/**
 * Reusable page blocks. Each returns an HTML string and takes `depth` so links
 * inside it resolve correctly from /services/ and /areas/ pages as well as the
 * root.
 */

const {
    BUSINESS,
    STATS,
    SERVICES,
    SERVICE_GROUPS,
    SECTORS,
    CITIES,
    REASONS,
    PROCESS,
    TESTIMONIALS,
    FAQS
} = require('./data');
const { rel, esc, ICONS } = require('./layout');

/* --------------------------------------------------------------------------
   Section heading
   -------------------------------------------------------------------------- */
function heading({ eyebrow, title, lede, align = 'center', light = false }) {
    return `<div class="section-head${align === 'left' ? ' section-head--left' : ''}">
        ${eyebrow ? `<p class="eyebrow${light ? ' eyebrow--light' : ''}" data-reveal>${ICONS.sparkle} ${esc(eyebrow)}</p>` : ''}
        <h2 data-reveal>${title}</h2>
        ${lede ? `<p class="lede" data-reveal>${lede}</p>` : ''}
    </div>`;
}

/** Responsive image helper for the work photos. */
function photo(name, alt, { sizes, cls = '', eager = false, w = 960, h = 640 } = {}, depth = 0) {
    const redesigned = name.startsWith('redesign/');
    const base = rel('/assets/img/' + (redesigned ? name : 'work/' + name), depth);
    const small = redesigned ? base + '-600.jpg 600w' : base + '-480.jpg 480w';
    return `<img${cls ? ` class="${cls}"` : ''} src="${base}.jpg"
             srcset="${small}, ${base}.jpg ${redesigned ? 1200 : 960}w"
             sizes="${sizes || '(max-width: 800px) 92vw, 45vw'}"
             alt="${esc(alt)}" width="${w}" height="${h}"
             ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/* --------------------------------------------------------------------------
   Hero — full-bleed photograph with the copy laid over it

   The background art is built with a deliberately dark left third, so the
   headline sits on the image rather than in a box beside it. Everything on top
   is a layer: scrim, animated light trail, drifting motes, then content.
   -------------------------------------------------------------------------- */
function hero(depth) {
    const chips = [
        'Written scope, inspected every visit',
        'Nights & weekends, no premium',
        'Insured & background-checked'
    ];

    const base = rel('/assets/img/redesign/home-hero', depth);

    return `
<section class="hero" data-hero>
    <div class="hero__bg" data-parallax>
        <img src="${base}.jpg"
             srcset="${base}-900.jpg 900w, ${base}.jpg 1800w"
             sizes="100vw" alt="" aria-hidden="true"
             width="1800" height="1077" fetchpriority="high" decoding="async">
    </div>

    <span class="hero__scrim" aria-hidden="true"></span>
    <span class="hero__sweep" aria-hidden="true"></span>

    <div class="wrap hero__wrap">
        <div class="hero__text">
            <p class="hero__kicker" data-in="1">${ICONS.pin} Serving Northern Illinois</p>

            <h1 class="hero__title" data-in="2">
                Commercial cleaning<br><em>built around your facility.</em>
            </h1>

            <p class="hero__body" data-in="3">Commercial, industrial and institutional cleaning across Chicago.
            One written scope, one assigned team and supervisor inspections that keep the standard consistent.</p>

            <ul class="hero__chips" data-in="4">
                ${chips.map((c) => `<li>${ICONS.check}<span>${esc(c)}</span></li>`).join('\n                ')}
            </ul>

            <div class="btn-row" data-in="5">
                <a class="btn btn--lg btn--white btn--glow" href="${rel('/contact.html', depth)}" data-cta="hero-quote">
                    Request a site walk ${ICONS.arrow}
                </a>
                <a class="btn btn--lg btn--outline-white btn--ring" href="${BUSINESS.phoneHref}" data-cta="hero-call">
                    ${ICONS.phone} ${esc(BUSINESS.phone)}
                </a>
            </div>
        </div>
    </div>
</section>`;
}

/* Buyer-led service discovery: choose the facility first, then the specialist need. */
function serviceExplorer(depth) {
    const families = [
        {
            key: 'facilities',
            label: 'By facility',
            title: 'Cleaning programs shaped around the building',
            copy: 'Start with the environment. Each program accounts for access, surfaces, operating hours and the way the space is used.',
            slugs: ['office-building-cleaning', 'medical-office-cleaning', 'industrial-cleaning', 'manufacturing-cleaning', 'warehouse-cleaning', 'school-cleaning', 'gym-cleaning']
        },
        {
            key: 'specialist',
            label: 'Specialist care',
            title: 'Focused work for floors, glass and handover',
            copy: 'Add specialist work to an ongoing contract or schedule it as a standalone project.',
            slugs: ['commercial-window-cleaning', 'carpet-cleaning', 'tile-and-grout-cleaning', 'post-construction-cleaning', 'green-cleaning']
        },
        {
            key: 'recurring',
            label: 'Recurring care',
            title: 'One dependable cleaning routine',
            copy: 'Build a nightly, weekly or periodic program, then review the frequencies as the building changes.',
            slugs: ['commercial-cleaning', 'scheduled-cleaning-services', 'spring-cleaning']
        }
    ];

    return `<div class="service-explorer" data-service-explorer>
        <div class="service-explorer__tabs" role="tablist" aria-label="Explore cleaning services">
            ${families.map((f, i) => `<button type="button" role="tab" id="tab-${f.key}" aria-controls="panel-${f.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}">${esc(f.label)}</button>`).join('')}
        </div>
        ${families.map((f, i) => {
            const items = f.slugs.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);
            return `<section class="service-explorer__panel" id="panel-${f.key}" role="tabpanel" aria-labelledby="tab-${f.key}"${i ? ' hidden' : ''}>
                <div class="service-explorer__intro"><p class="eyebrow">${esc(f.label)}</p><h3>${esc(f.title)}</h3><p>${esc(f.copy)}</p></div>
                <ul class="service-explorer__links">${items.map((s) => `<li><a href="${rel('/services/' + s.slug + '.html', depth)}"><span class="svc-list__ico">${ICONS[s.icon]}</span><span><strong>${esc(s.title)}</strong><small>${esc(s.kicker)}</small></span>${ICONS.arrow}</a></li>`).join('')}</ul>
            </section>`;
        }).join('')}
    </div>`;
}

function operatingSystem(depth) {
    return `<div class="ops-story">
        <div class="ops-story__copy" data-reveal>
            <p class="eyebrow">${ICONS.sparkle} A controlled cleaning system</p>
            <h2>Defined before the first clean. Checked after every visit.</h2>
            <p class="lede">The scope is the operating plan: each room, each task and the frequency it needs. The crew works to it, the supervisor inspects against it, and the plan changes when the building does.</p>
            <div class="btn-row"><a class="btn btn--primary" href="${rel('/about.html', depth)}">See how we work ${ICONS.arrow}</a><a class="btn btn--ghost" href="${rel('/contact.html', depth)}">Request a site walk</a></div>
        </div>
        <div class="scope-sheet" data-reveal aria-label="Example structure of a commercial cleaning scope">
            <div class="scope-sheet__head"><span>${ICONS.clipboard}</span><div><strong>Building cleaning scope</strong><small>Tasks · frequencies · inspection</small></div><b>ACTIVE</b></div>
            <ol>
                <li><span>01</span><div><strong>Walk the site</strong><small>Measure the real spaces and surfaces</small></div></li>
                <li><span>02</span><div><strong>Write the scope</strong><small>Task and frequency against every area</small></div></li>
                <li><span>03</span><div><strong>Assign the team</strong><small>Inducted to access and safety rules</small></div></li>
                <li><span>04</span><div><strong>Clean and inspect</strong><small>Supervisor check and visit report</small></div></li>
            </ol>
            <div class="scope-sheet__foot"><span>${ICONS.check} Visit checked</span><span>Review cycle: monthly</span></div>
        </div>
    </div>`;
}

function visualProof(depth) {
    const img = rel('/assets/img/redesign/warehouse', depth);
    return `<div class="visual-proof">
        <div class="visual-proof__media" data-reveal><img src="${img}.jpg" srcset="${img}-600.jpg 600w, ${img}.jpg 1200w" sizes="(max-width: 900px) 100vw, 56vw" width="1200" height="800" loading="lazy" decoding="async" alt="Professional cleaner operating a ride-on floor scrubber in a warehouse aisle"><span class="visual-proof__label">Warehouse floor care · machine scrubbing at scale</span></div>
        <div class="visual-proof__copy" data-reveal><p class="eyebrow">Work that fits the operation</p><h2>Commercial spaces need commercial methods.</h2><p class="lede">Large floors need correctly sized machines. Clinical rooms need zone discipline. Multi-tenant buildings need quiet access and reporting by area. The program changes with the facility.</p><ul class="ticks"><li>${ICONS.check}<span>Equipment matched to the surface and scale</span></li><li>${ICONS.check}<span>Work planned around shifts, access and dispatch</span></li><li>${ICONS.check}<span>One supervisor across recurring and specialist work</span></li></ul><a class="text-link" href="${rel('/services.html', depth)}">Explore every cleaning program ${ICONS.arrow}</a></div>
    </div>`;
}

/* --------------------------------------------------------------------------
   Trust strip — the five promises directly under the hero
   -------------------------------------------------------------------------- */
const PROMISES = [
    { icon: 'shield', title: 'Consistent Quality', body: 'Supervisor inspections every visit' },
    { icon: 'clock', title: 'Flexible Scheduling', body: 'Nights, weekends & holidays' },
    { icon: 'users', title: 'Trusted Professionals', body: 'Trained, uniformed & background-checked' },
    { icon: 'leaf', title: 'Green Cleaning', body: 'Safer for people and the planet' },
    { icon: 'building', title: 'All Commercial Spaces', body: 'Offices, medical, industrial, schools & more' }
];

function trustStrip() {
    return `
<section class="trust">
    <div class="wrap">
        <ul class="trust__grid">
            ${PROMISES.map(
                (p) => `<li data-reveal>
                <span class="trust__icon">${ICONS[p.icon]}</span>
                <span class="trust__text"><strong>${esc(p.title)}</strong><span>${esc(p.body)}</span></span>
            </li>`
            ).join('\n            ')}
        </ul>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Hero scene — a building actually being cleaned

   Drawn rather than photographed. Two copies of the same facade sit on top of
   each other: a grimy one, and a bright one revealed through a clip rectangle
   that travels down in step with the gondola. So the glass turns clear exactly
   where the squeegee has passed.

   ~14KB of markup, sharp at any size, no licensing, and it depicts the actual
   service — which no stock photograph in a free library does.
   -------------------------------------------------------------------------- */
function heroScene() {
    const COLS = 6;
    const ROWS = 8;
    const X0 = 78;
    const Y0 = 58;
    const PW = 68;
    const PH = 44;
    const GAP = 10;

    // Same geometry drawn twice; only the fill differs.
    const panes = (fill, extra = '') => {
        let out = '';
        for (let r = 0; r < ROWS; r += 1) {
            for (let c = 0; c < COLS; c += 1) {
                const x = X0 + c * (PW + GAP);
                const y = Y0 + r * (PH + GAP);
                out += `<rect x="${x}" y="${y}" width="${PW}" height="${PH}" rx="3" fill="${fill}"${extra}/>`;
            }
        }
        return out;
    };

    // Diagonal highlight streaks, only on the cleaned glass
    const shine = () => {
        let out = '';
        for (let r = 0; r < ROWS; r += 1) {
            for (let c = 0; c < COLS; c += 1) {
                const x = X0 + c * (PW + GAP);
                const y = Y0 + r * (PH + GAP);
                out += `<path d="M${x + 8} ${y + PH - 6} L${x + 26} ${y + 6}" stroke="#fff" stroke-width="5"
                        stroke-linecap="round" opacity=".55"/>`;
                out += `<path d="M${x + 30} ${y + PH - 6} L${x + 40} ${y + 14}" stroke="#fff" stroke-width="3"
                        stroke-linecap="round" opacity=".35"/>`;
            }
        }
        return out;
    };

    const sparkles = [
        [150, 150, 0], [300, 210, 0.4], [470, 170, 0.8],
        [220, 320, 1.2], [420, 360, 1.6], [120, 260, 2.0]
    ]
        .map(
            ([x, y, d]) =>
                `<path class="scene__spark" style="animation-delay:${d}s"
                   d="M${x} ${y - 9} L${x + 2.6} ${y - 2.6} L${x + 9} ${y} L${x + 2.6} ${y + 2.6} L${x} ${y + 9}
                      L${x - 2.6} ${y + 2.6} L${x - 9} ${y} L${x - 2.6} ${y - 2.6} Z" fill="#fff"/>`
        )
        .join('');

    return `
<div class="scene" role="img" aria-label="Illustration: a window-cleaning gondola descending a glass tower, leaving gleaming glass behind it">
<svg viewBox="48 28 524 442" preserveAspectRatio="xMidYMid slice" focusable="false">
    <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#DCEBFF"/>
            <stop offset="1" stop-color="#F7FBFF"/>
        </linearGradient>
        <linearGradient id="cleanGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7DD3FC"/>
            <stop offset="0.5" stop-color="#38BDF8"/>
            <stop offset="1" stop-color="#2563EB"/>
        </linearGradient>
        <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#12325E"/>
            <stop offset="1" stop-color="#0A2140"/>
        </linearGradient>

        <!-- Travels down with the gondola, revealing the clean facade -->
        <clipPath id="wipe" clipPathUnits="userSpaceOnUse">
            <rect class="scene__wipe" x="0" y="-470" width="620" height="470"/>
        </clipPath>
    </defs>

    <rect width="620" height="470" fill="url(#sky)"/>

    <!-- Neighbouring towers, for depth -->
    <g opacity=".5">
        <rect x="0" y="150" width="58" height="320" fill="#C3D9F2"/>
        <rect x="566" y="110" width="54" height="360" fill="#C3D9F2"/>
        <rect x="14" y="196" width="12" height="12" fill="#fff" opacity=".7"/>
        <rect x="34" y="240" width="12" height="12" fill="#fff" opacity=".7"/>
        <rect x="584" y="170" width="12" height="12" fill="#fff" opacity=".7"/>
    </g>

    <!-- The tower -->
    <rect x="62" y="38" width="496" height="432" rx="6" fill="url(#tower)"/>

    <!-- Grimy glass -->
    <g>${panes('#5C7391', ' opacity=".9"')}</g>
    <g opacity=".22">${panes('#2A3F5C')}</g>

    <!-- Cleaned glass, revealed behind the squeegee -->
    <g class="scene__clean" clip-path="url(#wipe)">
        <g>${panes('url(#cleanGlass)')}</g>
        <g>${shine()}</g>
        <g class="scene__sparks">${sparkles}</g>
    </g>

    <!-- Gondola: cables, cradle, squeegee, operator -->
    <g class="scene__rig">
        <path d="M196 -470 V 96" stroke="#0A2140" stroke-width="3"/>
        <path d="M424 -470 V 96" stroke="#0A2140" stroke-width="3"/>

        <!-- squeegee blade and the water it leaves -->
        <rect x="150" y="86" width="320" height="7" rx="3.5" fill="#E2EEFE"/>
        <rect x="150" y="93" width="320" height="4" rx="2" fill="#38BDF8" opacity=".85"/>

        <rect x="168" y="98" width="284" height="52" rx="8" fill="#0D57C0"/>
        <rect x="168" y="98" width="284" height="52" rx="8" fill="none" stroke="#2E82F0" stroke-width="2"/>
        <rect x="182" y="112" width="46" height="26" rx="4" fill="#9CC6FB" opacity=".55"/>

        <!-- operator -->
        <circle cx="300" cy="80" r="13" fill="#F5C9A8"/>
        <path d="M287 74a13 13 0 0 1 26 0z" fill="#0B2545"/>
        <path d="M282 98h36a10 10 0 0 1 10 10v14h-56v-14a10 10 0 0 1 10-10z" fill="#FFD447"/>
        <path d="M318 104l26-10" stroke="#F5C9A8" stroke-width="7" stroke-linecap="round"/>
    </g>
</svg>
</div>`;
}

/* --------------------------------------------------------------------------
   Sector ticker
   Decorative repetition of the sectors list, so it is hidden from assistive
   tech — the real list is a proper section further down the page. The track is
   duplicated because the loop translates by exactly -50%.
   -------------------------------------------------------------------------- */
function marquee() {
    const items = SECTORS.map((s) => `<span>${ICONS[s.icon]}${esc(s.name)}</span>`).join('');
    return `
<div class="marquee" aria-hidden="true">
    <div class="marquee__track">${items}${items}</div>
</div>`;
}

/* --------------------------------------------------------------------------
   Stat band — numbers count up on scroll
   -------------------------------------------------------------------------- */
function statBand() {
    return `
<section class="stat-band">
    <div class="wrap">
        <ul class="stat-grid">
            ${STATS.map(
                // The final value is in the markup, so a browser with JS
                // blocked shows the real figure rather than a zero. The script
                // resets it to zero only at the moment it starts animating.
                (s) => `<li data-reveal>
                <strong data-count="${s.value}" data-suffix="${esc(s.suffix)}">${s.value}${esc(s.suffix)}</strong>
                <span>${esc(s.label)}</span>
            </li>`
            ).join('\n            ')}
        </ul>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Service cards — photo-led, used for the featured six
   -------------------------------------------------------------------------- */
function serviceCards(depth, { limit, cols = 3 } = {}) {
    const list = limit ? SERVICES.slice(0, limit) : SERVICES;
    return `<div class="card-grid${cols === 2 ? ' card-grid--2' : ''}">
        ${list
            .map(
                (s) => `<article class="s-card" data-reveal>
            <a class="s-card__media" href="${rel('/services/' + s.slug + '.html', depth)}" tabindex="-1" aria-hidden="true">
                ${photo(s.image, '', { sizes: '(max-width: 600px) 92vw, (max-width: 1000px) 46vw, 30vw' }, depth)}
                <span class="s-card__scrim"></span>
            </a>
            <div class="s-card__body">
                <span class="s-card__icon">${ICONS[s.icon]}</span>
                <h3><a href="${rel('/services/' + s.slug + '.html', depth)}">${esc(s.title)}</a></h3>
                <p class="s-card__kicker">${esc(s.kicker)}</p>
                <p>${esc(s.short)}</p>
                <span class="s-card__more">Read more ${ICONS.arrow}</span>
            </div>
        </article>`
            )
            .join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Compact list of all services, grouped
   -------------------------------------------------------------------------- */
function serviceIndex(depth) {
    return `<div class="svc-groups">
        ${SERVICE_GROUPS.map((group) => {
            const items = SERVICES.filter((s) => s.group === group);
            return `<section class="svc-group" data-reveal>
            <h3 class="svc-group__title"><span>${esc(group)}</span><span class="svc-group__count">${
                items.length
            }</span></h3>
            <ul class="svc-list">
                ${items
                    .map(
                        (s) => `<li>
                    <a href="${rel('/services/' + s.slug + '.html', depth)}">
                        <span class="svc-list__ico">${ICONS[s.icon]}</span>
                        <span class="svc-list__text">
                            <strong>${esc(s.title)}</strong>
                            <span>${esc(s.kicker)}</span>
                        </span>
                        ${ICONS.arrow}
                    </a>
                </li>`
                    )
                    .join('\n                ')}
            </ul>
        </section>`;
        }).join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Sectors
   -------------------------------------------------------------------------- */
function sectors() {
    return `<ul class="sector-grid">
        ${SECTORS.map(
            (s) => `<li data-reveal><span>${ICONS[s.icon]}</span>${esc(s.name)}</li>`
        ).join('\n        ')}
    </ul>`;
}

/* --------------------------------------------------------------------------
   Reasons
   -------------------------------------------------------------------------- */
function reasons() {
    return `<div class="reason-grid">
        ${REASONS.map(
            (r) => `<article class="reason" data-reveal>
            <span class="reason__icon">${ICONS[r.icon]}</span>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.body)}</p>
        </article>`
        ).join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Process
   -------------------------------------------------------------------------- */
function process() {
    return `<ol class="process">
        ${PROCESS.map(
            (s) => `<li data-reveal>
            <span class="process__num">${esc(s.num)}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.body)}</p>
        </li>`
        ).join('\n        ')}
    </ol>`;
}

/* --------------------------------------------------------------------------
   Areas
   -------------------------------------------------------------------------- */
function areaGrid(depth, { exclude } = {}) {
    const list = CITIES.filter((c) => c.slug !== exclude);
    return `<div class="area-grid">
        ${list
            .map(
                (c) => `<article class="area-card" data-reveal>
            <h3><a href="${rel('/areas/' + c.slug + '.html', depth)}">${esc(c.name)}</a></h3>
            <p class="area-card__county">${ICONS.pin} ${esc(c.county)}</p>
            <p>${esc(c.intro)}</p>
            <span class="s-card__more">Cleaning in ${esc(c.name)} ${ICONS.arrow}</span>
        </article>`
            )
            .join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Testimonials — honest empty state until real ones exist
   -------------------------------------------------------------------------- */
function testimonials(depth) {
    if (!TESTIMONIALS.length) {
        return `<div class="empty-state" data-reveal>
        <span class="empty-state__icon">${ICONS.quote}</span>
        <h3>No testimonials published yet</h3>
        <p>We would rather show you nothing than show you quotes we wrote ourselves. Real client testimonials go here
        as soon as we have permission to publish them, with the name and the building type attached.</p>
        <p class="faint">Ask us for references instead — we will put you in touch with a facilities manager who runs a
        building like yours.</p>
        <div class="btn-row">
            <a class="btn btn--primary" href="${rel('/contact.html', depth)}">Ask for references ${ICONS.arrow}</a>
            <a class="btn btn--outline" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(BUSINESS.phone)}</a>
        </div>
    </div>`;
    }

    return `<div class="quote-grid">
        ${TESTIMONIALS.map(
            (t) => `<figure class="quote" data-reveal>
            <span class="quote__mark">${ICONS.quote}</span>
            <span class="stars" aria-label="${t.stars} out of 5">${ICONS.star.repeat(t.stars)}</span>
            <blockquote><p>${esc(t.body)}</p></blockquote>
            <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.role)} &middot; ${esc(t.company)}</span></figcaption>
        </figure>`
        ).join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
function faqList(limit) {
    const list = limit ? FAQS.slice(0, limit) : FAQS;
    return `<div class="faq">
        ${list
            .map(
                (item, i) => `<div class="faq__item" data-reveal>
            <h3>
                <button type="button" class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
                    <span>${esc(item.q)}</span>${ICONS.chevron}
                </button>
            </h3>
            <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden>
                <p>${esc(item.a)}</p>
            </div>
        </div>`
            )
            .join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Quote form
   Posts to Web3Forms. Until the access key is set the form does not fail
   silently — it tells the visitor and hands them the phone number instead.
   -------------------------------------------------------------------------- */
const WEB3FORMS_KEY = 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY';

function quoteForm(depth) {
    const serviceOptions = SERVICE_GROUPS.map((g) => {
        const opts = SERVICES.filter((s) => s.group === g)
            .map((s) => `<option value="${esc(s.title)}">${esc(s.title)}</option>`)
            .join('\n                            ');
        return `<optgroup label="${esc(g)}">
                            ${opts}
                        </optgroup>`;
    }).join('\n                        ');

    const towns = CITIES.map((c) => `<option value="${esc(c.name)}, IL">`).join('\n                        ');

    return `
<form class="quote-form" id="quote-form" method="POST" action="https://api.web3forms.com/submit"
      data-access-key="${WEB3FORMS_KEY}" novalidate>
    <input type="hidden" name="access_key" value="${WEB3FORMS_KEY}">
    <input type="hidden" name="subject" value="New quote request — ${esc(BUSINESS.name)} website">
    <input type="hidden" name="from_name" value="${esc(BUSINESS.name)} website">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">

    <div class="form-grid">
        <p class="field">
            <label for="qf-name">Your name <span aria-hidden="true">*</span></label>
            <input id="qf-name" name="name" type="text" autocomplete="name" required placeholder="Jane Doe" maxlength="80">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-company">Company <span aria-hidden="true">*</span></label>
            <input id="qf-company" name="company" type="text" autocomplete="organization" required
                   placeholder="Company name" maxlength="90">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-phone">Phone <span aria-hidden="true">*</span></label>
            <input id="qf-phone" name="phone" type="tel" autocomplete="tel" required
                   placeholder="(630) 000-0000" maxlength="24">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-email">Email</label>
            <input id="qf-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" maxlength="120">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-service">Service needed <span aria-hidden="true">*</span></label>
            <span class="select">
                <select id="qf-service" name="service" required>
                    <option value="">Select a service…</option>
                    ${serviceOptions}
                    <option value="Several / not sure">Several — or not sure yet</option>
                </select>
                ${ICONS.chevron}
            </span>
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-facility">Facility type</label>
            <span class="select">
                <select id="qf-facility" name="facility_type">
                    <option value="">Select…</option>
                    <option>Office / multi-tenant building</option>
                    <option>Industrial plant</option>
                    <option>Warehouse / distribution</option>
                    <option>Medical or dental practice</option>
                    <option>School or campus</option>
                    <option>Gym or fitness studio</option>
                    <option>Retail or showroom</option>
                    <option>Construction / fit-out</option>
                    <option>Other</option>
                </select>
                ${ICONS.chevron}
            </span>
        </p>

        <p class="field">
            <label for="qf-size">Approx. square footage</label>
            <input id="qf-size" name="square_footage" type="text" inputmode="numeric" placeholder="e.g. 12,000" maxlength="20">
        </p>

        <p class="field">
            <label for="qf-frequency">Frequency</label>
            <span class="select">
                <select id="qf-frequency" name="frequency">
                    <option value="">Select…</option>
                    <option>One-off / project</option>
                    <option>Nightly</option>
                    <option>Weekly</option>
                    <option>Fortnightly</option>
                    <option>Monthly</option>
                    <option>Not sure yet</option>
                </select>
                ${ICONS.chevron}
            </span>
        </p>

        <p class="field">
            <label for="qf-town">Town or city <span aria-hidden="true">*</span></label>
            <input id="qf-town" name="location" type="text" list="qf-towns" required placeholder="Naperville, IL"
                   maxlength="80" autocomplete="address-level2">
            <datalist id="qf-towns">
                        ${towns}
            </datalist>
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-start">Preferred start date</label>
            <input id="qf-start" name="preferred_date" type="date">
        </p>

        <p class="field field--full">
            <label for="qf-notes">Anything we should know?</label>
            <textarea id="qf-notes" name="notes" rows="4" maxlength="1500"
                      placeholder="Floor types, restroom count, access and security arrangements, out-of-hours requirements, shutdown dates…"></textarea>
        </p>
    </div>

    <div class="form-foot">
        <button class="btn btn--primary btn--lg" type="submit">Request my quote ${ICONS.arrow}</button>
        <p class="faint">No obligation. We reply within one working day — or call
            <a href="${BUSINESS.phoneHref}">${esc(BUSINESS.phone)}</a> for an answer now.</p>
    </div>

    <p class="form-status" data-form-status role="status" aria-live="polite"></p>
</form>`;
}

module.exports = {
    heading,
    photo,
    hero,
    heroScene,
    trustStrip,
    marquee,
    statBand,
    serviceCards,
    serviceIndex,
    serviceExplorer,
    operatingSystem,
    visualProof,
    sectors,
    reasons,
    process,
    areaGrid,
    testimonials,
    faqList,
    quoteForm
};
