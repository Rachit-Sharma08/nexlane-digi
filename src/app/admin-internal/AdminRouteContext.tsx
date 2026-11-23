"use client";

import { createContext, useContext } from "react";

const AdminRouteContext = createContext("/panel-x7f");

export function AdminRouteProvider({ route, children }: { route: string; children: React.ReactNode }) {
  return <AdminRouteContext.Provider value={route}>{children}</AdminRouteContext.Provider>;
}

export function useAdminRoute() {
  return useContext(AdminRouteContext);
}
