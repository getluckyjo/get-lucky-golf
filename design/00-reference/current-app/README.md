# The app as it is today

Captured automatically at **375 x 812, 2x** (750px wide PNGs), full page, against the beta
build. Same naming convention you will use for your comps, so this folder doubles as a
worked example of the format.

These are the *before* pictures. Nothing here is a design to preserve — several of these
screens have never really been designed at all.

## What is here — 20 screens

Splash, onboarding, age check, auth, payment setup, select course, the challenge-hole
panel, choose stake, the stake confirmation sheet, payment return, home, leaderboard,
history, account, membership, all three legal pages, the 404, and the desktop backdrop.

## What is missing, and why

**Five screens could not be captured: `11-record`, `12-confirm`, `13-result-claim`,
`14-result-miss`, `15-verify`.**

These are the screens after the payment. Each guards on live state the app holds in memory
— `/record` needs a paid bet, `/confirm` needs a recorded video — and it redirects home if
that state is absent. Reaching them means a real payment and a real camera, which an
automated capture cannot do.

**Ask Johannes for a walkthrough video or a live demo before designing these five.** They
contain the two most emotionally important moments in the whole product — the ace and the
miss — and they should not be designed from a written description alone.

Four more surfaces are not separate screens and so have no file here: the tab bar (visible
at the bottom of most captures), the error boundary, the loading and skeleton states, and
the toast. All four are described in the screen inventory.

## Three things you are seeing that are not quite real

**No signed-in user.** Captured without a session, so lists are empty, the avatar shows a
fallback and personalised values are blank. That is genuinely useful — it is what a new
user meets on day one — but it is not a populated screen.

**Course data is placeholder.** Leopard Creek, Fancourt and the rest are development
fixtures. The thumbnails are broken-image icons behind a green tint; in production they are
real course photographs.

**Animations are frozen mid-flight.** Almost every screen animates its content in on entry
and a still frame cannot show that. Motion values are in `01-tokens/tokens.csv`.

## One thing worth looking at closely

Open `08-choose-stake__default.png` and look at the gold multiplier chips — `500x`, `600x`
— against the green. That is the 3.87:1 contrast failure described in
`01-tokens/README.md`, and it is the clearest example in the app of gold being asked to do
a job it cannot do. The prize amounts beside them, in much larger gold type, work fine.
