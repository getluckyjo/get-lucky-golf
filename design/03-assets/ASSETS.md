# Asset specification

Three groups: logo, icons, imagery. The logo and icon sets are the two highest-value
things in this whole engagement, because both are genuinely broken today rather than
merely dated.

---

## 1. Logo — currently a machine trace in the wrong colour

What ships today, honestly:

- `public/logo.svg` is a **single auto-vectorised path** filled `#007728` — a bright
  emerald that contradicts the brand's forest green. It cannot be recoloured sensibly
  because it is one path, and it was traced from a raster, not drawn.
- `public/logo.png` is **292 KB** and is what actually appears on the splash and auth screens.
- `favicon.png` and `apple-icon.png` are **296 KB each** — for a favicon.
- There is no reversed lockup. On dark backgrounds the code fakes one with a CSS filter
  (`brightness(0) invert(1)`), which flattens the mark to pure white and destroys any detail.

### Deliver

| File | Spec |
|---|---|
| `logo-primary.svg` | Full-colour horizontal lockup. Real vector. Under 15 KB. |
| `logo-reversed.svg` | Cream on dark, drawn as artwork — not the primary with a filter over it. |
| `logo-mono-dark.svg` | Single colour, for print and low-ink contexts. |
| `logo-mono-cream.svg` | Single colour, reversed. |
| `mark.svg` | Icon only, square, must still read at 24px. |
| `app-icon-1024.png` | Flattened, no transparency, under 60 KB. |
| `app-icon-512.png`, `favicon-192.png`, `favicon-32.png` | Same, scaled and hand-checked at each size. |
| `logo-source.ai` | The editable master, so this never has to be re-traced again. |
| Clear space and minimum size | One diagram. What is the smallest the lockup may appear, and how much air does it need. |

---

## 2. Icons — thirteen emoji are currently doing real UI work

The app uses **emoji as its icon system**. Not as decoration — as interface. The primary
Play button in the tab bar is 🏌️. The search field's magnifying glass is a 🔍 injected
through CSS. These render as a different picture on iPhone, Android, Windows and Mac, and
they cannot be recoloured, resized precisely, or animated.

### Deliver a 19-icon set

Replacing emoji: `golf-flag`, `golfer`, `trophy`, `lock`, `search`, `card`, `money`,
`video`, `check`, `document`, `crown`, `target`, `star`.

The six tab bar glyphs (currently hand-drawn SVGs, inconsistent with everything else):
`home`, `history`, `leaderboard`, `play`, `membership`, `account`.

### Export spec

> **24 x 24 px artboard.** All strokes black `#000000`, **2px**, round cap, round join.
> **Do not expand strokes.** No fills, no gradients, no clipping masks, no unnecessary
> groups. Save as SVG with "Presentation Attributes". Leave the "Responsive" box unchecked.

Keep strokes live — expanded strokes become filled outlines that cannot be recoloured or
resized cleanly. We handle the conversion to a recolourable component; you just draw.

**Geometry note:** the codebase already uses [Lucide](https://lucide.dev) icons in places,
and the two sets will sit next to each other. Lucide is a 24px grid with 2px round strokes.
Matching that geometry means the sets look like one family. Deviating is a legitimate design
choice — just do it on purpose, and tell us, because then we replace the Lucide icons too.

---

## 3. Imagery — a treatment recipe, not new photography

Do not shoot or source anything new. There are already 19 South African course photographs
in `public/marketing/courses/` (Zimbali, Clovelly, Paarl, St Francis Links, Metropolitan
and others) plus a hero background.

What we need is a **recipe** we can apply consistently to any course photo, including ones
added after you have finished:

- Crop ratio for the course list thumbnail, and for the onboarding hero.
- The scrim or gradient that goes over a photo so text stays legible — as colour stops with
  positions and opacities, not just "a dark overlay".
- Any grade, duotone or treatment. If there is none, say so explicitly.
- One finished hero comp at 1125 x 1500 showing the recipe applied.

### Weight budget

`public/marketing/hero-bg.avif` is currently **1.37 MB** for a single background image. On
a South African mobile connection that is a real cost to a real user.

| Asset | Maximum |
|---|---|
| Hero background | 250 KB |
| Course thumbnail | 60 KB |
| App icon / favicon | 60 KB |
| Logo SVG | 15 KB |

---

## Where to put things

```
design/03-assets/
  logo/       all logo files plus the clear-space diagram
  icons/      the 19 SVGs, named exactly as listed above
  imagery/    the hero comp and the treatment recipe
```
