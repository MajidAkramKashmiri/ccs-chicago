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
    const base = rel('/assets/img/work/' + name, depth);
    return `<img${cls ? ` class="${cls}"` : ''} src="${base}.jpg"
             srcset="${base}-480.jpg 480w, ${base}.jpg 960w"
             sizes="${sizes || '(max-width: 800px) 92vw, 45vw'}"
             alt="${esc(alt)}" width="${w}" height="${h}"
             ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/* --------------------------------------------------------------------------
   Hero — split layout, white ground, photo panel on the right
   -------------------------------------------------------------------------- */
function hero(depth) {
    const bullets = [
        'Written scope, inspected after every visit',
        'Nights and weekends at no premium',
        'Insured, background-checked, badged crews'
    ];

    return `
<section class="hero">
    <span class="fx fx--hero" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="grid-fx" aria-hidden="true"></span>
    <div class="wrap hero__wrap">
        <div class="hero__text">
            <p class="hero__kicker">${ICONS.pin} Chicago &amp; the western suburbs</p>
            <h1>Commercial cleaning<br><em>built as a system</em>, not a visit.</h1>
            <p class="hero__body">Fifteen specialist cleaning programs under one contract — offices, plants,
            warehouses, medical practices and schools across Chicago and the western suburbs. Every job runs to a
            written scope and is inspected against it.</p>
            <ul class="hero__list">
                ${bullets.map((b) => `<li>${ICONS.check}<span>${esc(b)}</span></li>`).join('\n                ')}
            </ul>
            <div class="btn-row">
                <a class="btn btn--lg btn--primary" href="${rel('/contact.html', depth)}" data-cta="hero-quote">
                    Get a free quote ${ICONS.arrow}
                </a>
                <a class="btn btn--lg btn--outline" href="${BUSINESS.phoneHref}" data-cta="hero-call">
                    ${ICONS.phone} ${esc(BUSINESS.phone)}
                </a>
            </div>
        </div>

        <div class="hero__media">
            <div class="hero__shot">
                ${photo('hero', 'A glass-fronted Chicago office building catching the daylight', {
                    sizes: '(max-width: 980px) 92vw, 46vw',
                    cls: 'hero__img',
                    eager: true
                }, depth)}
                <span class="hero__sheen" aria-hidden="true"></span>
            </div>
            <div class="hero__badge">
                <span class="hero__badge-icon">${ICONS.shield}</span>
                <span>
                    <strong>${esc(BUSINESS.guarantee)}</strong>
                    <span>Report it within 24 hours — the crew comes back, no charge.</span>
                </span>
            </div>
        </div>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Stat band — numbers count up on scroll
   -------------------------------------------------------------------------- */
function statBand() {
    return `
<section class="stat-band">
    <span class="grid-fx" aria-hidden="true"></span>
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
    statBand,
    serviceCards,
    serviceIndex,
    sectors,
    reasons,
    process,
    areaGrid,
    testimonials,
    faqList,
    quoteForm
};
