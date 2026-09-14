# Ke Iki Sunset Lūʻau

A seven-page static site for a (fictional) monthly lūʻau business on Ke Iki
Beach, North Shore Oʻahu.

Plain HTML, CSS and one small JS file. No build step, no dependencies, no
framework. Open `index.html` in a browser and it works.

```
index.html         Home — hero, what it is, the evening, availability teaser
about.html         About — the October origin, the beach, the imu
evening.html       The Evening — the running order, minute by minute
menu.html          Menu — the buffet, plus dietary notes
book.html          Reservations — availability, themes, booking rules, prices
visit.html         Plan Your Visit — directions, parking, dress, FAQ
```

---

## How the booking fiction works

This is the part that carries the whole site, so it is worth understanding
before you change any dates.

- The lūʻau runs on the **fourth Monday of every month**, 150 seats.
- Seats release at **7:00 HST on the first of the month**. October, November and
  December opened on 1 July, 1 August and 1 September; **January opens 1 December**.
- On `book.html`: October, November and December are all **SOLD OUT**, January
  2027 is **not yet released** (opens **Tue 1 December**, 7:00 HST), February
  onward is **not open**.

The effect is that there is no date anybody could book right now. That is
deliberate: it explains why she could not have arranged this herself.

**The dates line up correctly.** 26 October 2026 genuinely is the fourth
Monday of that month, and a three-month-ahead release genuinely lands on
1 July 2026. If you move the event, recompute both:

```bash
python3 -c "
import calendar,datetime
y,m=2026,10                      # <- your year and month
d=[x for x in calendar.Calendar().itermonthdates(y,m) if x.month==m and x.weekday()==0][3]
rm,ry=(m-3,y) if m>3 else (m+9,y-1)
print('event  ', d.strftime('%A %d %B %Y'))
print('opens  ', datetime.date(ry,rm,1).strftime('%A %d %B %Y'))
"
```

---

## Before you send the link — change these

| What | Current value | Where |
|---|---|---|
| **Availability months** | Oct 2026 – Feb 2027 | `book.html` and `index.html` |
| **Release countdown** | `2026-12-01T07:00:00-10:00` | `book.html`, `data-countdown` |
| **Phone** | `(808) 555-0164` | all files — `555-01xx` is the reserved fake range |
| **Email** | `keikisunsetluau@outlook.com` | all files (footer) |
| **Domain** | `https://keikiluau.com` | all files — `canonical` and `og:` meta tags |

Fast global swaps:

```bash
cd ke-iki-luau
sed -i '' 's/keikiluau\.com/yourdomain.com/g' *.html
```

Hawaii is UTC−10 and does not observe daylight saving, so the `-10:00` offset
in the countdown is correct year-round.

**Note on the sunset.** `evening.html` describes a house tradition where the
music stops at around six and guests carry a plate down toward the water. It
reads as a quirk of the venue, not as anything aimed at a particular guest.

---

## Hosting it

A preview-style URL would give the game away, so put it on a real domain.

1. Buy a domain (~$12/yr) — something plausible like `keikiluau.com`.
2. Drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
3. Netlify → *Domain settings → Add custom domain*, then point your registrar's
   nameservers at Netlify. HTTPS is issued automatically.

There is no build command; the output directory is the folder root. Cloudflare
Pages, GitHub Pages and Vercel all work the same way.

Open it on **your own phone** before you send it. That is how she will see it.

---

## Editing

Nav and footer are duplicated across all six files rather than templated —
the trade-off for having no build step. Change one, change all six.

**Edit the HTML files directly.** They are the source of truth; there is no
generator and nothing regenerates them.

The design system is at the top of `css/style.css`. The palette was sampled
from the hero photograph:

```css
--ink:   #12212a   /* deep ocean, text and dark sections */
--sand:  #faf5ec   /* page background */
--ember: #bd551f   /* sunset orange, the one accent */
--gold:  #a3833c   /* small caps labels */
--sea:   #2c534c   /* confirmations, "not yet released" */
```

Type is Archivo (display) over Karla (text), from Google Fonts, with local
sans fallbacks if that request fails. Headings are heavy uppercase.

The layout follows the conventions of real Hawaii luau sites: an announcement
bar carrying the sold-out status, a solid sticky header with a persistent
"Book" button, filled pill buttons, and photo-led cards.

`js/main.js` is progressive enhancement only — sticky header, mobile menu,
scroll reveal, countdown, FAQ accordion. Delete it and every page still reads.

## Accessibility

Skip link, landmark elements, visible focus rings, `aria-expanded` on the menu
and FAQ toggles, and a full `prefers-reduced-motion` path that disables the
reveal animations. Text meets WCAG AA contrast against its background.
