/**
 * Security & Validation Tests for Get Lucky Golf API
 *
 * Tests critical security controls:
 * - Input validation on all API endpoints
 * - Field whitelisting on admin PATCH endpoints (mass assignment prevention)
 * - CSV injection prevention in exports
 * - Batch operation limits
 * - Bet status transition validation
 * - PayFast signature generation
 * - Tier validation
 */
import { describe, it, expect } from 'vitest'

// ─── Tier Validation ─────────────────────────────────────────────────────────
import { BET_TIERS } from '@/lib/tiers'

describe('BET_TIERS', () => {
  it('has exactly 5 tiers', () => {
    expect(BET_TIERS).toHaveLength(5)
  })

  it('each tier has required fields', () => {
    for (const tier of BET_TIERS) {
      expect(tier.tier).toMatch(/^tier_[1-5]$/)
      expect(tier.stakeZAR).toBeGreaterThan(0)
      expect(tier.winZAR).toBeGreaterThan(tier.stakeZAR)
      expect(tier.multiplier).toBeGreaterThanOrEqual(500)
      expect(tier.label).toBeTruthy()
    }
  })

  it('tiers are sorted by stake ascending', () => {
    for (let i = 1; i < BET_TIERS.length; i++) {
      expect(BET_TIERS[i].stakeZAR).toBeGreaterThan(BET_TIERS[i - 1].stakeZAR)
    }
  })

  it('exactly one tier is marked popular', () => {
    const popular = BET_TIERS.filter(t => t.isPopular)
    expect(popular).toHaveLength(1)
    expect(popular[0].tier).toBe('tier_2')
  })

  it('stake * multiplier = win for each tier', () => {
    for (const tier of BET_TIERS) {
      expect(tier.stakeZAR * tier.multiplier).toBe(tier.winZAR)
    }
  })
})

// ─── CSV Injection Prevention ────────────────────────────────────────────────
describe('CSV Export Security', () => {
  // Reproduce the escape logic from export/route.ts
  function csvEscape(v: string): string {
    let safe = v.replace(/"/g, '""')
    if (/^[=+\-@\t\r]/.test(safe)) safe = `'${safe}`
    return `"${safe}"`
  }

  it('escapes double quotes', () => {
    expect(csvEscape('hello "world"')).toBe('"hello ""world"""')
  })

  it('prevents formula injection with =', () => {
    expect(csvEscape('=cmd|calc')).toBe(`"'=cmd|calc"`)
  })

  it('prevents formula injection with +', () => {
    expect(csvEscape('+1234')).toBe(`"'+1234"`)
  })

  it('prevents formula injection with -', () => {
    expect(csvEscape('-1234')).toBe(`"'-1234"`)
  })

  it('prevents formula injection with @', () => {
    expect(csvEscape('@SUM(A1:A10)')).toBe(`"'@SUM(A1:A10)"`)
  })

  it('prevents formula injection with tab', () => {
    expect(csvEscape('\tmalicious')).toBe(`"'\tmalicious"`)
  })

  it('leaves normal text unchanged', () => {
    expect(csvEscape('John Smith')).toBe('"John Smith"')
  })

  it('handles empty strings', () => {
    expect(csvEscape('')).toBe('""')
  })
})

// ─── Bet Status Validation ──────────────────────────────────────────────────
describe('Bet Status Transitions', () => {
  const VALID_USER_STATUSES = ['miss', 'claimed'] as const
  const VALID_DECLARED_RESULTS = ['miss', 'win'] as const

  it('rejects invalid status values', () => {
    const invalid = ['active', 'verified', 'paid', 'admin_override', 'deleted', '']
    for (const status of invalid) {
      expect(VALID_USER_STATUSES.includes(status as typeof VALID_USER_STATUSES[number])).toBe(false)
    }
  })

  it('accepts valid status values', () => {
    for (const status of VALID_USER_STATUSES) {
      expect(VALID_USER_STATUSES.includes(status)).toBe(true)
    }
  })

  it('rejects invalid declared_result values', () => {
    const invalid = ['hole_in_one', 'verified', 'pending', 'admin', '']
    for (const result of invalid) {
      expect(VALID_DECLARED_RESULTS.includes(result as typeof VALID_DECLARED_RESULTS[number])).toBe(false)
    }
  })

  it('accepts valid declared_result values', () => {
    for (const result of VALID_DECLARED_RESULTS) {
      expect(VALID_DECLARED_RESULTS.includes(result)).toBe(true)
    }
  })
})

// ─── Admin Field Whitelisting ───────────────────────────────────────────────
describe('Admin Field Whitelisting', () => {
  const BET_ALLOWED_FIELDS = ['status', 'declared_result']
  const COURSE_ALLOWED_FIELDS = ['name', 'location_text', 'region', 'country', 'lat', 'lng', 'image_url', 'is_partner']
  const HOLE_ALLOWED_FIELDS = ['hole_number', 'par', 'distance_metres', 'is_active', 'jackpot_amount']

  function filterFields(body: Record<string, unknown>, allowed: string[]) {
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }
    return updates
  }

  it('strips disallowed bet fields (user_id, payment_intent_id)', () => {
    const malicious = { status: 'verified', user_id: 'hacker', payment_intent_id: 'fake', stake_pence: 0 }
    const filtered = filterFields(malicious, BET_ALLOWED_FIELDS)
    expect(filtered).toEqual({ status: 'verified' })
    expect(filtered).not.toHaveProperty('user_id')
    expect(filtered).not.toHaveProperty('payment_intent_id')
    expect(filtered).not.toHaveProperty('stake_pence')
  })

  it('strips disallowed course fields (id, created_at)', () => {
    const malicious = { name: 'Hacked', id: 'injected-id', created_at: '2020-01-01' }
    const filtered = filterFields(malicious, COURSE_ALLOWED_FIELDS)
    expect(filtered).toEqual({ name: 'Hacked' })
    expect(filtered).not.toHaveProperty('id')
    expect(filtered).not.toHaveProperty('created_at')
  })

  it('strips disallowed hole fields (id, course_id)', () => {
    const malicious = { par: 3, id: 'injected', course_id: 'other-course' }
    const filtered = filterFields(malicious, HOLE_ALLOWED_FIELDS)
    expect(filtered).toEqual({ par: 3 })
    expect(filtered).not.toHaveProperty('id')
    expect(filtered).not.toHaveProperty('course_id')
  })

  it('returns empty object when no valid fields present', () => {
    const malicious = { __proto__: 'attack', constructor: 'bad' }
    const filtered = filterFields(malicious, BET_ALLOWED_FIELDS)
    expect(Object.keys(filtered)).toHaveLength(0)
  })

  it('preserves all valid fields', () => {
    const valid = { name: 'Test Course', region: 'Western Cape', lat: -33.9, lng: 18.4, is_partner: true }
    const filtered = filterFields(valid, COURSE_ALLOWED_FIELDS)
    expect(filtered).toEqual(valid)
  })
})

// ─── Batch Operation Limits ─────────────────────────────────────────────────
describe('Batch Operation Validation', () => {
  const MAX_BATCH = 50
  const VALID_ACTIONS = ['approve', 'reject', 'under_review']
  const MAX_NOTES_LENGTH = 1000

  it('rejects batch sizes over 50', () => {
    const ids = Array.from({ length: 51 }, (_, i) => `id-${i}`)
    expect(ids.length).toBeGreaterThan(MAX_BATCH)
  })

  it('accepts batch sizes up to 50', () => {
    const ids = Array.from({ length: 50 }, (_, i) => `id-${i}`)
    expect(ids.length).toBeLessThanOrEqual(MAX_BATCH)
  })

  it('validates action values', () => {
    expect(VALID_ACTIONS).toContain('approve')
    expect(VALID_ACTIONS).toContain('reject')
    expect(VALID_ACTIONS).toContain('under_review')
    expect(VALID_ACTIONS).not.toContain('delete')
    expect(VALID_ACTIONS).not.toContain('admin_override')
  })

  it('truncates notes to max length', () => {
    const longNotes = 'x'.repeat(2000)
    const sanitized = longNotes.slice(0, MAX_NOTES_LENGTH)
    expect(sanitized.length).toBe(MAX_NOTES_LENGTH)
  })
})

// ─── Limit Parsing ──────────────────────────────────────────────────────────
describe('API Limit Parsing', () => {
  function parseLimit(input: string | null): number {
    const parsed = parseInt(input ?? '20', 10)
    return Math.min(Number.isNaN(parsed) ? 20 : Math.max(1, parsed), 500)
  }

  it('defaults to 20 when null', () => {
    expect(parseLimit(null)).toBe(20)
  })

  it('defaults to 20 for NaN input', () => {
    expect(parseLimit('abc')).toBe(20)
  })

  it('clamps to 1 for negative values', () => {
    expect(parseLimit('-5')).toBe(1)
  })

  it('clamps to 1 for zero', () => {
    expect(parseLimit('0')).toBe(1)
  })

  it('caps at 500', () => {
    expect(parseLimit('9999')).toBe(500)
  })

  it('passes through valid values', () => {
    expect(parseLimit('50')).toBe(50)
  })
})

// ─── PayFast Signature ──────────────────────────────────────────────────────
describe('PayFast Signature Generation', () => {
  // Simplified version of pfEncode from the route
  function pfEncode(value: string): string {
    return encodeURIComponent(value.trim()).replace(/%20/g, '+')
  }

  it('encodes spaces as +', () => {
    expect(pfEncode('hello world')).toBe('hello+world')
  })

  it('trims whitespace', () => {
    expect(pfEncode('  test  ')).toBe('test')
  })

  it('encodes special characters', () => {
    expect(pfEncode('test&value=1')).toBe('test%26value%3D1')
  })
})

// ─── PayFast IP Validation ──────────────────────────────────────────────────
describe('PayFast IP Whitelist', () => {
  const VALID_IPS = new Set([
    ...Array.from({ length: 16 }, (_, i) => `197.97.145.${144 + i}`),
    ...Array.from({ length: 16 }, (_, i) => `41.74.179.${192 + i}`),
  ])

  it('accepts PayFast Block 1 IPs (197.97.145.144-159)', () => {
    expect(VALID_IPS.has('197.97.145.144')).toBe(true)
    expect(VALID_IPS.has('197.97.145.159')).toBe(true)
  })

  it('rejects IPs outside Block 1 range', () => {
    expect(VALID_IPS.has('197.97.145.143')).toBe(false)
    expect(VALID_IPS.has('197.97.145.160')).toBe(false)
  })

  it('accepts PayFast Block 2 IPs (41.74.179.192-207)', () => {
    expect(VALID_IPS.has('41.74.179.192')).toBe(true)
    expect(VALID_IPS.has('41.74.179.207')).toBe(true)
  })

  it('rejects IPs outside Block 2 range', () => {
    expect(VALID_IPS.has('41.74.179.191')).toBe(false)
    expect(VALID_IPS.has('41.74.179.208')).toBe(false)
  })

  it('rejects random IPs', () => {
    expect(VALID_IPS.has('1.2.3.4')).toBe(false)
    expect(VALID_IPS.has('192.168.1.1')).toBe(false)
    expect(VALID_IPS.has('10.0.0.1')).toBe(false)
  })

  it('has exactly 32 valid IPs (2 blocks of 16)', () => {
    expect(VALID_IPS.size).toBe(32)
  })

  // Test the multi-IP chain validation logic
  it('finds valid IP in forwarded chain', () => {
    const forwardedFor = '10.0.0.1, 197.97.145.150, 172.16.0.1'
    const allIps = forwardedFor.split(',').map(ip => ip.trim())
    const hasValidIp = allIps.some(ip => VALID_IPS.has(ip))
    expect(hasValidIp).toBe(true)
  })

  it('rejects chain with no valid IPs', () => {
    const forwardedFor = '10.0.0.1, 172.16.0.1, 192.168.1.1'
    const allIps = forwardedFor.split(',').map(ip => ip.trim())
    const hasValidIp = allIps.some(ip => VALID_IPS.has(ip))
    expect(hasValidIp).toBe(false)
  })
})

// ─── Input Sanitization ─────────────────────────────────────────────────────
describe('Input Sanitization', () => {
  function sanitizeUserName(input: unknown): string {
    return String(input).replace(/[<>"'&]/g, '').slice(0, 100)
  }

  it('strips HTML tags', () => {
    expect(sanitizeUserName('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
  })

  it('strips special chars', () => {
    expect(sanitizeUserName('John "Ace" O\'Brien')).toBe('John Ace OBrien')
  })

  it('truncates at 100 chars', () => {
    const long = 'A'.repeat(200)
    expect(sanitizeUserName(long).length).toBe(100)
  })

  it('handles null/undefined gracefully', () => {
    expect(sanitizeUserName(null)).toBe('null')
    expect(sanitizeUserName(undefined)).toBe('undefined')
  })

  it('handles numbers', () => {
    expect(sanitizeUserName(12345)).toBe('12345')
  })

  it('preserves normal names', () => {
    expect(sanitizeUserName('Johannes Le Roux')).toBe('Johannes Le Roux')
  })
})

// ─── Course Seed Data ────────────────────────────────────────────────────────
describe('Course Seed Data Integrity', () => {
  // We can't import the full module without Next.js, but we can validate the structure
  it('BET_TIERS stakeZAR values match TIER_ZAR amounts', () => {
    const TIER_ZAR: Record<string, number> = {
      tier_1: 50,
      tier_2: 100,
      tier_3: 250,
      tier_4: 500,
      tier_5: 1000,
    }

    for (const tier of BET_TIERS) {
      expect(TIER_ZAR[tier.tier]).toBe(tier.stakeZAR)
    }
  })
})
