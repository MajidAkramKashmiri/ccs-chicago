# Commercial Cleaning Systems of Chicago — website

Static marketing site for Commercial Cleaning Systems of Chicago — commercial,
industrial and institutional cleaning across Chicago and the western suburbs.

Plain HTML, CSS and JavaScript. No framework, no runtime dependencies, nothing
to install on the server — upload the folder and it works.

29 pages: home, a services index, **one landing page per service (15)**, six
area pages, about, testimonials, FAQ, contact and a 404.

---

## Before it goes live — 3 things to fix

The phone number is real and correct throughout. These are the open items.

### 1. Email address and domain

`tools/data.js` → both are placeholders:

```js
email: 'info@ccsofchicago.com',
domain: 'https://ccsofchicago.com',
```

`domain` builds every canonical URL, every Open Graph tag and `sitemap.xml`. If
it is wrong when the site is indexed, the SEO work is wasted. Set both and run
`node tools/build.js`.

### 2. Connect the quote form

The form is fully built and validated but not wired to an inbox:

1. Go to [web3forms.com](https://web3forms.com), enter the owner's email, get a
   free access key.
2. In `tools/components.js`, find `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` and paste
   the key in.
3. Run `node tools/build.js`.

Until that is done the form does not fail silently — it validates as normal,
then tells the visitor it is not connected yet and gives them the phone number.

Any endpoint that accepts a `POST` of `FormData` and returns `{"success":true}`
works; Formspree and Basin are drop-in alternatives.

### 3. Add real testimonials

`tools/data.js` → `TESTIMONIALS` is an **empty array on purpose**, and the page
renders an honest "nothing here yet" note that offers references instead.

Publishing invented testimonials for a real business breaks the FTC rule on
fake endorsements (16 CFR Part 465). Paste genuine ones — with permission — and
they render:

```js
const TESTIMONIALS = [
    {
        name: 'First name L.',
        role: 'Facilities Manager',
        company: 'Distribution centre, Elmhurst',
        stars: 5,
        body: 'Their actual words, with permission to publish.'
    }
];
```

### Also worth confirming

The **service areas** were chosen to match the 630 area code — Chicago plus
Naperville, Oak Brook, Downers Grove, Elmhurst and Schaumburg. If the real
coverage differs, edit `CITIES` in `tools/data.js`; pages, nav, footer and
schema all follow automatically.

The **stats band** figures are deliberately capability statements
(15 programs, 7/7 scheduling, 24h redo window, 100% insured) rather than
performance claims like "500+ clients", because those are the first thing a
procurement team checks and the hardest to evidence.

---

## Editing content

**All copy, services, areas, FAQs and testimonials live in `tools/data.js`.**
Edit that one file, then rebuild:

```bash
node tools/build.js
```

That regenerates all 29 HTML pages plus `sitemap.xml`, `robots.txt` and
`site.webmanifest`. Never hand-edit the generated `.html` files — the next build
overwrites them.

| File | What it holds |
|---|---|
| `tools/data.js` | Business details, stats, 15 services, 6 areas, reasons, FAQs |
| `tools/layout.js` | Shared `<head>`, top bar, header, mega-menu, footer, CTA band, icons |
| `tools/components.js` | Hero, stat band, cards, service index, quote form, FAQ |
| `tools/build.js` | Page definitions, structured data, file writer |
| `assets/css/main.css` | All styling |
| `assets/js/main.js` | All behaviour |

Node is only needed to *rebuild*. The published site does not use it.

### Adding a service

Append an object to `SERVICES`. A full landing page is generated at
`/services/<slug>.html`, and it appears automatically in the mega-menu, the
services index, the footer, the contact form's service picker, every area page
and the `OfferCatalog` structured data.

`icon` must be a key in the `ICONS` map in `tools/layout.js`, and `group` must
be one of the entries in `SERVICE_GROUPS`.

### Adding an area

Append an object to `CITIES`. A landing page is generated and linked from the
nav, footer, every service page and every other area page.

---

## Local preview

```bash
cd ccs-chicago
python3 -m http.server 8920
# open http://127.0.0.1:8920
```

Use a server rather than opening the files directly — the fonts need proper
HTTP headers.

---

## Deploying

The folder is the site. Upload everything except `tools/` and `README.md`.

- **GitHub Pages** — push and serve from the repo root. `.nojekyll` is present
  so asset folders are served verbatim.
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in. No build command,
  publish directory `.`. `404.html` is picked up automatically.
- **Traditional host (cPanel, Hostinger, GoDaddy)** — upload to `public_html/`.

After deploying, submit `https://yourdomain.com/sitemap.xml` in Google Search
Console and make sure the Google Business Profile lists the same phone number.

---

## Design

White and blue. The palette is defined once as custom properties at the top of
`main.css` (`--navy-*`, `--blue-*`) — change those and the whole site follows.

The look is deliberately corporate rather than consumer: white ground, navy
bands for contrast, tight 8–16px radii, and a faint blueprint grid that reads
as engineered rather than decorative.

### Hero background

`assets/img/hero/hero-bg.jpg` is a client-supplied AI-generated image, served at
three widths (800/1200/1659) behind `srcset`, ~283KB at full size. It is
composed with a deliberately dark left third so the headline sits **on** the
photograph rather than in a panel beside it.

Layers stacked over it, all pure CSS:

| Layer | What it does |
|---|---|
| `.hero__scrim` | Diagonal darkening so the copy stays legible over the art |
| `.hero__glow` | Cool bloom that breathes, echoing the light trail in the image |
| `.hero__sweep` | A broad band of light travelling across the room every 13s |
| `.motes` | Eight dust specks drifting on unequal cycles |
| `[data-in]` | Staggered entrance — the hero assembles rather than appearing |

The background also drifts slower than the page scrolls and leans a few pixels
toward the pointer (`[data-parallax]` in `main.js`). Both are clamped small on
purpose: parallax reads as depth when it is barely noticed and as a gimmick
when it is not.

An earlier version animated an SVG pulse along the light trail in the artwork.
It was removed: the path was authored in the image's coordinate space, but the
photo is placed with `object-fit: cover`, so the two drifted apart at any
viewport where the image cropped differently. The sweep cannot misalign.

To replace the background, drop a new file in at the same three widths and keep
the dark-left composition, or adjust `.hero__scrim` to suit the new image.

### Service imagery

Sixteen photographs in `assets/img/work/` — one per service plus a hero
backdrop. Two sizes each (`-480.jpg` and a 960px full) behind `srcset`, lazy
below the fold, under 3 MB in total.

**Licensing.** Every photo is **CC0 / public domain**, sourced from StockSnap
via the Openverse API. CC0 permits commercial use and modification with no
attribution required, so nothing on the page needs a credit line. Provenance is
recorded in `tools/photo-credits.json`.

960px is the largest size the source CDN serves, so files ship at native size
and are never upscaled — an upscaled photo is a soft photo.

**These are stand-ins.** They show relevant buildings and equipment, but none
of them are your crews, vans or finished jobs. Photographs of your own work
will lift this site more than any other single change. To swap one, drop a new
file in using the same base name and rebuild:

```bash
sips -s format jpeg -s formatOptions 74 -Z 960 source.jpg --out warehouse-cleaning.jpg
sips -s format jpeg -s formatOptions 66 -Z 480 source.jpg --out warehouse-cleaning-480.jpg
```

Update the matching `alt` text in `tools/data.js` at the same time. If a service
has no `image` key the card layout still works — it just has no photo.

### Motion

Three blurred blue lights drift on long offset cycles behind the hero, the navy
bands and the CTA; a blueprint grid pans slowly over them; a sheen sweeps across
the hero photo; and the stat figures count up when scrolled into view.

All of it is disabled under `prefers-reduced-motion`, which keeps the light and
grid as static colour but stops every animation.

---

## Notes on the build

- Fonts (Plus Jakarta Sans + Inter) are **self-hosted**, 76 KB total. No Google
  Fonts request, so first paint never waits on a third-party server and there is
  no third-party cookie or GDPR question.
- Stylesheet and script URLs carry a content hash (`main.css?v=…`), so a deploy
  is never masked by a browser cache.
- Structured data covers `LocalBusiness`, `Service` (per service page),
  `BreadcrumbList`, `ItemList` and `FAQPage`. It deliberately omits
  `aggregateRating` — marking up review scores a business does not hold risks a
  manual action.
- Content is visible without JavaScript. Scroll animations are gated behind a
  `js` class set in `<head>`, and a timeout reveals everything if the observer
  never fires.
- Accessibility: skip link, focus-visible rings, keyboard-operable mega-menu and
  accordion, `aria-expanded` on all toggles, `aria-current` on the active nav
  item, and a `prefers-reduced-motion` block.
- The quote form has a honeypot, per-field validation messages, and never
  reports success it did not get.
