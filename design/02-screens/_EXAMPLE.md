# A worked example

This is what a finished screen card looks like. Copy `_TEMPLATE.md` into your screen folder,
rename it to match the folder, and fill it in like this.

The example below is deliberately a **RECOMPOSED** screen — one that absorbs another — because
that is the case most likely to be got wrong, and it is the one this redesign makes possible.

Every section carries something a picture cannot. Skipping one means we have to come back and ask.

---

# 08 — Choose Stake   (route: /choose-stake)

Comp: 08-choose-stake__default.png   (375 x 1180)
Change type: RECOMPOSED
Replaces: 09 (the stake confirmation sheet)
Scrolls: yes, the tier list only
Fixed on screen: back bar at top, Continue button at bottom

## Blocks, top to bottom
1. Back bar with course and hole — fixed
2. Prize headline — the number the whole screen is built around
3. Stake tier list — REPEATING, driven by data, 6 shown
4. Trust strip (PayFast, Indwe FSP 3425) — static
5. Continue button — fixed to bottom, full width, label carries the amount

## Added / Removed / Kept
- ADDED: the prize headline at the top, which changes as a tier is selected
- ADDED: inline confirmation on this screen — selecting a tier expands it in place
- REMOVED: screen 09, the separate confirmation sheet. See the flow proposal.
- REMOVED: the standalone disclaimer paragraph under the list
- KEPT: all six tiers at their exact amounts, and the PayFast handoff

## Final copy (everything not listed here is placeholder)
- "Back yourself"
- "One swing. Nothing else to it."

## Notes
- (2) The prize figure is the largest thing on the screen. Everything else defers to it.
- (3) Selected tier expands in place to show the confirmation detail — this is what removes screen 09.
- (3) Unselected tiers dim rather than shrink, so the ladder stays readable.
- (5) Button label includes the amount, so it changes with the selection.

## States delivered
default, selected, loading, error

---

## Why each section is there

**Change type** tells us what kind of job this is before we open the image.

- `REDESIGNED` — new design, same functional scope, still one screen. The usual answer.
- `RECOMPOSED` — absorbs, splits or reorganises other screens. Add `Replaces:` and put the reasoning in the flow proposal.
- `NEW` — a screen that does not exist today.
- `ABSORBED` — this screen goes away; add `Absorbed into:` and deliver no comps for it.
- `CARRIED-OVER` — deliberately keeping today's structure. Rare; say why.

**Replaces / Absorbed into** is what makes recomposition safe. If screen 09 vanishes and
nothing says where it went, we cannot tell a deliberate merge from an oversight — and the
package checker will fail 09 for having no comps. One line each way and both problems go away.

**Added / Removed / Kept** exists because **removal is invisible in an image.** If you delete
the disclaimer, the comp simply does not show it, and that is indistinguishable from you
forgetting it.

**Final copy** exists because your comp will contain realistic placeholder text — a name, an
amount, a course. Without this we would commit "Leopard Creek Country Club" as literal text
and break the live data behind it. Anything you do not list here we treat as placeholder and
leave wired to the database.

**REPEATING, driven by data** on a block tells us those six tier cards are six database rows,
not six hand-placed elements. Mark any list, feed or grid this way.

**Fixed vs scrolls** cannot be seen in a flat image at all, and getting it wrong is how
content ends up hidden behind the tab bar.
