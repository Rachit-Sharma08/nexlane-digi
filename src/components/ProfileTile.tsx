import Image from "next/image";
import type { TeamMember } from "@/config/site";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * One profile tile for Founders and Team (AGENTS.md §11.5).
 * With a portfolio URL the whole tile is one link (projects stay clickable above it).
 * Without one it is a plain article: no link, no hover cue, no empty promise.
 */
export default function ProfileTile({ member }: { member: TeamMember }) {
  const hasPortfolio = Boolean(member.portfolioUrl);

  return (
    <article
      id={member.slug}
      className="group relative scroll-mt-28 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--brand)] via-[var(--brand-2)] to-[var(--surface-1)] shadow-[var(--shadow-card)]">
        {member.photo ? (
          <Image
            src={member.photo}
            alt=""
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[var(--brand-2)] opacity-20 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center font-display text-7xl font-bold tracking-tight text-[var(--surface)] sm:text-8xl"
            >
              {initials(member.name)}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-x-6 bottom-1/4 h-px bg-gradient-to-r from-transparent via-[var(--accent-2)]/40 to-transparent"
            />
          </>
        )}

        {hasPortfolio && (
          <a
            href={member.portfolioUrl!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${member.name}'s portfolio in a new tab`}
            className="absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-2)]"
          >
            <span className="portfolio-cue absolute right-4 top-4 rounded-full border border-[var(--accent-2)]/40 bg-[rgba(22,34,15,0.86)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-2)] backdrop-blur">
              Open portfolio <span aria-hidden="true">↗</span>
            </span>
          </a>
        )}
      </div>

      <div className="mt-5">
        <h2 className="font-display text-2xl font-semibold text-[var(--text)]">{member.name}</h2>
        <p className="mt-1 text-sm text-[var(--accent-2)]">{member.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{member.bio}</p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${member.name}'s skills`}>
          {member.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-[var(--card-border)] bg-[var(--secondary)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
            >
              {skill}
            </li>
          ))}
        </ul>

        {member.personalProjects.length > 0 && (
          <div className="relative z-20 mt-5 border-t border-[var(--card-border)] pt-4">
            <p className="text-xs uppercase tracking-widest text-[var(--accent-2)]">Personal projects</p>
            <ul className="mt-2 space-y-1.5">
              {/* §4: at most 3 personal projects, always labelled personal. */}
              {member.personalProjects.slice(0, 3).map((project) => (
                <li key={project.title}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--muted)] underline decoration-[var(--card-border)] hover:text-[var(--text)] hover:decoration-[var(--accent-2)]"
                  >
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Personal project by {member.name}, not Nexlane client work
            </p>
          </div>
        )}
      </div>
    </article>
  );
}