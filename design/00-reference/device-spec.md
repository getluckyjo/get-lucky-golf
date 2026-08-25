# Device spec — design against these numbers

## The canvas

**375 x variable.** Always 375pt wide. Height is whatever the content needs, rounded to a
multiple of 8. Most screens scroll, so do not force everything into 812.

375 x 812 is the reference viewport (an iPhone X through 13 mini). The app is built on a
fluid scale, so everything you design at 375 stretches smoothly up to about 480 without
any second design. **You never need to design a tablet or desktop layout.** The one
exception is screen 27, the desktop backdrop.

## Reserved space

| Region | Size | Notes |
|---|---|---|
| Status bar | 44pt at top | Clock, signal, battery. Never put content here. |
| Home indicator | 34pt at bottom | The iOS gesture bar. Keep it clear. |
| Bottom tab bar | 120pt today | Includes the sponsor banner. See below. |
| Page gutter | 16pt left and right | Content edge on a 375 canvas. |
| Minimum tap target | 44 x 44pt | Anything tappable. Non-negotiable. |

## The tab bar is 120pt and that is a problem

The bottom tab bar currently occupies **120pt of an 812pt screen — nearly 15% of the
viewport** — because the Indwe sponsor banner is stacked directly above the five tabs
inside the same fixed element.

The sponsor banner is contractual and must stay visible. Its height is not. If you can get
the same sponsor presence into less vertical space, every screen in the app gains room.
This is one of the more valuable things you could fix.

## What the app looks like on a desktop today

Every screen renders inside a **literal simulated iPhone** — a black chassis with a notch
and a camera dot, floating on a near-black page. There is no desktop layout behind it.

This is the loudest "this is a prototype" signal in the product. Screen 27 asks for one
comp that fixes it: a branded backdrop, and the phone reduced to a clean centred column
rather than a bezel-and-notch mock.

## Breakpoints (for information — you do not design these)

| Width | Behaviour |
|---|---|
| Up to 374px | Slightly reduced hero type and control sizes |
| Up to 430px | The frame dissolves. True full-bleed mobile app. This is the real experience. |
| 431 to 768px | A scaled phone frame |
| Over 768px | Fixed phone column on a dark page (screen 27) |

## Fonts

| Role | Font | Available weights |
|---|---|---|
| Display | Poster Gothic Round ATF | **Heavy only.** One cut. See the note in `01-tokens/README.md`. |
| Body and UI | Inter | 400, 500, 600, 700 — and any other weight is free to add |
| Numerals | Space Mono | 400, 700 |

Poster Gothic is used uppercase everywhere it appears today. That is a choice you can
change — but it is the app's strongest typographic signature, so change it deliberately.
