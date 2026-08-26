# Token sheets — how to fill these in

Two spreadsheets. Open them in Excel, Numbers or Google Sheets. Save back as CSV.

## Where these values come from

**The Get Lucky website (`getluckyjo/getlucky-www`) is the base.** Its
`src/app/globals.css` is the cleanest expression of the brand we have — eleven colour
tokens and two font families, with the Tailwind theme deriving from a single `:root`
block rather than duplicating it. That is both the palette and the architecture the app
is being brought in line with.

Every row is marked in the `source` column:

| `source` | Means |
|---|---|
| `getlucky-www` | Comes from the website. This is the V2 base. |
| `app-only` | The app needs it and the website has no equivalent — error states, the bottom tab bar, motion, the fluid spacing scale. |
| `derived` | A proposal to fold an untokenised app value into a website token. |

**The palette is open.** You are free to repoint any colour — this is Get Lucky V2, not a
tidy-up. The website values are the starting point, not a constraint.

One thing the website does not have and the app does: **a fluid spacing, radius and type
scale**. Everything in the app scales continuously between a 320px phone and a tablet
rather than jumping at breakpoints. It works well and we are keeping it, which is why
those rows are `app-only` and are given as pixels at 375 width.

## The one rule

**Blank means unchanged.** Every row already contains what the app uses today. Only
type into a cell you are actually changing. If you are happy with a value, leave it
alone — a sheet with six edited cells is a perfectly good deliverable.

## `tokens.csv`

Colour, spacing, radius, shadow and motion. Put your value in `new_value`.

- **Colours:** six-digit hex, e.g. `#2f4a2c`. No colour names, no rgba.
- **Spacing and radius:** a plain number in pixels, measured at 375pt width. Just `12`, not `12px`.
  We turn that into the responsive scale ourselves — you never need to think about tablets.
- **Shadows:** `x y blur colour`, e.g. `0 4px 16px rgba(0,0,0,0.06)`.
- **Motion:** durations in milliseconds, easing as a `cubic-bezier(...)`.

**Do not rename rows, delete rows, or reorder them.** If you need a token that does not
exist, add it underneath a final row containing the single word `NEW`, and give it a name,
a value and a `used_for` description.

## `type-scale.csv`

Nine roles covering every piece of text in the app.

- `size_at_375` and `size_at_430` — the type size at the narrowest and widest phone. Text
  scales smoothly between the two, so give us both and we handle the rest.
- `letter_spacing_pct` — percentage of the font size. `-2` is tight, `0` is normal, `15` is
  the wide uppercase label look.
- `line_height` — a multiplier, e.g. `1.55`.

### Two constraints on typography

**Poster Gothic Round ATF is licensed as a single Heavy cut**, declared at weight 800 on
the website. There is no Light, Regular or Medium. If the design needs another weight, say
so now — it is a licensing purchase, and finding out during the build is expensive.

**Inter** is used at 300, 400, 500, 600 and 700 on the website, self-hosted through
`next/font`. Any weight is free to add.

**Space Mono** is an app-only addition for numerals — timers, multipliers, card numbers.
The website does not use it. If you would rather set numerals in Inter, say so and it
goes away.

## Before you commit to gold

Measured contrast ratios against the current palette. WCAG AA needs **4.5:1** for body
text and **3:1** for text at 24px and above.

| Combination | Ratio | Verdict |
|---|---|---|
| Gold `#c9a94e` on cream `#faf7ef` | **2.12:1** | Fails badly. Never use gold as text on cream. |
| Gold on green-deep `#335231` | **3.87:1** | Large text only. Fails for body copy. |
| Gold on green-dark `#1e3120` | 6.12:1 | Good. This is where gold belongs. |
| Gray-light `#999` on cream | **2.66:1** | Fails, and it is the secondary text colour in 12+ places today. |
| Gray-mid `#666` on cream | 5.36:1 | Passes. |
| Green-deep on cream | 8.20:1 | Excellent. |
| Green-mid `#4a7a3d` on cream | 4.74:1 | Passes, just. |
| Red `#e40014` on cream | 4.55:1 | Passes, just. |

Gold is the prize colour and it should keep feeling like one — but on dark green, not on
cream. If you want a gold-toned text colour for light backgrounds, fill in the
`--gold-dark` row.
