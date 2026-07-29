# AI Portland — aipdx.info

The AI Portland website. Built with Next.js (App Router) + Tailwind CSS, deployed on
Vercel. Events, sponsors, and story/recap posts are **managed entirely in Notion** —
publishing a new event, adding a sponsor, or posting a recap never requires touching
code or asking a developer for a deploy. Notion edits show up on the live site
automatically within a few minutes (via [Incremental Static Regeneration](https://nextjs.org/docs/app/guides/incremental-static-regeneration)).

Static pages (About, Speaking, Sponsorship pitch copy, Contact, Code of Conduct) live
in code since they rarely change — see `src/content/site.ts`.

## Tech stack

- Next.js 16 (App Router), TypeScript
- Tailwind CSS 4
- `@notionhq/client` — reads three Notion databases as the CMS
- Vercel — hosting + ISR

## Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in real values, see below
npm run dev
```

The site runs and builds fine with no Notion credentials set — every Notion-backed
section (events, sponsors, stories) just shows a clear "not connected yet" message
instead of breaking. This is on purpose: Notion isn't required for local frontend work.

Other commands:

```bash
npm run build   # production build
npm run lint    # eslint
```

## Setting up Notion

### 1. Create the integration

1. Go to <https://www.notion.so/my-integrations> and click **New integration**.
2. Give it a name (e.g. "AI Portland Website"), select the AI Portland workspace,
   and create it.
3. Copy the **Internal Integration Secret** — this is your `NOTION_TOKEN`. Keep it
   private; treat it like a password.

### 2. Share the databases with the integration

The integration can only see databases it's explicitly been given access to. For
**each** of the databases below, open it in Notion, click **`···`** (top
right) → **Connections** → **Connect to** → select the integration you just made.

| Database | Env var | Fields the site reads |
|---|---|---|
| Public Events | `NOTION_EVENTS_DB_ID` | Event (title), Date, Time (text), Location (text), Description (rich text, optional), Luma (url). A Meetup field may exist in Notion but is intentionally never read or shown on the site. |
| Sponsors | `NOTION_SPONSORS_DB_ID` | Name (title), Logo (file/url), Link (url), Tier (select, optional) |
| Stories / Recaps | `NOTION_STORIES_DB_ID` | Name (title, used as a fallback), Headline (rich text — the display title), Intro (rich text — card/feature excerpt), page content (the body), Cover Image (file/url, optional), Related Event (relation, optional) |
| Partners | `NOTION_PARTNERS_DB_ID` | Name (title), Logo (files, optional), URL (url, optional) |

**Important:** the Public Events database must be the curated, public-facing one.
If your workspace also has an internal event-planning database, do not share that
one with this integration or point `NOTION_EVENTS_DB_ID` at it — anything in the
connected database is displayed on the public website.

Field names must match exactly (case-sensitive) — the site looks up properties by
name (`"Event"`, `"Date"`, `"Luma"`, etc.), not by type or position.

### 3. Get each database ID

Open the database as a full page in Notion and copy the ID out of the URL:

```
https://www.notion.so/myworkspace/1a2b3c4d5e6f7890abcd1234ef567890?v=...
                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                   this 32-character string is the database ID
```

## Environment variables

Set in `.env.local` for local development, and in **Vercel → Project Settings →
Environment Variables** for production/preview deploys. Never commit `.env.local`
(it's in `.gitignore`) and never hardcode real values in code.

```
NOTION_TOKEN=
NOTION_EVENTS_DB_ID=
NOTION_SPONSORS_DB_ID=
NOTION_STORIES_DB_ID=
NOTION_PARTNERS_DB_ID=
RESEND_API_KEY=
```

## Contact form

The Contact page form (`/contact`) sends submissions as email via
[Resend](https://resend.com) — there's no third-party form service and nothing is
stored in Notion. The submitter's address is set as the reply-to, so replying to
the notification email goes straight to them.

1. Create a Resend account and verify a sending domain (Resend → Domains → Add
   Domain, then add the DNS records it gives you). This site sends from
   `contact.aipdx.info`.
2. Create an API key (Resend → API Keys) and set it as `RESEND_API_KEY`.
3. Without a Resend key set, the API route returns an error and the form shows a
   "something went wrong" message — email isn't required for local frontend work,
   but the form itself won't succeed until it's configured.

The `from` address is hardcoded to `contact@contact.aipdx.info` in
`src/app/api/contact/route.ts` — update it there if the verified domain changes.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In [Vercel](https://vercel.com), click **Add New → Project** and import the repo.
   Vercel auto-detects Next.js — no config changes needed.
3. Before the first deploy, add the environment variables above under
   **Project Settings → Environment Variables** (add them to Production, Preview,
   and Development).
4. Deploy. Every push to the main branch redeploys automatically; every pull
   request gets its own preview URL.
5. Point your domain (`aipdx.info`) at the Vercel project under **Project
   Settings → Domains**.

After the initial deploy, you generally never need to trigger another one for
content changes — see below.

---

## How to publish a new event / sponsor / story

*(No coding or Vercel access needed for any of this — just Notion.)*

The website automatically re-checks Notion every few minutes and updates itself.
After you make a change in Notion, give it **up to 5 minutes**, then refresh the
site to see it live. You don't need to "publish," "deploy," or tell anyone —
it just happens.

### Add a new event

1. Open the **Public Events** database in Notion.
2. Click **New** to add a row.
3. Fill in:
   - **Event** — the event's title (this is required — the event won't show up
     without it)
   - **Date** — required. This also controls ordering (soonest first) and whether
     it counts as "upcoming."
   - **Time** — e.g. `6:00 PM – 8:00 PM` (plain text, type it however you want
     attendees to read it)
   - **Location** — venue name/address
   - **Description** — a short paragraph about the event
   - **Luma** — the RSVP link (this is the main "RSVP" button on the site)

   A Meetup link column may exist in this database for internal reference, but
   the site never reads or displays it — Luma is the only public RSVP link.
4. That's it. It'll appear on the Events page and, if it's the soonest upcoming
   one, on the homepage.

To remove an event from the site, delete it from this database (or move it out —
anything not in the database won't be shown).

### Add a new sponsor

1. Open the **Sponsors** database in Notion.
2. Click **New**.
3. Fill in:
   - **Name** — required
   - **Logo** — upload a logo image file, or paste an external image URL
   - **Link** — the sponsor's website (their logo becomes clickable)
   - **Tier** — optional, for your own organization; not currently shown on the
     site
4. Done — their logo appears in the sponsor strip on the homepage, Sponsorship
   page, and anywhere else sponsors are listed.

### Post a new story / recap

1. Open the **Stories** database in Notion.
2. Click **New**.
3. Fill in:
   - **Title** — required
   - **Date** — required (controls ordering — most recent first)
   - **Cover Image** — upload or paste an image URL; shown at the top of the
     story and in story cards
   - **Related Event** — optional; link it to the event this story is about and
     the story page will show a "From [Event Name]" link back to that event
4. Write the actual recap **in the page body** — click into the page (below the
   properties) and write normally: paragraphs, headings, bullet lists, quotes,
   images, all supported. This is what shows up as the article content.
5. The most recent story automatically becomes the "Latest Story" featured on
   the homepage.

### Things to know

- **Empty database ≠ broken site.** If a database has no entries yet, that
  section just shows a friendly "check back soon" message instead of erroring.
- **Field names matter.** If you rename a column in Notion (e.g. "Event" →
  "Event Name"), the site will stop reading that field until someone updates
  the matching code in `src/lib/notion/`. Stick to the field names in the table
  above.
- **Images can take a moment.** Freshly uploaded Notion images sometimes take a
  minute to be reachable externally; if a logo/photo doesn't show up immediately,
  give it a few minutes and refresh.
- **Nothing here needs a developer.** Adding, editing, or removing a row in any
  of the three databases is the entire publishing workflow.

## Judgment calls made during the build

These were reasonable defaults chosen to move the build forward, not locked brand
decisions — flagged here (and with inline comments in the code) for review:

- **Surface/card color** (`--color-surface` in `src/app/globals.css`) — a new dark
  tone for cards and alternating sections; not an existing brand color.
- **Headline typeface** — Fraunces (serif) paired with the existing Montserrat body
  font, for the "editorial, magazine-leaning" direction (`src/app/layout.tsx`).
- **Hero gradient** — uses the existing dark ink/maroon tokens rather than a bright
  pink/crimson gradient, to keep the hero consistent with "dark background, pink as
  accent" rather than reading as a colorful banner.
- **Podcast page embeds** — uses the full Spotify show embed (which lists all
  episodes, latest first) rather than hand-picked individual episode embeds, since
  no specific past-episode list was provided.
- **Story body renderer** (`src/components/NotionBlocks.tsx`) — supports the common
  block types (paragraphs, headings, lists, images, quotes, code, dividers) but not
  nested/indented blocks, on the assumption recaps are simple prose + photos.
