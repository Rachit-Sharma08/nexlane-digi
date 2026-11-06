import type { TeamMember } from "@/config/site";
import { GlassCard } from "./ui";

/**
 * Profile card for /about/founders and /about/team.
 * Personal projects are always labelled as personal, never client work.
 */
export default function MemberCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <GlassCard id={member.slug} className="h-full">
      <div className="flex items-center gap-4">
        {/* Initials avatar — no photos exist yet, and none are invented. */}
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[rgba(30,211,242,0.08)] font-display text-lg font-bold text-[var(--accent)]"
        >
          {initials}
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">{member.name}</h2>
          <p className="text-sm text-[var(--accent)]">{member.title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{member.bio}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {member.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-[var(--card-border)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
          >
            {skill}
          </li>
        ))}
      </ul>

      {member.portfolioUrl && (
        <a
          href={member.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-[var(--accent-2)] hover:text-white"
        >
          Portfolio →
        </a>
      )}

      {member.personalProjects.length > 0 && (
        <div className="mt-5 border-t border-[var(--card-border)] pt-4">
          <p className="text-xs uppercase tracking-widest text-[var(--accent)]">Personal projects</p>
          <ul className="mt-2 space-y-1.5">
            {member.personalProjects.map((p) => (
              <li key={p.title}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] underline decoration-[var(--card-border)] hover:text-white hover:decoration-[var(--accent)]"
                >
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Personal project by {member.name}, not Nexlane client work
          </p>
        </div>
      )}
    </GlassCard>
  );
}
