import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Get Lucky Golf — Back yourself on any par-3'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public', 'logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 25% 30%, #4a7a3d 0%, #335231 45%, #1e3120 100%)',
          color: '#f5f0e1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={150} alt="Get Lucky Golf" style={{ height: 150 }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            Cape Town
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 128,
              lineHeight: 0.92,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: -2,
            }}
          >
            One shot.
          </div>
          <div
            style={{
              fontSize: 128,
              lineHeight: 0.92,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: -2,
              color: '#c9a94e',
            }}
          >
            R1,000,000.
          </div>
          <div
            style={{
              fontSize: 30,
              marginTop: 28,
              opacity: 0.9,
              maxWidth: 900,
            }}
          >
            The insured hole-in-one challenge. Stake on any par-3 — anywhere in the world.
          </div>
        </div>

        <div
          style={{
            fontSize: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          getluckygolf.co.za / app
        </div>
      </div>
    ),
    size,
  )
}
