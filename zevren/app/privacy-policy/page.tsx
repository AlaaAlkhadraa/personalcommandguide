import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLocale } from "@/lib/i18n/get-locale";
import { PRIVACY } from "@/lib/legal/privacy";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = PRIVACY[await getLocale()];
  return buildMetadata({
    title: doc.metaTitle,
    description: doc.metaDescription,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPage() {
  return <LegalDocument doc={PRIVACY[await getLocale()]} />;
}
