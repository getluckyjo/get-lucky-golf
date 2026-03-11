'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

const REGIONS = ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Mpumalanga', 'North West', 'Eastern Cape', 'Free State', 'Limpopo', 'Northern Cape']

export default function AdminNewCoursePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    location_text: '',
    region: '',
    country: 'South Africa',
    lat: '',
    lng: '',
    is_partner: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Course name is required'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lat: form.lat ? parseFloat(form.lat) : null,
          lng: form.lng ? parseFloat(form.lng) : null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/courses')
      } else {
        setError(data.error || 'Failed to create course')
      }
    } catch {
      setError('Failed to create course')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #e5e5e5',
    fontSize: 14,
    color: '#111',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.push('/admin/courses')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e5e5',
            background: '#fff', cursor: 'pointer', color: '#333', fontSize: 13,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>Add New Course</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Course Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Leopard Creek Country Club"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Location</label>
              <input
                type="text"
                value={form.location_text}
                onChange={(e) => setForm({ ...form, location_text: e.target.value })}
                placeholder="e.g. Malelane, Mpumalanga"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select region</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Latitude</label>
                <input type="text" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="-33.96" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Longitude</label>
                <input type="text" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="22.38" style={inputStyle} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#333', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_partner}
                onChange={(e) => setForm({ ...form, is_partner: e.target.checked })}
                style={{ width: 18, height: 18 }}
              />
              Partner course
            </label>
          </div>

          {error && (
            <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: '#fde8e8', color: '#c0392b', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              style={{
                padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e5e5',
                background: '#fff', fontSize: 14, cursor: 'pointer', color: '#333',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: '#00432a', color: '#fff', fontSize: 14,
                cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={16} /> {saving ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
