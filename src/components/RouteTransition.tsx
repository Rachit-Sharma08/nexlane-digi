"use client";

import { usePathname } from "next/navigation";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  return <div key={usePathname()} className="route-content">{children}</div>;
}
