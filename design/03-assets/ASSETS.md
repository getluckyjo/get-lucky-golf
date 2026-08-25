# Asset specification

Three groups: logo, icons, imagery.

The brand mark itself is good — see below — so the logo work is about producing usable
formats and, critically, an icon-only mark that does not exist yet. The icon set is a
straight replacement of thirteen emoji currently doing interface work.

---

## 1. Logo — a good mark with the wrong file formats

**The real logo lives in the `getlucky-www` repository, and it is genuinely good.** Copies
are in `logo/current/` so you have them to hand:

| File | What it is |
|---|---|
| `logo-color.png` | The primary lockup. Hand-lettered cream script reading "Get Lucky", with a forest-green drop shadow, over "GOLF" in a condensed sans beneath a rule. For light backgrounds. |
| `logo-dark-bg.png` | The same lettering with a cream halo around the whole mark so it holds on dark green. A real reversed artwork, not a filter. |
| `challenge-lockup.png` | The separate Get Lucky Challenge lockup. |
| `partners/` | Indwe, Santam, Nedbank, Sun International, Shanky's Whip, FlySafair, Blue Label Telecoms. Several are already SVG. |

**Ignore `public/logo.svg` in the app repository entirely.** It is an unrelated
machine-traced path filled emerald `#007728` and it should be deleted, not redrawn.

### What is actually missing

The mark is fine. The delivery is not.

1. **No vector master.** Every file is a PNG at roughly 2932 x 2195 and 269–305 KB. There is no `.ai`, `.svg` or `.eps` anywhere in either repository. Everything downstream is a resample of a raster.
2. **No icon-only mark, and this is the real problem.** The lockup is hand-lettered script. It is beautiful at 200px and unreadable at 24px. A mobile app needs a mark that survives in a tab bar, a favicon, an app icon and an avatar — and one does not exist. **This is the single most valuable thing you can draw for us.**
3. **No small-size treatment.** Nobody has decided what happens between "full lockup" and "icon".

### Deliver

| File | Spec |
|---|---|
| `logo-primary.svg` | The existing lockup, redrawn as true vector. Under 30 KB. |
| `logo-reversed.svg` | The dark-background variant, as vector. |
| `logo-mono-dark.svg` / `logo-mono-cream.svg` | Single colour, for print and low-ink contexts. |
| `mark.svg` | **New.** Icon only, square, legible at 24px. |
| `app-icon-1024.png` | Flattened, no transparency, under 60 KB. |
| `app-icon-512.png`, `favicon-192.png`, `favicon-32.png` | Scaled and hand-checked at each size — a script reduction will not survive automatically. |
| `logo-source.ai` | The editable master. |
| Clear space, minimum size, and the size at which the lockup gives way to the mark | One diagram. |

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
  logo/current/     the existing marks from getlucky-www — reference, do not overwrite
  logo/             your new files plus the clear-space diagram
  icons/            the 19 SVGs, named exactly as listed above
  imagery/          the hero comp and the treatment recipe
  fonts/            PosterGothicRoundATF-Heavy.woff2 — the licensed display cut
```
