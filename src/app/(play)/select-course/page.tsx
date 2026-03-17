'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'
import type { Course, Hole } from '@/context/BetContext'

interface ApiHole {
  id: string
  hole_number: number
  par: number
  distance_metres: number | null
}

interface ApiCourse {
  id: string
  name: string
  location_text: string | null
  region: string | null
  country: string
  lat: number | null
  lng: number | null
  image_url: string | null
  is_partner: boolean
  holes: ApiHole[]
}

function toContextCourse(c: ApiCourse): Course {
  return {
    id: c.id,
    name: c.name,
    location: c.location_text ?? c.region ?? '',
    region: c.region ?? '',
    emoji: '⛳',
  }
}

function toContextHole(h: ApiHole, courseId: string): Hole {
  return {
    id: h.id,
    courseId,
    holeNumber: h.hole_number,
    par: h.par,
    distanceMetres: h.distance_metres ?? 0,
  }
}

export default function SelectCoursePage() {
  const router = useRouter()
  const { selectCourse } = useBet()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedHoleId, setSelectedHoleId] = useState<string | null>(null)

  function loadCourses() {
    setLoading(true)
    setFetchError(false)
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        setCourses(data.courses ?? [])
        setLoading(false)
      })
      .catch(() => {
        setFetchError(true)
        setLoading(false)
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadCourses() }, [])

  const regions = ['All', ...Array.from(new Set(courses.map(c => c.region ?? '').filter(Boolean)))]

  const filtered = courses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.location_text ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || c.region === filter
    return matchesSearch && matchesFilter
  })

  const selectedCourse = courses.find(c => c.id === selectedCourseId)
  const selectedHole = selectedCourse?.holes.find(h => h.id === selectedHoleId)
    ?? selectedCourse?.holes[0]

  function handleSelectCourse(c: ApiCourse) {
    setSelectedCourseId(c.id)
    setSelectedHoleId(c.holes[0]?.id ?? null)
  }

  function handleContinue() {
    if (!selectedCourse || !selectedHole) return
    selectCourse(toContextCourse(selectedCourse), toContextHole(selectedHole, selectedCourse.id))
    router.push('/choose-stake')
  }

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-course">
        <div className="signup-header" style={{ padding: 'var(--space-md) var(--page-px) 0' }}>
          <button className="back-btn" onClick={() => router.back()}>←</button>
        </div>
        <div className="signup-title-area" style={{ padding: 'var(--space-sm) var(--page-px) 4px' }}>
          <h3 className="signup-title" style={{ fontSize: 'var(--text-xl)', color: 'var(--green-deep)' }}>Select Course</h3>
        </div>

        <div className="course-search">
          <input
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="course-filters">
          {regions.map(f => (
            <span
              key={f}
              className={`course-filter${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'All' ? '📍 All' : f}
            </span>
          ))}
        </div>

        <div className="course-list" style={{ flex: 1 }}>
          {loading ? (
            [0, 1, 2, 3].map(i => (
              <div key={i} className="course-card" style={{ pointerEvents: 'none' }}>
                <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 11, width: '50%', borderRadius: 3 }} />
                  <div className="skeleton" style={{ height: 10, width: '40%', borderRadius: 3 }} />
                </div>
              </div>
            ))
          ) : fetchError ? (
            <div style={{ padding: 'var(--space-2xl) var(--page-px)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-sm)' }}>📡</div>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--green-deep)', marginBottom: 6 }}>
                Couldn&apos;t load courses
              </div>
              <div style={{ fontSize: 'var(--text-body)', color: 'var(--gray-light)', marginBottom: 'var(--space-lg)' }}>
                Check your connection and try again.
              </div>
              <button
                onClick={loadCourses}
                style={{
                  padding: 'var(--space-sm) var(--page-px)', background: 'var(--green-deep)',
                  border: 'none', borderRadius: 'var(--radius-sm)', color: 'white',
                  fontSize: 'var(--text-md)', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-2xl) var(--page-px)', textAlign: 'center', color: 'var(--gray-light)', fontSize: 'var(--text-md)' }}>
              {search ? `No courses matching "${search}"` : 'No courses found'}
            </div>
          ) : filtered.map(c => (
            <div
              key={c.id}
              className={`course-card${selectedCourseId === c.id ? ' selected' : ''}`}
              style={{ position: 'relative' }}
              onClick={() => handleSelectCourse(c)}
            >
              {c.image_url ? (
                <img src={c.image_url} alt={c.name} className="course-thumb" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="course-thumb">⛳</div>
              )}
              <div className="course-info">
                <div className="course-name">{c.name}</div>
                <div className="course-location">📍 {c.location_text ?? c.region}</div>
                <div className="course-meta">
                  <span>{c.holes.length} par-3{c.holes.length !== 1 ? 's' : ''}</span>
                  {c.holes[0] && <span>Hole {c.holes[0].hole_number}</span>}
                  {c.holes[0]?.distance_metres && <span>{c.holes[0].distance_metres}m</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCourse && selectedHole && (
          <div className="course-hole-info">
            <div className="hole-info-title">Challenge Hole Details</div>

            {selectedCourse.holes.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {selectedCourse.holes.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHoleId(h.id)}
                    style={{
                      flex: 1, minWidth: 60, padding: '6px 4px', borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
                      border: selectedHole.id === h.id ? '2px solid var(--green-mid)' : '1px solid #ddd',
                      background: selectedHole.id === h.id ? 'rgba(74,157,91,0.1)' : 'white',
                      color: 'var(--green-deep)',
                    }}
                  >
                    Hole {h.hole_number}
                  </button>
                ))}
              </div>
            )}

            <div className="hole-info-grid">
              <div>
                <div className="hole-stat-value">{selectedHole.hole_number}</div>
                <div className="hole-stat-label">Hole</div>
              </div>
              <div>
                <div className="hole-stat-value">{selectedHole.distance_metres ?? '—'}</div>
                <div className="hole-stat-label">Metres</div>
              </div>
              <div>
                <div className="hole-stat-value">{selectedHole.par}</div>
                <div className="hole-stat-label">Par</div>
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-md)' }}>
              <button className="btn-primary" onClick={handleContinue}>
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
