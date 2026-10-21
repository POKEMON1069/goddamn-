/**
 * All site copy and content lives here.
 *
 * Everything about "Nila Raghunathan" is invented for this template and is
 * marked `placeholder: true` below. Replace the name, the studio details, the
 * projects and the outcomes with real ones before the site goes live.
 * Images are original generated still lifes, also placeholders.
 */

export const placeholder = true;

export const site = {
  name: "Nila Raghunathan",
  role: "Independent designer and developer",
  city: "Chennai, India",
  timeZone: "Asia/Kolkata",
  email: "studio@nilapress.example",
  title: "Nila Raghunathan · Designer and developer in Chennai",
  description:
    "Nila Raghunathan designs and builds identities, interfaces and print for small teams. Based in Chennai, working with people who care how a thing feels in the hand.",
  url: "https://nilapress.example",
  availability: "Taking two projects from January",
  social: [
    { label: "Instagram", href: "https://instagram.com", handle: "@nila.set" },
    { label: "Are.na", href: "https://are.na", handle: "nila-raghunathan" },
    { label: "GitHub", href: "https://github.com", handle: "nilaraghunathan" },
  ],
  colophon:
    "Set in Archivo and JetBrains Mono, self-hosted. Built with Next.js, GSAP and Lenis. Stills generated for this template; they are placeholders, not client work.",
  disclosure:
    "Nila Raghunathan is a fictional persona built as a portfolio demo. Projects, clients and numbers are placeholders.",
};

export type NavItem = { label: string; href: string; index: string };

export const nav: NavItem[] = [
  { label: "Work", href: "/work", index: "01" },
  { label: "About", href: "/about", index: "02" },
  { label: "Contact", href: "/contact", index: "03" },
];

export const hero = {
  kicker: "Designer and developer, Chennai",
  lines: ["Set it well.", "Press it once."],
  lede: "I'm Nila. I make websites, identities and print for small teams who care how a thing feels in the hand, not just how it looks on a screen.",
  primary: { label: "See the work", href: "/work" },
  secondary: { label: "Start a project", href: "/contact" },
  image: {
    src: "hero-press",
    alt: "A sheet of ivory cotton paper curled through the rollers of a letterpress, with a single vermilion ink smudge at its lower edge.",
    caption: "Sheet 01, test pull. Cotton, 240 gsm. The smudge stayed.",
  },
  meta: [
    { label: "Based", value: "Chennai, IST" },
    { label: "Focus", value: "Identity, web, print" },
    { label: "Status", value: "Two slots, Jan" },
  ],
};

export type Project = {
  slug: string;
  title: string;
  standfirst: string;
  year: string;
  client: string;
  sector: string;
  disciplines: string[];
  role: string;
  cover: string;
  coverAlt: string;
  coverAspect: string;
  summary: string;
  brief: string;
  approach: { title: string; body: string }[];
  outcome: string;
  facts: { label: string; value: string }[];
  gallery: { src: string; alt: string; caption: string }[];
  next: string;
  accentNote: string;
};

export const projects: Project[] = [
  {
    slug: "verdant-seed-library",
    title: "Verdant Seed Library",
    standfirst:
      "A seed lending library needed a catalogue you could read in a field, on a phone, with cold hands.",
    year: "2025",
    client: "Verdant, Chennai",
    sector: "Horticulture, community",
    disciplines: ["Identity", "Web", "Catalogue"],
    role: "Art direction, interface design, front end",
    cover: "verdant-cover",
    coverAlt:
      "Pressed fern fronds, seed pods and a red thread arranged on ivory paper on a black table.",
    coverAspect: "1408 / 768",
    summary:
      "Four hundred and twelve seed varieties, each with its own sowing window, now living in a catalogue that works in a browser offline.",
    brief:
      "Verdant lends seed to home growers across Tamil Nadu. Their catalogue existed as a spreadsheet, three notebooks and one very patient volunteer. Members were ringing the office to ask what to sow this month, and the answers were in a different room.",
    approach: [
      {
        title: "One page per variety, sized to a thumb",
        body: "Each variety gets a single screen: sowing months as a strip of coloured ticks, days to harvest, and a photograph of the actual seed. No accordion, no tabs. The whole card is one scroll-free screen at 390 px.",
      },
      {
        title: "A calendar, not a search box",
        body: "Most visitors arrive with one question: what can I sow now? The catalogue opens on the current month and marks every variety that will take seed this week. Search is there for people who already know what they want.",
      },
      {
        title: "Print as the fallback, not the afterthought",
        body: "The library still posts a folded card to members without a phone. The same data sets it, at A5, four varieties to a side, with the same colour ticks as the screen.",
      },
    ],
    outcome:
      "The library now updates the catalogue from a single file, and the volunteer who used to answer the phone spends that hour in the seed room instead.",
    facts: [
      { label: "Varieties", value: "412" },
      { label: "Fields per variety", value: "9" },
      { label: "Shipped", value: "8 weeks" },
    ],
    gallery: [
      {
        src: "verdant-detail",
        alt: "Open seed catalogue drawer with rows of blank ivory paper packets and one red divider tab.",
        caption: "The drawer the catalogue was designed to replace.",
      },
    ],
    next: "tally",
    accentNote: "Sowing ticks, four seasons, no legend to learn.",
  },
  {
    slug: "tally",
    title: "Tally",
    standfirst:
      "Invoices small enough to send from a phone, and receipts that remember what they were for.",
    year: "2024",
    client: "Tally (independent product)",
    sector: "Software, finance",
    disciplines: ["Product design", "Web", "Design system"],
    role: "Product design, identity, front end",
    cover: "tally-cover",
    coverAlt:
      "A neat stack of narrow blank paper receipts beside a brass ruler and a red wax pencil on a black surface.",
    coverAspect: "1408 / 768",
    summary:
      "A bookkeeping tool for people who do not want to be bookkeepers. Three screens, one number, and an export their accountant can actually read.",
    brief:
      "Freelancers in the Tally pilot were photographing receipts into three apps and reconciling them once a quarter, usually the night before a filing. The product had every feature a finance team wanted and no room for a person with a camera roll.",
    approach: [
      {
        title: "The amount comes first",
        body: "Opening Tally shows one figure: what is owed to you and what you owe. Everything else is a tap away. The number is set in tabular figures at display size, so it reads without being interpreted.",
      },
      {
        title: "Receipts as objects, not attachments",
        body: "A receipt keeps its photograph, its vendor, its date and its tax line on one card. Filing is dragging one card onto one category, and the card never leaves the screen while it happens.",
      },
      {
        title: "An export the accountant recognises",
        body: "The CSV follows the format the pilot group's accountants already used, column for column. The product bends to the paperwork that exists, not the other way round.",
      },
    ],
    outcome:
      "Pilot users closed their books in a median of 22 minutes per quarter, down from the evening the interviews described.",
    facts: [
      { label: "Pilot users", value: "38" },
      { label: "Screens", value: "3" },
      { label: "Median close", value: "22 min" },
    ],
    gallery: [
      {
        src: "tally-detail",
        alt: "An open ledger with blank ivory pages and one thin vermilion line crossing the spread, a pen in the gutter.",
        caption: "Ledger studies for the export sheet.",
      },
    ],
    next: "nightshift",
    accentNote: "Tabular figures, zero decoration on the number.",
  },
  {
    slug: "nightshift",
    title: "Nightshift Radio",
    standfirst:
      "Fourteen hundred hours of community radio tapes, given a listening room instead of a spreadsheet.",
    year: "2024",
    client: "Nightshift Archive, Kochi",
    sector: "Culture, archive",
    disciplines: ["Web", "Interaction", "Type"],
    role: "Design, front end, catalogue structure",
    cover: "nightshift-cover",
    coverAlt:
      "Macro photograph of a vintage speaker grille in a dark room with dust in a hard beam of light and a small red circle painted on it.",
    coverAspect: "1376 / 768",
    summary:
      "An archive of a late-night radio station, playable without an account, searchable by voice, weather and whatever the host was reading that week.",
    brief:
      "For eleven years Nightshift broadcast between midnight and four, then stopped. The tapes survived in a cupboard. The volunteers had a hard drive, a filing convention only two people understood, and no budget for a streaming platform.",
    approach: [
      {
        title: "The tape is the navigation",
        body: "Each broadcast is drawn as a horizontal band whose height follows the audio level of that minute. Listeners scrub by shape before they read a single description.",
      },
      {
        title: "Metadata people actually remember",
        body: "Nobody remembers an episode number. They remember the rain, the host, the year, the song that kept cutting out. Those are the four search axes, and each one is a real field the volunteers could fill from the tape labels.",
      },
      {
        title: "Built to be left running",
        body: "The player is a footer that persists across the archive, keeps its place, and needs no account. On a slow connection it streams a 96 kbps mono file, which is what the source material deserves.",
      },
    ],
    outcome:
      "The archive opened with 1,400 hours online and a listening room in Kochi that runs the same interface on a wall screen.",
    facts: [
      { label: "Hours digitised", value: "1,400" },
      { label: "Tape labels parsed", value: "2,900" },
      { label: "Stream bitrate", value: "96 kbps" },
    ],
    gallery: [
      {
        src: "nightshift-detail",
        alt: "Two open reel-to-reel tape spools on a black surface, one hub marked with a red dot.",
        caption: "Tape labels, read and transcribed before anything was uploaded.",
      },
    ],
    next: "kiln",
    accentNote: "One persistent player, no account, no autoplay.",
  },
  {
    slug: "kiln",
    title: "Kiln",
    standfirst:
      "A pottery studio's shop and class list, built so a wet-handed person can book with one thumb.",
    year: "2023",
    client: "Kiln Studio, Bengaluru",
    sector: "Craft, retail",
    disciplines: ["Identity", "Commerce", "Web"],
    role: "Identity, design, front end",
    cover: "kiln-cover",
    coverAlt:
      "An unglazed bone-white ceramic vessel on a black surface, hard light revealing throwing rings and a hairline crack mended with red thread.",
    coverAspect: "928 / 1152",
    summary:
      "Sixty pots at a time, six wheels, and a booking flow that takes four taps while your hands are still clay.",
    brief:
      "Kiln sells out of every class within an hour of announcing it, mostly to people who then cannot make the date. The studio wanted a shop that did not look like a shop, and a booking flow that did not punish a person standing at a sink.",
    approach: [
      {
        title: "Photograph the object, not the room",
        body: "Every pot is shot on the same black cloth with one hard light, so the glaze is the only variable. The grid is three across on a phone and never crops a rim.",
      },
      {
        title: "Four taps, one hand",
        body: "Class, date, name, pay. Fields accept a thumb-sized target, keep their values when a payment fails, and hold a place for four minutes rather than the usual ten.",
      },
      {
        title: "A mark that survives a stamp",
        body: "The identity is one letterform and one red line, drawn so it can be pressed into a wet base with a wooden tool. It appears at 12 px in the footer and 40 cm on the studio wall.",
      },
    ],
    outcome:
      "The studio reports fewer no-shows and a shop that sells out without a mailing-list scramble.",
    facts: [
      { label: "Pots per drop", value: "60" },
      { label: "Booking taps", value: "4" },
      { label: "Hold window", value: "4 min" },
    ],
    gallery: [
      {
        src: "kiln-detail",
        alt: "Three bone-white unglazed cups and a stack of blank packing slips tied with red thread on a black bench.",
        caption: "Packing slips and cups, tested at the studio bench.",
      },
    ],
    next: "verdant-seed-library",
    accentNote: "One letterform, one red line, repeatable by hand.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getNextProject = (p: Project) => getProject(p.next) ?? projects[0];

export const principles = {
  label: "How I work",
  heading: "Three passes, every time.",
  intro:
    "The press does not care how good the idea was. It cares whether the sheet was set, inked and checked. I work in the same order.",
  chapters: [
    {
      mark: "Set",
      title: "Set it at the size it will ship.",
      body: "Type, grid and spacing decided in the browser at 390 px and 1440 px, never in a mockup at a size nobody will see. If the layout cannot survive fourteen pixels, it is not a layout yet.",
      note: "Week one: structure, type scale, one honest page.",
    },
    {
      mark: "Press",
      title: "Build the thing I designed.",
      body: "I write the front end, which means the spacing you approve is the spacing that ships. Motion, states and empty states get the same attention as the hero, because that is where people actually live.",
      note: "Weeks two to five: build, motion, content.",
    },
    {
      mark: "Check",
      title: "Proof it like it is going to a client.",
      body: "Every build gets a throttled phone, a keyboard-only pass, a reduced-motion pass and a slow connection. Then I fix what the proof shows, and we sign the sheet.",
      note: "Last week: accessibility, performance, handover.",
    },
  ],
  images: [
    {
      src: "desk-typesorts",
      alt: "Letterpress type sorts scattered on a black desk with a brass loupe and a red pencil.",
    },
    {
      src: "verdant-detail",
      alt: "Rows of blank paper seed packets in a wooden drawer, one red divider tab.",
    },
    {
      src: "kiln-cover",
      alt: "A bone-white ceramic vessel on black cloth, lit hard from the right.",
    },
  ],
};

export const about = {
  label: "About",
  heading: "Nine years of setting type and shipping code.",
  paragraphs: [
    "I started in a print shop in Mylapore, setting wedding invitations and learning that a millimetre is a real distance. I moved to screens in 2018 and kept the habit: measure, proof, then print.",
    "I work alone, with a small circle of photographers, writers and engineers when a project needs them. Clients are usually between two and thirty people, and usually have one thing they care about more than the rest. That thing becomes the site.",
    "I take two projects at a time so I can be the person who answers the email. If we work together you will hear from me directly, not an account manager.",
  ],
  facts: [
    { label: "Practice", value: "Independent since 2019" },
    { label: "Based", value: "Chennai, India" },
    { label: "Works in", value: "English, Tamil" },
    { label: "Studio", value: "One person, plus a bench" },
  ],
  services: [
    {
      title: "Identity and type",
      body: "A mark that survives a stamp, a typeface choice with a reason, and a small set of rules anyone can follow without a brand manual the size of a novel.",
    },
    {
      title: "Websites",
      body: "Design and front end in one pair of hands. Next.js or static, depending on the content, with motion that explains rather than decorates.",
    },
    {
      title: "Print and objects",
      body: "Catalogues, cards and labels set on real stock with the printer on the phone. Usually the piece people keep.",
    },
  ],
  process: [
    { label: "First call", value: "30 minutes, no deck" },
    { label: "Proposal", value: "Scope, dates, one price" },
    { label: "Weekly", value: "A live link, every Friday" },
    { label: "Handover", value: "Files, code, and a walkthrough" },
  ],
  image: {
    src: "desk-typesorts",
    alt: "Letterpress type sorts, a brass loupe and a red pencil on a black work surface.",
    caption: "The bench, mid-project.",
  },
};

export const contact = {
  label: "Contact",
  heading: "Tell me what you are making.",
  lede: "A short note is enough: what it is, who it is for, and roughly when you need it. I answer within two working days, and I will say no quickly if it is not a fit.",
  details: [
    { label: "Email", value: "studio@nilapress.example", href: "mailto:studio@nilapress.example" },
    { label: "Based", value: "Chennai, India (IST)" },
    { label: "Hours", value: "Mon to Thu, 10:00 to 18:00" },
    { label: "Availability", value: "Two projects from January" },
  ],
  budgets: ["Under 2 lakh", "2 to 5 lakh", "5 to 10 lakh", "Not sure yet"],
  kinds: ["Identity", "Website", "Print", "Something else"],
};

export const faq = [
  {
    q: "Do you work with clients outside India?",
    a: "Yes. About half the work is remote, mostly with teams in Berlin and Singapore. I keep two hours of overlap with European mornings and can shift for a launch week.",
  },
  {
    q: "Who writes the copy?",
    a: "I write the first draft from our interviews, then a copy editor I trust reads it. If you have a writer, even better, and I will build around their words.",
  },
  {
    q: "What do you need from me to start?",
    a: "A conversation, whatever assets exist, and one person who can approve things. Projects stall when approval is a committee of five.",
  },
  {
    q: "Can you work with our existing developers?",
    a: "Often. I can design and hand over a documented system, or build the front end and pair with your team on the integration.",
  },
];
