import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <section className="container-page flex flex-1 items-center py-20 sm:py-28">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-surface/70 p-7 shadow-2xl sm:p-9">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">ZEVREN</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Admin dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Sign in to review contact enquiries.</p>
        <AdminLoginForm />
      </div>
    </section>
  );
}
