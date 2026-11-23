"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/config/site";
import BrandMark from "./BrandMark";

/** Thin top strip with WhatsApp / social / email icons (only what is set). */
function TopBar() {
  const links = [
    site.whatsappNumber
      ? {
          href: `https://wa.me/${site.whatsappNumber}`,
          label: "WhatsApp",
          icon: <WhatsAppIcon className="h-3.5 w-3.5" />,
        }
      : null,
    site.instagramUrl ? { href: site.instagramUrl, label: "Instagram", icon: <InstagramIcon className="h-3.5 w-3.5" /> } : null,
    site.youtubeUrl ? { href: site.youtubeUrl, label: "YouTube", icon: <YouTubeIcon className="h-3.5 w-3.5" /> } : null,
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  if (links.length === 0) return null;
  return (
    <div className="border-b border-[var(--card-border)] bg-[var(--bg)] pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-5 px-4 py-1.5 sm:px-6">
        {links.map((l) => (
          <a key={l.label} href={l.href} aria-label={l.label} className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]" rel="noopener noreferrer" target="_blank">
            {l.icon}
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

type NavItem = { href: string; label: string };
type DropdownParent = { label: string } & { items: NavItem[] };

const navBase = "relative flex items-center rounded px-3 py-2 text-sm transition-colors";
const navIdle = "text-[var(--muted)] hover:text-[var(--text)]";

/** CSS-only gradient underline (motion lib would add ~145 KB to every page). */
function ActiveIndicator() {
  return (
    <span
      aria-hidden="true"
      className="nav-indicator absolute inset-x-2 -bottom-[7px] h-0.5 rounded-full bg-gradient-to-r from-[var(--brand-2)] to-[var(--accent-2)]"
    />
  );
}

function isRouteActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isRouteActive(pathname, item.href);
  return (
    <Link href={item.href} aria-current={active ? "page" : undefined} className={`${navBase} ${active ? "text-[var(--text)]" : navIdle}`}>
      {item.label}
      {active && <ActiveIndicator />}
    </Link>
  );
}

function Dropdown({ parent, mobile }: { parent: DropdownParent; mobile?: boolean }) {
  const [menu, setMenu] = useState<{ path: string; open: boolean }>({ path: "", open: false });
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const focusFirstOnOpen = useRef(false);
  const menuId = useId();
  const active = parent.items.some((i) => isRouteActive(pathname, i.href));
  const open = menu.open && menu.path === pathname;
  const setOpen = useCallback(
    (value: boolean) => setMenu({ path: pathname, open: value }),
    [pathname],
  );

  useEffect(() => {
    if (open && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open || mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open, mobile, setOpen]);

  function focusItem(index: number) {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (items.length === 0) return;
    const next = (index + items.length) % items.length;
    items[next]?.focus();
  }

  function handleButtonKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirstOnOpen.current = true;
      setOpen(true);
    }
  }

  function handleMenuKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(items.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  if (mobile) {
    return (
      <div className="ml-3 border-l border-[var(--card-border)] pl-3">
        <span className={`text-xs font-semibold uppercase tracking-widest ${active ? "text-[var(--text)]" : "text-[var(--accent)]"}`}>
          {parent.label}
        </span>
        <ul className="mt-1 space-y-1">
          {parent.items.map((i) => {
            const itemActive = pathname === i.href;
            return (
              <li key={i.href}>
                <Link
                  href={i.href}
                  aria-current={itemActive ? "page" : undefined}
                  className={`block rounded px-2 py-3 text-sm ${
                    itemActive
                      ? "border-l-2 border-[var(--accent)] bg-[rgba(31,58,36,0.08)] pl-2 text-[var(--text)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {i.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" onBlur={(e) => {
      if (!wrapperRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
    }}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={handleButtonKeyDown}
        className={`${navBase} gap-1 ${active || open ? "text-[var(--text)]" : navIdle}`}
      >
        {parent.label}
        <Chevron className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        {active && <ActiveIndicator />}
      </button>
      {open && (
        <ul
          ref={menuRef}
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          className="absolute left-0 top-full z-[60] mt-2 w-56 rounded-xl border border-[var(--card-border)] bg-[var(--surface-1)] p-2 shadow-2xl shadow-[var(--shadow-deep)] backdrop-blur-md"
        >
          {parent.items.map((i) => {
            const itemActive = pathname === i.href;
            return (
              <li key={i.href}>
                <Link
                  href={i.href}
                  aria-current={itemActive ? "page" : undefined}
                  className={`block rounded px-3 py-2 text-sm hover:bg-[var(--secondary)] hover:text-[var(--text)] ${
                    itemActive ? "bg-[rgba(31,58,36,0.08)] text-[var(--text)]" : "text-[var(--muted)]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {i.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<{ path: string; open: boolean }>({ path: "", open: false });
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (value: boolean) => setMenu({ path: pathname, open: value });
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const setHeight = () =>
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      <TopBar />
      <nav aria-label="Main navigation" className="border-b border-[var(--card-border)] bg-[rgba(229,232,206,0.78)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
            <BrandMark size={40} ariaLabel={`${site.name} mark`} />
            <span className="font-display text-lg font-bold tracking-[0.18em] text-[var(--text)]">NEXLANE</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 lg:flex">
            {nav.main.map((i) => (
              <DesktopLink key={i.href} item={i} pathname={pathname} />
            ))}
            <Dropdown parent={nav.about} />
            <Dropdown parent={nav.services} />
            <Dropdown parent={nav.learn} />
            {nav.extra.map((i) => (
              <DesktopLink key={i.href} item={i} pathname={pathname} />
            ))}
            <Link href={nav.cta.href} className="btn btn-primary ml-2 text-sm">
              {nav.cta.label}
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="rounded p-2.5 text-[var(--text)] lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
              {menuOpen ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu-enter border-t border-[var(--card-border)] bg-[rgba(229,232,206,0.97)] px-4 py-4 lg:hidden">
            <div className="space-y-3">
              {nav.main.map((i) => {
                const active = isRouteActive(pathname, i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded px-2 py-3 text-sm ${
                      active
                        ? "border-l-2 border-[var(--accent)] bg-[rgba(31,58,36,0.08)] pl-2 text-[var(--text)]"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {i.label}
                  </Link>
                );
              })}
              <Dropdown parent={nav.about} mobile />
              <Dropdown parent={nav.services} mobile />
              <Dropdown parent={nav.learn} mobile />
              {nav.extra.map((i) => {
                const active = isRouteActive(pathname, i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded px-2 py-3 text-sm ${
                      active
                        ? "border-l-2 border-[var(--accent)] bg-[rgba(31,58,36,0.08)] pl-2 text-[var(--text)]"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {i.label}
                  </Link>
                );
              })}
              <Link href={nav.cta.href} onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
                {nav.cta.label}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

/* ---- inline icons (kept tiny, no icon library) ---- */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.92 9.92 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.24 8.24 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 8.24 8.23c0 4.54-3.7 8.23-8.25 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23a7.45 7.45 0 0 1-1.38-1.71c-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.13.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2C.4 9.1.4 12 .4 12s0 2.9.6 4.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.6-1.9.6-4.8.6-4.8s0-2.9-.6-4.8ZM9.7 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}