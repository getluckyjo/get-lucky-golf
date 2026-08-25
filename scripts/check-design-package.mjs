#!/usr/bin/env node
/**
 * Validates a design handback against the contract in docs/Design-Reskin-Brief.md.
 * Run: npm run check:design
 *
 * Exits non-zero on any error so a package either passes or comes back with a
 * specific list. Screens with no comps yet are reported as "not started", not failed.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SCREENS_DIR = path.join(ROOT, 'design/02-screens')
const MANIFEST = path.join(ROOT, 'design/00-reference/screens.tsv')
const TOKENS = path.join(ROOT, 'design/01-tokens/tokens.csv')
const TYPE_SCALE = path.join(ROOT, 'design/01-tokens/type-scale.csv')
const ICONS_DIR = path.join(ROOT, 'design/03-assets/icons')

const STATES = ['default','empty','loading','error','success','selected','modal','permission','blocked']
const CHANGE_TYPES = ['RESKIN-ONLY','RESTRUCTURED','REBUILT']
const REQUIRED_SECTIONS = ['## Blocks, top to bottom','## Added / Removed / Kept','## Final copy','## Notes','## States delivered']
const COMP_WIDTH = 750
const MAX_BYTES = 1.5 * 1024 * 1024

const errors = []
const warnings = []
const notStarted = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

/** PNG width/height from the IHDR chunk. */
function pngSize(file) {
  const fd = fs.openSync(file, 'r')
  const buf = Buffer.alloc(24)
  fs.readSync(fd, buf, 0, 24, 0)
  fs.closeSync(fd)
  if (buf.toString('ascii', 1, 4) !== 'PNG') return null
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

// ── Manifest ────────────────────────────────────────────────────────────────
if (!fs.existsSync(MANIFEST)) {
  console.error('FATAL: design/00-reference/screens.tsv is missing.')
  process.exit(1)
}
const manifest = fs.readFileSync(MANIFEST, 'utf8').trim().split('\n').slice(1).map(l => {
  const [num, slug, route, source, states, purpose] = l.split('\t')
  return { num, slug, route, source, states: states.split(','), purpose, folder: `${num}-${slug}` }
})

// ── Folders match the manifest ──────────────────────────────────────────────
const onDisk = fs.existsSync(SCREENS_DIR)
  ? fs.readdirSync(SCREENS_DIR).filter(f => fs.statSync(path.join(SCREENS_DIR, f)).isDirectory())
  : []
for (const f of onDisk) {
  if (!manifest.some(m => m.folder === f)) err(`Unexpected folder design/02-screens/${f} — not in screens.tsv`)
}
for (const m of manifest) {
  if (!onDisk.includes(m.folder)) err(`Missing folder design/02-screens/${m.folder}`)
}

// ── Per screen ──────────────────────────────────────────────────────────────
for (const m of manifest) {
  const dir = path.join(SCREENS_DIR, m.folder)
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir)
  const comps = files.filter(f => f.toLowerCase().endsWith('.png'))

  if (comps.length === 0) { notStarted.push(m.folder); continue }

  const seenBase = new Map()
  for (const c of comps) {
    const mt = c.match(/^(.+?)__([a-z]+)(--[a-z0-9-]+)?\.png$/i)
    if (!mt) { err(`${m.folder}/${c} — name must be NN-slug__state.png (optional --suffix)`); continue }
    const [, base, state, suffix] = mt
    if (base !== m.folder) err(`${m.folder}/${c} — prefix "${base}" should be "${m.folder}"`)
    if (!STATES.includes(state)) err(`${m.folder}/${c} — "${state}" is not an allowed state (${STATES.join(', ')})`)
    if (!suffix) {
      if (seenBase.has(state)) err(`${m.folder} — two unsuffixed comps for state "${state}": ${seenBase.get(state)} and ${c}`)
      seenBase.set(state, c)
    }
    const full = path.join(dir, c)
    const size = pngSize(full)
    if (!size) err(`${m.folder}/${c} — not a valid PNG`)
    else if (size.width !== COMP_WIDTH) err(`${m.folder}/${c} — width ${size.width}px, must be ${COMP_WIDTH}px (2x the 375 canvas)`)
    if (fs.statSync(full).size > MAX_BYTES) err(`${m.folder}/${c} — ${(fs.statSync(full).size/1024/1024).toFixed(2)} MB, limit is 1.5 MB`)
  }

  for (const state of m.states) {
    if (!seenBase.has(state)) err(`${m.folder} — required state "${state}" has no comp`)
  }

  // ── The screen card ───────────────────────────────────────────────────────
  const card = path.join(dir, `${m.folder}.md`)
  if (!fs.existsSync(card)) { err(`${m.folder} — missing screen card ${m.folder}.md`); continue }
  const text = fs.readFileSync(card, 'utf8')

  const ct = text.match(/^Change type:\s*(\S+)/m)
  if (!ct || !CHANGE_TYPES.includes(ct[1])) {
    err(`${m.folder} — "Change type:" must be one of ${CHANGE_TYPES.join(' | ')}`)
  } else if (ct[1] !== 'RESKIN-ONLY') {
    const dflt = seenBase.get('default')
    if (dflt && !comps.includes(dflt.replace('.png', '--redline.png'))) {
      err(`${m.folder} — marked ${ct[1]} so it needs a redline twin: ${dflt.replace('.png','--redline.png')}`)
    }
  }
  for (const s of REQUIRED_SECTIONS) {
    if (!text.includes(s)) err(`${m.folder} — screen card is missing section "${s}"`)
  }
  if (/^Scrolls:\s*$/m.test(text)) err(`${m.folder} — "Scrolls:" is blank`)
  if (/^Fixed on screen:\s*$/m.test(text)) err(`${m.folder} — "Fixed on screen:" is blank`)
}

// ── Token sheets ────────────────────────────────────────────────────────────
function checkCsv(file, label, expectHeader) {
  if (!fs.existsSync(file)) { err(`${label} is missing`); return null }
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n')
  if (lines[0].trim() !== expectHeader) {
    err(`${label} — header row changed. Expected:\n    ${expectHeader}\n  Got:\n    ${lines[0].trim()}`)
  }
  return lines
}

const tokenLines = checkCsv(TOKENS, 'design/01-tokens/tokens.csv',
  'group,token,current_value,new_value,source,used_for,notes')
if (tokenLines) {
  let edits = 0
  for (const [i, line] of tokenLines.slice(1).entries()) {
    const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map(c => c.replace(/,$/, '').replace(/^"|"$/g, '')) ?? []
    const [group, token, , newValue] = cells
    if (token === 'NEW' || group === 'NEW') break
    if (!newValue) continue
    edits++
    if (group === 'colour' && !/^#[0-9a-fA-F]{6}$/.test(newValue.trim())) {
      err(`tokens.csv line ${i + 2} (${token}) — "${newValue}" is not a 6-digit hex`)
    }
    if ((group === 'space' || group === 'radius') && !/^\d+(\.\d+)?$/.test(newValue.trim())) {
      err(`tokens.csv line ${i + 2} (${token}) — "${newValue}" must be a plain number in px, no unit`)
    }
  }
  if (edits === 0) warn('tokens.csv has no values in new_value — nothing has been changed yet')
}

checkCsv(TYPE_SCALE, 'design/01-tokens/type-scale.csv',
  'token,role,family,weight,size_at_375,size_at_430,letter_spacing_pct,line_height,uppercase')

// ── Icons ───────────────────────────────────────────────────────────────────
if (fs.existsSync(ICONS_DIR)) {
  const svgs = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'))
  if (svgs.length === 0) warn('design/03-assets/icons/ has no SVGs yet')
  for (const s of svgs) {
    const t = fs.readFileSync(path.join(ICONS_DIR, s), 'utf8')
    const vb = t.match(/viewBox\s*=\s*"([^"]+)"/)
    if (!vb) err(`icons/${s} — no viewBox`)
    else if (!/^0\s+0\s+24\s+24$/.test(vb[1].trim())) err(`icons/${s} — viewBox is "${vb[1]}", must be "0 0 24 24"`)
    if (/<image\b/i.test(t)) err(`icons/${s} — contains an embedded raster <image>`)
    if (/<(linear|radial)Gradient\b/i.test(t)) err(`icons/${s} — contains a gradient`)
    if (/base64/i.test(t)) err(`icons/${s} — contains base64 embedded data`)
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const started = manifest.length - notStarted.length
console.log(`\nDesign package check — ${started}/${manifest.length} screens have comps\n`)

if (notStarted.length) {
  console.log(`Not started (${notStarted.length}): ${notStarted.join(', ')}\n`)
}
for (const w of warnings) console.log(`  warning  ${w}`)
if (warnings.length) console.log('')
for (const e of errors) console.log(`  ERROR    ${e}`)

if (errors.length) {
  console.log(`\n${errors.length} error${errors.length === 1 ? '' : 's'}. See section 4 of docs/Design-Reskin-Brief.md.\n`)
  process.exit(1)
}
console.log(started === 0
  ? 'Structure is valid. No comps delivered yet.\n'
  : `Package is valid.\n`)
