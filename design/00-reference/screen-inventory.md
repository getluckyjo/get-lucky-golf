# Screen inventory

27 surfaces. The states listed are the ones we need — you do not have to decide which
states exist, only how they look. If you think a screen needs a state that is not
listed, add it and say why in the screen card.

Deliver into `design/02-screens/NN-slug/`, one folder per row.

| # | Screen | Route | States required | What it does today |
|---|---|---|---|---|
| 01 | Splash | `/splash` | default | Brand splash. Logo, tagline, pulsing dots. Auto-forwards after 2.5s. |
| 02 | Onboarding | `/onboarding` | default | Four-slide swipeable carousel over course photography. Sells the proposition. |
| 03 | Age Check | `/age-check` | default, error, blocked | Hard 18+ gate. Date of birth + consent checkbox. Under-18 is blocked and signed out. |
| 04 | Auth | `/auth` | default, loading, error | Sign in. Single Continue-with-Google button, social proof, terms footer. |
| 05 | Payment Setup | `/payment-setup` | default, selected | Choose preferred payment method from four radio cards. |
| 06 | Select Course | `/select-course` | default, empty, loading | Search and filter courses. First step of the play loop. |
| 07 | Select Course Hole | `/select-course` | modal | Challenge-hole panel revealed after picking a course. Hole picker plus stat grid. |
| 08 | Choose Stake | `/choose-stake` | default, selected, loading, error | The money screen. Six stake tiers, stake to potential win. |
| 09 | Choose Stake Confirm | `/choose-stake` | modal | Bottom-sheet confirmation before handing off to PayFast. |
| 10 | Payment Return | `/payment-return` | loading, success, error | Interstitial after returning from PayFast while the bet is created. |
| 11 | Record | `/record` | default, permission | Full-screen camera viewfinder. Films the tee shot. |
| 12 | Confirm | `/confirm` | default | Video replay. Asks the single question: did it go in? |
| 13 | Result Claim | `/result/claim` | default, loading, success | Win path. Celebration plus the three-document claim checklist. |
| 14 | Result Miss | `/result/miss` | default | Miss path. Encouragement, stats, play again. |
| 15 | Verify | `/verify` | default | Claim-under-review tracker. Four-stage timeline plus pending prize panel. |
| 16 | Home | `/home` | default, empty, loading | Primary dashboard. Hero card, membership upsell, how-it-works, recent attempts. |
| 17 | Leaderboard | `/leaderboard` | default, empty | Winners. Two tabs, three-up podium, ranked rows. |
| 18 | History | `/history` | default, empty, loading | My bets ledger. Summary stats, filter chips, paginated bet cards. |
| 19 | Account | `/account` | default | Profile, stats, membership status, legal links, sign out. |
| 20 | Membership | `/membership` | default, member, loading | Get Lucky Golf Club. Price cards for non-members, status card for members. |
| 21 | Tab Bar | `component` | default | The five-item bottom nav plus the sponsor banner above it. All five active states. |
| 22 | Legal | `/terms` | default | One shared template covering Terms, Privacy and Responsible Play. |
| 23 | Not Found | `404` | default | Out of Bounds. Rendered inside the phone frame. |
| 24 | Error | `error boundary` | default | Something Went Wrong. Full-bleed, outside the phone frame. |
| 25 | Loading | `loading state` | default | The spinner and skeleton language used across the app. |
| 26 | Toast | `component` | modal | Transient message. Three variants: default, error, gold. |
| 27 | Desktop Backdrop | `>768px` | default | What a desktop visitor sees around the phone column. One comp at 1440x900. |

## The state vocabulary

These nine words are the only state names. A closed list is what stops a folder
filling up with `__hover-2-final-FINAL.png`.

| State | Means |
|---|---|
| `default` | The normal, populated screen |
| `empty` | No data yet — no bets, no results, no courses found |
| `loading` | Waiting on the network. Skeletons or a spinner |
| `error` | Something failed and the user needs to know |
| `success` | A confirmation moment |
| `selected` | An item in a list has been chosen |
| `modal` | A sheet or overlay on top of the screen |
| `permission` | An OS permission prompt state (camera) |
| `blocked` | The user is refused — currently only the under-18 gate |

## Total deliverable

**49 comps** across 27 screens, plus a redline twin for every screen marked
RESTRUCTURED or REBUILT, plus the logo set, the icon set and the two token sheets.
