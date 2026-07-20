export const links = {
  meetup: "https://www.meetup.com/ai-portland/",
  linkedinCompany: "https://www.linkedin.com/company/ai-portland/",
  linkedinGroup: "https://www.linkedin.com/groups/14375111/",
  podcastYoutube: "https://www.youtube.com/@AIPortlandOrganizers",
  newsletter: "http://eepurl.com/iJv5O6",
  contactEmail: "hello@aipdx.info",
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
    "We are a gathering of enthusiasts, professionals, and the AI-curious from all walks of life, committed to fostering an inclusive environment where everyone is welcome to explore, learn, and innovate. Whether you're taking your first steps into the world of AI or you're a seasoned professional looking to push the boundaries of what's possible, AI Portland offers a space to collaborate, share knowledge, and drive positive change.",
    "Join us in our journey to unlock the potential of AI and discover its impact on our lives, our communities, and the world.",
  ],
  podcastEyebrow: "It's here!",
  podcastTitle: "(Super)charged by AI",
  podcastSubtitle: "A podcast",
  podcastBody:
    "We are excited to announce our new podcast and are ecstatic to bring more conversation to the AI community.",
  sponsorshipTeaser:
    "Step into the forefront of innovation and community engagement by sponsoring AI Portland. Your support directly contributes to a vibrant ecosystem of cutting-edge workshops, enriching talks, and valuable networking opportunities that propel the AI conversation forward. Connect with us and play a pivotal role in a space where technology meets collaboration.",
};

// Generic placeholder copy — no specific partner orgs named yet. Swap
// `pillars` for a real list (names/logos/links) once there's one to
// publish, similar to how the Sponsors database already works.
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

export const sponsorship = {
  intro:
    "Step into the forefront of innovation and community engagement by sponsoring AI Portland. Your support directly contributes to a vibrant ecosystem where AI enthusiasts, professionals, and newcomers alike can thrive. Through your sponsorship, we can continue to offer cutting-edge workshops, enriching talks, and valuable networking opportunities that propel the AI conversation forward. Collaborate with AI Portland and play a pivotal role in nurturing a space where technology meets collaboration, and where everyone can leverage the transformative power of AI.",
  stats: [
    "Over 2,800 members",
    "Events average 100-150 attendees depending on venue.",
    "Attendees come from the design, development, HR, and various professional industries and range from the AI novice to AI experts.",
    "We average one event per month but expect that number to increase in frequency as we expand our content calendar.",
  ],
  tiers: [
    {
      name: "Event Sponsor",
      price: "$500",
      cadence: "per event",
      perks: [
        "Logo and link on Meetup event page, and the AI Portland website",
        "Logo, link, and promo copy in all event related communications",
        "Slide in the event presentation and materials",
        "Opportunity to give short (< 5 mins) plug at the event",
      ],
      cta: "Contact AI Portland to Sponsor an event",
    },
    {
      name: "Partner Sponsor",
      price: "$5,000",
      cadence: "per year",
      perks: [
        "Logo and link on all Meetup event pages and event related communications for a year",
        "Logo and link on the homepage of the AI Portland website",
        "Slide in all event presentations and materials for a year",
        "Opportunity to give short (< 5 mins) plug at any event",
        "Opportunity to have a table at any event",
      ],
      cta: "Contact AI Portland to become a Partner",
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
  galleryCaption: "The city we call home",
};

export const about = {
  story: [
    "In the summer of 2023, as the world watched the rapid rise of generative AI, Nicole and Megan found themselves casually yet deeply engaged in conversations about what this emerging technology meant for their lives. They were fascinated by the possibilities, and it became a frequent topic of their discussions.",
    "Then, one December evening, the stars aligned for an impromptu get-together over a bottle of wine and some baby carrots. Nicole had been listening to a podcast about AI in design on her way over, and naturally, the conversation turned to AI once again. The excitement in the air was palpable.",
    "That night, Nicole made a casual but significant suggestion: “If we’re so fascinated by this, surely other people must be too. We should start a meetup, we should make AI Portland!” Without hesitation, Megan said, “No. We are too busy, and have way too much going on.”",
    "But sometimes, a simple idea has a way of sticking with you. The very next day, Megan reconsidered. Maybe there was something more here—a community waiting to be formed. And just like that, AI Portland was born.",
    "Fast forward, and AI Portland has grown into something beyond their wildest expectations. What started as a casual conversation between friends over a bottle of wine has evolved into a thriving community of AI enthusiasts, creators, and thought leaders, all eager to explore the future together.",
  ],
  team: [
    {
      name: "Megan Notarte, PMP",
      role: "Partner at Cloud Four",
      bio: "Megan is a technology leader with over a decade of experience in spearheading innovative initiatives and managing high-impact projects across various industries. As the co-founder of AI Portland, she’s built a community focused on demystifying generative AI and its applications, organizing monthly events that bridge the gap between AI technology and practical business applications. Megan’s career also spans roles in operations and business management, including as a Partner at Cloud Four, where she’s led strategic initiatives and managed sizable projects for various companies, including several in the Fortune 500.",
    },
    {
      name: "J. Nicole Mors",
      role: "Group Product Design Manager, Driveway",
      bio: "Nicole is a seasoned Product Design Leader with a deep passion for crafting engaging digital experiences that drive business success across diverse industries. Her expertise spans leading design teams within tech organizations of all sizes, where she's committed to fostering growth and instilling a culture of passion and enthusiasm. Nicole volunteers as the Volunteer Director on the AIGA Portland Board of Directors, contributing to the growth and culture of the design community in Portland. When she's not working you can find Nicole spending time with her kids, collecting french bulldogs, or reading a good book.",
    },
  ],
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
