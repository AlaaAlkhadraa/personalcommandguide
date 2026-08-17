import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // Never indexable, never followed, never cached by a search engine.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="container-page py-16">{children}</div>;
}
