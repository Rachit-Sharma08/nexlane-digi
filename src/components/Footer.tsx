import Link from "next/link";
import Image from "next/image";
import { nav, site, team } from "@/config/site";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "./Navbar";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--card-border)] bg-[rgba(2,17,35,0.8)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/nexlane-mark.webp" alt="" width={400} height={285} className="logo-blend h-8 w-auto object-contain mix-blend-screen" />
            <span className="font-display text-lg font-bold tracking-[0.18em]">NEXLANE DIGITAL</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            A young digital agency from {site.location}, helping small local businesses grow online — and teaching what we learn, free.
          </p>
          <div className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className="block hover:text-white">
                {site.contactEmail}
              </a>
            )}
            {site.phones.map((p) => (
              <a key={p} href={`tel:${site.phoneCountryCode}${p}`} className="block hover:text-white">
                {site.phoneCountryCode} {p}
              </a>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-[var(--muted)]">
            {site.whatsappNumber && (
              <a href={`https://wa.me/${site.whatsappNumber}`} aria-label="WhatsApp" className="hover:text-white" rel="noopener noreferrer" target="_blank">
                <WhatsAppIcon />
              </a>
            )}
            {site.instagramUrl && (
              <a href={site.instagramUrl} aria-label="Instagram" className="hover:text-white" rel="noopener noreferrer" target="_blank">
                <InstagramIcon />
              </a>
            )}
            {site.youtubeUrl && (
              <a href={site.youtubeUrl} aria-label="YouTube" className="hover:text-white" rel="noopener noreferrer" target="_blank">
                <YouTubeIcon />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Explore links" className="text-sm">
          <p className="font-semibold uppercase tracking-widest text-xs text-[var(--accent)]">Explore</p>
          <ul className="mt-3 space-y-2">
            {nav.main.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-[var(--muted)] hover:text-white">
                  {i.label}
                </Link>
              </li>
            ))}
            {nav.about.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-[var(--muted)] hover:text-white">
                  {i.label}
                </Link>
              </li>
            ))}
            {nav.services.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-[var(--muted)] hover:text-white">
                  {i.label}
                </Link>
              </li>
            ))}
            {nav.learn.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-[var(--muted)] hover:text-white">
                  {i.label}
                </Link>
              </li>
            ))}
            {nav.extra.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-[var(--muted)] hover:text-white">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-semibold uppercase tracking-widest text-xs text-[var(--accent)]">Team</p>
          <ul className="mt-3 space-y-2">
            {team.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/about/${m.group === "founders" ? "founders" : "team"}#${m.slug}`}
                  className="text-[var(--muted)] hover:text-white"
                >
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="font-semibold mt-6 uppercase tracking-widest text-xs text-[var(--accent)]">Legal</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/terms" className="text-[var(--muted)] hover:text-white">Terms</Link></li>
            <li><Link href="/privacy" className="text-[var(--muted)] hover:text-white">Privacy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--card-border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {site.name} · {site.location}</p>
          <p>A young team of four — learning by building, since 2026.</p>
        </div>
      </div>
    </footer>
  );
}
