# A worked example

This is what a finished screen card looks like. Copy `_TEMPLATE.md` into your screen
folder, rename it to match the folder, and fill it in like this.

Every section below exists because it carries something a picture cannot. Skipping one
means we have to come back and ask.

---

# 08 — Choose Stake   (route: /choose-stake)

Comp: 08-choose-stake__default.png   (375 x 1180)
Change type: RESTRUCTURED
Scrolls: yes, the tier list only
Fixed on screen: back bar at top, Continue button at bottom

## Blocks, top to bottom
1. Back bar — fixed
2. Course and hole summary — static text
3. Trust strip (PayFast, Indwe FSP 3425) — static
4. Stake tier list — REPEATING, driven by data, 6 shown
5. Continue button — fixed to bottom, full width

## Added / Removed / Kept
- ADDED: a gold "potential win" strip inside each tier card
- REMOVED: the standalone disclaimer paragraph that sat under the list
- KEPT: everything else in the same role as today

## Final copy (everything not listed here is placeholder)
- "Choose your entry"
- "Back yourself on any par-3"

## Notes
- (4) Selected tier is a 2px gold border with a cream-light fill. Unselected is flat cream.
- (4) The win amount is the hero — largest type on the screen, gold on green.
- (4) Tapping a tier opens the existing confirmation sheet. No new screen.
- (5) Button label includes the amount, so it changes with the selection.

## States delivered
default, selected, loading, error

---

## Why each section is there

**Change type** tells us whether this is a value swap or a rebuild, which decides how we
approach the whole screen.
- `RESKIN-ONLY` — same layout, new colours, type and spacing.
- `RESTRUCTURED` — same content and same purpose, rearranged.
- `REBUILT` — genuinely different approach to the screen.

**Added / Removed / Kept** exists because **removal is invisible in an image.** If you
delete today's disclaimer paragraph, the comp simply does not show it — and we cannot tell
that apart from you forgetting it. One line here saves a round trip.

**Final copy** exists because your comp will contain realistic-looking placeholder text —
a name, an amount, a course. Without this section we would commit "Clovelly Golf Club" as
literal text and break the live data behind it. The safe default is: anything you do not
list here, we treat as placeholder and leave wired to real data.

**REPEATING, driven by data** on a block tells us the six tier cards are six database rows,
not six hand-placed elements. Mark any list, feed or grid this way.

**Fixed vs scrolls** cannot be seen in a flat image at all, and getting it wrong is how
content ends up hidden behind the tab bar.
