import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const isHome = path === "/";
  // Open Graph/Twitter cards never inherit the root layout's title
  // template, so they need the " | ZEVREN" suffix spelled out here. The
  // document <title> must NOT repeat it — the root layout's title.template
  // already appends "| ZEVREN" to any plain string title, so passing the
  // suffixed string through as well produced "Services | ZEVREN | ZEVREN".
  // The home page wants a bespoke full title with no suffix at all, which
  // { absolute } achieves by opting out of the template entirely.
  const fullTitle = isHome ? title : `${title} | ${SITE_CONFIG.name}`;

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
