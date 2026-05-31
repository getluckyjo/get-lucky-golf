import Image from 'next/image'
import { MapPin, Plus } from 'lucide-react'

const COURSES = [
  { slug: 'metropolitan',    name: 'Metropolitan',       region: 'Cape Town' },
  { slug: 'clovelly',        name: 'Clovelly',           region: 'Cape Town' },
  { slug: 'atlantic-beach',  name: 'Atlantic Beach',     region: 'Cape Town' },
  { slug: 'paarl',           name: 'Paarl',              region: 'Cape Winelands' },
  { slug: 'boschenmeer',     name: 'Boschenmeer',        region: 'Cape Winelands' },
  { slug: 'durbanville',     name: 'Durbanville',        region: 'Cape Town' },
  { slug: 'rondebosch',      name: 'Rondebosch',         region: 'Cape Town' },
  { slug: 'mossel-bay',      name: 'Mossel Bay',         region: 'Garden Route' },
  // Featured tile slot here (rendered separately)
  { slug: 'st-francis-links',name: 'St Francis Links',   region: 'Eastern Cape' },
  { slug: 'east-london',     name: 'East London',        region: 'Eastern Cape' },
  { slug: 'centurion',       name: 'Centurion',          region: 'Gauteng' },
  { slug: 'highland-gate',   name: 'Highland Gate',      region: 'Mpumalanga' },
  { slug: 'zimbali',         name: 'Zimbali',            region: 'KwaZulu-Natal' },
  { slug: 'umhlali',         name: 'Umhlali',            region: 'KwaZulu-Natal' },
  { slug: 'graceland',       name: 'Graceland',          region: 'Mpumalanga' },
]

const FEATURE_INDEX = 8 // position where the gold "more" tile lives

export default function PartnerCourses() {
  return (
    <section
      id="courses"
      aria-labelledby="courses-heading"
      className="relative bg-[#1e3120] overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#c9a94e]/8 rounded-full blur-[120px] pointer-events-none"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
              Where to play
            </p>
            <h2
              id="courses-heading"
              className="font-playfair text-3xl sm:text-5xl md:text-6xl text-white leading-[1.02] uppercase tracking-tight"
            >
              Play it at SA&rsquo;s
              <br />
              <span className="text-[#c9a94e]">best par-3s.</span>
            </h2>
          </div>
          <p className="text-white/70 leading-relaxed md:text-lg md:pb-2">
            From the Western Cape to KZN. 100+ registered courses, more added every month.
            No hardware on the tee — just open the app, pick a hole, and back yourself.
          </p>
        </div>

        <ul className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {COURSES.slice(0, FEATURE_INDEX).map((c) => (
            <CourseTile key={c.slug} course={c} />
          ))}

          {/* Featured tile */}
          <li className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#c9a94e] via-[#c9a94e] to-[#a98b3c] text-[#1e3120] p-5 flex flex-col justify-between group">
            <div
              aria-hidden
              className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"
            />
            <Plus className="w-7 h-7 opacity-70 group-hover:rotate-90 transition-transform duration-500" aria-hidden />
            <div>
              <p className="font-playfair text-4xl md:text-5xl leading-none uppercase">
                100+
              </p>
              <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.12em]">
                courses live
              </p>
              <p className="mt-2 text-xs text-[#1e3120]/65 leading-snug">
                And more added every month
              </p>
            </div>
          </li>

          {COURSES.slice(FEATURE_INDEX).map((c) => (
            <CourseTile key={c.slug} course={c} />
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-white/55">
          Full course list lives inside the app.
        </p>
      </div>
    </section>
  )
}

function CourseTile({ course }: { course: { slug: string; name: string; region: string } }) {
  return (
    <li className="group relative aspect-[4/3] rounded-xl overflow-hidden">
      <Image
        src={`/marketing/courses/${course.slug}.jpg`}
        alt={`${course.name} Golf Club`}
        fill
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 32vw, 48vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-[#c9a94e]/40 transition-colors"
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-bold text-white text-base leading-tight group-hover:text-[#c9a94e] transition-colors">
          {course.name}
        </p>
        <p className="flex items-center gap-1 text-white/70 text-xs mt-1">
          <MapPin className="w-3 h-3" aria-hidden />
          {course.region}
        </p>
      </div>
    </li>
  )
}
