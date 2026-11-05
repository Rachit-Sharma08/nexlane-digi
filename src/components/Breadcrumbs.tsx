import Link from 'next/link';

type BreadcrumbItem = {
  name: string;
  path: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap text-xs text-[var(--muted)]">
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <span className="mx-2">/</span>
            {index === items.length - 1 ? (
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