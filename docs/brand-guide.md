# Get Lucky Golf — Brand Guide

> Source of truth: the live production site **getluckygolf.co.za**. All tokens below
> were extracted from the live site's compiled CSS custom properties on 2026-05-31.
> When the live site and the app disagree, the live site wins.

---

## 1. Colour palette

### Core tokens (authoritative — from live `:root`)

| Token | Hex | Role |
|-------|-----|------|
| `--cream` / `--background` | `#f5f0e1` | Default app/page background |
| `--cream-dark` | `#e8e0cc` | Secondary surface, borders, subtle fills |
| `--green-dark` | `#1e3120` | Deep forest — primary brand green, hero backgrounds, headings on cream |
| `--green` | `#335231` | Mid forest — primary buttons, active states |
| `--green-light` | `#4a7a3d` | Lighter forest — accents, hover, secondary green |
| `--gold` | `#c9a94e` | Primary gold — prize/win emphasis, premium accents |
| `--gold-light` | `#e8d48b` | Light gold — gradients, highlights |
| `--foreground` | `#1a1a1a` | Primary body text on light |
| `--charcoal` | `#2a2a2a` | Strong text, dark UI |
| `--charcoal-light` | `#3a3a3a` | Secondary text |
| `--black` | `#000000` | Pure black (sparingly) |
| `--white` | `#ffffff` | White surfaces, text on dark |

### Status / accent

| Token | Hex | Role |
|-------|-----|------|
| `--red-600` | `#e40014` | Error, "live"/record badge, alerts |
| `--red-700` | `#bf000f` | Pressed/darker red |
| `--red-200` | `#ffcaca` | Red border tint |
| `--red-50` | `#fef2f2` | Red background tint |
| Accent blue | `#0072b8` | Minor accent (info text / partner) — use sparingly, not a core brand colour |

### The single most important brand fact

The brand green is a **deep forest/olive green** (`#1e3120` → `#335231` → `#4a7a3d`),
**not** a bright emerald. The app currently ships emerald (`#007728`); this must be
re-pointed to the forest scale above to match the brand.

---

## 2. Typography

| Use | Typeface | Notes |
|-----|----------|-------|
| Display / headings | **Poster Gothic** (`posterGothic`) | Heavy, condensed, uppercase. Fallbacks: Impact, Arial Black, sans-serif. Already bundled at `/public/fonts/PosterGothicRoundATF-Heavy.otf`. |
| Body / UI | **Inter** | Clean geometric sans. Fallbacks: system-ui, sans-serif. **The app currently uses DM Sans — switch to Inter.** |
| Mono | system mono | SFMono / Menlo / Monaco for numerals like card/timer where used. |

Headings: uppercase, tight letter-spacing, heavy weight. Body: Inter, regular/medium,
generous line-height (~1.5–1.6).

---

## 3. Logo

- Primary mark: **Get Lucky Golf Club** — circular badge / colour lockup.
- Challenge wordmark: **Get Lucky** challenge lockup (`GLG_Challenge Lockup`).
- App `logo.svg` is natively forest-green stroke — display directly on cream
  backgrounds (no CSS filter). On dark/green backgrounds, invert to cream/white.
- Placement: top-left of nav and repeated in footer.
- Clear space and minimum sizes: keep generous padding; never place the coloured
  logo on a busy photo without a solid scrim.

---

## 4. Visual style & tone

- **Mood:** premium, energetic, aspirational — "accessible luxury." Confidence of
  winning paired with insurance-backed credibility.
- **Backgrounds:** cream `#f5f0e1` as the default canvas; deep forest-green panels
  for heroes and emphasis; gold reserved for prize/win moments.
- **Imagery:** high-quality golf-course photography, scenic hero banners, action shots.
- **Numbers matter:** prize amounts (up to **R1,000,000**), stakes (**R50–R1,000**) are
  hero elements — set large in Poster Gothic, often gold on green.
- **Voice / taglines:**
  - "Scan, pay, play — and if you sink it, you win."
  - "One swing. The bigger the entry, the bigger the prize."
  - "Back yourself on any par-3."
- Always pair the excitement with **responsible-play** and **insurance-backed**
  trust signals.

---

## 5. Partners / sponsors

Present partner logos in a consistent greyscale lockup:

- **Indwe Risk Services** — headline sponsor (FSP 3425). Banner asset:
  `/public/GLG_Indwe_FSP_Banner.png`.
- **Santam** — co-insurer.
- Others referenced on the live site: Blue Label Telecoms, Sun International,
  FlySafair, Shanky's Whip.

---

## 6. App vs. brand — current drift (to fix for beta)

| Element | Brand (live site) | App today | Action |
|---------|-------------------|-----------|--------|
| Primary green | `#335231` / `#1e3120` (forest) | `#007728` / `#006320` (emerald) | Re-point green scale |
| Green light | `#4a7a3d` | `#4aad62` / `#5ebf75` | Re-point |
| Body font | Inter | DM Sans | Swap font |
| Cream | `#f5f0e1` | `#f5f0e8` / `#faf8f2` | Normalise to `#f5f0e1` |
| Gold | `#c9a94e` | `#c9a84c` | Minor nudge |
| Gold light | `#e8d48b` | `#e8d48b` | ✓ matches |
| Display font | Poster Gothic | Poster Gothic | ✓ matches |
| Red | `#e40014` | `#c0392b` | Re-point |
