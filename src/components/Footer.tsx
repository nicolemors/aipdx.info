import Link from "next/link";
import { Logo } from "@/components/Logo";
import { footerLinks, links } from "@/content/site";

// Simple monochrome glyphs so the footer doesn't pull in an icon library for
// three marks — swap for brand-approved SVGs if AI Portland has them.
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
    </svg>
  );
}

function MeetupIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 15.5v-5a2.5 2.5 0 0 1 5 0M12.5 15.5v-4a2 2 0 0 1 4 0v2.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H4.06V19h2.88V8.5ZM5.5 4a1.68 1.68 0 1 0 0 3.36A1.68 1.68 0 0 0 5.5 4ZM19.94 19h-2.87v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.08 1.4-2.08 2.85V19h-2.87V8.5h2.76v1.43h.04c.38-.73 1.32-1.5 2.72-1.5 2.91 0 3.45 1.92 3.45 4.4V19Z" />
    </svg>
  );
}

const socialLinks = [
  { href: links.podcastYoutube, label: "YouTube", Icon: YoutubeIcon },
  { href: links.meetup, label: "Meetup", Icon: MeetupIcon },
  { href: links.linkedinCompany, label: "LinkedIn", Icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-paper/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Stay in the loop with new events, sponsors, and stories.
            </p>
            <a
              href={links.newsletter}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90"
            >
              Sign up for the newsletter
            </a>
          </div>

          <div className="flex flex-col items-start gap-6 sm:items-end">
            <nav className="flex gap-6 text-sm">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-muted transition hover:text-paper">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-4">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-muted transition hover:text-pink"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-paper/10 pt-6 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} AI Portland</p>
        </div>
      </div>
    </footer>
  );
}
