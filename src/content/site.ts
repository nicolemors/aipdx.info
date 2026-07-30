export const links = {
  meetup: "https://www.meetup.com/ai-portland/",
  linkedinCompany: "https://www.linkedin.com/company/ai-portland/",
  linkedinGroup: "https://www.linkedin.com/groups/14375111/",
  podcastYoutube: "https://www.youtube.com/@AIPortlandOrganizers",
  newsletter: "http://eepurl.com/iJv5O6",
  contactEmail: "aipdx.info@gmail.com",
};

// Primary site sections, shown in the header — order and labels match the
// Figma nav ("Stories, Events, Podcast, Partners, About"). "Partners" points
// to the community-partnerships page (/partners), not Sponsorship —
// Sponsorship is footer-only (see footerLinks) so the two don't collide.
export const nav = [
  { href: "/stories", label: "Stories" },
  { href: "/events", label: "Events" },
  { href: "/podcast", label: "Podcast" },
  { href: "/partners", label: "Partners" },
  { href: "/about", label: "About" },
];

// Footer-only per the site map, to avoid duplicating links between header
// and footer. Speaking was dropped from the header nav to match Figma, but
// is kept here rather than made unreachable — flag if Speaking should live
// somewhere else instead.
export const footerLinks = [
  { href: "/speaking", label: "Speaking" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/code-of-conduct", label: "Code of Conduct" },
  { href: "/contact", label: "Contact" },
];

export const home = {
  // Matches the current Figma hero headline (node 292:57).
  heroLead: "Portland-grown,\nhuman-centered AI.",
  missionTitle: "AI Portland Mission",
  missionBody: [
    "AI Portland exists to help people show up for one of the most important technological and cultural shifts of our lifetime, together.",
    "We're building a community for the curious, bringing together artists, technologists, founders, educators, researchers, and neighbors to explore how AI is shaping our work, creativity, and future.",
    "Through conversations, events, stories, and our podcast, we're documenting this moment as it unfolds and helping Portland write its next chapter.",
  ],
  podcastEyebrow: "It's here!",
  podcastTitle: "(Super)charged by AI",
  podcastSubtitle: "A podcast",
  podcastBody:
    "We are excited to announce our new podcast and are ecstatic to bring more conversation to the AI community.",
  sponsorshipTeaser:
    "Step into the forefront of innovation and community engagement by sponsoring AI Portland. Your support directly contributes to a vibrant ecosystem of cutting-edge workshops, enriching talks, and valuable networking opportunities that propel the AI conversation forward. Connect with us and play a pivotal role in a space where technology meets collaboration.",
};

// Pillar titles/body copy stay here; actual partner orgs (name/logo/link) are
// pulled from the Notion Partners database (see src/lib/notion/partners.ts)
// and shown as one flat list below the pillars — same pattern as Sponsors.
export const partners = {
  eyebrow: "Friends of AI Portland",
  title: "Our Partners",
  intro:
    "AI Portland exists because of the venues, organizations, and fellow communities across Portland who show up for us again and again — lending space, cross-promoting events, and helping us reach people who'd otherwise never find their way into the room.",
  pillars: [
    {
      title: "Venue Partners",
      body: "Local spaces that open their doors for our meetups, workshops, and talks — often going out of their way to make a room feel like ours for the night.",
    },
    {
      title: "Community Partners",
      body: "Other Portland meetups, guilds, and interest groups we cross-promote with and borrow ideas from, because no single community can cover everything AI touches.",
    },
    {
      title: "Organizational Partners",
      body: "Companies and institutions that support what we do beyond a single event — through sponsorship, volunteer time, or simply believing in what a monthly meetup can build.",
    },
  ],
  cta: "Want to partner with us?",
};

// Synced from the "AIPDX - Sponsor Deck - 2025.pdf" — values, metrics, and
// tiers below all mirror that deck's copy and numbers. Update both together
// if the deck changes.
export const sponsorship = {
  intro:
    "Step into the forefront of innovation and community engagement by sponsoring AI Portland. Your support directly contributes to a vibrant ecosystem where AI enthusiasts, professionals, and newcomers alike can thrive. Through your sponsorship, we can continue to offer cutting-edge workshops, enriching talks, and valuable networking opportunities that propel the AI conversation forward. Collaborate with AI Portland and play a pivotal role in nurturing a space where technology meets collaboration, and where everyone can leverage the transformative power of AI.",
  values: [
    {
      title: "Brand Awareness",
      body: "By gaining prominent visibility at AI Portland events and through our partnerships and marketing channels, you can significantly enhance your brand recognition within the AI community and beyond. This exposure positions your brand in front of an engaged audience, driving awareness and interest in your products or services.",
    },
    {
      title: "Access to our Network",
      body: "Sponsorship grants you access to our extensive network of local AI influencers, thought leaders, and innovators. By engaging with these key players, you can foster valuable collaborations, expand your reach, and enhance your brand's credibility, ultimately positioning yourself to win new customers within the AI community.",
    },
    {
      title: "Thought Leadership",
      body: "Sponsorship positions you as a key player in the AI community, allowing you to showcase your expertise through AI Portland speaking engagements, workshops, and collaborative content. This not only enhances your brand's visibility but also builds trust and credibility, helping you attract and retain customers.",
    },
  ],
  metrics: [
    { value: "2,700+", label: "members", detail: "Nearly double 2024 — all active within the last year" },
    { value: "35", label: "events", detail: "...and counting, with an average event rating of 4.7+ out of 5 stars" },
    { value: "4,146", label: "event RSVPs", detail: "Across events" },
    { value: "118", label: "average RSVPs", detail: "Per event, up from 65 in 2024" },
    { value: "790", label: "repeat attendees", detail: "At monthly events, including local leaders and innovators" },
  ],
  tiers: [
    {
      name: "Event",
      price: "$500",
      cadence: "per event",
      perks: [
        "Logo and link on the event page, and the AI Portland website",
        "Logo, link, and promo copy in all event related communications",
        "Slide in the event presentation and materials",
        "Opportunity to give a short plug at the event",
      ],
      cta: "Contact AI Portland to Sponsor an event",
    },
    {
      name: "Annual",
      price: "$5,000",
      cadence: "per year",
      perks: [
        "Logo and link on all event pages and event related communications for a year",
        "Logo and link on the homepage of the AI Portland website",
        "Slide in all event presentations and materials for a year",
        "Opportunity to give a short plug at any event",
        "Opportunity to have a table at any event",
      ],
      cta: "Contact AI Portland to become an Annual Sponsor",
    },
    {
      name: "Choose Your Own Adventure",
      price: "You tell us",
      cadence: null,
      body: "Are you working with a budget or have a specific idea of what sponsorship with AI Portland could look like? We'd love to collaborate with you. We have ideas!",
      cta: "Let's talk",
    },
  ],
};

export const upcomingEvent = {
  badge: "Next Upcoming Event",
  title: "Join us live in Portland",
};

export const podcast = {
  eyebrow: "(Super)charged by AI",
  title: "The AI Portland Podcast",
  intro:
    "Conversations with the people building, questioning, and living alongside AI — recorded live from the Portland community.",
};

export const speaking = {
  intro:
    "Nicole and Megan offer a diverse range of public speaking engagements designed to inform, inspire, and ignite interest in the field of artificial intelligence.",
  cta: "Contact for booking inquiries",
  galleryCaption: "On stage at Silicon Forest Summit",
};

// Discriminated union so the About page can render short staccato "lines"
// blocks (tight-set, no paragraph spacing) distinctly from normal paragraphs
// and section headings — the source copy's own rhythm depends on that.
export type StoryBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "lines"; lines: string[] }
  | { type: "quote"; text: string };

export const about = {
  // Split before the emphasized word so the About hero can bold "together"
  // without string-parsing this at render time — see about/page.tsx.
  ledeBeforeEmphasis: "AI Portland exists to help people show up for one of the most important technological and cultural shifts of our lifetime, ",
  // Two-column layout matching Figma "about-page-redesign" hero-grid (node
  // 843:40) — condensed manifesto statement + supporting image card, instead
  // of the flowing prose this used to open with (see `story` below).
  manifesto: {
    eyebrow: "Our Mission",
    headlineBeforeEmphasis: "We believe moments like this deserve to be experienced together.",
    body: "Artificial intelligence is changing how we create, work, learn, communicate, and imagine what's possible. These moments don't come around very often. They're exciting, uncertain, messy, and full of possibility.",
    visualImage: "/images/gallery/AIPDX_feb2025-9528.jpg",
    visualQuoteTitle: "History is unfolding in real time.",
    visualQuoteBody:
      "Rather than watching it happen from behind our screens, we believe there's value in showing up—in the same room—to ask questions, challenge ideas, share perspectives, and imagine what's next.",
  },
  // Full-bleed background photo + solid card, matching Figma node 844:88 —
  // the site's own --color-ink is an exact match for the design's #1f1f1f
  // card background, so no new color was needed.
  communityCard: {
    heading: "More than an AI community.",
    intro:
      "We're a community for people navigating one of the most significant technological shifts of our generation.",
    highlights: [
      "Artists sit next to engineers.",
      "Founders meet educators.",
      "Researchers share ideas with designers.",
      "Students challenge executives.",
    ],
    closing: "Curiosity is the only prerequisite.",
    backgroundImage: "/images/gallery/AIPDX_Kiln_8142025-1313.jpg",
  },
  story: [
    {
      type: "paragraph",
      text: "Whether you're building AI products, experimenting with creative tools, leading organizational change, or simply wondering what all of this means, there's a place for you here.",
    },
  ] satisfies StoryBlock[],
  // Image + prose layout for the "Portland has something unique to
  // contribute" section — matches the mockup's two-column treatment (photo
  // left, text right), dropping the Silicon Valley/Seattle/New York
  // comparison lines that aren't part of that design.
  regional: {
    heading: "Portland has something unique to contribute.",
    image: "/images/hero-portland-sign.jpg",
    intro: "Every city approaches technology differently.",
    valuesIntro: "Portland has always been different.",
    values: ["We value creativity.", "Craft.", "Community.", "Curiosity.", "Human-centered design."],
    closing: "We believe those values matter as AI becomes part of everyday life.",
    finalBeforeEmphasis:
      "AI Portland exists to help cultivate that conversation—not just about what AI can do, but about ",
    finalEmphasis: "what kind of future we want to build together.",
  },
  ourStory: [
    { type: "paragraph", text: "Like many good ideas, AI Portland started with a conversation." },
    {
      type: "paragraph",
      text: "In late 2023, Nicole and Megan found themselves talking about AI almost every time they got together. One evening, over a bottle of wine, Nicole floated an idea:",
    },
    {
      type: "quote",
      text: "If we're this fascinated by what's happening, there have to be other people who want to talk about it too. We should start something, we should make a group, AI Portland.",
    },
    { type: "paragraph", text: "Megan's first response?" },
    { type: "quote", text: "Absolutely not. We're way too busy." },
    { type: "paragraph", text: "By the next day, she'd changed her mind." },
    {
      type: "paragraph",
      text: "What began as a single meetup has grown into a community of thousands, bringing together people from across Portland to explore one of the defining moments of our time.",
    },
    {
      type: "paragraph",
      text: "The conversations have expanded beyond our events into our podcast, stories, partnerships, and growing network—but the heart of AI Portland hasn't changed.",
    },
    { type: "paragraph", text: "It still begins with people gathering in a room, curious enough to ask:" },
    { type: "lines", lines: ["What's happening?", "What does it mean?", "Where do we go from here?"] },
    {
      type: "paragraph",
      text: "What started as a conversation between two friends has evolved into the largest tech organization in Portland.",
    },
  ] satisfies StoryBlock[],
  team: [
    {
      name: "Nicole Mors",
      bio: "Nicole is a designer who's endlessly curious about how technology shapes the way we create, work, and connect, and more importantly, what those changes mean to people and hopefully for people.\n\nBy day, she leads Product Design at Lithia & Driveway. She co-founded AI Portland to create the kind of conversations she wanted to be part of. Through events, storytelling, and the (Super)charged by AI podcast, she enjoys bringing together people with different perspectives to explore ideas, challenge assumptions, and imagine what's next.\n\nOutside of work, Nicole spends her time with her kids, reading a good book, tackling a home project, and hanging out with Gary, her beloved French bulldog.",
    },
    {
      name: "Megan Notarte, PMP",
      role: "Partner at Cloud Four",
      bio: "Megan is a technology leader with over a decade of experience in spearheading innovative initiatives and managing high-impact projects across various industries. As the co-founder of AI Portland, she’s built a community focused on demystifying generative AI and its applications, organizing monthly events that bridge the gap between AI technology and practical business applications. Megan’s career also spans roles in operations and business management, including as a Partner at Cloud Four, where she’s led strategic initiatives and managed sizable projects for various companies, including several in the Fortune 500.",
    },
  ] satisfies { name: string; role?: string; bio: string }[],
};

export const codeOfConduct = {
  lastUpdated: "2/23/2024",
  body: "We are committed to fostering an inclusive, harassment-free environment for all members, irrespective of their backgrounds. We expect respectful behavior and do not tolerate harassment, discrimination, or inappropriate content. Violations may result in warnings, suspensions, or expulsion. Weapons and drugs are prohibited in our community spaces and events. Your participation is conditional on upholding these principles as we strive to create a welcoming and respectful community for everyone.",
};

export const contact = {
  eyebrow: "Reach our team",
  title: "Contact Us",
  intro: "We're happy to hear from you. Whether it's an event or speaker proposal, a sponsorship inquiry, a venue partnership, or a media request — send us a note and we'll get back to you.",
  purposes: [
    "Event/Speaker Proposal",
    "Sponsorship Inquiry",
    "Venue Partnership",
    "Media/Press Contact",
  ],
};

export const getInvolved = {
  title: "Get Involved...",
  body: "We're always looking for passionate individuals to share their unique AI experiences at future events. If you're a Photographer, Designer, industry expert, skilled prompt writer, or any other AI enthusiast with a story to tell, we want to hear from you!",
  cta: "Reach out",
};
