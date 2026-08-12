/**
 * Single source of truth for everything that appears on more than one page.
 *
 * Edit this file, run `node tools/build.js`, and every HTML page, the sitemap,
 * robots.txt and the web manifest are rewritten from it. Never hand-edit the
 * generated .html files — the next build overwrites them.
 *
 * Anything marked TODO is a placeholder that must be replaced before launch.
 */

const BUSINESS = {
    name: 'Commercial Cleaning Systems of Chicago',
    shortName: 'CCS of Chicago',
    initials: 'CCS',
    tagline: 'Commercial & Industrial Cleaning',

    // Supplied by the client — this is the real number.
    phone: '(630) 202-7343',
    phoneHref: 'tel:+16302027343',
    smsHref: 'sms:+16302027343',
    phoneDigits: '+1-630-202-7343',

    // TODO: replace with the real address before launch.
    email: 'info@ccsofchicago.com',
    domain: 'https://ccsofchicago.com',

    country: 'US',
    region: 'IL',
    regionName: 'Illinois',
    city: 'Chicago',
    hours: 'Mon–Fri, 7:00am – 6:00pm',
    hoursNote: 'Nightly, overnight and weekend crews by contract',
    emergency: 'Emergency and same-day response available',
    guarantee: 'Inspected after every visit — anything missed is redone free',

    // Approximate metro centroid, used only for the LocalBusiness geo hint.
    lat: 41.8781,
    lng: -87.6298,

    // TODO: add real profile URLs, or leave blank to hide the icons.
    social: { facebook: '', linkedin: '', google: '' }
};

/**
 * Headline figures. Every one of these is a capability statement rather than
 * a performance claim, because unverifiable stats ("500+ clients") on a
 * marketing site are the first thing a procurement team checks.
 */
const STATS = [
    { value: 15, suffix: '', label: 'Specialist cleaning programs under one contract' },
    { value: 7, suffix: '/7', label: 'Scheduling — nights, weekends and holidays' },
    { value: 24, suffix: 'h', label: 'Window to report anything missed for a free redo' },
    { value: 100, suffix: '%', label: 'Insured, background-checked, supervised crews' }
];

const NAV = [
    { label: 'Home', href: '/index.html' },
    { label: 'Services', href: '/services.html' },
    { label: 'About', href: '/about.html' },
    { label: 'Testimonials', href: '/testimonials.html' },
    { label: 'FAQ', href: '/faq.html' }
];

/* --------------------------------------------------------------------------
   Services — all fifteen, each with its own landing page at /services/<slug>
   `group` drives the mega-menu columns and the services index.
   -------------------------------------------------------------------------- */
const SERVICES = [
    {
        slug: 'commercial-cleaning',
        icon: 'building',
        group: 'Core programs',
        title: 'Commercial Cleaning',
        kicker: 'Nightly, weekly or on a set rotation',
        short:
            'A single janitorial contract covering the whole site, worked to a written scope and inspected after every visit.',
        blurb:
            'The base program most of our clients start from. We build a room-by-room scope with a frequency against every task, assign a supervised crew to your building, and inspect against that scope after each visit — so what you agreed in month one is still what you get in month twelve.',
        points: [
            'Written scope of work with a frequency against every task',
            'Assigned crew who learn your building and your access rules',
            'Post-visit inspection reports, not just an invoice',
            'Nightly, weekly, fortnightly or monthly rotations',
            'Consumables and restocking managed if you want it'
        ],
        image: 'commercial-cleaning',
        alt: 'Daylight falling across a bench in a clean commercial building lobby'
    },
    {
        slug: 'industrial-cleaning',
        icon: 'factory',
        group: 'Industrial & heavy',
        title: 'Industrial Cleaning',
        kicker: 'Plant floors and high-clearance space',
        short:
            'Plant, mill and heavy-industry cleaning — machine surrounds, overheads, structural steel and production floors.',
        blurb:
            'Industrial sites are not big offices, and cleaning them with office methods does not work. We handle production floors, machine surrounds, overhead steel, dust accumulation on high ledges and the degreasing that follows, working to your permit, lockout and PPE requirements rather than around them.',
        points: [
            'Production floors, machine surrounds and pits',
            'High-level and structural steel dust removal',
            'Degreasing and oil residue on floors and plant',
            'Work planned around shift patterns and shutdowns',
            'Crews briefed on your site induction, PPE and lockout rules'
        ],
        image: 'industrial-cleaning',
        alt: 'An active industrial plant with storage tanks and pipework under a clear sky'
    },
    {
        slug: 'manufacturing-cleaning',
        icon: 'gear',
        group: 'Industrial & heavy',
        title: 'Manufacturing Cleaning',
        kicker: 'Around your production schedule',
        short:
            'Line-side and plant-wide cleaning scheduled around production, changeovers and planned shutdowns.',
        blurb:
            'Cleaning a working plant is a scheduling problem as much as a cleaning one. We work line-side between runs, take the deeper work into changeovers and shutdowns, and keep a documented record of what was cleaned and when — the thing auditors actually ask for.',
        points: [
            'Line-side cleaning between runs and on changeover',
            'Shutdown and turnaround deep cleans',
            'Documented cleaning records for audits',
            'Segregated equipment for sensitive production areas',
            'Waste streams handled to your site procedure'
        ],
        image: 'manufacturing-cleaning',
        alt: 'Molten metal and heavy plant inside a steel manufacturing facility'
    },
    {
        slug: 'warehouse-cleaning',
        icon: 'box',
        group: 'Industrial & heavy',
        title: 'Warehouse Cleaning',
        kicker: 'Machine scrubbing at scale',
        short:
            'Ride-on scrubbing for large floor plates, plus racking, dock and mezzanine cleaning that keeps dust down.',
        blurb:
            'Large floor plates need machines, not mops. We bring ride-on and walk-behind scrubbers sized to the space, work the racking and dock areas that collect the worst of the dust, and schedule around your pick and dispatch windows so nothing blocks a trailer.',
        points: [
            'Ride-on and walk-behind machine scrubbing',
            'Racking, upright and mezzanine dust removal',
            'Loading dock and yard-door cleaning',
            'Line-marking areas kept legible',
            'Scheduled around pick, pack and dispatch windows'
        ],
        image: 'warehouse-cleaning',
        alt: 'Stacked shipping containers at a distribution yard'
    },
    {
        slug: 'office-building-cleaning',
        icon: 'tower',
        group: 'Core programs',
        title: 'Office Building Cleaning',
        kicker: 'Multi-tenant and common areas',
        short:
            'Whole-building janitorial for multi-tenant offices — lobbies, elevators, common areas, restrooms and suites.',
        blurb:
            'Built for property managers and building engineers rather than a single tenant. We cover lobbies, elevator cabs and tracks, corridors, stairwells, restrooms and tenant suites, and report by area so you can see where the hours are actually going.',
        points: [
            'Lobbies, elevator cabs and tracks, corridors and stairwells',
            'Restroom servicing with consumables managed',
            'Tenant suites cleaned to individual scopes',
            'Reporting broken down by area, not one line item',
            'Day porters available alongside the night crew'
        ],
        image: 'office-building-cleaning',
        alt: 'Looking up between glass office towers against a blue sky'
    },
    {
        slug: 'medical-office-cleaning',
        icon: 'cross',
        group: 'Regulated & sensitive',
        title: 'Medical Office Cleaning',
        kicker: 'Clinical protocol, documented',
        short:
            'Clinics, dental and specialist practices cleaned to a clinical protocol with colour-coded, segregated equipment.',
        blurb:
            'Exam rooms, treatment bays, waiting areas and restrooms cleaned in the right order with equipment that never crosses between zones. We clean first and disinfect second, hold the label dwell time on every high-touch point, and leave a record of it.',
        points: [
            'Colour-coded, zone-segregated equipment — no cross-use',
            'Clean-then-disinfect with label dwell times observed',
            'Exam rooms, treatment bays, waiting and reception areas',
            'Regulated waste handled to your practice procedure',
            'Crews briefed on patient privacy and quiet working'
        ],
        image: 'medical-office-cleaning',
        alt: 'A clean, brightly lit dental treatment room ready for the next patient'
    },
    {
        slug: 'school-cleaning',
        icon: 'school',
        group: 'Regulated & sensitive',
        title: 'School Cleaning',
        kicker: 'Term-time and summer programs',
        short:
            'Classrooms, gyms, cafeterias and washrooms cleaned around the timetable, with a deeper program over breaks.',
        blurb:
            'Schools have two cleaning problems: keeping up during term and resetting everything over the break. We do both — a daily program that works around the timetable, and a summer deep clean covering floors, furniture and the places that only get reached when the building is empty.',
        points: [
            'Daily classroom, corridor and washroom program',
            'Cafeteria and gym floor care',
            'High-touch disinfection through illness season',
            'Summer and break-period deep cleans, floors stripped and resealed',
            'Background-checked staff, badged and supervised'
        ],
        image: 'school-cleaning',
        alt: 'A classroom blackboard and a stack of school books'
    },
    {
        slug: 'gym-cleaning',
        icon: 'dumbbell',
        group: 'Regulated & sensitive',
        title: 'Gym Cleaning',
        kicker: 'Equipment, mats and locker rooms',
        short:
            'Studios, equipment, mats, showers and locker rooms — the surfaces members notice and the ones they smell.',
        blurb:
            'Gyms are judged on their locker rooms. We disinfect equipment contact points and mats, deep-clean showers and changing areas on a rotation that keeps grout and drains under control, and work early or late so the floor is never closed at peak.',
        points: [
            'Equipment contact points and mats disinfected',
            'Locker rooms, showers and drains on a deep-clean rotation',
            'Studio and free-weight floor care',
            'Odour handled at the source rather than masked',
            'Early-morning or late-night slots to miss peak hours'
        ],
        image: 'gym-cleaning',
        alt: 'A row of cardio machines in a clean, well-lit gym floor'
    },
    {
        slug: 'carpet-cleaning',
        icon: 'carpet',
        group: 'Specialist care',
        title: 'Carpet Cleaning',
        kicker: 'Hot water extraction & low-moisture',
        short:
            'Extraction that lifts what is bonded into the fibre — traffic lanes, spills and odour, not just the surface.',
        blurb:
            'Vacuuming takes the loose soil; extraction takes what is bonded to the fibre. We pre-treat, agitate and hot-water extract, with a low-moisture option for offices that cannot be out of service — walkable in two to four hours instead of overnight.',
        points: [
            'Pre-treatment, agitation and hot water extraction',
            'Traffic lane, spot and stain treatment',
            'Odour neutralised at the source, not masked',
            'Carpet tiles, broadloom, upholstery and task chairs',
            'Low-moisture option — walkable in 2–4 hours'
        ],
        image: 'carpet-cleaning',
        alt: 'A modern interior with seating over a soft, freshly cleaned floor covering'
    },
    {
        slug: 'tile-and-grout-cleaning',
        icon: 'tile',
        group: 'Specialist care',
        title: 'Tile and Grout Cleaning',
        kicker: 'Deep-scrub, restore and seal',
        short:
            'Grout lines scrubbed back to colour and sealed, so restrooms and lobbies stop looking dirty when they are clean.',
        blurb:
            'Grout is porous, so it holds soil long after the tile is clean — which is why a mopped restroom can still look grubby. We deep-scrub the grout lines mechanically, restore the colour, and seal them so the next six months of mopping actually works.',
        points: [
            'Mechanical deep-scrub of tile and grout lines',
            'Grout colour restoration where scrubbing is not enough',
            'Penetrating sealer applied after cleaning',
            'Restrooms, lobbies, kitchens and locker rooms',
            'Slip-resistance preserved, not polished away'
        ],
        image: 'tile-and-grout-cleaning',
        alt: 'A tiled washroom with a clean basin and fittings'
    },
    {
        slug: 'commercial-window-cleaning',
        icon: 'window',
        group: 'Specialist care',
        title: 'Commercial Window Cleaning',
        kicker: 'Interior, exterior and frames',
        short:
            'Storefront, low-rise and mid-rise glass cleaned inside and out, with frames, sills and tracks included.',
        blurb:
            'Glass is the first thing anyone sees and the last thing most contracts cover properly. We clean interior and exterior faces, and we do the frames, sills and tracks too — leaving those is why windows look dirty again within a week.',
        points: [
            'Interior and exterior glass, storefront to mid-rise',
            'Frames, sills and tracks cleaned, not skipped',
            'Purified-water pole systems for reachable elevations',
            'Partition and internal glass on the janitorial rotation',
            'Scheduled quarterly, monthly or to your standard'
        ],
        image: 'commercial-window-cleaning',
        alt: 'A blue glass office tower seen from street level'
    },
    {
        slug: 'green-cleaning',
        icon: 'leaf',
        group: 'Specialist care',
        title: 'Green Cleaning',
        kicker: 'Low-toxicity by default',
        short:
            'Third-party certified products, microfibre and HEPA filtration, with safety data sheets for everything we use.',
        blurb:
            'Available as a full program or applied to any of our other services. We use third-party certified low-toxicity products, microfibre systems that cut chemical use, and HEPA-filtered vacuums so what gets lifted off the floor does not end up in the air.',
        points: [
            'Third-party certified low-toxicity products',
            'Microfibre systems that cut chemical and water use',
            'HEPA filtration on vacuums and extractors',
            'Fragrance-free options for sensitive occupants',
            'Safety data sheets supplied for everything on site'
        ],
        image: 'green-cleaning',
        alt: 'Indoor greenery beside a window in a bright, airy interior'
    },
    {
        slug: 'post-construction-cleaning',
        icon: 'hardhat',
        group: 'Project work',
        title: 'Post Construction Cleaning',
        kicker: 'Rough, final and touch-up',
        short:
            'Construction dust removed in stages so the space is ready for handover, sign-off and occupancy.',
        blurb:
            'Construction dust is fine, it travels, and it settles again after the first clean — which is why a single pass never works. We work the standard three stages: a rough clean once debris is out, a final clean before handover, and a touch-up after the punch list is closed.',
        points: [
            'Rough clean once debris and materials are cleared',
            'Final clean — glass, fixtures, joinery, floors',
            'Touch-up pass after the punch list closes',
            'Adhesive, paint spots, labels and protective film removed',
            'Coordinated with your handover and occupancy dates'
        ],
        image: 'post-construction-cleaning',
        alt: 'A bare interior room part-way through renovation, ready for its final clean'
    },
    {
        slug: 'spring-cleaning',
        icon: 'sparkle',
        group: 'Project work',
        title: 'Spring Cleaning',
        kicker: 'The annual reset',
        short:
            'The once-a-year deep clean that resets everything a routine program is not scoped to reach.',
        blurb:
            'Every routine program is scoped to keep a building steady, not to reset it. Once a year we take out the things the rotation never reaches — high dusting, vents and diffusers, light fittings, interior glass, behind and under fixed furniture, and the floors underneath all of it.',
        points: [
            'High-level dusting, vents, diffusers and light fittings',
            'Interior glass, partitions and window coverings',
            'Behind and beneath fixed furniture and equipment',
            'Hard floors stripped, resealed and burnished',
            'Carpets extracted as part of the same visit'
        ],
        image: 'spring-cleaning',
        alt: 'Fresh flowers on a table in a bright, freshly cleaned room'
    },
    {
        slug: 'scheduled-cleaning-services',
        icon: 'calendar',
        group: 'Core programs',
        title: 'Scheduled Cleaning Services',
        kicker: 'A rotation built round your hours',
        short:
            'A fixed calendar of daily, weekly, monthly and annual tasks, so nothing depends on somebody remembering.',
        blurb:
            'Most cleaning fails quietly: the daily work continues and the periodic work slips. A scheduled program puts every task on a calendar with a frequency and an owner — daily, weekly, monthly, quarterly, annual — and reports against it, so slippage is visible before it becomes a complaint.',
        points: [
            'Daily, weekly, monthly, quarterly and annual task calendar',
            'Periodic work tracked separately from daily janitorial',
            'Reporting against the schedule, not just attendance',
            'Nights, weekends and holidays at no premium on contract',
            'Scope reviewed and re-tuned after the first month'
        ],
        image: 'scheduled-cleaning-services',
        alt: 'A city skyline at night with office floors still lit'
    }
];

const SERVICE_GROUPS = ['Core programs', 'Industrial & heavy', 'Regulated & sensitive', 'Specialist care', 'Project work'];

/* --------------------------------------------------------------------------
   Sectors — used on the home page as a quick "is this for me?" scan
   -------------------------------------------------------------------------- */
const SECTORS = [
    { icon: 'tower', name: 'Offices & multi-tenant buildings' },
    { icon: 'factory', name: 'Plants & industrial facilities' },
    { icon: 'box', name: 'Warehouses & distribution' },
    { icon: 'cross', name: 'Medical & dental practices' },
    { icon: 'school', name: 'Schools & campuses' },
    { icon: 'dumbbell', name: 'Gyms & fitness studios' },
    { icon: 'store', name: 'Retail & showrooms' },
    { icon: 'hardhat', name: 'Construction & fit-out' }
];

/* --------------------------------------------------------------------------
   Areas — Chicago and the western suburbs
   -------------------------------------------------------------------------- */
const CITIES = [
    {
        slug: 'chicago',
        name: 'Chicago',
        county: 'Cook County',
        intro:
            'Downtown towers, River North and West Loop offices, industrial space along the south and west corridors, and everything in between.',
        detail:
            'City work is mostly multi-tenant office buildings and industrial units, both of which run on access and timing more than anything else. We work to building engineering rules, loading dock windows and freight elevator bookings, and our crews are badged and supervised.',
        focus: ['Multi-tenant office towers', 'West Loop and River North offices', 'Industrial and flex space', 'Medical and dental practices', 'Retail and showroom floors'],
        nearby: ['Oak Park', 'Cicero', 'Evanston', 'Berwyn']
    },
    {
        slug: 'naperville',
        name: 'Naperville',
        county: 'DuPage & Will County',
        intro:
            'One of the largest concentrations of corporate office and research space in the western suburbs, plus a dense professional and medical sector.',
        detail:
            'Naperville work skews toward corporate offices and medical practices — buildings where the cleaning has to be invisible and the reporting has to be legible. Most of it runs overnight on a scheduled program.',
        focus: ['Corporate offices and campuses', 'Medical and dental suites', 'Research and light industrial', 'Schools and training centres', 'Retail along Route 59'],
        nearby: ['Aurora', 'Warrenville', 'Lisle', 'Wheaton']
    },
    {
        slug: 'oak-brook',
        name: 'Oak Brook',
        county: 'DuPage County',
        intro:
            'Corporate headquarters, professional offices and high-end retail clustered around the I-88 and Route 83 corridors.',
        detail:
            'Oak Brook is head-office territory, which means visible reception areas, glass, and floors that are judged by visitors rather than staff. Window cleaning and hard floor care make up a large share of what we do here.',
        focus: ['Corporate headquarters', 'Professional and legal offices', 'High-end retail and showrooms', 'Hotel and conference space', 'Medical practices'],
        nearby: ['Oakbrook Terrace', 'Hinsdale', 'Elmhurst', 'Downers Grove']
    },
    {
        slug: 'downers-grove',
        name: 'Downers Grove',
        county: 'DuPage County',
        intro:
            'A mix of corporate offices along Butterfield Road, light industrial and flex units, and a busy medical and professional sector.',
        detail:
            'The mix here is broad, so most Downers Grove clients take more than one program — a nightly janitorial contract with periodic floor care and window cleaning scheduled on top of it.',
        focus: ['Butterfield Road corporate offices', 'Light industrial and flex units', 'Medical and outpatient facilities', 'Schools and community buildings', 'Retail and restaurants'],
        nearby: ['Lisle', 'Westmont', 'Woodridge', 'Lombard']
    },
    {
        slug: 'elmhurst',
        name: 'Elmhurst',
        county: 'DuPage County',
        intro:
            'Professional offices and medical practices around the hospital district, with industrial and warehouse space toward the north and east.',
        detail:
            'Elmhurst splits neatly between clinical and industrial work — medical suites needing a documented protocol, and warehouse space needing machine scrubbing. We run both from the same schedule.',
        focus: ['Medical and outpatient practices', 'Professional and legal offices', 'Warehouse and distribution units', 'Schools and college buildings', 'Downtown retail'],
        nearby: ['Villa Park', 'Lombard', 'Addison', 'Oakbrook Terrace']
    },
    {
        slug: 'schaumburg',
        name: 'Schaumburg',
        county: 'Cook County',
        intro:
            'Large office parks, corporate campuses and one of the region’s biggest retail concentrations, plus substantial industrial space.',
        detail:
            'Schaumburg is office-park scale, so the work is volume work — large floor plates, long corridors, a lot of glass and a lot of restrooms. Machine floor care and a properly sized crew matter more here than anywhere else we cover.',
        focus: ['Office parks and corporate campuses', 'Retail and shopping centres', 'Industrial and distribution units', 'Hotels and conference facilities', 'Medical and dental suites'],
        nearby: ['Hoffman Estates', 'Elk Grove Village', 'Roselle', 'Itasca']
    }
];

/* --------------------------------------------------------------------------
   Why us
   -------------------------------------------------------------------------- */
const REASONS = [
    {
        icon: 'clipboard',
        title: 'A written scope, and inspections against it',
        body:
            'You get a room-by-room scope with a frequency against every task before the first visit, and an inspection report after each one. Most complaints about cleaning are really complaints about an undefined scope.'
    },
    {
        icon: 'users',
        title: 'The same supervised crew',
        body:
            'An assigned team who learn your building, your access rules and which areas are off-limits when. Supervised on site, not managed from a phone three suburbs away.'
    },
    {
        icon: 'shield',
        title: 'Insured, background-checked, badged',
        body:
            'Every cleaner is vetted and background-checked before they hold a key or a badge, and the company carries liability and workers compensation cover. Certificates on request, before you sign anything.'
    },
    {
        icon: 'leaf',
        title: 'Green cleaning as the default',
        body:
            'Third-party certified low-toxicity products, microfibre systems and HEPA filtration as standard rather than as a paid upgrade. Safety data sheets for anything we bring on site.'
    },
    {
        icon: 'clock',
        title: 'Nights, weekends, holidays — no premium',
        body:
            'Commercial work is scheduled around your operation, not ours. Out-of-hours crews carry no surcharge on a contract, because cleaning around people costs you more than it costs us.'
    },
    {
        icon: 'check',
        title: 'Redone free if it is missed',
        body:
            'Report anything within 24 hours of a visit and the crew comes back and puts it right at no charge. No credit note to chase and no argument about what the scope said.'
    }
];

/* --------------------------------------------------------------------------
   Process
   -------------------------------------------------------------------------- */
const PROCESS = [
    { num: '01', title: 'Walk the site', body: 'We visit, measure and look at your actual floors, glass and surfaces. No square-footage guess over the phone.' },
    { num: '02', title: 'Scope and fixed price', body: 'You get a written scope with a frequency against each task and a fixed price per visit. Nothing is billed that is not on that sheet.' },
    { num: '03', title: 'Crew assigned and inducted', body: 'A named crew and supervisor are assigned, inducted to your site rules, badged and issued access.' },
    { num: '04', title: 'Clean, inspect, report', body: 'The crew works the scope and a supervisor inspects against it. You get the report, not just the invoice.' },
    { num: '05', title: 'Review and adjust', body: 'After the first month we review what the building actually needs and re-tune frequencies. Buildings change; scopes should too.' }
];

/* --------------------------------------------------------------------------
   Testimonials
   Deliberately empty. Publishing invented testimonials for a real business
   breaks the FTC rule on fake endorsements (16 CFR Part 465), so the page
   renders an honest empty state until genuine ones are supplied.
   Format:
     { name: 'First name L.', role: 'Facilities Manager', company: 'Sector, town',
       stars: 5, body: 'Their actual words, with permission to publish.' }
   -------------------------------------------------------------------------- */
const TESTIMONIALS = [];

/* --------------------------------------------------------------------------
   FAQs
   -------------------------------------------------------------------------- */
const FAQS = [
    {
        q: 'What areas do you cover?',
        a: 'Chicago and the western suburbs — Naperville, Oak Brook, Downers Grove, Elmhurst and Schaumburg, plus the towns around them. If you are just outside that, call anyway; routes flex more often than people expect.'
    },
    {
        q: 'Do you only work with businesses?',
        a: 'Yes. Everything we do is commercial, industrial or institutional — offices, plants, warehouses, medical practices, schools and gyms. We are not set up for domestic housekeeping, and a company built for one is rarely good at the other.'
    },
    {
        q: 'How is pricing worked out?',
        a: 'A fixed price per visit, set after a site walk. It depends on square footage, floor types, restroom count, frequency and how much periodic work sits on top of the daily program. We do not quote a final number over the phone, because that is how buildings end up with surprise invoices in month three.'
    },
    {
        q: 'Can you work outside business hours?',
        a: 'Yes, and for most commercial sites we prefer it. Nights, early mornings, weekends and holidays are standard on contract work and carry no out-of-hours premium.'
    },
    {
        q: 'Are you insured, and can you provide certificates?',
        a: 'Yes. The company carries general liability and workers compensation cover, and every cleaner is background-checked before they are issued a badge or a key. We send certificates of insurance before you sign anything, and we can be named as additional insured where your lease requires it.'
    },
    {
        q: 'What does "green cleaning" actually mean here?',
        a: 'Third-party certified low-toxicity products, microfibre systems that cut chemical and water use, and HEPA-filtered vacuums so soil lifted off the floor does not end up in the air. It is our default rather than a paid upgrade, and we will supply safety data sheets for anything we bring on site.'
    },
    {
        q: 'How long does commercial carpet cleaning take to dry?',
        a: 'Hot water extraction is typically dry in four to eight hours with reasonable airflow, so it is usually done overnight. Where a floor cannot be out of service that long we use a low-moisture method that is walkable in two to four hours.'
    },
    {
        q: 'Do you handle post-construction cleaning in stages?',
        a: 'Yes — rough, final and touch-up. Construction dust is fine enough to keep settling after the first pass, so a single clean before handover never holds. We schedule the three stages around your debris clearance, handover and punch-list dates.'
    },
    {
        q: 'Who supplies equipment and consumables?',
        a: 'We bring all equipment, machines and cleaning products, and that is included in the price. Restroom consumables — paper, soap, liners — can be managed by us and billed at cost, or left with you, whichever you prefer.'
    },
    {
        q: 'What happens if something gets missed?',
        a: 'Report it within 24 hours of the visit and the crew returns to redo it at no charge. Supervisors also inspect against the scope after each visit, so most misses are caught before you see them.'
    },
    {
        q: 'Is there a long contract?',
        a: 'One-off and project work — post-construction, spring cleans, floor restoration — has no contract at all. Ongoing janitorial runs monthly with 30 days notice either way. We do not use lock-in terms; if the service is not worth keeping, a long contract will not fix that.'
    },
    {
        q: 'How quickly can you start?',
        a: 'A site walk usually happens within a couple of working days, and a written scope follows within about two. Most ongoing contracts start inside a week; project and emergency work can often be covered sooner.'
    }
];

module.exports = {
    BUSINESS,
    STATS,
    NAV,
    SERVICES,
    SERVICE_GROUPS,
    SECTORS,
    CITIES,
    REASONS,
    PROCESS,
    TESTIMONIALS,
    FAQS
};
