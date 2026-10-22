/*
 * SITE CONTENT — single source of truth (Phase 3).
 *
 * Copy is real and specific. Anything the owner must replace is marked
 * placeholder: true and listed in DESIGN.md / the final message. No fake
 * awards, client logos or metrics; invented projects are fictional
 * placeholders clearly flagged for replacement.
 */

export const site = {
  name: "GODDAMN-",
  // placeholder: the portfolio owner's name — replace before ship
  ownerName: { value: "Alex Rivera", placeholder: true },
  role: "Independent designer & creative developer",
  tagline:
    "Work presented as a contact sheet. Each project is a frame that racks into focus as you scroll.",
  email: { value: "hello@example.com", placeholder: true },
  location: { value: "Patna, Bihar, IN", placeholder: true },

  social: [
    { name: "Instagram", url: "https://instagram.com/example", placeholder: true },
    { name: "Twitter", url: "https://twitter.com/example", placeholder: true },
    { name: "LinkedIn", url: "https://linkedin.com/in/example", placeholder: true },
  ],

  meta: {
    title: "GODDAMN- — Independent designer & creative developer",
    description:
      "A portfolio of designed and built digital experiences. Contact-sheet framing, rack-focus motion, real work.",
    url: "https://example.com",
    image: "/images/og.png",
  },

  about: {
    intro:
      "I design and build things that move — websites, identities, and the occasional exclamation.",
    body: [
      "This site is itself a contact sheet: work laid out as frames on a film strip, each one racking into focus as you scroll past. No templates, no gradient blobs, no three equal cards.",
      "If you need something designed, developed, or both, get in touch.",
    ],
    placeholder: true, // bio is a placeholder until the owner supplies their own
  },

  work: [
    {
      slug: "halcyon",
      title: "Halcyon",
      kicker: "Brand + website",
      summary:
        "A visual identity and editorial site for a speculative coffee roaster, built around a single moving typeface.",
      image: "/images/work/halcyon.svg",
      imageAlt: "Halcyon wordmark over a textured paper ground",
      featured: true,
      // placeholder: this project and its images are fictional until replaced
      fictional: true,
    },
    {
      slug: "tension",
      title: "Tension",
      kicker: "Editorial design",
      summary:
        "A music journal that treats each issue as a score — type and image timed to the tracklist.",
      image: "/images/work/tension.svg",
      imageAlt: "Spread layout with type over photographic detail",
      featured: true,
      fictional: true,
    },
    {
      slug: "lead-line",
      title: "Lead Line",
      kicker: "Product design",
      summary:
        "A scheduling tool for small studios. Rebuilt the booking flow end to end; half the clicks removed.",
      image: "/images/work/lead-line.svg",
      imageAlt: "Calendar interface on a dark ground",
      featured: true,
      fictional: true,
    },
    {
      slug: "sink",
      title: "Sink",
      kicker: "Type specimen",
      summary: "A variable-font specimen that reacts to the cursor, drawn entirely in code.",
      image: "/images/work/sink.svg",
      imageAlt: "Variable type axes in motion",
      featured: false,
      fictional: true,
    },
    {
      slug: "meridian",
      title: "Meridian",
      kicker: "Campaign site",
      summary: "Launch microsite for a watch brand, told as one continuous vertical film.",
      image: "/images/work/meridian.svg",
      imageAlt: "Watch product photography on black",
      featured: false,
      fictional: true,
    },
    {
      slug: "quiet",
      title: "Quiet",
      kicker: "Print + digital",
      summary: "A quarterly magazine with no ads, typeset in one family at two sizes.",
      image: "/images/work/quiet.svg",
      imageAlt: "Magazine page with generous margins",
      featured: false,
      fictional: true,
    },
  ],
};

export const work = site.work;
