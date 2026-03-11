'use client'

import { Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  debounceMs?: number
}

export default function SearchInput({ placeholder = 'Search...', value, onChange, debounceMs = 300 }: SearchInputProps) {
  const [local, setLocal] = useState(value)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setLocal(value)
  }, [value])

  const handleChange = (v: string) => {
    setLocal(v)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => onChange(v), debounceMs)
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
      <Search
        size={16}
        color="#999"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
      />
      <input
        type="text"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px 8px 36px',
          borderRadius: 8,
          border: '1px solid #e5e5e5',
          fontSize: 14,
          color: '#111',
          background: '#fff',
          outline: 'none',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      />
    </div>
  )
}
