import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Fallback data used when Supabase is not configured
const FALLBACK_COURSES = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Boschenmeer Golf Club',
    location_text: 'Paarl, Western Cape',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -33.7248,
    lng: 18.9556,
    is_partner: true,
    holes: [
      { id: 'bm-h3', hole_number: 3, par: 3, distance_metres: 178 },
      { id: 'bm-h7', hole_number: 7, par: 3, distance_metres: 162 },
      { id: 'bm-h14', hole_number: 14, par: 3, distance_metres: 195 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Atlantic Beach Estate',
    location_text: 'Melkbosstrand, Western Cape',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -33.7295,
    lng: 18.4661,
    is_partner: true,
    holes: [
      { id: 'ab-h5', hole_number: 5, par: 3, distance_metres: 143 },
      { id: 'ab-h12', hole_number: 12, par: 3, distance_metres: 187 },
      { id: 'ab-h16', hole_number: 16, par: 3, distance_metres: 155 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'Serengeti Estates Golf Club',
    location_text: 'Kempton Park, Gauteng',
    region: 'Gauteng',
    country: 'South Africa',
    lat: -26.0014,
    lng: 28.2600,
    is_partner: false,
    holes: [
      { id: 'se-h4', hole_number: 4, par: 3, distance_metres: 169 },
      { id: 'se-h11', hole_number: 11, par: 3, distance_metres: 201 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000004',
    name: 'Fancourt Golf Estate',
    location_text: 'George, Western Cape',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -33.9826,
    lng: 22.3987,
    is_partner: true,
    holes: [
      { id: 'fc-h6', hole_number: 6, par: 3, distance_metres: 183 },
      { id: 'fc-h13', hole_number: 13, par: 3, distance_metres: 158 },
      { id: 'fc-h17', hole_number: 17, par: 3, distance_metres: 212 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000005',
    name: 'Pearl Valley Golf Estate',
    location_text: 'Franschhoek, Western Cape',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -33.8418,
    lng: 19.0264,
    is_partner: true,
    holes: [
      { id: 'pv-h2', hole_number: 2, par: 3, distance_metres: 145 },
      { id: 'pv-h9', hole_number: 9, par: 3, distance_metres: 176 },
      { id: 'pv-h15', hole_number: 15, par: 3, distance_metres: 191 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000006',
    name: 'Steenberg Golf Club',
    location_text: 'Tokai, Western Cape',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -34.0608,
    lng: 18.4468,
    is_partner: false,
    holes: [
      { id: 'sb-h6', hole_number: 6, par: 3, distance_metres: 167 },
      { id: 'sb-h14', hole_number: 14, par: 3, distance_metres: 152 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000007',
    name: 'Zimbali Country Club',
    location_text: 'Ballito, KwaZulu-Natal',
    region: 'KwaZulu-Natal',
    country: 'South Africa',
    lat: -29.4948,
    lng: 31.1647,
    is_partner: true,
    holes: [
      { id: 'zb-h3', hole_number: 3, par: 3, distance_metres: 188 },
      { id: 'zb-h8', hole_number: 8, par: 3, distance_metres: 172 },
      { id: 'zb-h17', hole_number: 17, par: 3, distance_metres: 204 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000008',
    name: 'Sun City Golf Estate',
    location_text: 'Sun City, North West',
    region: 'North West',
    country: 'South Africa',
    lat: -25.3399,
    lng: 27.0949,
    is_partner: false,
    holes: [
      { id: 'sc-h7', hole_number: 7, par: 3, distance_metres: 160 },
      { id: 'sc-h15', hole_number: 15, par: 3, distance_metres: 193 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000009',
    name: 'Leopard Creek Country Club',
    location_text: 'Malelane, Mpumalanga',
    region: 'Mpumalanga',
    country: 'South Africa',
    lat: -25.4819,
    lng: 31.5488,
    is_partner: true,
    holes: [
      { id: 'lc-h4', hole_number: 4, par: 3, distance_metres: 175 },
      { id: 'lc-h11', hole_number: 11, par: 3, distance_metres: 188 },
      { id: 'lc-h16', hole_number: 16, par: 3, distance_metres: 162 },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000010',
    name: 'Erinvale Golf Club',
    location_text: 'Somerset West, Western Cape',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -34.1108,
    lng: 18.8612,
    is_partner: false,
    holes: [
      { id: 'ev-h5', hole_number: 5, par: 3, distance_metres: 144 },
      { id: 'ev-h12', hole_number: 12, par: 3, distance_metres: 179 },
    ],
  },
]

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*, holes(id, hole_number, par, distance_metres)')
      .eq('holes.is_active', true)
      .order('name')

    if (error || !courses?.length) {
      return NextResponse.json({ courses: FALLBACK_COURSES, source: 'fallback' })
    }

    return NextResponse.json({ courses, source: 'database' })
  } catch {
    return NextResponse.json({ courses: FALLBACK_COURSES, source: 'fallback' })
  }
}
