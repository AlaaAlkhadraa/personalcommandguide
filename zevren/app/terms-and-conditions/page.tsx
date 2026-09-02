import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLocale } from "@/lib/i18n/get-locale";
import { TERMS } from "@/lib/legal/terms";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = TERMS[await getLocale()];
  return buildMetadata({
    title: doc.metaTitle,
    description: doc.metaDescription,
    path: "/terms-and-conditions",
    singleLocale: true,
  });
}

export default async function TermsPage() {
  return <LegalDocument doc={TERMS[await getLocale()]} />;
}
