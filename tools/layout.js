/**
 * Shared page chrome. Every page is assembled from these pieces so the nav,
 * footer, schema and meta tags can never drift apart across the site.
 *
 * Paths are written root-relative ("/services.html") in page data and rewritten
 * here relative to the page's own depth, so the site also works when opened
 * straight off disk or served from a subfolder.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { BUSINESS, NAV, CITIES, SERVICES, SERVICE_GROUPS } = require('./data');

/**
 * Content hash on the stylesheet and script URLs. Static hosts serve assets
 * with a cache lifetime and no fingerprint in the filename, so a cached
 * main.css survives a deploy. Hashing the query string makes a changed file a
 * changed URL, and the update lands immediately.
 */
function assetVersion(relPath) {
    try {
        return crypto
            .createHash('sha1')
            .update(fs.readFileSync(path.join(__dirname, '..', relPath)))
            .digest('hex')
            .slice(0, 8);
    } catch (err) {
        return '0';
    }
}

const CSS_V = assetVersion('assets/css/main.css');
const JS_V = assetVersion('assets/js/main.js');

/** Rewrite a root-relative path for a page nested `depth` folders deep. */
function rel(p, depth) {
    if (!p.startsWith('/')) {
        return p;
    }
    const trimmed = p.slice(1);
    return depth === 0 ? trimmed : '../'.repeat(depth) + trimmed;
}

function esc(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* --------------------------------------------------------------------------
   Icons — inline, inheriting currentColor, so there is no sprite request
   -------------------------------------------------------------------------- */
const S =
    'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const ICONS = {
    phone: `<svg viewBox="0 0 24 24" ${S}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" ${S}><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 6.5l9 6 9-6"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" ${S}><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" ${S}><path d="M12 2l8 3.5v6c0 4.8-3.4 9.2-8 10.5-4.6-1.3-8-5.7-8-10.5v-6z"/><path d="M9 12l2 2 4-4"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 7"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    chevron: `<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.5 9.3l6.6-.9z"/></svg>`,
    quote: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.5 5C6.5 6.4 4.6 9.2 4.6 12.6V19h6.6v-6.6H7.9c0-2 .8-3.6 2.6-4.7zm9.9 0c-3 1.4-4.9 4.2-4.9 7.6V19h6.6v-6.6h-3.3c0-2 .8-3.6 2.6-4.7z"/></svg>`,
    users: `<svg viewBox="0 0 24 24" ${S}><circle cx="9" cy="8" r="3.4"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.3a6.2 6.2 0 0 1 3.7 5.7"/></svg>`,
    clipboard: `<svg viewBox="0 0 24 24" ${S}><path d="M9 4.5H7.5A1.5 1.5 0 0 0 6 6v13.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H15"/><rect x="9" y="2.5" width="6" height="4" rx="1.2"/><path d="M9 11h6M9 15h4"/></svg>`,
    leaf: `<svg viewBox="0 0 24 24" ${S}><path d="M4 20c0-8 5-13 16-14 0 10-4.5 15-11 15a5 5 0 0 1-5-1z"/><path d="M9 15c2.5-3 5.3-5 8.5-6.5"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><path d="M18.5 15l.8 2.6 2.7.9-2.7.9-.8 2.6-.8-2.6-2.7-.9 2.7-.9z" opacity=".7"/></svg>`,
    building: `<svg viewBox="0 0 24 24" ${S}><path d="M3 21h18"/><path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h6A1.5 1.5 0 0 1 14 5.5V21"/><path d="M14 10h3.5A1.5 1.5 0 0 1 19 11.5V21"/><path d="M8 8h3M8 12h3M8 16h3M16.5 14h1M16.5 17.5h1"/></svg>`,
    tower: `<svg viewBox="0 0 24 24" ${S}><path d="M2.5 21h19"/><path d="M6 21V8l6-4.5V21"/><path d="M12 10h5.5V21"/><path d="M8.5 9.5h1.5M8.5 13h1.5M8.5 16.5h1.5M14.5 13.5h1M14.5 17h1"/></svg>`,
    factory: `<svg viewBox="0 0 24 24" ${S}><path d="M2.5 21h19"/><path d="M3.5 21V10l5 3.2V10l5 3.2V10l5 3.2V21"/><path d="M5.5 3.5h3l.5 5.2h-4z"/><path d="M7 17h2M12 17h2M17 17h2"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>`,
    box: `<svg viewBox="0 0 24 24" ${S}><path d="M21 8.5v7a1.6 1.6 0 0 1-.8 1.4l-6.4 3.6a1.6 1.6 0 0 1-1.6 0l-6.4-3.6A1.6 1.6 0 0 1 5 15.5v-7"/><path d="M3.2 8.1l8-4.5a1.6 1.6 0 0 1 1.6 0l8 4.5"/><path d="M3.2 8.1L12 13l8.8-4.9"/><path d="M12 13v8.5"/></svg>`,
    cross: `<svg viewBox="0 0 24 24" ${S}><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M12 8v8M8 12h8"/></svg>`,
    school: `<svg viewBox="0 0 24 24" ${S}><path d="M12 3.5l9 4.2-9 4.2-9-4.2z"/><path d="M6.5 10v5.4c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9V10"/><path d="M21 7.7v5.6"/></svg>`,
    dumbbell: `<svg viewBox="0 0 24 24" ${S}><path d="M3 9.5v5M6 7v10M18 7v10M21 9.5v5"/><path d="M6 12h12"/></svg>`,
    carpet: `<svg viewBox="0 0 24 24" ${S}><path d="M3.5 6.5h17v11h-17z"/><path d="M3.5 10h17M3.5 14h17"/><path d="M9 6.5v11M15 6.5v11"/></svg>`,
    tile: `<svg viewBox="0 0 24 24" ${S}><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1"/><rect x="13" y="13" width="7.5" height="7.5" rx="1"/></svg>`,
    window: `<svg viewBox="0 0 24 24" ${S}><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M12 3.5v17M3.5 12h17"/><path d="M6.5 7.2l2 2M6.5 16l2 2"/></svg>`,
    hardhat: `<svg viewBox="0 0 24 24" ${S}><path d="M3 17a9 9 0 0 1 18 0"/><path d="M2 17h20a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/><path d="M9.5 17V6.2A1.7 1.7 0 0 1 11.2 4.5h1.6a1.7 1.7 0 0 1 1.7 1.7V17"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" ${S}><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/><path d="M7.5 13.5h3M7.5 17h3M14 13.5h2.5"/></svg>`,
    store: `<svg viewBox="0 0 24 24" ${S}><path d="M4 10.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9.5"/><path d="M3 10.5l1.6-6A1 1 0 0 1 5.6 4h12.8a1 1 0 0 1 1 .7l1.6 5.8a2.8 2.8 0 0 1-5.5 0 2.8 2.8 0 0 1-5.5 0 2.8 2.8 0 0 1-5.5 0z"/><path d="M9.5 21v-5.5h5V21"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.3 3 10.2 4.6 10.2 7v2H8v3h2.2v9H14v-9h2.6l.4-3z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.9 21H3.5V9h3.4zM5.2 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM21 21h-3.4v-6c0-1.6-.6-2.5-1.9-2.5-1 0-1.6.7-1.8 1.4-.1.2-.1.6-.1.9V21H10.4s.1-10.4 0-11.5h3.4v1.7c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>`,
    google: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"/></svg>`
};

/* --------------------------------------------------------------------------
   Head
   -------------------------------------------------------------------------- */
function head(page, depth) {
    const canonical = BUSINESS.domain + (page.path === '/index.html' ? '/' : page.path);
    const ogImage = BUSINESS.domain + '/assets/img/brand/og-image.png';

    return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#0B2545">
${page.geo || `<meta name="geo.region" content="US-IL">\n<meta name="geo.placename" content="Chicago, Illinois">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BUSINESS.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${esc(ogImage)}">

<link rel="icon" href="${rel('/assets/img/brand/favicon.svg', depth)}" type="image/svg+xml">
<link rel="icon" href="${rel('/assets/img/brand/favicon-64.png', depth)}" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="${rel('/assets/img/brand/apple-touch-icon.png', depth)}">
<link rel="manifest" href="${rel('/site.webmanifest', depth)}">

<link rel="preload" as="font" type="font/woff2" href="${rel('/assets/fonts/jakarta-latin-var.woff2', depth)}" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${rel('/assets/fonts/inter-latin-var.woff2', depth)}" crossorigin>
<link rel="stylesheet" href="${rel('/assets/css/main.css', depth)}?v=${CSS_V}">
<script>document.documentElement.className+=' js';</script>
<script type="application/ld+json">
${JSON.stringify(page.schema, null, 2)}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;
}

/* --------------------------------------------------------------------------
   Header
   -------------------------------------------------------------------------- */
function header(page, depth) {
    // Services mega-menu, grouped so fifteen entries stay scannable
    const megaCols = SERVICE_GROUPS.map((group) => {
        const items = SERVICES.filter((s) => s.group === group)
            .map(
                (s) =>
                    `<a href="${rel('/services/' + s.slug + '.html', depth)}"><span class="mega__ico">${
                        ICONS[s.icon]
                    }</span><span>${esc(s.title)}</span></a>`
            )
            .join('\n                        ');
        return `<div class="mega__col">
                        <p class="mega__title">${esc(group)}</p>
                        ${items}
                    </div>`;
    }).join('\n                    ');

    const cityLinks = CITIES.map(
        (c) =>
            `<a href="${rel('/areas/' + c.slug + '.html', depth)}"><span>${esc(c.name)}<span>${esc(
                c.county
            )}</span></span></a>`
    ).join('\n                    ');

    const servicesOpen = page.path === '/services.html' || page.path.startsWith('/services/');
    const areasOpen = page.path.startsWith('/areas/') || page.path === '/service-areas.html';

    const link = (href, label) =>
        `<a class="nav__link" href="${rel(href, depth)}"${
            page.path === href ? ' aria-current="page"' : ''
        }>${esc(label)}</a>`;

    return `
<div class="topbar">
    <div class="wrap">
        <p class="topbar__item">${ICONS.pin}<span>Serving Northern Illinois</span></p>
        <p class="topbar__item topbar__item--hide">${ICONS.clock}<span>${esc(BUSINESS.hours)} &middot; ${esc(
        BUSINESS.hoursNote
    )}</span></p>
        <a class="topbar__item" href="mailto:${esc(BUSINESS.email)}">${ICONS.mail}<span>${esc(BUSINESS.email)}</span></a>
    </div>
</div>

<header class="site-header">
    <div class="wrap">
        <a class="brand" href="${rel('/index.html', depth)}">
            <img src="${rel('/assets/img/brand/logo.svg', depth)}" alt="" width="46" height="46" loading="eager">
            <span class="brand__text">
                <span class="brand__name">Commercial Cleaning Systems</span>
                <span class="brand__tag">of Chicago</span>
            </span>
        </a>

        <nav class="nav" id="site-nav" aria-label="Main">
            ${link('/index.html', 'Home')}

            <span class="nav__item${servicesOpen ? ' is-current' : ''}">
                <button class="nav__link nav__toggle" type="button" aria-expanded="false" aria-haspopup="true"${
                    servicesOpen ? ' aria-current="page"' : ''
                }>Services ${ICONS.chevron}</button>
                <span class="nav__panel nav__panel--mega">
                    ${megaCols}
                    <div class="mega__foot">
                        <a href="${rel('/services.html', depth)}">All ${
        SERVICES.length
    } services ${ICONS.arrow}</a>
                    </div>
                </span>
            </span>

            <span class="nav__item${areasOpen ? ' is-current' : ''}">
                <button class="nav__link nav__toggle" type="button" aria-expanded="false" aria-haspopup="true"${
                    areasOpen ? ' aria-current="page"' : ''
                }>Areas ${ICONS.chevron}</button>
                <span class="nav__panel nav__panel--areas">
                    ${cityLinks}
                    <div class="nav__panel-foot">
                        <a href="${rel('/service-areas.html', depth)}">All areas covered ${ICONS.arrow}</a>
                    </div>
                </span>
            </span>

            ${link('/about.html', 'About')}
            ${link('/testimonials.html', 'References')}
            ${link('/faq.html', 'FAQ')}
            ${link('/contact.html', 'Contact')}
        </nav>

        <div class="header-cta">
            <a class="header-phone" href="${BUSINESS.phoneHref}" data-cta="header-call">
                ${ICONS.phone}
                <span><span>Call for a quote</span><strong>${esc(BUSINESS.phone)}</strong></span>
            </a>
            <a class="btn btn--primary" href="${rel('/contact.html', depth)}" data-cta="header-quote">Free Quote</a>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
                <span></span>
            </button>
        </div>
    </div>
</header>

<div class="call-bar">
    <a class="btn btn--primary" href="${BUSINESS.phoneHref}" data-cta="mobile-call">${ICONS.phone} ${esc(
        BUSINESS.phone
    )}</a>
    <a class="btn btn--outline" href="${rel('/contact.html', depth)}" data-cta="mobile-quote">Free Quote</a>
</div>

<main id="main">`;
}

/* --------------------------------------------------------------------------
   CTA band
   -------------------------------------------------------------------------- */
function ctaBand(depth, options = {}) {
    const heading = options.heading || 'Get a fixed price for your building';
    const body =
        options.body ||
        'A site walk, a written scope with a frequency against every task, and a fixed price per visit. No obligation, and no number invented over the phone.';

    return `
<section class="cta-band">
    <span class="fx" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="wrap">
        <div class="cta-band__inner">
            <div data-reveal>
                <p class="eyebrow eyebrow--light">${ICONS.sparkle} ${esc(BUSINESS.emergency)}</p>
                <h2>${esc(heading)}</h2>
                <p class="lede">${esc(body)}</p>
            </div>
            <div class="cta-band__actions" data-reveal>
                <a class="btn btn--lg btn--white" href="${BUSINESS.phoneHref}" data-cta="cta-call">${
        ICONS.phone
    } ${esc(BUSINESS.phone)}</a>
                <a class="btn btn--lg btn--outline-white" href="${rel(
                    '/contact.html',
                    depth
                )}" data-cta="cta-quote">Request a quote ${ICONS.arrow}</a>
            </div>
        </div>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
function footer(depth) {
    const col = (list) =>
        list
            .map((s) => `<li><a href="${rel('/services/' + s.slug + '.html', depth)}">${esc(s.title)}</a></li>`)
            .join('\n                    ');

    const featuredServices = SERVICES.filter((s) => [
        'commercial-cleaning', 'office-building-cleaning', 'industrial-cleaning',
        'warehouse-cleaning', 'medical-office-cleaning', 'post-construction-cleaning'
    ].includes(s.slug));

    const socials = Object.entries(BUSINESS.social)
        .filter(([, url]) => url)
        .map(
            ([key, url]) =>
                `<a href="${esc(url)}" rel="noopener noreferrer" target="_blank" aria-label="${
                    key[0].toUpperCase() + key.slice(1)
                }">${ICONS[key]}</a>`
        )
        .join('\n                    ');

    return `
</main>

<footer class="site-footer">
    <div class="wrap">
        <div class="footer-top">
            <div class="footer-brand">
                <a class="brand brand--footer" href="${rel('/index.html', depth)}">
                    <img src="${rel('/assets/img/brand/logo-mono.svg', depth)}" alt="" width="48" height="48" loading="lazy">
                    <span class="brand__text">
                        <span class="brand__name">Commercial Cleaning Systems</span>
                        <span class="brand__tag">of Chicago</span>
                    </span>
                </a>
                <p>Commercial, industrial and institutional cleaning serving Northern Illinois.
                Family-owned, locally operated and serving commercial facilities since 2011.</p>
                <div class="footer-contact">
                    <a class="footer-phone" href="${BUSINESS.phoneHref}">${ICONS.phone}<span>${esc(BUSINESS.phone)}</span></a>
                    <a href="mailto:${esc(BUSINESS.email)}">${ICONS.mail}<span>${esc(BUSINESS.email)}</span></a>
                    <a href="${esc(BUSINESS.social.google)}" target="_blank" rel="noopener noreferrer">${ICONS.pin}<span>${esc(BUSINESS.street)}<br>${esc(BUSINESS.postalCity)}, IL ${esc(BUSINESS.postalCode)}</span></a>
                </div>
                ${socials ? `<div class="socials">\n                    ${socials}\n                </div>` : ''}
            </div>

            <div class="footer-col">
                <h4>Popular services</h4>
                <ul>
                    ${col(featuredServices)}
                    <li><a class="footer-all" href="${rel('/services.html', depth)}">View all ${SERVICES.length} services ${ICONS.arrow}</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Explore</h4>
                <ul>
                    <li><a href="${rel('/about.html', depth)}">About us</a></li>
                    <li><a href="${rel('/service-areas.html', depth)}">Service areas</a></li>
                    <li><a href="${rel('/testimonials.html', depth)}">References &amp; standards</a></li>
                    <li><a href="${rel('/faq.html', depth)}">FAQ</a></li>
                    <li><a href="${rel('/contact.html', depth)}">Request a quote</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <span data-year>2026</span> ${esc(BUSINESS.name)}. All rights reserved.</p>
            <p>${esc(BUSINESS.hours)} &middot; ${esc(BUSINESS.hoursNote)} &middot; <a href="https://www.commercialcleaningsystemsofchicago.com/privacy-policy">Privacy</a></p>
        </div>
    </div>
</footer>

<script src="${rel('/assets/js/main.js', depth)}?v=${JS_V}" defer></script>
</body>
</html>`;
}

module.exports = { head, header, footer, ctaBand, rel, esc, ICONS };
