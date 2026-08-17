import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { issueCsrfToken } from "@/lib/server/csrf";
import { getSessionUserFromHeaders } from "@/lib/server/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLoginPage() {
  // Already signed in: no reason to show the form again.
  const user = await getSessionUserFromHeaders();
  if (user) redirect("/admin");

  const csrfToken = await issueCsrfToken();
  return <LoginForm csrfToken={csrfToken} />;
}
