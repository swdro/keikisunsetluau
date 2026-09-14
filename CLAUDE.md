# Ke Iki Sunset Lūʻau — working notes

Static marketing site for a **fictional** monthly lūʻau business on Ke Iki
Beach, North Shore Oʻahu. Plain HTML/CSS/JS, no build step, no dependencies.

## What it is actually for

It is a surprise proposal. The site has an audience of one: the user's
partner. It must read as a real, established business she could have found
herself. That single fact drives every rule below — believability beats
cleverness, and anything that reads as "made for her" defeats the purpose.

**Never make the site romantic, personal, or addressed to her.** It is a
public event that 150 strangers attend. 

## Voice and content

The user's brief was "professional while avoiding AI slop". In practice:

- **Never use**: emoji, gradient blobs, three-icon feature rows, "unforgettable
  experience", "nestled", "immerse yourself", "elevate", exclamation marks,
  or any sentence that could describe any business anywhere.
- **Do not use**: specifics, numbers, and named things — 6:07 sunset, nine hours in
  the ground, sold out in 4 minutes, kiawe, ipu heke, the right-of-way, once a month, etc.
- Hawaiian words keep their diacritics: lūʻau, kālua puaʻa, Haleʻiwa, ʻulu,
  Oʻahu, keiki, ʻokina (ʻ) and kahakō (ā ē ī ō ū). Getting these wrong is the
  single most obvious tell.
- British-leaning register is established across the copy ("half eight",
  "whilst" avoided but "rather", "reliably"). Keep it consistent.
- **No invented testimonials, reviews, or press quotes.** Fake reviews are the
  first thing that collapses under scrutiny, and citing a real publication
  would put words in its mouth. Operational detail does the job better.

## The booking fiction — keep internally consistent

This is what makes the site work. Do not change one part without the others.

- Fourth Monday of every month. 150 seats.
- **Never state when the business started.** No founding year anywhere on
  the site — no "since 2009", no "seventeen years", no anniversary count.
- Seats release at **7:00 HST on the first of the month**. October, November and
  December opened on 1 July, 1 August and 1 September. **January opens
  Tuesday 1 December** — this is a fixed instruction from the user, so the copy
  no longer claims a fixed "N months ahead" rule, which 1 December would
  contradict. Do not reintroduce that phrasing.
- `book.html` shows **October, November and December 2026 all sold out**
  (opened 1 July, 1 August and 1 September), **January 2027 not yet released**
  (opens **Tue 1 December**, 7:00 HST), **February onward not open**. The
  countdown on `book.html` targets `2026-12-01T07:00:00-10:00`.
- Net effect: no date is bookable by anyone today. When looking at the reservation site, every possible booking date is blocked off
- Keep everything brief and to the point revolving around the Lūʻau. Too many details may beg for questions. 
- event starts at 4pm
- schedule of events make things believable including dining time and Lūʻau time. Additional scheduling ideas should be placed on this bullet point. Everything starts at 4:15pm. 
- do not include entire beach standing up for sunset. 
- You can mention the inu but be subtle. To not explicitly say "the roasting of the pig"
- adult price is $57, kids 5-12 is $23, and under 5 is free. 

Dates are real, not decorative: 26 Oct 2026 **is** the fourth Monday of that
month, and a three-month-ahead release lands on **1 July 2026**. If dates move, recompute both
(the README has the snippet). Hawaii is UTC−10 with no DST, so `-10:00` is
correct year-round.

## Technical constraints

- Plain static HTML. No framework, no build step, no npm. Keep it that way.
- Nav and footer are **duplicated across all seven pages**. Change one, change
  all seven. This is the accepted cost of having no build step.
- `js/main.js` is progressive enhancement only — sticky header, mobile drawer,
  scroll reveal, countdown, FAQ. Every page must still read with JS disabled.
- Design tokens live at the top of `css/style.css`. The palette is sampled from
  the hero photograph; do not introduce colours outside it.
  `--ink #12212a` · `--sand #faf5ec` · `--ember #bd551f` (single accent) ·
  `--ember-ink #a54a1b` · `--gold #79612d` · `--sea #2c534c` · `--muted #58676d`

## Colour contrast — every pair must pass WCAG AA

The whole palette was audited and re-tuned; **do not lighten these tokens
again.** Thirteen pairs were failing AA before the fix, all of them small
supporting text that is easy to overlook.

Rules that keep it passing:

- **`--ember` is a fill colour, not a text colour.** White on `--ember` is
  4.68:1, which is fine for the promo bar, buttons and pills. But `--ember`
  *as text* on sand is only 4.31:1 and fails. Use **`--ember-ink`** whenever
  ember is type on a light background (`.timeline__time`,
  `.menu-item__hawaiian`, the FAQ icon, the active nav underline).
- **`--gold` is for eyebrows and hairline ornament.** It was `#a3833c`, which
  was 2.95:1 on `--sand-2` — the worst failure on the site, and it appeared on
  every page. It is now `#79612d`.
- **`--muted` was `#67787f`** (4.23:1) and is now `#58676d`. It carries
  captions, `.avail__date`, `.tier__sub`, `.prices__sub`, `.brand__sub`.
- **Footer secondary text** (`.footer__title`, `.footer__bottom`) was
  `rgba(250,245,236,.45)` = 4.10:1; now `.62`. Footer body is `.8`.
- The darkest background any of these sits on is `--sand-2 #f1e8d9`
  (page heads and tinted sections) — **check new colours against that, not
  against `--sand`**, or they will pass on one section and fail on another.

**Before changing any colour, run the checker:**

```bash
python3 tools-contrast-check.py     # prints every pair with its ratio
```

It lives in the project root and is not part of the site. Targets: 4.5:1 for
normal text, 3:1 for large text and UI borders. Aim for ~4.8 so rendering
variance cannot dip below.

Text over photographs (`.hero`, `.band`) cannot be measured this way; those
rely on the two stacked scrims in `.hero__media::after`. If you change a hero
image, check the headline is still legible against it by eye.
- Type: **Archivo** (display, 500-800) over **Karla** (text), Google Fonts, with
  local sans fallbacks. Headings are heavy and UPPERCASE via `.display`; use
  `.display--plain` for the few sentence-case headings where shouting hurts.
  (This replaced Cormorant Garamond when the site was restyled toward the
  reference luau sites — see below.)
- Spacing is an 8px rhythm via `--s-1`…`--s-8`. Use the tokens, not raw px.
- Radii: `--radius` 6px on cards and imagery, `--pill` on every button.

### Commercial chrome (adopted from the reference sites)

- **`.promo`** — orange announcement bar above the header carrying the
  sold-out status. Every reference site has one. It scrolls away.
- **Header is permanently solid and sticky.** It no longer goes transparent
  over the hero: with the promo bar above it, the header sits below the bar
  in normal flow, so white-on-cream nav was unreadable. Germaine's does the
  same thing. There is no `data-hero` body attribute any more.
- **`.nav__cta`** — persistent filled "Book" pill in the header.
- **`.btn`** — filled pills, not square outlines. `.btn--solid` is the ember
  primary.
- **`.card--media`** — cards lead with a photograph. The six home-page cards
  use these; `.grid--3` is tuned to 3 columns so six cards sit 3+3.

## Images

The user specifically asked for **luau activity photos, not just scenery** —
imu, hula, crowds, fire knife. Keep that balance.

- Licence: **CC BY, CC BY-SA, CC0 or public domain only.** No NonCommercial,
  no NoDerivatives. Openverse defaults to returning NC/ND — always pass
  `license=by,by-sa,cc0,pdm`.
- **Look at every image before using it.** Filenames and search results lie.
- Record photographer, licence and source URL in `CREDITS.md` at download time.
  CC BY requires the person's name, not just a link.
- Resize with `sips -Z 1800 -s formatOptions 72`; do not upscale past native.

## Verifying changes

Do not hand back UI work without rendering it and looking at it.

```bash
cd ke-iki-luau && python3 -m http.server 8741 &
# wait for a 200 before screenshotting, or you capture Chrome's error page
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
  --window-size=1440,1050 --screenshot=out.png http://127.0.0.1:8741/index.html
```

Two traps found the hard way:

1. **Headless Chrome clamps the layout viewport to 500px minimum.** A
   `--window-size=390` shot is a 500px render cropped to 390 — it will look
   like a broken mobile nav that is not broken. For true narrow-width testing,
   load the page in a 390px-wide `<iframe>` inside a 400px window.
2. `[data-reveal]` elements are `opacity: 0` until scrolled into view, so
   offscreen content is invisible in screenshots. Inject
   `[data-reveal]{opacity:1!important;transform:none!important}` into the
   frame before capturing.

Always check 390px as well as desktop — she will open this on a phone.


## Reference sites (structure only — never their words or pictures)

These five real luau sites were used as inspiration for navigation, page set,
and how a luau business presents itself:

- maukawarriorsluau.com — Transportation as a top-level nav item; hands-on
  activities framing; separate Dinner Menu page
- polynesia.com — named package tiers (Aliʻi, Super Ambassador, Gateway);
  villages/activities before the evening show
- paradisecove.com — three tiers; "Fun Facts" explainers (What is a Luau, All
  About Poi, The Hawaiian Lei); Photo Gallery; Schedule of Events; Seating Chart.
  **Note: this business permanently closed 31 Dec 2025** — do not treat it as
  a live competitor or cite it as operating.
- hiltonhawaiianvillage.com/…/waikiki-starlight-luau — a published itinerary
  with clock times; Diamond Premier vs Golden Circle seating
- germainesluau.com — the clearest tier model: Plumeria / Original / Makai,
  differentiated by seating position, lei type, drink tickets, imu access and
  transport; Gallery, FAQ, Menu split into food and drinks

**The boundary.** Structure, conventions and information architecture are fair
to borrow. Their copy, their photographs and their branding are not — every
sentence and every image on this site must be original or properly licensed.
Never lift a phrase, a tier name, or a picture from any of them.

### What was adopted

- **Seating tiers were tried and removed.** See "One ticket, one price" below.
- **A pre-dinner activity window** (4:30 entry on `evening.html`). All five fill
  the gap between arrival and dinner with crafts, games and the imu.
- **A Gallery page**, now the 7th nav item.
- **Drinks as their own menu group**, as Germaine's and PCC do.

### What was deliberately NOT adopted

- **Awards, press logos, "as featured in", customer reviews.** Four of the five
  lead with these. They collide with the no-invented-testimonials rule and are
  the fastest thing to disprove. Operational detail carries believability instead.
- **Motor coach / shuttle packages.** Germaine's and PCC both sell them. Ours
  deliberately has none — "there is no car park at Ke Iki" is a stronger and
  more place-specific story than a shuttle upsell.
- **Deep dropdown navigation.** Paradise Cove nests three levels. That needs
  JS and a more complex mobile drawer; the flat seven-item nav still fits at
  1440px and stays simple.

## Screenshot gotcha: viewport units and cropping

Two further traps, on top of the two above:

3. `.hero` and `.band` use `svh`, so their height scales with the capture
   window. A very tall iframe inflates them and invalidates any measured
   element offset. Capture at a realistic viewport height.
4. `sips --cropOffset` is silently ignored on this machine, and there is no
   PIL or ImageMagick. Do not crop screenshots. To inspect one section,
   extract that `<section>` into a temporary page in the site root that links
   `css/style.css`, screenshot it, and delete the temp file.


## The origin story — June 2026, and deliberately new

The About page says **the first lūʻau was held in June 2026**. The year is now
stated openly; the earlier "never name a founding year" rule is superseded. The business is
young and still finding its shape; that is the pitch, not a weakness. Copy
leans on it: tables grown from four to six, things tried and quietly dropped,
"you are coming to something that has not settled yet."

This replaced an earlier "running since 2009" framing. Do not claim a long
history or an anniversary count — the business is a few months old. June 2026
is the only date given.

Knock-on effects to keep consistent if you edit copy: nothing may claim a long
history. Phrases like "we have done it since the first year" or "over the
years" contradict the framing and were removed.

## The Evening page — image rules

- **`hula-dusk.jpg` is the hero image and must not be changed.** The user has
  explicitly approved it.
- The closing section uses **`luau-stage.jpg`** (a guest brought up on stage),
  because that section's copy is about guests being brought up to dance. It
  replaced `hula-torches.jpg`, which now carries the "Torches down" card on the
  home page instead.
- Page order is: hero → timeline → sunset note (dark) → the closing image
  section last.


## Tone: plain, not writerly

The user has pushed back on "cheesy" copy more than once. The site is written
as a business explaining how its evening works — not as travel writing.

**Cut on sight:**

- Literary flourishes and scene-setting: "the sand simply opens out", "as the
  light goes", "the colour of the inside of a shell", "while there is still
  light".
- Knowing asides about the reader: "you may be one of them", "nobody has ever
  regretted overdressing", "the ones who protest hardest are still up there
  four songs later", "somebody at your table will eat most of these".
- Self-congratulation, including the humble kind: "the oldest thing on the menu
  and still the best", "made properly and therefore not sweet", "we are
  honestly still working out what it wants to be", "which we think is the best
  part of it".
- Sentimental framing: a Hawaiian proverb set over a sunset photo was removed
  from the home page for exactly this reason.
- Rhetorical triples and inverted drama: "No car park, no concession, no
  lifeguard tower", "Steam first, then the smell, then dinner".

**Keep:** concrete facts, times, numbers, place names, and instructions —
especially ones that tell guests what they *cannot* do. Those carry the
believability. One clause is usually enough where there were two.

Prefer the flat statement. "Service stops at six" beats "the whole beach walks
down to the water". If a sentence would sound odd read aloud by someone who
runs a business, rewrite it.

Alt text follows the same rule: describe the photograph, do not narrate it.


## Naming, and things that must stay vague

- The business is **Ke Iki Sunset Lūʻau**. That exact string is the brand mark,
  the `<h1>` on the home page, and the name in every `<title>`. Keep the kahakō
  and ʻokina: Lūʻau.
- **Never state how many tables there are.** "Six long tables", "four to six",
  "the two tables nearest the sea" all read as oddly precise for a business and
  were removed. Say "the long tables", "the tables nearest the water". Seat
  counts (150) and the guest's own table number on her confirmation are fine —
  it is the *inventory count* that sounds wrong.
- Do not reintroduce a founding year (see above). "It started in October" is
  the whole of the history.

## Dinner is a buffet, not table service

Changed from family-style-down-the-table to a **buffet**, matching how real
luaus present it. Consequences to keep consistent:

- The running order has no separate "Dinner" and "Sunset" entries. There is one
  **"Feast at sunset"** at 5:30 that covers both, and it links to `menu.html`.
- The buffet **opens as the light goes and stays open through the sunset**, so
  nothing may say "service stops" at six. The music stops; the food does not.
- `menu.html` is headed "The buffet" and is written as one continuous service.
- **The Impossible burger is the standing vegan main**, on the buffet every
  month, so no vegan arrangement is needed in advance. Keep it listed under
  "From the imu and the grill".

## Pictures must match the words next to them

Audited after the user flagged mismatches. Rules:

- A card, caption or section image must show the thing it sits beside. "The
  buffet" showed people dancing; "Torches down" showed a daytime coastline.
  Both were wrong and were swapped for `buffet.jpg` and `hula-torches.jpg`.
- Alt text describes what is actually in the frame. A gallery caption said
  "the view west from the tables" on a photograph with no tables in it.
- Current intentional pairings on the home cards: doors → `luau-guests.jpg`,
  imu → `imu-ceremony.jpg`, feast → `buffet.jpg`, hula → `hula-dusk.jpg`,
  fire knife → `fire-dance.jpg`, torches down → `hula-torches.jpg`.
- The home page's main content picture is `hula-sunset.jpg` — a lūʻau image,
  not scenery. `luau-stage.jpg` (a guest brought up on stage) closes **The
  Evening**, where the copy is about exactly that. The Evening hero
  (`hula-dusk.jpg`) is still fixed and must not change.


## Monthly dress themes

Each lūʻau has a dress theme. **Dressing to it is "highly encouraged"** — use
that phrasing. It is still never a requirement or a dress code, and nobody is
turned away for missing it, but it should not read as an afterthought either.

| Month | Theme | Notes |
|---|---|---|
| October | **Floral** | Prints, lei, a flower behind the ear |
| November | **All white** | White or off-white head to foot |
| December | **Mele Kalikimaka** | Hawaiian Christmas — red, green and gold |

Where the themes appear, and all must stay in step:

- `book.html` — a gold `.avail__theme` label under each date in the
  availability list, plus a "Themes" section explaining them.
- `index.html` — the same label in the availability teaser (October and
  November only; the teaser uses `avail_rows(full=False)`).
- `visit.html` — the "what to wear" card mentions the theme.
- `reservation.html` — her booking carries a **Theme: Floral** row, which is a
  useful side effect: it gives her a plain reason to dress up for the evening
  without it seeming to come from him.

If months roll forward, keep the pattern: one theme per month, named in two or
three words, never compulsory.


## Every page must agree with every other page

This is the rule that gets broken most often, because copy lives in eight
places and gets edited in one.

**After any content change, check the whole site — not just the page edited.**
Anything that appears in more than one place must match everywhere:

- **The running order.** `evening.html` is the source of truth. The home page
  card grid mirrors it and must use the *same names* for the same items
  ("The imu is opened", "Feast at sunset", "Torches down"), not synonyms.
- **Times.** Doors 4:00, imu 4:15, buffet 5:30, hula 6:30, fire knife 7:15,
  torches down 8:00. These appear on the home page, The Evening, Visit,
  Menu and the reservation.
- **The menu.** What the home page and The Evening say is on the buffet has to
  be on `menu.html`. The vegan main is always called "a vegan main".
- **The booking mechanic.** Release window, which months are sold out, the
  countdown target and the promo bar all state the same thing.
- **Themes.** The month/theme pairs appear in four places.

Useful greps after an edit:

```bash
grep -o 'card__title">[^<]*' index.html      # home order
grep -o 'timeline__title">[^<]*' evening.html # real order — must agree
grep -rn "4:15\|5:30\|8:00" *.html          # times
for f in images/*.jpg; do grep -qh "$(basename $f)" *.html || echo "orphan $f"; done
```

A contradiction is worse than an omission: it is the thing a reader notices.

## There is no gallery page — do not add one

`gallery.html` was built and then deliberately removed. A page whose only job
is to show photographs invites scrutiny of the photographs, and ours come from
several different real lūʻau, so they do not look like one venue on one beach
when lined up in a grid.

Photographs stay spread thinly across the pages, each one next to copy that
explains it. Do not reinstate a gallery, a lightbox, or a "more photos" link.
The gallery CSS has been deleted from `style.css` too.


## Watch out for slice-based CSS edits

A block-deletion in `style.css` (removing the gallery rules by slicing between
two indices) ran one closing brace too far and **silently deleted the `.promo`
rule**. Brace counts still balanced, so nothing looked broken in a lint — the
announcement bar just rendered as unstyled dark text on cream.

When removing a CSS block, delete it by matching the whole rule text, not by
slicing to "the second `}` after X". After any edit to `style.css`, render the
top of a page and look at it.

## Home page availability: three month cards

The home page shows all three sold-out months as `.month-card`s, each led by
its dress theme in large display type. Accent bars come from the existing
palette — October `--ember`, November `--gold`, December `--sea`. **No new
colours were introduced**; if a fourth month is ever added, reuse one of these
rather than inventing one.

## The About opening is a "why we started" section

Modelled on the structure other lūʻau sites use for their mission copy — why
we started, what is different about it, what we were trying to build — but
**written from scratch**. Never paste or paraphrase another business's copy;
the reference site's wording was used only as a shape to aim at.

Its argument is that most lūʻau on the island could be held anywhere, and ours
is built around one beach and one sunset. Keep that claim consistent with the
rest of the site: it is why the sunset stops the music, and why there is no
shuttle and no car park.

## Visit FAQ tone

The FAQ answers are the warmest copy on the site — deliberately. They were
too blunt ("No, and please don't try", "We are not able to seat anyone"). They
now decline warmly and give a reason or an alternative: "We would really
rather you didn't… it is much better watched than swum." Plain elsewhere,
friendly here.


## The About opening follows a supplied model

The user twice supplied Mauka Warriors' "Why We Started" copy as the target
register. The section now mirrors its **structure** — we saw the need / what we
have built since / how it differs from the commercial lūʻau / heritage and the
Spirit of Aloha / not just a show but something immersive — in original words.

**Never paste or paraphrase their sentences.** The reference is a shape, not a
source. This section is deliberately warmer and more mission-led than the
"plain, not writerly" rule elsewhere on the site; that is intended, and the
exception stops at this section.

## Image archive

`images/_archive/` holds photographs pulled from the live site but kept in case
the user wants them back. `buffet.jpg` (the daytime buffet) is there after the
"Feast at sunset" card was moved to an evening image.

The orphan check (`for f in images/*.jpg`) does not recurse, so archived files
are correctly ignored. Keep archived images credited in `CREDITS.md` under
their `_archive/` path.

**Note on evening imagery:** there is no CC-licensed photograph of a lūʻau
buffet or an imu at night within the licence rules. The "Feast at sunset" card
therefore shows the lūʻau in golden evening light rather than the food itself,
and the imu card shows the pit being opened in warm late light. If a better
night shot ever turns up, those are the two to replace.


## Do not mention guests being brought up during the hula

Removed at the user's instruction. The hula is danced on the sand and watched
— no audience participation, nobody pulled up from the tables, no "you will
probably end up dancing" section. `luau-stage.jpg` was archived because the
photograph itself shows a guest on stage.

## There is no reservation page

`reservation.html` — the personalised booking confirmation — has been deleted
along with every link to it: the "Manage your booking" item in the footer and
the "Already booked / View your reservation" block on `book.html`. Do not
recreate it or link to it.

**Consequence worth knowing:** that page carried the guest's name, her table,
and the "keep six o'clock free" line. Nothing on the site is addressed to her
any more; it is now a purely public brochure site.

## One ticket, one price

There is a single standard ticket. **Do not list seating tiers, upgrades,
premium rows, or any price other than these:**

| | |
|---|---|
| Adult (13+) | **$57** |
| Keiki (5–12) | **$23** |
| Under 5 | **Free** |

These are the only prices anywhere on the site or in this file. The earlier
$189 / $249 / $89 figures are gone and must not come back.

The site does **not** say "only the standard ticket is available" or explain
that seating cannot be changed — it simply presents one price and says nothing
about alternatives. Silence, not a disclaimer.

The `.tier` and `.ticket` CSS blocks were deleted with these features. When
removing dead CSS, match the whole block text and assert it appears exactly
once — do not slice to "the Nth closing brace" (that bug silently ate `.promo`
once already).


## NEVER regenerate the HTML — edit the files directly

**The HTML files are the source of truth. There is no build step.**

For most of this project's history the pages were produced by a generator
script (`build.py`) that rewrote all six HTML files on every run. That script
**silently destroyed the user's hand edits** every time it ran. It has been
retired to `build.py.RETIRED-do-not-run` and must not be resurrected.

Rules from here on:

- Make every change by editing `index.html`, `about.html`, `evening.html`,
  `menu.html`, `visit.html` and `book.html` **in place**.
- Nav and footer are duplicated across all six pages. Change one, change all
  six — that is the accepted cost of having no build step, and it is cheaper
  than clobbering the user's work.
- Never write a script that loops over the pages and rewrites them wholesale.
  Targeted per-file edits only.
- If a page ever looks out of date, it is not because a generator needs
  running. Read the file.

The user edits these files by hand between sessions. Assume any file may
contain changes this file does not know about, and never overwrite one
without reading it first.

## Imu photography — a known dead end

The user asked for an imu picture taken in the evening or on sand. **No such
photograph exists under the licence rules.** Searched Openverse and Wikimedia
Commons exhaustively:

- Every commercial-safe imu photo is daytime, and all are on grass or paving.
- The one genuine night imu shot (`Preparing Hawaiian imu … Oahu`, CC BY-SA)
  shows a raw pig under flash — unusable on a guest-facing page.
- The night/beach-ish candidates (Luau Kalamaku imu ceremony) are CC BY-NC-ND;
  **ND forbids derivatives, so they cannot even be resized**, let alone used.

Do not repeat this search without a new source. If the rule ever relaxes to
allow NonCommercial, re-check — but ND is still a hard no.
