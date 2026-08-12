#!/usr/bin/env node
/**
 * Static site generator.
 *
 * Run `node tools/build.js` and every .html file in the project root, /services
 * and /areas is rewritten from these definitions, along with sitemap.xml,
 * robots.txt and site.webmanifest. The output is plain static HTML with no
 * runtime dependency on this script — deploy the folder as-is.
 */

const fs = require('fs');
const path = require('path');

const { BUSINESS, SERVICES, SERVICE_GROUPS, CITIES, FAQS, TESTIMONIALS } = require('./data');
const { head, header, footer, ctaBand, rel, esc, ICONS } = require('./layout');
const C = require('./components');

const ROOT = path.join(__dirname, '..');

const DESCRIPTION =
    'Commercial, industrial and institutional cleaning serving Northern Illinois — janitorial, ' +
    'industrial, warehouse, medical, school, carpet, window, tile and post-construction cleaning.';

/* --------------------------------------------------------------------------
   Schema
   -------------------------------------------------------------------------- */

/**
 * Core LocalBusiness node.
 * Deliberately no aggregateRating — there are no verified review scores yet,
 * and marking up scores a business does not hold risks a manual action.
 */
function localBusiness(extra = {}) {
    return {
        '@type': ['LocalBusiness', 'CleaningService', 'ProfessionalService'],
        '@id': BUSINESS.domain + '/#business',
        name: BUSINESS.name,
        alternateName: BUSINESS.shortName,
        description: DESCRIPTION,
        url: BUSINESS.domain + '/',
        telephone: BUSINESS.phoneDigits,
        email: BUSINESS.email,
        image: BUSINESS.domain + '/assets/img/brand/og-image.png',
        logo: BUSINESS.domain + '/assets/img/brand/logo.svg',
        priceRange: '$$',
        currenciesAccepted: 'USD',
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS.street,
            addressLocality: BUSINESS.postalCity,
            addressRegion: BUSINESS.region,
            postalCode: BUSINESS.postalCode,
            addressCountry: BUSINESS.country
        },
        geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.lat, longitude: BUSINESS.lng },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '07:00',
                closes: '18:00'
            }
        ],
        areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name + ', IL' })),
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Commercial cleaning services',
            itemListElement: SERVICES.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: s.title, description: s.short }
            }))
        },
        ...extra
    };
}

function breadcrumbs(trail) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: BUSINESS.domain + item.path
        }))
    };
}

const graph = (nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });

/* --------------------------------------------------------------------------
   Shared blocks
   -------------------------------------------------------------------------- */
function pageHero({ eyebrow, title, lede, crumbs = [], depth = 0, media, mediaAlt }) {
    const trail = crumbs.length
        ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>
            <li><a href="${rel('/index.html', depth)}">Home</a></li>
            ${crumbs
                .map((c) =>
                    c.path
                        ? `<li><a href="${rel(c.path, depth)}">${esc(c.name)}</a></li>`
                        : `<li aria-current="page">${esc(c.name)}</li>`
                )
                .join('\n            ')}
        </ol></nav>`
        : '';

    return `
<section class="page-hero${media ? ' page-hero--media' : ''}">
    <span class="fx" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="wrap">
        <div class="page-hero__inner">
            <div class="page-hero__text">
                ${trail}
                ${eyebrow ? `<p class="eyebrow eyebrow--light">${ICONS.sparkle} ${esc(eyebrow)}</p>` : ''}
                <h1>${title}</h1>
                ${lede ? `<p class="lede">${esc(lede)}</p>` : ''}
            </div>
            ${
                media
                    ? `<div class="page-hero__media">${C.photo(
                          media,
                          mediaAlt || '',
                          { sizes: '(max-width: 980px) 92vw, 40vw', eager: true },
                          depth
                      )}</div>`
                    : ''
            }
        </div>
    </div>
</section>`;
}

function guaranteeBlock(depth) {
    return `
<section class="section section--tint" id="guarantee">
    <div class="wrap">
        <div class="guarantee">
            <span class="guarantee__icon" aria-hidden="true">${ICONS.shield}</span>
            <div>
                <p class="eyebrow">${ICONS.sparkle} Our standard</p>
                <h2>Inspected after every visit. Missed anything, and we redo it free.</h2>
                <p class="lede">A supervisor inspects the work against your written scope after each visit, so most
                misses are caught before you ever see them. If something does get through, report it within 24 hours
                and the crew comes back and puts it right at no charge — no credit note to chase, and no argument
                about what the scope said.</p>
                <div class="btn-row">
                    <a class="btn btn--primary" href="${rel('/contact.html', depth)}">Get a fixed price ${
        ICONS.arrow
    }</a>
                    <a class="btn btn--outline" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(BUSINESS.phone)}</a>
                </div>
            </div>
        </div>
    </div>
</section>`;
}

function serviceSignature(service) {
    const signatures = {
        'medical-office-cleaning': ['Zone-segregated equipment', 'High-touch sequence', 'Documented visit'],
        'industrial-cleaning': ['Site induction', 'PPE and lockout rules', 'Shutdown scheduling'],
        'manufacturing-cleaning': ['Line-side planning', 'Changeover windows', 'Audit-ready records'],
        'warehouse-cleaning': ['Ride-on equipment', 'Dispatch-aware timing', 'Dock and rack detail'],
        'office-building-cleaning': ['Multi-tenant reporting', 'Lobby and glass detail', 'Quiet evening crews'],
        'gym-cleaning': ['High-touch equipment', 'Mirrors and mats', 'Locker-room routines'],
        'school-cleaning': ['Term-time routines', 'Break-period deep cleans', 'Classroom-to-gym scope'],
        'post-construction-cleaning': ['Rough clean', 'Final clean', 'Touch-up before handover'],
        'commercial-window-cleaning': ['Interior and exterior', 'Frames and tracks', 'Access planned first'],
        'carpet-cleaning': ['Method by fiber and use', 'Overnight drying plan', 'Spot and traffic-lane care'],
        'tile-and-grout-cleaning': ['Deep scrub', 'Extraction', 'Seal where specified'],
        'scheduled-cleaning-services': ['Frequency by task', 'Built around operating hours', 'Monthly review cycle']
    };
    const items = signatures[service.slug] || service.points.slice(0, 3).map((p) => p.split(' — ')[0]);
    return `<section class="service-signature service-signature--${esc(service.group.toLowerCase().replace(/[^a-z]+/g, '-'))}">
        <div class="wrap"><p>Program focus</p><ul>${items.map((item, i) => `<li><span>0${i + 1}</span><strong>${esc(item)}</strong></li>`).join('')}</ul></div>
    </section>`;
}

/* --------------------------------------------------------------------------
   Pages
   -------------------------------------------------------------------------- */
const pages = [];

/* ----- Home ------------------------------------------------------------- */
pages.push({
    path: '/index.html',
    title: 'Commercial Cleaning Systems of Chicago | Commercial & Industrial Cleaning',
    description:
        'Commercial, industrial and institutional cleaning serving Northern Illinois. Janitorial, warehouse, ' +
        'medical, school, carpet, window and post-construction cleaning. Written scope, fixed price, free quote.',
    schema: graph([
        localBusiness(),
        {
            '@type': 'WebSite',
            '@id': BUSINESS.domain + '/#website',
            url: BUSINESS.domain + '/',
            name: BUSINESS.name,
            publisher: { '@id': BUSINESS.domain + '/#business' }
        }
    ]),
    body: (depth) => `
${C.hero(depth)}
${C.trustStrip()}

<section class="section">
    <div class="wrap">
        ${C.heading({ eyebrow: 'Find your program', title: 'Start with the facility. Add the specialist work.', lede: 'Fifteen programs, organized around how facilities teams actually buy cleaning.' })}
        ${C.serviceExplorer(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.operatingSystem(depth)}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.visualProof(depth)}
    </div>
</section>

<section class="section section--navy">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'The operating standard',
            title: 'Built for facilities teams, not domestic housekeeping',
            lede: 'Clear scope, controlled access, consistent staffing and work that fits around the building.',
            light: true
        })}
        ${C.reasons()}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Where we work',
            title: 'Serving Northern Illinois',
            lede: 'Scheduled routes across the city and the I-88 and I-290 corridors.'
        })}
        ${C.areaGrid(depth)}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Questions',
            title: 'What buyers ask before they switch',
            lede: 'Pricing, insurance, contracts and out-of-hours access — answered clearly.'
        })}
        <div class="faq-wrap">${C.faqList(5)}</div>
        <div class="section-foot" data-reveal>
            <a class="btn btn--ghost btn--lg" href="${rel('/faq.html', depth)}">All ${FAQS.length} questions ${
        ICONS.arrow
    }</a>
        </div>
    </div>
</section>

${guaranteeBlock(depth)}
${ctaBand(depth)}`
});

/* ----- Services index --------------------------------------------------- */
pages.push({
    path: '/services.html',
    title: `All ${SERVICES.length} Cleaning Services | CCS of Chicago`,
    description:
        'Industrial, commercial, warehouse, manufacturing, medical, school, gym, carpet, tile and grout, window, ' +
        'green, post-construction, spring and scheduled cleaning serving Northern Illinois.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services.html' }
        ]),
        {
            '@type': 'ItemList',
            name: 'Cleaning services',
            itemListElement: SERVICES.map((s, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: s.title,
                url: BUSINESS.domain + '/services/' + s.slug + '.html'
            }))
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Our services',
    title: `${SERVICES.length} cleaning programs.<br><em>One contract.</em>`,
    lede:
        'Every program below can be taken on its own or folded into a single janitorial contract with one schedule, one supervisor and one invoice.',
    crumbs: [{ name: 'Services' }],
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.serviceExplorer(depth)}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({ eyebrow: 'How it works', title: 'What happens after you call' })}
        ${C.process()}
    </div>
</section>

${guaranteeBlock(depth)}
${ctaBand(depth, {
    heading: 'Not sure which programs you need?',
    body:
        'Describe the building and we will tell you what it actually needs — including the parts you do not need to pay for yet.'
})}`
});

/* ----- One page per service --------------------------------------------- */
SERVICES.forEach((s, idx) => {
    const others = SERVICES.filter((o) => o.group === s.group && o.slug !== s.slug).slice(0, 3);
    const fill = SERVICES.filter((o) => o.slug !== s.slug && !others.includes(o)).slice(0, 3 - others.length);
    const related = others.concat(fill);

    pages.push({
        path: '/services/' + s.slug + '.html',
        depth: 1,
        title: `${s.title} Serving Northern Illinois | CCS of Chicago`,
        description: `${s.short} Serving Chicago, Naperville, Oak Brook, Downers Grove, Elmhurst and Schaumburg. Free site walk and fixed price per visit.`,
        schema: graph([
            localBusiness(),
            breadcrumbs([
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services.html' },
                { name: s.title, path: '/services/' + s.slug + '.html' }
            ]),
            {
                '@type': 'Service',
                name: s.title,
                description: s.blurb,
                serviceType: s.title,
                provider: { '@id': BUSINESS.domain + '/#business' },
                areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name + ', IL' })),
                url: BUSINESS.domain + '/services/' + s.slug + '.html'
            }
        ]),
        body: (depth) => `
${pageHero({
    eyebrow: s.group,
    title: esc(s.title),
    lede: s.short,
    crumbs: [{ name: 'Services', path: '/services.html' }, { name: s.title }],
    depth,
    media: s.image,
    mediaAlt: s.alt
})}

${serviceSignature(s)}

<section class="section service-detail service-detail--${s.slug}">
    <div class="wrap">
        <div class="split">
            <div class="split__text">
                <p class="eyebrow" data-reveal>${ICONS.sparkle} ${esc(s.kicker)}</p>
                <h2 data-reveal>What ${esc(s.title.toLowerCase())} covers</h2>
                <p class="lede" data-reveal>${esc(s.blurb)}</p>
                <ul class="ticks ticks--lg" data-reveal>
                    ${s.points.map((p) => `<li>${ICONS.check}<span>${esc(p)}</span></li>`).join('\n                    ')}
                </ul>
                <div class="btn-row" data-reveal>
                    <a class="btn btn--primary btn--lg" href="${rel('/contact.html?service=' + s.slug, depth)}">
                        Get a price for ${esc(s.title.toLowerCase())} ${ICONS.arrow}
                    </a>
                    <a class="btn btn--outline btn--lg" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(
            BUSINESS.phone
        )}</a>
                </div>
            </div>
            <div class="split__aside" data-reveal>
                <div class="panel">
                    <h3>${ICONS.pin} Available across</h3>
                    <ul class="link-list">
                        ${CITIES.map(
                            (c) =>
                                `<li><a href="${rel('/areas/' + c.slug + '.html', depth)}">${esc(
                                    s.title
                                )} in ${esc(c.name)}${ICONS.arrow}</a></li>`
                        ).join('\n                        ')}
                    </ul>
                </div>
                <div class="panel panel--accent">
                    <h3>${ICONS.clock} Scheduling</h3>
                    <p>${esc(BUSINESS.hours)}</p>
                    <p class="faint">${esc(BUSINESS.hoursNote)} — at no premium on a contract.</p>
                    <a class="btn btn--primary btn--block" href="${rel('/contact.html', depth)}">Book a site walk</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({ eyebrow: 'How it works', title: 'How we run the program' })}
        ${C.process()}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Related',
            title: 'Often bundled with this',
            lede: 'Bundled programs share one schedule, one supervisor and one invoice.'
        })}
        <div class="card-grid">
            ${related
                .map(
                    (r) => `<article class="s-card" data-reveal>
                <a class="s-card__media" href="${rel('/services/' + r.slug + '.html', depth)}" tabindex="-1" aria-hidden="true">
                    ${C.photo(r.image, '', { sizes: '(max-width: 600px) 92vw, 30vw' }, depth)}
                    <span class="s-card__scrim"></span>
                </a>
                <div class="s-card__body">
                    <span class="s-card__icon">${ICONS[r.icon]}</span>
                    <h3><a href="${rel('/services/' + r.slug + '.html', depth)}">${esc(r.title)}</a></h3>
                    <p class="s-card__kicker">${esc(r.kicker)}</p>
                    <p>${esc(r.short)}</p>
                    <span class="s-card__more">Read more ${ICONS.arrow}</span>
                </div>
            </article>`
                )
                .join('\n            ')}
        </div>
    </div>
</section>

${ctaBand(depth, {
    heading: `Get a fixed price for ${s.title.toLowerCase()}`,
    body: `Call ${BUSINESS.phone} or send the details and we will walk the site, write the scope and price it per visit.`
})}`
    });
});

/* ----- About ------------------------------------------------------------ */
pages.push({
    path: '/about.html',
    title: 'About | Commercial Cleaning Systems of Chicago',
    description:
        'How we run commercial cleaning as a system — written scopes, assigned supervised crews, post-visit ' +
        'inspections and green cleaning as standard across Northern Illinois.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about.html' }
        ]),
        { '@type': 'AboutPage', name: 'About ' + BUSINESS.name, url: BUSINESS.domain + '/about.html' }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Our company',
    title: 'Cleaning run as a <em>system</em>.',
    lede:
        'The name is not decoration. Most cleaning fails because nobody wrote down what "clean" means for a specific building — so we start there and build the schedule around it.',
    crumbs: [{ name: 'About' }],
    depth,
    media: 'office-building-cleaning',
    mediaAlt: 'Glass office towers seen from below against a clear sky'
})}

<section class="section">
    <div class="wrap">
        <div class="split">
            <div class="split__text">
                <p class="eyebrow" data-reveal>${ICONS.sparkle} What we do differently</p>
                <h2 data-reveal>Define it, staff it, inspect it.</h2>
                <p class="lede" data-reveal>Almost every complaint about a cleaning contractor is really a complaint
                about an undefined scope. Nobody wrote down how often the high dusting happens, so it stopped
                happening, and eleven months later somebody notices.</p>
                <p data-reveal>So we define it: a room-by-room scope with a frequency against every task, agreed
                before the first visit. We staff it with a named crew and an on-site supervisor rather than whoever is
                free that night. And we inspect against the scope after each visit and send you the report.</p>
                <p data-reveal>That is the whole method. It is not clever, but it is the difference between a contract
                that holds its standard in month twelve and one that quietly degrades from month three.</p>
            </div>
            <div class="split__aside" data-reveal>
                <div class="panel">
                    <h3>${ICONS.shield} At a glance</h3>
                    <dl class="facts">
                        <div><dt>Services</dt><dd>${SERVICES.length} programs</dd></div>
                        <div><dt>Areas</dt><dd>Chicago + ${CITIES.length - 1} suburbs</dd></div>
                        <div><dt>Clients</dt><dd>Commercial &amp; industrial only</dd></div>
                        <div><dt>Hours</dt><dd>${esc(BUSINESS.hours)}</dd></div>
                        <div><dt>Out of hours</dt><dd>No premium on contract</dd></div>
                        <div><dt>Insurance</dt><dd>Liability &amp; workers comp</dd></div>
                        <div><dt>Staff</dt><dd>Background-checked, badged</dd></div>
                        <div><dt>Products</dt><dd>Green cleaning as standard</dd></div>
                    </dl>
                    <a class="btn btn--primary btn--block" href="${rel('/contact.html', depth)}">Request a quote</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section--navy">
    <span class="fx" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Why us',
            title: 'What you get on every contract',
            light: true
        })}
        ${C.reasons()}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({ eyebrow: 'How it works', title: 'From first call to a settled routine' })}
        ${C.process()}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({ eyebrow: 'Who we clean for', title: 'Buildings we are set up for' })}
        ${C.sectors()}
    </div>
</section>

${guaranteeBlock(depth)}
${ctaBand(depth)}`
});

/* ----- Service areas index ---------------------------------------------- */
pages.push({
    path: '/service-areas.html',
    title: 'Service Areas | Commercial Cleaning Serving Northern Illinois',
    description:
        'Commercial and industrial cleaning in Chicago, Naperville, Oak Brook, Downers Grove, Elmhurst and ' +
        'Schaumburg. Scheduled routes across the city and the western suburbs.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Service areas', path: '/service-areas.html' }
        ]),
        {
            '@type': 'ItemList',
            name: 'Service areas',
            itemListElement: CITIES.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: c.name + ', IL',
                url: BUSINESS.domain + '/areas/' + c.slug + '.html'
            }))
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Service areas',
    title: 'Chicago and the <em>western suburbs</em>',
    lede:
        'Scheduled routes across the city and out along the I-88 and I-290 corridors. If you are just outside one of these, call anyway — routes flex more often than people expect.',
    crumbs: [{ name: 'Service areas' }],
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.areaGrid(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Services',
            title: 'Every program runs in every area',
            lede: 'Nothing on this list is limited to one part of the metro.'
        })}
        ${C.serviceIndex(depth)}
    </div>
</section>

${ctaBand(depth, {
    heading: 'Not on the list?',
    body:
        'We add towns to a route when there is enough work to justify it. Tell us where the building is and we will say honestly whether we can cover it properly.'
})}`
});

/* ----- Area pages ------------------------------------------------------- */
CITIES.forEach((city) => {
    pages.push({
        path: '/areas/' + city.slug + '.html',
        depth: 1,
        title: `Commercial Cleaning in ${city.name}, IL | CCS of Chicago`,
        description:
            `Commercial, industrial and office cleaning in ${city.name}, ${city.county}. Janitorial, carpet, window, ` +
            `floor and post-construction programs. Written scope and a fixed price per visit.`,
        geo: `<meta name="geo.region" content="US-IL">\n<meta name="geo.placename" content="${esc(city.name)}, Illinois">`,
        schema: graph([
            localBusiness(),
            breadcrumbs([
                { name: 'Home', path: '/' },
                { name: 'Service areas', path: '/service-areas.html' },
                { name: city.name, path: '/areas/' + city.slug + '.html' }
            ]),
            {
                '@type': 'Service',
                name: `Commercial cleaning in ${city.name}, IL`,
                description: city.intro,
                serviceType: 'Commercial cleaning',
                provider: { '@id': BUSINESS.domain + '/#business' },
                areaServed: {
                    '@type': 'City',
                    name: city.name,
                    containedInPlace: { '@type': 'AdministrativeArea', name: city.county }
                }
            }
        ]),
        body: (depth) => `
${pageHero({
    eyebrow: city.county,
    title: `Commercial cleaning in <em>${esc(city.name)}</em>`,
    lede: city.intro,
    crumbs: [{ name: 'Service areas', path: '/service-areas.html' }, { name: city.name }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="split">
            <div class="split__text">
                <p class="eyebrow" data-reveal>${ICONS.sparkle} On our ${esc(city.name)} route</p>
                <h2 data-reveal>What we clean in ${esc(city.name)}</h2>
                <p class="lede" data-reveal>${esc(city.detail)}</p>
                <p data-reveal>Whatever the building, the arrangement is the same: a site walk, a written scope with
                a frequency against every task, a fixed price per visit and a supervisor who inspects the work.
                Out-of-hours crews carry no premium, and anything missed is redone free if you report it within
                24 hours.</p>
                <div class="btn-row" data-reveal>
                    <a class="btn btn--primary btn--lg" href="${rel('/contact.html', depth)}">Get a ${esc(
            city.name
        )} quote ${ICONS.arrow}</a>
                    <a class="btn btn--outline btn--lg" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(
            BUSINESS.phone
        )}</a>
                </div>
            </div>
            <div class="split__aside" data-reveal>
                <div class="panel">
                    <h3>${ICONS.building} What we mostly clean here</h3>
                    <ul class="ticks">
                        ${city.focus.map((f) => `<li>${ICONS.check}<span>${esc(f)}</span></li>`).join('\n                        ')}
                    </ul>
                    <p class="fact-label">Also covered nearby</p>
                    <p class="chips">${city.nearby.map((n) => `<span>${esc(n)}</span>`).join('')}</p>
                    <a class="btn btn--primary btn--block" href="${rel('/contact.html', depth)}">Book a site walk</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: `${esc(city.name)} services`,
            title: `All ${SERVICES.length} programs available in ${esc(city.name)}`,
            lede: 'Take one, or bundle several into a single contract with one invoice.'
        })}
        ${C.serviceIndex(depth)}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({ eyebrow: 'Nearby', title: 'Other areas we cover' })}
        ${C.areaGrid(depth, { exclude: city.slug })}
    </div>
</section>

${guaranteeBlock(depth)}
${ctaBand(depth, {
    heading: `Cleaning contracts in ${city.name}`,
    body: `Call ${BUSINESS.phone} or send the details, and we will walk the building and come back with a written scope and a fixed price per visit.`
})}`
    });
});

/* ----- Testimonials ----------------------------------------------------- */
pages.push({
    path: '/testimonials.html',
    title: 'Client References & Cleaning Standards | CCS of Chicago',
    description:
        'Client testimonials for CCS of Chicago. We publish only genuine, attributable testimonials — and offer ' +
        'references from facilities managers running buildings like yours.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Testimonials', path: '/testimonials.html' }
        ])
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Testimonials',
    title: 'References, not invented reviews',
    lede:
        'Only testimonials we can attribute to a real client, with their permission, get published here. If a cleaning company shows you five glowing quotes with no name and no building attached, assume it wrote them.',
    crumbs: [{ name: 'Testimonials' }],
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.testimonials(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Instead of quotes',
            title: 'Ask us for a reference',
            lede:
                'More useful than a testimonial: we will connect you with a facilities manager running a building the same size and type as yours, and you can ask them whatever you like.'
        })}
        ${C.reasons()}
    </div>
</section>

${ctaBand(depth, {
    heading: 'Ask for references',
    body: 'Tell us the building type and size, and we will put you in touch with a client running something comparable.'
})}`
});

/* ----- FAQ -------------------------------------------------------------- */
pages.push({
    path: '/faq.html',
    title: 'FAQ | Pricing, Insurance, Contracts & Scheduling | CCS of Chicago',
    description:
        'Answers on commercial cleaning pricing, insurance certificates, contract terms, out-of-hours scheduling, ' +
        'green cleaning, carpet drying times and post-construction stages.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq.html' }
        ]),
        {
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Questions',
    title: 'Frequently asked questions',
    lede: 'What buyers ask before they switch contractors, answered without the sales gloss.',
    crumbs: [{ name: 'FAQ' }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="faq-wrap">${C.faqList()}</div>
    </div>
</section>

${guaranteeBlock(depth)}
${ctaBand(depth, {
    heading: 'Still not answered?',
    body: 'Call and ask. You will get someone who knows the answer rather than a form that promises one.'
})}`
});

/* ----- Contact ---------------------------------------------------------- */
pages.push({
    path: '/contact.html',
    title: 'Request a Free Cleaning Quote | CCS of Chicago',
    description:
        'Request a free, no-obligation commercial cleaning quote for your building in Chicago or the western ' +
        'suburbs. Site walk, written scope and a fixed price per visit.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact.html' }
        ]),
        { '@type': 'ContactPage', name: 'Contact ' + BUSINESS.name, url: BUSINESS.domain + '/contact.html' }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Get in touch',
    title: 'Request a free quote',
    lede:
        'Tell us the building, the frequency and the town. You get a site walk, a written scope and a fixed price per visit — no obligation, and no sales visit dressed up as a survey.',
    crumbs: [{ name: 'Contact' }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="contact-grid">
            <div class="contact-form-wrap" data-reveal>
                <h2>Tell us about the building</h2>
                <p class="faint">Fields marked <span aria-hidden="true">*</span> are required.</p>
                ${C.quoteForm(depth)}
            </div>

            <aside class="contact-side">
                <div class="panel panel--accent" data-reveal>
                    <h3>${ICONS.phone} Call us</h3>
                    <a class="contact-phone" href="${BUSINESS.phoneHref}">${esc(BUSINESS.phone)}</a>
                    <p class="faint">${esc(BUSINESS.hours)}<br>${esc(BUSINESS.emergency)}.</p>
                </div>

                <div class="panel" data-reveal>
                    <h3>${ICONS.mail} Prefer to write?</h3>
                    <p><a href="mailto:${esc(BUSINESS.email)}">${esc(BUSINESS.email)}</a></p>
                    <p class="faint">Replies within one working day. Attach a floor plan or a photo of the problem
                    area and the quote comes back faster.</p>
                </div>

                <div class="panel" data-reveal>
                    <h3>${ICONS.pin} Areas covered</h3>
                    <ul class="link-list">
                        ${CITIES.map(
                            (c) =>
                                `<li><a href="${rel('/areas/' + c.slug + '.html', depth)}">${esc(c.name)}${
                                    ICONS.arrow
                                }</a></li>`
                        ).join('\n                        ')}
                    </ul>
                </div>

                <div class="panel" data-reveal>
                    <h3>${ICONS.shield} Before you sign</h3>
                    <p class="faint">We send certificates of insurance, safety data sheets for our products and the
                    full written scope before any contract starts.</p>
                </div>
            </aside>
        </div>
    </div>
</section>`
});

/* ----- 404 -------------------------------------------------------------- */
pages.push({
    path: '/404.html',
    noindex: true,
    title: 'Page not found | CCS of Chicago',
    description: 'That page does not exist. Here is everything else on the site.',
    schema: graph([localBusiness()]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Error 404',
    title: 'That page has been cleaned away.',
    lede: 'The link is broken or the page has moved. Everything that does exist is below.',
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.heading({ eyebrow: 'Services', title: 'What you were probably looking for' })}
        ${C.serviceIndex(depth)}
        <div class="section-foot">
            <a class="btn btn--primary btn--lg" href="${rel('/index.html', depth)}">Back to the homepage ${
        ICONS.arrow
    }</a>
            <a class="btn btn--outline btn--lg" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(BUSINESS.phone)}</a>
        </div>
    </div>
</section>`
});

/* --------------------------------------------------------------------------
   Render
   -------------------------------------------------------------------------- */
function render(page) {
    const depth = page.depth || 0;
    return head(page, depth) + header(page, depth) + page.body(depth) + footer(depth);
}

console.log('\nBuilding ' + BUSINESS.name + '…\n');

let written = 0;
pages.forEach((page) => {
    const outPath = path.join(ROOT, page.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, render(page).replace(/\n{3,}/g, '\n\n'), 'utf8');
    written += 1;
    console.log('  ✓ ' + page.path);
});

/* ----- sitemap.xml ------------------------------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = pages
    .filter((p) => !p.noindex)
    .map((p) => {
        const loc = BUSINESS.domain + (p.path === '/index.html' ? '/' : p.path);
        const priority =
            p.path === '/index.html' ? '1.0' : p.path.startsWith('/services/') ? '0.8' : p.path.startsWith('/areas/') ? '0.7' : '0.8';
        return `    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
    </url>`;
    })
    .join('\n');

fs.writeFileSync(
    path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`,
    'utf8'
);
console.log('  ✓ /sitemap.xml');

fs.writeFileSync(
    path.join(ROOT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${BUSINESS.domain}/sitemap.xml\n`,
    'utf8'
);
console.log('  ✓ /robots.txt');

fs.writeFileSync(
    path.join(ROOT, 'site.webmanifest'),
    JSON.stringify(
        {
            name: BUSINESS.name,
            short_name: BUSINESS.shortName,
            description: 'Commercial and industrial cleaning serving Northern Illinois.',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#0B2545',
            icons: [
                { src: '/assets/img/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
                { src: '/assets/img/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
                { src: '/assets/img/brand/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
        },
        null,
        2
    ) + '\n',
    'utf8'
);
console.log('  ✓ /site.webmanifest');

console.log(`\nBuilt ${written} pages — ${SERVICES.length} services, ${CITIES.length} areas.`);
if (!TESTIMONIALS.length) {
    console.log('  note: TESTIMONIALS is empty — the page renders its honest empty state.');
}
console.log('');
