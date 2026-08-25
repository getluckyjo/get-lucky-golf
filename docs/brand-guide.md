# Get Lucky Golf — Brand Guide

> **Status as of 2026-08-25: superseded for V2.**
>
> Tokens below were extracted from the live site on 2026-05-31, and the canonical source
> is `getluckyjo/getlucky-www` — `src/app/globals.css`, eleven colour tokens and two font
> families. That file is the base for the app's V2 redesign.
>
> The old rule that "when the live site and the app disagree, the live site wins" is
> **retired**. V2 is a full app redesign and **the brand is open** — palette, typography, and
> the wordmark itself, which may be evolved so it works at small sizes and in motion. It
> should still read as Get Lucky; it is not a rebrand. See `docs/App-Redesign-Brief.md`
> section 9.
>
> The app is now where the brand gets decided. The website, signage and sponsor collateral
> follow it.

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
**not** a bright emerald. The app's CSS tokens carry the correct forest scale. The emerald
`#007728` survives in one place only — the app's `public/logo.svg`, which is an unrelated
machine trace and should be deleted rather than corrected. The real mark is in the website
repository. See section 6.

### Naming: the website is canonical

The website calls them `--green` / `--green-light` / `--green-dark` and `--charcoal` /
`--charcoal-light`. The app calls the same colours `--green-deep` / `--green-mid` and
`--gray-dark` / `--gray-mid` / `--gray-light`. **The website's naming wins**; the app is
being brought onto it. The app also references `--font-heading`, which only the website
defines — in the app it currently resolves to nothing.

---

## 2. Typography

| Use | Typeface | Notes |
|-----|----------|-------|
| Display / headings | **Poster Gothic** (`posterGothic`) | Heavy, condensed, uppercase. Fallbacks: Impact, Arial Black, sans-serif. Bundled at `/public/fonts/PosterGothicRoundATF-Heavy.otf` — **a single Heavy cut; there are no other weights.** |
| Body / UI | **Inter** | Clean geometric sans. Fallbacks: system-ui, sans-serif. Loaded from Google Fonts; the app uses it correctly. |
| Mono | **Space Mono** | Numerals — timers, multipliers, card numbers. Loaded from Google Fonts. |

Headings: uppercase, tight letter-spacing, heavy weight. Body: Inter, regular/medium,
generous line-height (~1.5–1.6).

---

## 3. Logo

- Primary mark: **Get Lucky Golf Club** — circular badge / colour lockup.
- Challenge wordmark: **Get Lucky** challenge lockup (`GLG_Challenge Lockup`).
- **The real mark lives in `getluckyjo/getlucky-www`** at `public/logos/`: hand-lettered
  cream script reading "Get Lucky" with a forest-green shadow, over "GOLF" in a condensed
  sans. `logo-color.png` for light backgrounds, `logo-dark-bg.png` — a properly drawn
  reversed artwork with a cream halo — for dark, plus a separate `challenge-lockup.png`.
- ⚠️ **The app is not using any of them.** Its `public/logo.svg` is an unrelated
  machine-traced path filled emerald `#007728`; what ships is a 292 KB PNG. Delete it.
- ⚠️ **No vector master exists in either repository**, and **there is no icon-only mark** —
  the script lockup cannot survive at 24px in a tab bar or 32px as a favicon. Both are
  commissioned in `docs/App-Redesign-Brief.md`.
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

## 6. App vs. brand — where the drift actually is (updated 2026-08-25)

The emerald-to-forest migration described in earlier versions of this guide **was done in
the CSS token layer**. `src/app/globals.css` now declares the correct forest scale, the
correct gold and the correct cream. What was *not* migrated is everything that never
referenced those tokens in the first place.

| Element | Brand | Token layer (`globals.css`) | Actually shipping | Action |
|---------|-------|------------------------------|-------------------|--------|
| Primary green | `#335231` / `#1e3120` | ✓ correct | `#335231` hardcoded 49x in TSX | Replace literals with `var(--green-deep)` |
| Green light | `#4a7a3d` | ✓ correct | plus off-palette `#2d6a3f` (7x) | Re-point to `--green-mid` |
| Body font | Inter | ✓ correct | ✓ correct | Done |
| Display font | Poster Gothic | ✓ correct | ✓ correct | Done — but see the weight note below |
| Cream | `#f5f0e1` | ✓ correct | app background is `--cream-light #faf7ef`; five near-miss creams in TSX | Consolidate |
| Gold | `#c9a94e` | ✓ correct | `.btn-gold` gradient uses `#c9a84c`; spinners use off-palette `#d4af37` (4x) | Re-point |
| Red | `#e40014` | ✓ correct | `#c0392b` appears 23x in TSX | Re-point to `--red` |
| Logo | forest green | — | **`public/logo.svg` is a machine trace filled `#007728`** | Redraw — see below |

### The real problem: the token layer is not enforced

**55 distinct hardcoded hex values appear across 45 `.tsx` files, roughly 350 occurrences.**
Changing a token today changes very little, because most of the app never asks for one.
Until that is fixed, this guide describes an intention rather than the product.

Engineering action, tracked as part of the V2 redesign: replace every hardcoded literal with
its token, collapse the duplicated `@theme inline` and `:root` declarations into one source
of truth, and remove five dead token references (`--font-heading`, `--green-700`,
`--green-800`, `--text-3xl`, `--text-base`) that currently resolve to nothing.

### Corrections to earlier versions of this guide

- **Section 3 was wrong about the logo.** It stated the app logo is "natively forest-green
  stroke — display directly on cream backgrounds (no CSS filter)". In fact `public/logo.svg`
  is a single auto-vectorised path filled `#007728`, an off-brand emerald, and the app ships
  the 292 KB `logo.png` instead. There is no reversed lockup; dark backgrounds fake one with
  `filter: brightness(0) invert(1)`. A proper logo set is commissioned in
  `docs/App-Redesign-Brief.md`.
- **Poster Gothic is licensed as a single Heavy cut.** `globals.css` declares it
  `font-weight: 100 900`, which is not true — there is one weight. Any design needing a
  lighter display cut is a licensing purchase.

### Accessibility, measured

| Combination | Contrast | Verdict |
|---|---|---|
| Gold `#c9a94e` on cream `#faf7ef` | **2.12:1** | Fails. Gold must not be text on cream. |
| Gold on green-deep `#335231` | **3.87:1** | Large text only. |
| Gold on green-dark `#1e3120` | 6.12:1 | Good — this is where gold belongs. |
| Gray-light `#999` on cream | **2.66:1** | Fails, and it is the secondary text colour in 12+ places. |
| Gray-mid `#666` on cream | 5.36:1 | Passes. |
| Green-deep on cream | 8.20:1 | Excellent. |

Gold is the prize colour and should keep feeling like one — on dark green, not on cream.
