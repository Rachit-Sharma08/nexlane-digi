import { AdminRouteProvider } from "./AdminRouteContext";
import { getAdminRouteSlug } from "@/lib/admin-auth-utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRouteProvider route={getAdminRouteSlug()}>{children}</AdminRouteProvider>;
}
