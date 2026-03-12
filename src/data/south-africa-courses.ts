/**
 * Top 100 Golf Courses in South Africa (Golf Digest SA 2024 Ranking)
 * Each course includes all Par 3 holes with distances from club/member tees in metres.
 */

export interface CourseHole {
  id: string
  hole_number: number
  par: number
  distance_metres: number
}

export interface CourseData {
  id: string
  name: string
  location_text: string
  region: string
  country: string
  lat: number
  lng: number
  image_url: string | null
  is_partner: boolean
  holes: CourseHole[]
}

function courseId(n: number): string {
  return `sa-top100-${String(n).padStart(3, '0')}`
}

function holeId(courseNum: number, holeNum: number): string {
  return `sa-top100-${String(courseNum).padStart(3, '0')}-h${holeNum}`
}

export const SA_TOP_100_COURSES: CourseData[] = [
  // #1
  {
    id: courseId(1), name: 'Leopard Creek Country Club',
    location_text: 'Malelane, Mpumalanga', region: 'Mpumalanga', country: 'South Africa',
    lat: -25.471, lng: 31.559, image_url: null, is_partner: true,
    holes: [
      { id: holeId(1, 5), hole_number: 5, par: 3, distance_metres: 156 },
      { id: holeId(1, 7), hole_number: 7, par: 3, distance_metres: 172 },
      { id: holeId(1, 12), hole_number: 12, par: 3, distance_metres: 136 },
      { id: holeId(1, 16), hole_number: 16, par: 3, distance_metres: 183 },
    ],
  },
  // #2
  {
    id: courseId(2), name: 'Fancourt – The Links',
    location_text: 'George, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.954, lng: 22.407, image_url: null, is_partner: true,
    holes: [
      { id: holeId(2, 2), hole_number: 2, par: 3, distance_metres: 214 },
      { id: holeId(2, 8), hole_number: 8, par: 3, distance_metres: 156 },
      { id: holeId(2, 11), hole_number: 11, par: 3, distance_metres: 148 },
      { id: holeId(2, 17), hole_number: 17, par: 3, distance_metres: 163 },
    ],
  },
  // #3
  {
    id: courseId(3), name: 'St Francis Links',
    location_text: 'St Francis Bay, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -34.163, lng: 24.812, image_url: null, is_partner: false,
    holes: [
      { id: holeId(3, 4), hole_number: 4, par: 3, distance_metres: 137 },
      { id: holeId(3, 7), hole_number: 7, par: 3, distance_metres: 164 },
      { id: holeId(3, 14), hole_number: 14, par: 3, distance_metres: 143 },
      { id: holeId(3, 17), hole_number: 17, par: 3, distance_metres: 179 },
    ],
  },
  // #4
  {
    id: courseId(4), name: 'Blair Atholl Golf & Equestrian Estate',
    location_text: 'Lanseria, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.930, lng: 27.860, image_url: null, is_partner: false,
    holes: [
      { id: holeId(4, 3), hole_number: 3, par: 3, distance_metres: 183 },
      { id: holeId(4, 6), hole_number: 6, par: 3, distance_metres: 214 },
      { id: holeId(4, 8), hole_number: 8, par: 3, distance_metres: 188 },
      { id: holeId(4, 11), hole_number: 11, par: 3, distance_metres: 206 },
      { id: holeId(4, 17), hole_number: 17, par: 3, distance_metres: 175 },
    ],
  },
  // #5
  {
    id: courseId(5), name: 'Arabella Golf Club',
    location_text: 'Kleinmond, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.317, lng: 19.135, image_url: null, is_partner: true,
    holes: [
      { id: holeId(5, 5), hole_number: 5, par: 3, distance_metres: 161 },
      { id: holeId(5, 7), hole_number: 7, par: 3, distance_metres: 186 },
      { id: holeId(5, 14), hole_number: 14, par: 3, distance_metres: 142 },
      { id: holeId(5, 17), hole_number: 17, par: 3, distance_metres: 174 },
    ],
  },
  // #6
  {
    id: courseId(6), name: 'Pearl Valley Golf Club',
    location_text: 'Paarl, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.823, lng: 18.990, image_url: null, is_partner: true,
    holes: [
      { id: holeId(6, 3), hole_number: 3, par: 3, distance_metres: 175 },
      { id: holeId(6, 6), hole_number: 6, par: 3, distance_metres: 176 },
      { id: holeId(6, 13), hole_number: 13, par: 3, distance_metres: 175 },
      { id: holeId(6, 17), hole_number: 17, par: 3, distance_metres: 211 },
    ],
  },
  // #7
  {
    id: courseId(7), name: 'Fancourt – Montagu',
    location_text: 'George, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.954, lng: 22.407, image_url: null, is_partner: true,
    holes: [
      { id: holeId(7, 2), hole_number: 2, par: 3, distance_metres: 192 },
      { id: holeId(7, 8), hole_number: 8, par: 3, distance_metres: 186 },
      { id: holeId(7, 12), hole_number: 12, par: 3, distance_metres: 189 },
      { id: holeId(7, 17), hole_number: 17, par: 3, distance_metres: 175 },
    ],
  },
  // #8
  {
    id: courseId(8), name: 'Glendower Golf Club',
    location_text: 'Edenvale, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.149, lng: 28.152, image_url: null, is_partner: false,
    holes: [
      { id: holeId(8, 3), hole_number: 3, par: 3, distance_metres: 208 },
      { id: holeId(8, 6), hole_number: 6, par: 3, distance_metres: 184 },
      { id: holeId(8, 14), hole_number: 14, par: 3, distance_metres: 153 },
      { id: holeId(8, 17), hole_number: 17, par: 3, distance_metres: 217 },
    ],
  },
  // #9
  {
    id: courseId(9), name: 'Sishen Golf Club',
    location_text: 'Kathu, Northern Cape', region: 'Northern Cape', country: 'South Africa',
    lat: -27.710, lng: 23.050, image_url: null, is_partner: false,
    holes: [
      { id: holeId(9, 4), hole_number: 4, par: 3, distance_metres: 192 },
      { id: holeId(9, 8), hole_number: 8, par: 3, distance_metres: 150 },
      { id: holeId(9, 13), hole_number: 13, par: 3, distance_metres: 200 },
      { id: holeId(9, 17), hole_number: 17, par: 3, distance_metres: 159 },
    ],
  },
  // #10
  {
    id: courseId(10), name: 'East London Golf Club',
    location_text: 'East London, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -32.973, lng: 27.923, image_url: null, is_partner: false,
    holes: [
      { id: holeId(10, 2), hole_number: 2, par: 3, distance_metres: 180 },
      { id: holeId(10, 10), hole_number: 10, par: 3, distance_metres: 175 },
      { id: holeId(10, 17), hole_number: 17, par: 3, distance_metres: 159 },
    ],
  },
  // #11
  {
    id: courseId(11), name: 'Pinnacle Point Golf Club',
    location_text: 'Mossel Bay, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.206, lng: 22.090, image_url: null, is_partner: true,
    holes: [
      { id: holeId(11, 7), hole_number: 7, par: 3, distance_metres: 121 },
      { id: holeId(11, 9), hole_number: 9, par: 3, distance_metres: 165 },
      { id: holeId(11, 13), hole_number: 13, par: 3, distance_metres: 136 },
      { id: holeId(11, 17), hole_number: 17, par: 3, distance_metres: 185 },
    ],
  },
  // #12
  {
    id: courseId(12), name: 'Royal Johannesburg & Kensington – East',
    location_text: 'Linksfield, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.182, lng: 28.113, image_url: null, is_partner: false,
    holes: [
      { id: holeId(12, 2), hole_number: 2, par: 3, distance_metres: 211 },
      { id: holeId(12, 5), hole_number: 5, par: 3, distance_metres: 139 },
      { id: holeId(12, 12), hole_number: 12, par: 3, distance_metres: 168 },
      { id: holeId(12, 16), hole_number: 16, par: 3, distance_metres: 152 },
    ],
  },
  // #13
  {
    id: courseId(13), name: 'Elements Private Golf Reserve',
    location_text: 'Bela-Bela, Limpopo', region: 'Limpopo', country: 'South Africa',
    lat: -24.850, lng: 28.250, image_url: null, is_partner: false,
    holes: [
      { id: holeId(13, 2), hole_number: 2, par: 3, distance_metres: 202 },
      { id: holeId(13, 9), hole_number: 9, par: 3, distance_metres: 172 },
      { id: holeId(13, 11), hole_number: 11, par: 3, distance_metres: 188 },
      { id: holeId(13, 15), hole_number: 15, par: 3, distance_metres: 175 },
    ],
  },
  // #14
  {
    id: courseId(14), name: 'The Club at Steyn City',
    location_text: 'Fourways, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.970, lng: 27.995, image_url: null, is_partner: false,
    holes: [
      { id: holeId(14, 5), hole_number: 5, par: 3, distance_metres: 203 },
      { id: holeId(14, 9), hole_number: 9, par: 3, distance_metres: 184 },
      { id: holeId(14, 12), hole_number: 12, par: 3, distance_metres: 174 },
      { id: holeId(14, 14), hole_number: 14, par: 3, distance_metres: 201 },
    ],
  },
  // #15
  {
    id: courseId(15), name: 'Humewood Golf Club',
    location_text: 'Gqeberha, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -33.980, lng: 25.656, image_url: null, is_partner: false,
    holes: [
      { id: holeId(15, 3), hole_number: 3, par: 3, distance_metres: 210 },
      { id: holeId(15, 6), hole_number: 6, par: 3, distance_metres: 131 },
      { id: holeId(15, 12), hole_number: 12, par: 3, distance_metres: 160 },
      { id: holeId(15, 13), hole_number: 13, par: 3, distance_metres: 153 },
    ],
  },
  // #16
  {
    id: courseId(16), name: 'Zimbali Country Club',
    location_text: 'Ballito, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.543, lng: 31.196, image_url: null, is_partner: true,
    holes: [
      { id: holeId(16, 5), hole_number: 5, par: 3, distance_metres: 167 },
      { id: holeId(16, 9), hole_number: 9, par: 3, distance_metres: 193 },
      { id: holeId(16, 11), hole_number: 11, par: 3, distance_metres: 167 },
      { id: holeId(16, 14), hole_number: 14, par: 3, distance_metres: 135 },
    ],
  },
  // #17
  {
    id: courseId(17), name: 'Sun City – Gary Player CC',
    location_text: 'Sun City, North West', region: 'North West', country: 'South Africa',
    lat: -25.345, lng: 27.093, image_url: null, is_partner: true,
    holes: [
      { id: holeId(17, 4), hole_number: 4, par: 3, distance_metres: 199 },
      { id: holeId(17, 7), hole_number: 7, par: 3, distance_metres: 210 },
      { id: holeId(17, 12), hole_number: 12, par: 3, distance_metres: 205 },
      { id: holeId(17, 16), hole_number: 16, par: 3, distance_metres: 178 },
    ],
  },
  // #18
  {
    id: courseId(18), name: 'Pezula Championship Course',
    location_text: 'Knysna, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.070, lng: 23.090, image_url: null, is_partner: false,
    holes: [
      { id: holeId(18, 3), hole_number: 3, par: 3, distance_metres: 167 },
      { id: holeId(18, 5), hole_number: 5, par: 3, distance_metres: 191 },
      { id: holeId(18, 11), hole_number: 11, par: 3, distance_metres: 156 },
      { id: holeId(18, 15), hole_number: 15, par: 3, distance_metres: 152 },
    ],
  },
  // #19
  {
    id: courseId(19), name: 'Highland Gate Golf & Trout Estate',
    location_text: 'Dullstroom, Mpumalanga', region: 'Mpumalanga', country: 'South Africa',
    lat: -25.448, lng: 30.205, image_url: null, is_partner: false,
    holes: [
      { id: holeId(19, 3), hole_number: 3, par: 3, distance_metres: 167 },
      { id: holeId(19, 7), hole_number: 7, par: 3, distance_metres: 170 },
      { id: holeId(19, 13), hole_number: 13, par: 3, distance_metres: 148 },
      { id: holeId(19, 15), hole_number: 15, par: 3, distance_metres: 192 },
      { id: holeId(19, 17), hole_number: 17, par: 3, distance_metres: 163 },
    ],
  },
  // #20
  {
    id: courseId(20), name: 'Champagne Sports Resort',
    location_text: 'Winterton, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.004, lng: 29.465, image_url: null, is_partner: false,
    holes: [
      { id: holeId(20, 4), hole_number: 4, par: 3, distance_metres: 162 },
      { id: holeId(20, 7), hole_number: 7, par: 3, distance_metres: 160 },
      { id: holeId(20, 12), hole_number: 12, par: 3, distance_metres: 157 },
      { id: holeId(20, 17), hole_number: 17, par: 3, distance_metres: 195 },
    ],
  },
  // #21
  {
    id: courseId(21), name: 'Simola Golf Estate',
    location_text: 'Knysna, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.002, lng: 23.027, image_url: null, is_partner: false,
    holes: [
      { id: holeId(21, 6), hole_number: 6, par: 3, distance_metres: 200 },
      { id: holeId(21, 9), hole_number: 9, par: 3, distance_metres: 171 },
      { id: holeId(21, 11), hole_number: 11, par: 3, distance_metres: 191 },
      { id: holeId(21, 14), hole_number: 14, par: 3, distance_metres: 166 },
      { id: holeId(21, 17), hole_number: 17, par: 3, distance_metres: 160 },
    ],
  },
  // #22
  {
    id: courseId(22), name: 'George Golf Club',
    location_text: 'George, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.958, lng: 22.405, image_url: null, is_partner: false,
    holes: [
      { id: holeId(22, 6), hole_number: 6, par: 3, distance_metres: 153 },
      { id: holeId(22, 13), hole_number: 13, par: 3, distance_metres: 150 },
      { id: holeId(22, 15), hole_number: 15, par: 3, distance_metres: 170 },
      { id: holeId(22, 17), hole_number: 17, par: 3, distance_metres: 189 },
    ],
  },
  // #23
  {
    id: courseId(23), name: 'Country Club Johannesburg – Woodmead',
    location_text: 'Woodmead, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.047, lng: 28.096, image_url: null, is_partner: false,
    holes: [
      { id: holeId(23, 4), hole_number: 4, par: 3, distance_metres: 167 },
      { id: holeId(23, 8), hole_number: 8, par: 3, distance_metres: 175 },
      { id: holeId(23, 13), hole_number: 13, par: 3, distance_metres: 175 },
      { id: holeId(23, 15), hole_number: 15, par: 3, distance_metres: 175 },
    ],
  },
  // #24
  {
    id: courseId(24), name: 'Pretoria Country Club',
    location_text: 'Waterkloof, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.792, lng: 28.234, image_url: null, is_partner: false,
    holes: [
      { id: holeId(24, 5), hole_number: 5, par: 3, distance_metres: 162 },
      { id: holeId(24, 8), hole_number: 8, par: 3, distance_metres: 116 },
      { id: holeId(24, 14), hole_number: 14, par: 3, distance_metres: 136 },
      { id: holeId(24, 16), hole_number: 16, par: 3, distance_metres: 173 },
    ],
  },
  // #25
  {
    id: courseId(25), name: 'Fancourt – Outeniqua',
    location_text: 'George, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.954, lng: 22.407, image_url: null, is_partner: true,
    holes: [
      { id: holeId(25, 4), hole_number: 4, par: 3, distance_metres: 197 },
      { id: holeId(25, 7), hole_number: 7, par: 3, distance_metres: 175 },
      { id: holeId(25, 12), hole_number: 12, par: 3, distance_metres: 175 },
      { id: holeId(25, 15), hole_number: 15, par: 3, distance_metres: 156 },
    ],
  },
  // #26
  {
    id: courseId(26), name: 'Erinvale Golf Club',
    location_text: 'Somerset West, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.068, lng: 18.880, image_url: null, is_partner: false,
    holes: [
      { id: holeId(26, 2), hole_number: 2, par: 3, distance_metres: 154 },
      { id: holeId(26, 8), hole_number: 8, par: 3, distance_metres: 155 },
      { id: holeId(26, 12), hole_number: 12, par: 3, distance_metres: 166 },
      { id: holeId(26, 14), hole_number: 14, par: 3, distance_metres: 170 },
    ],
  },
  // #27
  {
    id: courseId(27), name: 'Country Club Johannesburg – Rocklands',
    location_text: 'Auckland Park, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.177, lng: 28.009, image_url: null, is_partner: false,
    holes: [
      { id: holeId(27, 4), hole_number: 4, par: 3, distance_metres: 198 },
      { id: holeId(27, 6), hole_number: 6, par: 3, distance_metres: 212 },
      { id: holeId(27, 15), hole_number: 15, par: 3, distance_metres: 170 },
      { id: holeId(27, 17), hole_number: 17, par: 3, distance_metres: 189 },
    ],
  },
  // #28
  {
    id: courseId(28), name: 'Royal Johannesburg & Kensington – West',
    location_text: 'Linksfield, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.182, lng: 28.113, image_url: null, is_partner: false,
    holes: [
      { id: holeId(28, 4), hole_number: 4, par: 3, distance_metres: 186 },
      { id: holeId(28, 7), hole_number: 7, par: 3, distance_metres: 139 },
      { id: holeId(28, 14), hole_number: 14, par: 3, distance_metres: 104 },
      { id: holeId(28, 17), hole_number: 17, par: 3, distance_metres: 176 },
    ],
  },
  // #29
  {
    id: courseId(29), name: 'De Zalze Golf Club',
    location_text: 'Stellenbosch, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.964, lng: 18.841, image_url: null, is_partner: false,
    holes: [
      { id: holeId(29, 3), hole_number: 3, par: 3, distance_metres: 133 },
      { id: holeId(29, 9), hole_number: 9, par: 3, distance_metres: 118 },
      { id: holeId(29, 12), hole_number: 12, par: 3, distance_metres: 140 },
      { id: holeId(29, 16), hole_number: 16, par: 3, distance_metres: 156 },
    ],
  },
  // #30
  {
    id: courseId(30), name: 'Houghton Golf Club',
    location_text: 'Houghton, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.170, lng: 28.060, image_url: null, is_partner: false,
    holes: [
      { id: holeId(30, 7), hole_number: 7, par: 3, distance_metres: 177 },
      { id: holeId(30, 9), hole_number: 9, par: 3, distance_metres: 178 },
      { id: holeId(30, 14), hole_number: 14, par: 3, distance_metres: 196 },
      { id: holeId(30, 16), hole_number: 16, par: 3, distance_metres: 230 },
    ],
  },
  // #31
  {
    id: courseId(31), name: 'Pecanwood Golf & Country Club',
    location_text: 'Hartbeespoort, North West', region: 'North West', country: 'South Africa',
    lat: -25.759, lng: 27.855, image_url: null, is_partner: false,
    holes: [
      { id: holeId(31, 3), hole_number: 3, par: 3, distance_metres: 150 },
      { id: holeId(31, 8), hole_number: 8, par: 3, distance_metres: 191 },
      { id: holeId(31, 13), hole_number: 13, par: 3, distance_metres: 171 },
      { id: holeId(31, 17), hole_number: 17, par: 3, distance_metres: 178 },
    ],
  },
  // #32
  {
    id: courseId(32), name: 'Kyalami Country Club',
    location_text: 'Kyalami, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.010, lng: 28.077, image_url: null, is_partner: false,
    holes: [
      { id: holeId(32, 3), hole_number: 3, par: 3, distance_metres: 178 },
      { id: holeId(32, 6), hole_number: 6, par: 3, distance_metres: 164 },
      { id: holeId(32, 14), hole_number: 14, par: 3, distance_metres: 148 },
      { id: holeId(32, 17), hole_number: 17, par: 3, distance_metres: 185 },
    ],
  },
  // #33
  {
    id: courseId(33), name: "Prince's Grant Coastal Golf Estate",
    location_text: 'KwaDukuza, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.346, lng: 31.379, image_url: null, is_partner: false,
    holes: [
      { id: holeId(33, 3), hole_number: 3, par: 3, distance_metres: 166 },
      { id: holeId(33, 8), hole_number: 8, par: 3, distance_metres: 161 },
      { id: holeId(33, 11), hole_number: 11, par: 3, distance_metres: 175 },
      { id: holeId(33, 17), hole_number: 17, par: 3, distance_metres: 198 },
    ],
  },
  // #34
  {
    id: courseId(34), name: 'Bryanston Country Club',
    location_text: 'Bryanston, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.060, lng: 28.013, image_url: null, is_partner: false,
    holes: [
      { id: holeId(34, 4), hole_number: 4, par: 3, distance_metres: 184 },
      { id: holeId(34, 9), hole_number: 9, par: 3, distance_metres: 163 },
      { id: holeId(34, 11), hole_number: 11, par: 3, distance_metres: 210 },
      { id: holeId(34, 14), hole_number: 14, par: 3, distance_metres: 161 },
    ],
  },
  // #35
  {
    id: courseId(35), name: 'Victoria Country Club',
    location_text: 'Pietermaritzburg, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.571, lng: 30.361, image_url: null, is_partner: false,
    holes: [
      { id: holeId(35, 6), hole_number: 6, par: 3, distance_metres: 164 },
      { id: holeId(35, 8), hole_number: 8, par: 3, distance_metres: 148 },
      { id: holeId(35, 13), hole_number: 13, par: 3, distance_metres: 137 },
      { id: holeId(35, 17), hole_number: 17, par: 3, distance_metres: 157 },
    ],
  },
  // #36
  {
    id: courseId(36), name: 'Parkview Golf Club',
    location_text: 'Parkview, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.165, lng: 28.034, image_url: null, is_partner: false,
    holes: [
      { id: holeId(36, 3), hole_number: 3, par: 3, distance_metres: 156 },
      { id: holeId(36, 5), hole_number: 5, par: 3, distance_metres: 175 },
      { id: holeId(36, 15), hole_number: 15, par: 3, distance_metres: 180 },
    ],
  },
  // #37
  {
    id: courseId(37), name: 'Randpark Golf Club – Firethorn',
    location_text: 'Randpark Ridge, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.113, lng: 27.958, image_url: null, is_partner: false,
    holes: [
      { id: holeId(37, 5), hole_number: 5, par: 3, distance_metres: 167 },
      { id: holeId(37, 8), hole_number: 8, par: 3, distance_metres: 191 },
      { id: holeId(37, 15), hole_number: 15, par: 3, distance_metres: 173 },
      { id: holeId(37, 17), hole_number: 17, par: 3, distance_metres: 205 },
    ],
  },
  // #38
  {
    id: courseId(38), name: 'Eye of Africa Golf Estate',
    location_text: 'Eikenhof, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.378, lng: 28.014, image_url: null, is_partner: false,
    holes: [
      { id: holeId(38, 5), hole_number: 5, par: 3, distance_metres: 190 },
      { id: holeId(38, 9), hole_number: 9, par: 3, distance_metres: 207 },
      { id: holeId(38, 12), hole_number: 12, par: 3, distance_metres: 178 },
      { id: holeId(38, 16), hole_number: 16, par: 3, distance_metres: 168 },
    ],
  },
  // #39
  {
    id: courseId(39), name: 'Royal Cape Golf Club',
    location_text: 'Wynberg, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.004, lng: 18.478, image_url: null, is_partner: false,
    holes: [
      { id: holeId(39, 4), hole_number: 4, par: 3, distance_metres: 125 },
      { id: holeId(39, 8), hole_number: 8, par: 3, distance_metres: 162 },
      { id: holeId(39, 13), hole_number: 13, par: 3, distance_metres: 166 },
      { id: holeId(39, 15), hole_number: 15, par: 3, distance_metres: 144 },
    ],
  },
  // #40
  {
    id: courseId(40), name: 'Hermanus Golf Club',
    location_text: 'Hermanus, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.424, lng: 19.233, image_url: null, is_partner: false,
    holes: [
      { id: holeId(40, 4), hole_number: 4, par: 3, distance_metres: 180 },
      { id: holeId(40, 9), hole_number: 9, par: 3, distance_metres: 155 },
      { id: holeId(40, 13), hole_number: 13, par: 3, distance_metres: 171 },
      { id: holeId(40, 16), hole_number: 16, par: 3, distance_metres: 165 },
    ],
  },
  // #41
  {
    id: courseId(41), name: 'Ebotse Golf & Country Estate',
    location_text: 'Benoni, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.167, lng: 28.334, image_url: null, is_partner: false,
    holes: [
      { id: holeId(41, 2), hole_number: 2, par: 3, distance_metres: 202 },
      { id: holeId(41, 8), hole_number: 8, par: 3, distance_metres: 150 },
      { id: holeId(41, 11), hole_number: 11, par: 3, distance_metres: 164 },
      { id: holeId(41, 15), hole_number: 15, par: 3, distance_metres: 149 },
    ],
  },
  // #42
  {
    id: courseId(42), name: 'Wild Coast Sun Country Club',
    location_text: 'Port Edward, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -31.080, lng: 30.170, image_url: null, is_partner: false,
    holes: [
      { id: holeId(42, 4), hole_number: 4, par: 3, distance_metres: 98 },
      { id: holeId(42, 6), hole_number: 6, par: 3, distance_metres: 171 },
      { id: holeId(42, 8), hole_number: 8, par: 3, distance_metres: 151 },
      { id: holeId(42, 11), hole_number: 11, par: 3, distance_metres: 176 },
      { id: holeId(42, 13), hole_number: 13, par: 3, distance_metres: 160 },
      { id: holeId(42, 17), hole_number: 17, par: 3, distance_metres: 159 },
    ],
  },
  // #43
  {
    id: courseId(43), name: 'Serengeti Golf & Wildlife Estate',
    location_text: 'Kempton Park, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.041, lng: 28.298, image_url: null, is_partner: false,
    holes: [
      { id: holeId(43, 5), hole_number: 5, par: 3, distance_metres: 122 },
      { id: holeId(43, 9), hole_number: 9, par: 3, distance_metres: 133 },
      { id: holeId(43, 12), hole_number: 12, par: 3, distance_metres: 161 },
      { id: holeId(43, 15), hole_number: 15, par: 3, distance_metres: 122 },
    ],
  },
  // #44
  {
    id: courseId(44), name: 'Maccauvlei Golf Club',
    location_text: 'Vereeniging, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.660, lng: 27.920, image_url: null, is_partner: false,
    holes: [
      { id: holeId(44, 5), hole_number: 5, par: 3, distance_metres: 197 },
      { id: holeId(44, 8), hole_number: 8, par: 3, distance_metres: 150 },
      { id: holeId(44, 14), hole_number: 14, par: 3, distance_metres: 149 },
      { id: holeId(44, 16), hole_number: 16, par: 3, distance_metres: 145 },
    ],
  },
  // #45
  {
    id: courseId(45), name: 'Wingate Park Country Club',
    location_text: 'Pretoria East, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.800, lng: 28.320, image_url: null, is_partner: false,
    holes: [
      { id: holeId(45, 5), hole_number: 5, par: 3, distance_metres: 140 },
      { id: holeId(45, 8), hole_number: 8, par: 3, distance_metres: 136 },
      { id: holeId(45, 14), hole_number: 14, par: 3, distance_metres: 175 },
      { id: holeId(45, 16), hole_number: 16, par: 3, distance_metres: 142 },
    ],
  },
  // #46
  {
    id: courseId(46), name: 'Plettenberg Bay Country Club',
    location_text: 'Plettenberg Bay, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.052, lng: 23.368, image_url: null, is_partner: false,
    holes: [
      { id: holeId(46, 6), hole_number: 6, par: 3, distance_metres: 163 },
      { id: holeId(46, 8), hole_number: 8, par: 3, distance_metres: 191 },
      { id: holeId(46, 11), hole_number: 11, par: 3, distance_metres: 128 },
      { id: holeId(46, 13), hole_number: 13, par: 3, distance_metres: 174 },
    ],
  },
  // #47
  {
    id: courseId(47), name: 'Killarney Country Club',
    location_text: 'Houghton, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.172, lng: 28.050, image_url: null, is_partner: false,
    holes: [
      { id: holeId(47, 4), hole_number: 4, par: 3, distance_metres: 198 },
      { id: holeId(47, 6), hole_number: 6, par: 3, distance_metres: 189 },
      { id: holeId(47, 14), hole_number: 14, par: 3, distance_metres: 187 },
      { id: holeId(47, 17), hole_number: 17, par: 3, distance_metres: 204 },
    ],
  },
  // #48
  {
    id: courseId(48), name: 'Clovelly Country Club',
    location_text: 'Clovelly, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.128, lng: 18.435, image_url: null, is_partner: false,
    holes: [
      { id: holeId(48, 6), hole_number: 6, par: 3, distance_metres: 144 },
      { id: holeId(48, 8), hole_number: 8, par: 3, distance_metres: 156 },
      { id: holeId(48, 11), hole_number: 11, par: 3, distance_metres: 109 },
      { id: holeId(48, 16), hole_number: 16, par: 3, distance_metres: 148 },
    ],
  },
  // #49
  {
    id: courseId(49), name: 'Modderfontein Golf Club',
    location_text: 'Modderfontein, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.096, lng: 28.163, image_url: null, is_partner: false,
    holes: [
      { id: holeId(49, 3), hole_number: 3, par: 3, distance_metres: 178 },
      { id: holeId(49, 9), hole_number: 9, par: 3, distance_metres: 185 },
      { id: holeId(49, 11), hole_number: 11, par: 3, distance_metres: 178 },
      { id: holeId(49, 14), hole_number: 14, par: 3, distance_metres: 159 },
    ],
  },
  // #50
  {
    id: courseId(50), name: 'Cotswold Downs Golf Club',
    location_text: 'Hillcrest, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.773, lng: 30.769, image_url: null, is_partner: false,
    holes: [
      { id: holeId(50, 5), hole_number: 5, par: 3, distance_metres: 163 },
      { id: holeId(50, 7), hole_number: 7, par: 3, distance_metres: 161 },
      { id: holeId(50, 14), hole_number: 14, par: 3, distance_metres: 170 },
      { id: holeId(50, 16), hole_number: 16, par: 3, distance_metres: 160 },
    ],
  },
  // #51
  {
    id: courseId(51), name: 'The Els Club – Copperleaf',
    location_text: 'Centurion, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.881, lng: 28.049, image_url: null, is_partner: false,
    holes: [
      { id: holeId(51, 3), hole_number: 3, par: 3, distance_metres: 210 },
      { id: holeId(51, 5), hole_number: 5, par: 3, distance_metres: 174 },
      { id: holeId(51, 14), hole_number: 14, par: 3, distance_metres: 179 },
      { id: holeId(51, 17), hole_number: 17, par: 3, distance_metres: 151 },
    ],
  },
  // #52
  {
    id: courseId(52), name: 'Steenberg Golf Club',
    location_text: 'Tokai, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.066, lng: 18.437, image_url: null, is_partner: false,
    holes: [
      { id: holeId(52, 3), hole_number: 3, par: 3, distance_metres: 155 },
      { id: holeId(52, 6), hole_number: 6, par: 3, distance_metres: 167 },
      { id: holeId(52, 11), hole_number: 11, par: 3, distance_metres: 140 },
      { id: holeId(52, 14), hole_number: 14, par: 3, distance_metres: 152 },
    ],
  },
  // #53
  {
    id: courseId(53), name: 'Mount Edgecombe CC – Course One',
    location_text: 'Mount Edgecombe, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.720, lng: 31.040, image_url: null, is_partner: false,
    holes: [
      { id: holeId(53, 4), hole_number: 4, par: 3, distance_metres: 165 },
      { id: holeId(53, 7), hole_number: 7, par: 3, distance_metres: 153 },
      { id: holeId(53, 13), hole_number: 13, par: 3, distance_metres: 171 },
      { id: holeId(53, 16), hole_number: 16, par: 3, distance_metres: 145 },
    ],
  },
  // #54
  {
    id: courseId(54), name: 'Woodhill Country Club',
    location_text: 'Pretoria East, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.815, lng: 28.340, image_url: null, is_partner: false,
    holes: [
      { id: holeId(54, 3), hole_number: 3, par: 3, distance_metres: 175 },
      { id: holeId(54, 8), hole_number: 8, par: 3, distance_metres: 162 },
      { id: holeId(54, 12), hole_number: 12, par: 3, distance_metres: 188 },
      { id: holeId(54, 16), hole_number: 16, par: 3, distance_metres: 150 },
    ],
  },
  // #55
  {
    id: courseId(55), name: 'Gowrie Farm Golf Course',
    location_text: 'Nottingham Road, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.364, lng: 30.003, image_url: null, is_partner: false,
    holes: [
      { id: holeId(55, 4), hole_number: 4, par: 3, distance_metres: 148 },
      { id: holeId(55, 6), hole_number: 6, par: 3, distance_metres: 155 },
      { id: holeId(55, 11), hole_number: 11, par: 3, distance_metres: 139 },
      { id: holeId(55, 15), hole_number: 15, par: 3, distance_metres: 164 },
    ],
  },
  // #56
  {
    id: courseId(56), name: 'Dainfern Golf & Country Club',
    location_text: 'Fourways, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.987, lng: 27.995, image_url: null, is_partner: false,
    holes: [
      { id: holeId(56, 4), hole_number: 4, par: 3, distance_metres: 170 },
      { id: holeId(56, 8), hole_number: 8, par: 3, distance_metres: 155 },
      { id: holeId(56, 13), hole_number: 13, par: 3, distance_metres: 183 },
      { id: holeId(56, 17), hole_number: 17, par: 3, distance_metres: 145 },
    ],
  },
  // #57
  {
    id: courseId(57), name: 'Irene Country Club',
    location_text: 'Irene, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.870, lng: 28.218, image_url: null, is_partner: false,
    holes: [
      { id: holeId(57, 5), hole_number: 5, par: 3, distance_metres: 158 },
      { id: holeId(57, 8), hole_number: 8, par: 3, distance_metres: 142 },
      { id: holeId(57, 14), hole_number: 14, par: 3, distance_metres: 172 },
      { id: holeId(57, 17), hole_number: 17, par: 3, distance_metres: 163 },
    ],
  },
  // #58
  {
    id: courseId(58), name: 'Atlantic Beach Golf Estate',
    location_text: 'Melkbosstrand, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.743, lng: 18.487, image_url: null, is_partner: true,
    holes: [
      { id: holeId(58, 5), hole_number: 5, par: 3, distance_metres: 143 },
      { id: holeId(58, 8), hole_number: 8, par: 3, distance_metres: 168 },
      { id: holeId(58, 12), hole_number: 12, par: 3, distance_metres: 187 },
      { id: holeId(58, 16), hole_number: 16, par: 3, distance_metres: 155 },
    ],
  },
  // #59
  {
    id: courseId(59), name: 'San Lameer Country Club',
    location_text: 'Southbroom, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -30.945, lng: 30.298, image_url: null, is_partner: false,
    holes: [
      { id: holeId(59, 4), hole_number: 4, par: 3, distance_metres: 147 },
      { id: holeId(59, 7), hole_number: 7, par: 3, distance_metres: 165 },
      { id: holeId(59, 12), hole_number: 12, par: 3, distance_metres: 158 },
      { id: holeId(59, 16), hole_number: 16, par: 3, distance_metres: 142 },
    ],
  },
  // #60
  {
    id: courseId(60), name: 'Zebula Country Club & Spa',
    location_text: 'Bela-Bela, Limpopo', region: 'Limpopo', country: 'South Africa',
    lat: -24.748, lng: 27.966, image_url: null, is_partner: false,
    holes: [
      { id: holeId(60, 3), hole_number: 3, par: 3, distance_metres: 172 },
      { id: holeId(60, 8), hole_number: 8, par: 3, distance_metres: 145 },
      { id: holeId(60, 13), hole_number: 13, par: 3, distance_metres: 160 },
      { id: holeId(60, 17), hole_number: 17, par: 3, distance_metres: 185 },
    ],
  },
  // #61
  {
    id: courseId(61), name: 'Stellenbosch Golf Club',
    location_text: 'Stellenbosch, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.935, lng: 18.870, image_url: null, is_partner: false,
    holes: [
      { id: holeId(61, 4), hole_number: 4, par: 3, distance_metres: 152 },
      { id: holeId(61, 7), hole_number: 7, par: 3, distance_metres: 140 },
      { id: holeId(61, 12), hole_number: 12, par: 3, distance_metres: 165 },
      { id: holeId(61, 15), hole_number: 15, par: 3, distance_metres: 178 },
    ],
  },
  // #62
  {
    id: courseId(62), name: 'Nelspruit Golf Club',
    location_text: 'Mbombela, Mpumalanga', region: 'Mpumalanga', country: 'South Africa',
    lat: -25.476, lng: 30.969, image_url: null, is_partner: false,
    holes: [
      { id: holeId(62, 3), hole_number: 3, par: 3, distance_metres: 168 },
      { id: holeId(62, 7), hole_number: 7, par: 3, distance_metres: 144 },
      { id: holeId(62, 12), hole_number: 12, par: 3, distance_metres: 159 },
      { id: holeId(62, 16), hole_number: 16, par: 3, distance_metres: 176 },
    ],
  },
  // #63
  {
    id: courseId(63), name: 'Umhlali Country Club',
    location_text: 'Umhlali, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.465, lng: 31.203, image_url: null, is_partner: false,
    holes: [
      { id: holeId(63, 5), hole_number: 5, par: 3, distance_metres: 155 },
      { id: holeId(63, 9), hole_number: 9, par: 3, distance_metres: 170 },
      { id: holeId(63, 14), hole_number: 14, par: 3, distance_metres: 148 },
      { id: holeId(63, 17), hole_number: 17, par: 3, distance_metres: 162 },
    ],
  },
  // #64
  {
    id: courseId(64), name: 'Krugersdorp Golf Club',
    location_text: 'Krugersdorp, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.106, lng: 27.782, image_url: null, is_partner: false,
    holes: [
      { id: holeId(64, 3), hole_number: 3, par: 3, distance_metres: 163 },
      { id: holeId(64, 7), hole_number: 7, par: 3, distance_metres: 149 },
      { id: holeId(64, 12), hole_number: 12, par: 3, distance_metres: 172 },
      { id: holeId(64, 15), hole_number: 15, par: 3, distance_metres: 155 },
    ],
  },
  // #65
  {
    id: courseId(65), name: 'Wanderers Golf Club',
    location_text: 'Illovo, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.142, lng: 28.055, image_url: null, is_partner: false,
    holes: [
      { id: holeId(65, 4), hole_number: 4, par: 3, distance_metres: 179 },
      { id: holeId(65, 8), hole_number: 8, par: 3, distance_metres: 157 },
      { id: holeId(65, 13), hole_number: 13, par: 3, distance_metres: 168 },
      { id: holeId(65, 16), hole_number: 16, par: 3, distance_metres: 142 },
    ],
  },
  // #66
  {
    id: courseId(66), name: 'Reading Country Club',
    location_text: 'Alberton, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.254, lng: 28.116, image_url: null, is_partner: false,
    holes: [
      { id: holeId(66, 5), hole_number: 5, par: 3, distance_metres: 145 },
      { id: holeId(66, 9), hole_number: 9, par: 3, distance_metres: 163 },
      { id: holeId(66, 14), hole_number: 14, par: 3, distance_metres: 178 },
      { id: holeId(66, 17), hole_number: 17, par: 3, distance_metres: 152 },
    ],
  },
  // #67
  {
    id: courseId(67), name: 'Paarl Golf Club (Boschenmeer)',
    location_text: 'Paarl, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.741, lng: 18.968, image_url: null, is_partner: false,
    holes: [
      { id: holeId(67, 2), hole_number: 2, par: 3, distance_metres: 159 },
      { id: holeId(67, 5), hole_number: 5, par: 3, distance_metres: 172 },
      { id: holeId(67, 12), hole_number: 12, par: 3, distance_metres: 148 },
      { id: holeId(67, 15), hole_number: 15, par: 3, distance_metres: 165 },
    ],
  },
  // #68
  {
    id: courseId(68), name: 'Centurion Country Club',
    location_text: 'Centurion, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.857, lng: 28.196, image_url: null, is_partner: false,
    holes: [
      { id: holeId(68, 4), hole_number: 4, par: 3, distance_metres: 160 },
      { id: holeId(68, 8), hole_number: 8, par: 3, distance_metres: 148 },
      { id: holeId(68, 13), hole_number: 13, par: 3, distance_metres: 175 },
      { id: holeId(68, 16), hole_number: 16, par: 3, distance_metres: 164 },
    ],
  },
  // #69
  {
    id: courseId(69), name: 'Eagle Canyon Golf Club',
    location_text: 'Honeydew, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.082, lng: 27.930, image_url: null, is_partner: false,
    holes: [
      { id: holeId(69, 3), hole_number: 3, par: 3, distance_metres: 185 },
      { id: holeId(69, 7), hole_number: 7, par: 3, distance_metres: 160 },
      { id: holeId(69, 12), hole_number: 12, par: 3, distance_metres: 173 },
      { id: holeId(69, 15), hole_number: 15, par: 3, distance_metres: 148 },
    ],
  },
  // #70
  {
    id: courseId(70), name: 'Sun City – The Lost City',
    location_text: 'Sun City, North West', region: 'North West', country: 'South Africa',
    lat: -25.335, lng: 27.100, image_url: null, is_partner: true,
    holes: [
      { id: holeId(70, 5), hole_number: 5, par: 3, distance_metres: 168 },
      { id: holeId(70, 8), hole_number: 8, par: 3, distance_metres: 155 },
      { id: holeId(70, 12), hole_number: 12, par: 3, distance_metres: 182 },
      { id: holeId(70, 16), hole_number: 16, par: 3, distance_metres: 195 },
    ],
  },
  // #71
  {
    id: courseId(71), name: 'Euphoria Golf Estate',
    location_text: 'Mookgophong, Limpopo', region: 'Limpopo', country: 'South Africa',
    lat: -24.580, lng: 28.700, image_url: null, is_partner: false,
    holes: [
      { id: holeId(71, 4), hole_number: 4, par: 3, distance_metres: 188 },
      { id: holeId(71, 8), hole_number: 8, par: 3, distance_metres: 162 },
      { id: holeId(71, 13), hole_number: 13, par: 3, distance_metres: 173 },
      { id: holeId(71, 17), hole_number: 17, par: 3, distance_metres: 152 },
    ],
  },
  // #72
  {
    id: courseId(72), name: 'Ruimsig Country Club',
    location_text: 'Ruimsig, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.093, lng: 27.862, image_url: null, is_partner: false,
    holes: [
      { id: holeId(72, 4), hole_number: 4, par: 3, distance_metres: 155 },
      { id: holeId(72, 7), hole_number: 7, par: 3, distance_metres: 168 },
      { id: holeId(72, 13), hole_number: 13, par: 3, distance_metres: 145 },
      { id: holeId(72, 16), hole_number: 16, par: 3, distance_metres: 178 },
    ],
  },
  // #73
  {
    id: courseId(73), name: 'Mount Edgecombe CC – Course Two',
    location_text: 'Mount Edgecombe, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.720, lng: 31.040, image_url: null, is_partner: false,
    holes: [
      { id: holeId(73, 3), hole_number: 3, par: 3, distance_metres: 160 },
      { id: holeId(73, 8), hole_number: 8, par: 3, distance_metres: 148 },
      { id: holeId(73, 12), hole_number: 12, par: 3, distance_metres: 175 },
      { id: holeId(73, 15), hole_number: 15, par: 3, distance_metres: 153 },
    ],
  },
  // #74
  {
    id: courseId(74), name: 'Goldfields West Golf Club',
    location_text: 'Carletonville, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.390, lng: 27.465, image_url: null, is_partner: false,
    holes: [
      { id: holeId(74, 5), hole_number: 5, par: 3, distance_metres: 162 },
      { id: holeId(74, 9), hole_number: 9, par: 3, distance_metres: 147 },
      { id: holeId(74, 14), hole_number: 14, par: 3, distance_metres: 175 },
      { id: holeId(74, 17), hole_number: 17, par: 3, distance_metres: 158 },
    ],
  },
  // #75
  {
    id: courseId(75), name: 'Knysna Golf Club',
    location_text: 'Knysna, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.045, lng: 23.046, image_url: null, is_partner: false,
    holes: [
      { id: holeId(75, 3), hole_number: 3, par: 3, distance_metres: 145 },
      { id: holeId(75, 7), hole_number: 7, par: 3, distance_metres: 162 },
      { id: holeId(75, 12), hole_number: 12, par: 3, distance_metres: 138 },
      { id: holeId(75, 16), hole_number: 16, par: 3, distance_metres: 170 },
    ],
  },
  // #76
  {
    id: courseId(76), name: 'Glenvista Country Club',
    location_text: 'Glenvista, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.295, lng: 28.095, image_url: null, is_partner: false,
    holes: [
      { id: holeId(76, 4), hole_number: 4, par: 3, distance_metres: 149 },
      { id: holeId(76, 8), hole_number: 8, par: 3, distance_metres: 160 },
      { id: holeId(76, 13), hole_number: 13, par: 3, distance_metres: 143 },
      { id: holeId(76, 15), hole_number: 15, par: 3, distance_metres: 155 },
    ],
  },
  // #77
  {
    id: courseId(77), name: 'Mossel Bay Golf Club',
    location_text: 'Mossel Bay, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.178, lng: 22.130, image_url: null, is_partner: false,
    holes: [
      { id: holeId(77, 4), hole_number: 4, par: 3, distance_metres: 112 },
      { id: holeId(77, 8), hole_number: 8, par: 3, distance_metres: 122 },
      { id: holeId(77, 12), hole_number: 12, par: 3, distance_metres: 156 },
      { id: holeId(77, 15), hole_number: 15, par: 3, distance_metres: 108 },
    ],
  },
  // #78
  {
    id: courseId(78), name: 'Waterkloof Golf Club',
    location_text: 'Waterkloof, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -25.790, lng: 28.230, image_url: null, is_partner: false,
    holes: [
      { id: holeId(78, 6), hole_number: 6, par: 3, distance_metres: 155 },
      { id: holeId(78, 8), hole_number: 8, par: 3, distance_metres: 119 },
      { id: holeId(78, 15), hole_number: 15, par: 3, distance_metres: 141 },
      { id: holeId(78, 17), hole_number: 17, par: 3, distance_metres: 167 },
    ],
  },
  // #79
  {
    id: courseId(79), name: 'Umdoni Park Golf Club',
    location_text: 'Pennington, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -30.440, lng: 30.657, image_url: null, is_partner: false,
    holes: [
      { id: holeId(79, 3), hole_number: 3, par: 3, distance_metres: 116 },
      { id: holeId(79, 7), hole_number: 7, par: 3, distance_metres: 155 },
      { id: holeId(79, 12), hole_number: 12, par: 3, distance_metres: 110 },
      { id: holeId(79, 16), hole_number: 16, par: 3, distance_metres: 185 },
    ],
  },
  // #80
  {
    id: courseId(80), name: 'St Francis Bay Golf Club',
    location_text: 'St Francis Bay, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -34.170, lng: 24.840, image_url: null, is_partner: false,
    holes: [
      { id: holeId(80, 3), hole_number: 3, par: 3, distance_metres: 185 },
      { id: holeId(80, 8), hole_number: 8, par: 3, distance_metres: 130 },
      { id: holeId(80, 10), hole_number: 10, par: 3, distance_metres: 155 },
      { id: holeId(80, 14), hole_number: 14, par: 3, distance_metres: 160 },
      { id: holeId(80, 17), hole_number: 17, par: 3, distance_metres: 138 },
    ],
  },
  // #81
  {
    id: courseId(81), name: 'Goose Valley Golf Club',
    location_text: 'Plettenberg Bay, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.025, lng: 23.305, image_url: null, is_partner: false,
    holes: [
      { id: holeId(81, 2), hole_number: 2, par: 3, distance_metres: 140 },
      { id: holeId(81, 5), hole_number: 5, par: 3, distance_metres: 116 },
      { id: holeId(81, 11), hole_number: 11, par: 3, distance_metres: 143 },
      { id: holeId(81, 13), hole_number: 13, par: 3, distance_metres: 145 },
    ],
  },
  // #82
  {
    id: courseId(82), name: 'Westlake Golf Club',
    location_text: 'Westlake, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.082, lng: 18.438, image_url: null, is_partner: false,
    holes: [
      { id: holeId(82, 3), hole_number: 3, par: 3, distance_metres: 146 },
      { id: holeId(82, 6), hole_number: 6, par: 3, distance_metres: 169 },
      { id: holeId(82, 15), hole_number: 15, par: 3, distance_metres: 133 },
      { id: holeId(82, 17), hole_number: 17, par: 3, distance_metres: 161 },
    ],
  },
  // #83
  {
    id: courseId(83), name: 'Randpark Golf Club – Bushwillow',
    location_text: 'Randpark Ridge, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.113, lng: 27.958, image_url: null, is_partner: false,
    holes: [
      { id: holeId(83, 6), hole_number: 6, par: 3, distance_metres: 156 },
      { id: holeId(83, 8), hole_number: 8, par: 3, distance_metres: 162 },
      { id: holeId(83, 13), hole_number: 13, par: 3, distance_metres: 182 },
      { id: holeId(83, 15), hole_number: 15, par: 3, distance_metres: 154 },
    ],
  },
  // #84
  {
    id: courseId(84), name: 'King David Mowbray Golf Club',
    location_text: 'Mowbray, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.952, lng: 18.471, image_url: null, is_partner: false,
    holes: [
      { id: holeId(84, 4), hole_number: 4, par: 3, distance_metres: 155 },
      { id: holeId(84, 8), hole_number: 8, par: 3, distance_metres: 150 },
      { id: holeId(84, 13), hole_number: 13, par: 3, distance_metres: 150 },
      { id: holeId(84, 16), hole_number: 16, par: 3, distance_metres: 130 },
    ],
  },
  // #85
  {
    id: courseId(85), name: 'Oubaai Golf Club',
    location_text: 'Herolds Bay, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -34.046, lng: 22.409, image_url: null, is_partner: false,
    holes: [
      { id: holeId(85, 3), hole_number: 3, par: 3, distance_metres: 155 },
      { id: holeId(85, 6), hole_number: 6, par: 3, distance_metres: 160 },
      { id: holeId(85, 11), hole_number: 11, par: 3, distance_metres: 155 },
      { id: holeId(85, 14), hole_number: 14, par: 3, distance_metres: 180 },
      { id: holeId(85, 17), hole_number: 17, par: 3, distance_metres: 125 },
    ],
  },
  // #86
  {
    id: courseId(86), name: 'Royal Port Alfred Golf Club',
    location_text: 'Port Alfred, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -33.592, lng: 26.890, image_url: null, is_partner: false,
    holes: [
      { id: holeId(86, 6), hole_number: 6, par: 3, distance_metres: 126 },
      { id: holeId(86, 8), hole_number: 8, par: 3, distance_metres: 144 },
      { id: holeId(86, 11), hole_number: 11, par: 3, distance_metres: 168 },
      { id: holeId(86, 13), hole_number: 13, par: 3, distance_metres: 172 },
    ],
  },
  // #87
  {
    id: courseId(87), name: 'Wedgewood Golf & Country Estate',
    location_text: 'Gqeberha, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -33.870, lng: 25.670, image_url: null, is_partner: false,
    holes: [
      { id: holeId(87, 3), hole_number: 3, par: 3, distance_metres: 172 },
      { id: holeId(87, 7), hole_number: 7, par: 3, distance_metres: 139 },
      { id: holeId(87, 12), hole_number: 12, par: 3, distance_metres: 155 },
      { id: holeId(87, 14), hole_number: 14, par: 3, distance_metres: 145 },
    ],
  },
  // #88
  {
    id: courseId(88), name: 'Parys Golf & Country Estate',
    location_text: 'Parys, Free State', region: 'Free State', country: 'South Africa',
    lat: -26.892, lng: 27.465, image_url: null, is_partner: false,
    holes: [
      { id: holeId(88, 4), hole_number: 4, par: 3, distance_metres: 165 },
      { id: holeId(88, 8), hole_number: 8, par: 3, distance_metres: 173 },
      { id: holeId(88, 12), hole_number: 12, par: 3, distance_metres: 200 },
      { id: holeId(88, 16), hole_number: 16, par: 3, distance_metres: 167 },
    ],
  },
  // #89
  {
    id: courseId(89), name: 'Katberg Eco Golf Estate',
    location_text: 'Fort Beaufort, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -32.489, lng: 26.667, image_url: null, is_partner: false,
    holes: [
      { id: holeId(89, 3), hole_number: 3, par: 3, distance_metres: 139 },
      { id: holeId(89, 7), hole_number: 7, par: 3, distance_metres: 135 },
      { id: holeId(89, 11), hole_number: 11, par: 3, distance_metres: 120 },
      { id: holeId(89, 18), hole_number: 18, par: 3, distance_metres: 156 },
    ],
  },
  // #90
  {
    id: courseId(90), name: 'Milnerton Golf Club',
    location_text: 'Milnerton, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.858, lng: 18.505, image_url: null, is_partner: false,
    holes: [
      { id: holeId(90, 5), hole_number: 5, par: 3, distance_metres: 137 },
      { id: holeId(90, 7), hole_number: 7, par: 3, distance_metres: 115 },
      { id: holeId(90, 11), hole_number: 11, par: 3, distance_metres: 147 },
      { id: holeId(90, 14), hole_number: 14, par: 3, distance_metres: 162 },
    ],
  },
  // #91
  {
    id: courseId(91), name: 'Bloemfontein Golf Club',
    location_text: 'Bloemfontein, Free State', region: 'Free State', country: 'South Africa',
    lat: -29.105, lng: 26.199, image_url: null, is_partner: false,
    holes: [
      { id: holeId(91, 4), hole_number: 4, par: 3, distance_metres: 171 },
      { id: holeId(91, 8), hole_number: 8, par: 3, distance_metres: 134 },
      { id: holeId(91, 11), hole_number: 11, par: 3, distance_metres: 134 },
      { id: holeId(91, 16), hole_number: 16, par: 3, distance_metres: 131 },
    ],
  },
  // #92
  {
    id: courseId(92), name: 'Kingswood Golf Estate',
    location_text: 'George, Western Cape', region: 'Western Cape', country: 'South Africa',
    lat: -33.970, lng: 22.400, image_url: null, is_partner: false,
    holes: [
      { id: holeId(92, 3), hole_number: 3, par: 3, distance_metres: 130 },
      { id: holeId(92, 5), hole_number: 5, par: 3, distance_metres: 148 },
      { id: holeId(92, 8), hole_number: 8, par: 3, distance_metres: 150 },
      { id: holeId(92, 17), hole_number: 17, par: 3, distance_metres: 145 },
    ],
  },
  // #93
  {
    id: courseId(93), name: 'Emfuleni Golf Estate',
    location_text: 'Vanderbijlpark, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.685, lng: 27.790, image_url: null, is_partner: false,
    holes: [
      { id: holeId(93, 4), hole_number: 4, par: 3, distance_metres: 150 },
      { id: holeId(93, 7), hole_number: 7, par: 3, distance_metres: 125 },
      { id: holeId(93, 12), hole_number: 12, par: 3, distance_metres: 155 },
      { id: holeId(93, 17), hole_number: 17, par: 3, distance_metres: 145 },
    ],
  },
  // #94
  {
    id: courseId(94), name: 'Schoeman Park Golf Club',
    location_text: 'Bloemfontein, Free State', region: 'Free State', country: 'South Africa',
    lat: -29.123, lng: 26.244, image_url: null, is_partner: false,
    holes: [
      { id: holeId(94, 6), hole_number: 6, par: 3, distance_metres: 152 },
      { id: holeId(94, 8), hole_number: 8, par: 3, distance_metres: 126 },
      { id: holeId(94, 14), hole_number: 14, par: 3, distance_metres: 188 },
      { id: holeId(94, 17), hole_number: 17, par: 3, distance_metres: 204 },
    ],
  },
  // #95
  {
    id: courseId(95), name: 'Bosch Hoek Golf Estate',
    location_text: 'Balgowan, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -29.393, lng: 30.014, image_url: null, is_partner: false,
    holes: [
      { id: holeId(95, 5), hole_number: 5, par: 3, distance_metres: 152 },
      { id: holeId(95, 7), hole_number: 7, par: 3, distance_metres: 130 },
      { id: holeId(95, 14), hole_number: 14, par: 3, distance_metres: 152 },
      { id: holeId(95, 16), hole_number: 16, par: 3, distance_metres: 130 },
    ],
  },
  // #96
  {
    id: courseId(96), name: 'Olivewood Private Estate & Golf Club',
    location_text: 'Chintsa, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -32.830, lng: 28.070, image_url: null, is_partner: false,
    holes: [
      { id: holeId(96, 7), hole_number: 7, par: 3, distance_metres: 150 },
      { id: holeId(96, 11), hole_number: 11, par: 3, distance_metres: 130 },
      { id: holeId(96, 15), hole_number: 15, par: 3, distance_metres: 128 },
      { id: holeId(96, 17), hole_number: 17, par: 3, distance_metres: 140 },
    ],
  },
  // #97
  {
    id: courseId(97), name: 'Jackal Creek Golf Estate',
    location_text: 'Honeydew, Gauteng', region: 'Gauteng', country: 'South Africa',
    lat: -26.040, lng: 27.900, image_url: null, is_partner: false,
    holes: [
      { id: holeId(97, 4), hole_number: 4, par: 3, distance_metres: 160 },
      { id: holeId(97, 7), hole_number: 7, par: 3, distance_metres: 128 },
      { id: holeId(97, 12), hole_number: 12, par: 3, distance_metres: 150 },
      { id: holeId(97, 15), hole_number: 15, par: 3, distance_metres: 203 },
    ],
  },
  // #98
  {
    id: courseId(98), name: 'Magalies Park Golf Club',
    location_text: 'Rustenburg, North West', region: 'North West', country: 'South Africa',
    lat: -25.680, lng: 27.550, image_url: null, is_partner: false,
    holes: [
      { id: holeId(98, 5), hole_number: 5, par: 3, distance_metres: 153 },
      { id: holeId(98, 8), hole_number: 8, par: 3, distance_metres: 137 },
      { id: holeId(98, 9), hole_number: 9, par: 3, distance_metres: 152 },
      { id: holeId(98, 11), hole_number: 11, par: 3, distance_metres: 158 },
      { id: holeId(98, 14), hole_number: 14, par: 3, distance_metres: 123 },
    ],
  },
  // #99
  {
    id: courseId(99), name: 'Southbroom Golf Club',
    location_text: 'Southbroom, KwaZulu-Natal', region: 'KwaZulu-Natal', country: 'South Africa',
    lat: -30.913, lng: 30.315, image_url: null, is_partner: false,
    holes: [
      { id: holeId(99, 4), hole_number: 4, par: 3, distance_metres: 113 },
      { id: holeId(99, 8), hole_number: 8, par: 3, distance_metres: 159 },
      { id: holeId(99, 11), hole_number: 11, par: 3, distance_metres: 150 },
      { id: holeId(99, 14), hole_number: 14, par: 3, distance_metres: 186 },
    ],
  },
  // #100
  {
    id: courseId(100), name: 'Port Elizabeth Golf Club',
    location_text: 'Gqeberha, Eastern Cape', region: 'Eastern Cape', country: 'South Africa',
    lat: -33.960, lng: 25.612, image_url: null, is_partner: false,
    holes: [
      { id: holeId(100, 2), hole_number: 2, par: 3, distance_metres: 119 },
      { id: holeId(100, 5), hole_number: 5, par: 3, distance_metres: 172 },
      { id: holeId(100, 14), hole_number: 14, par: 3, distance_metres: 130 },
      { id: holeId(100, 17), hole_number: 17, par: 3, distance_metres: 141 },
    ],
  },
]
