# Token sheets — how to fill these in

Two spreadsheets. Open them in Excel, Numbers or Google Sheets. Save back as CSV.

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

**Poster Gothic Round ATF is licensed and bundled as a single Heavy cut.** There is no
Light, Regular or Medium. If the design needs another weight, say so now — it is a
licensing purchase, and finding out during the build is expensive.

Inter and Space Mono are loaded from Google Fonts and any weight is free to use.

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
