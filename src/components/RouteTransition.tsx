"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  return <ViewTransition key={usePathname()} name="route-content" default="auto">{children}</ViewTransition>;
}
