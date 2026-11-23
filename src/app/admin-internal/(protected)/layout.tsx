import { redirect } from "next/navigation";
import { getAdminRequestContext, getAdminLoginUrl } from "@/lib/admin-auth-supabase";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdminRequestContext())) redirect(getAdminLoginUrl());
  return children;
}
