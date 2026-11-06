import Link from 'next/link';

type BreadcrumbItem = {
  name: string;
  path: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

/**
 * Breadcrumb trail. Pages pass their full trail (starting at Home) — the
 * same list feeds the JSON-LD breadcrumb schema. Hidden on top-level pages
 * by simply not rendering this component there. On mobile only the last
 * two levels are shown.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const crumbs = items[0]?.path === '/' ? items : [{ name: 'Home', path: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap text-xs text-[var(--muted)]">
        {crumbs.map((item, index) => (
          <li
            key={item.path}
            className={`flex items-center ${index < crumbs.length - 2 ? 'hidden sm:flex' : ''}`}
          >
            {index > 0 && (
              <span className={`mx-2 ${crumbs.length > 2 && index === crumbs.length - 2 ? 'hidden sm:inline' : ''}`}>/</span>
            )}
            {index === crumbs.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
