# Get Lucky Golf — design pack

**Start here.** This folder is both the brief's working material and the place your
finished work comes back to. Everything is pre-filled with what the app does today, so
most of your job is editing rather than starting from blank pages.

The full brief is `docs/Design-Reskin-Brief.pdf`. This page is the short version.

---

## The job in one paragraph

Get Lucky Golf lets South African golfers stake R50 to R1,000 on hitting a hole-in-one on
any par-3, and win up to R1,000,000, underwritten by Indwe Risk Services. It works. It is
in beta. It has never been designed — the look grew out of the build, and it has drifted
away from the Get Lucky website in the process. We want you to reskin it for the public
beta as Get Lucky V2, and you may restructure the layout of any screen and repoint any
colour. The routes and the order of the journey stay as they are.

---

## Five things to do

### 0. Look at the website first
**`getluckyjo/getlucky-www` is the V2 base**, not this app. Its stylesheet is copied to
`01-tokens/getlucky-www-globals.css`, the real logo files are in `03-assets/logo/current/`,
and the live site is at www.getluckygolf.co.za. The app has drifted from it; part of your
job is bringing them back together.

**The palette is open** — you may repoint any colour. The website values are a starting
point, not a constraint.

### 1. Look at what exists
`00-reference/current-app/` — screenshots of every screen as it is today.
`00-reference/device-spec.md` — the canvas, the safe areas, the fonts and their limits.
`00-reference/screen-inventory.md` — the 27 surfaces and which states each one needs.

### 2. Fill in two spreadsheets
`01-tokens/tokens.csv` — colour, spacing, radius, shadow, motion.
`01-tokens/type-scale.csv` — the nine type roles.

Both are pre-filled — colours and fonts from the website, spacing and motion from the app,
each row marked with its `source`. **Blank means unchanged.** Read `01-tokens/README.md`
first, particularly the contrast table, which explains why gold cannot be used as text on
cream.

### 3. Design the screens
One folder per screen in `02-screens/`, already created and numbered.

Drop your comps in, and fill in the screen card that is already sitting in each folder.
`02-screens/_EXAMPLE.md` shows a completed one and explains why each section is there —
read that before you fill in your first card.

### 4. Draw the logo set and the icon set
`03-assets/ASSETS.md` has the exact list and export settings.

The brand mark itself is good and it is in `03-assets/logo/current/` — what is missing is a
vector master and, more importantly, **an icon-only mark**. The lockup is hand-lettered
script: excellent at 200px, unreadable at 24px, and a mobile app needs something that works
in a tab bar and a favicon. Drawing that is the single highest-value item in the pack.
Alongside it, thirteen emoji are currently doing the work of an icon set.

---

## How to name a comp

```
NN-slug__state.png
```

`NN-slug` is the folder name. `state` is one of nine allowed words, listed in the screen
inventory. So: `16-home__default.png`, `16-home__empty.png`, `08-choose-stake__error.png`.

**Export at 750px wide** (that is 2x the 375 design canvas), PNG, sRGB, flattened.

If you restructure a screen, also export a `--redline` twin — the same image with numbered
magenta circles on it, keyed to the notes in your screen card:
`16-home__default--redline.png`. Numbered circles on a layer is all we need; no measurements.

Exploration you want us to see but not build gets `--alt-a`, `--alt-b`. **For each screen
and state, exactly one file has no `--` suffix, and that file is the one we build.**

---

## Two things worth knowing before you start

**Work in progress goes in `04-inbox/`.** It is ignored by version control, so nothing
there will ever be built by accident. Move a file out of the inbox when it is ready.

**There is a pilot.** We are asking for two screens first — `08-choose-stake` and
`16-home` — plus the logo and icon sets and the token sheets. We build those, then we sit
down together and fix whatever this pack got wrong before you draw the other 25. It is
much cheaper to find a problem with the format on screen two than on screen twenty.
