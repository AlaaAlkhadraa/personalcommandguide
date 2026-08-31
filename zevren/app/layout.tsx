import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { GoogleTag } from "@/components/analytics/GoogleTag";
import {
  IBM_Plex_Mono,
  Inter,
  Orbitron,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { OG_LOCALE } from "@/lib/seo";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/get-locale";
import { chatConfigured } from "@/lib/server/env";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isRtl, type Locale } from "@/lib/i18n/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["600", "700"],
});

// Only the Tajex concept uses these two. preload is off so the other pages do
// not fetch font files they never render with.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-tajex",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-tajex-mono",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta.home;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: meta.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: meta.description,
    applicationName: SITE_CONFIG.name,
    keywords: [
      "website laten maken",
      "webdesign Maastricht",
      "webshop laten maken",
      "webdesigner Limburg",
      "maatwerk webapplicatie",
    ],
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      siteName: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  // ProfessionalService rather than a bare Organization: it is the type
  // search engines use for a business that sells services, and it lets the
  // service list below be attached to it.
  "@type": "ProfessionalService",
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.legalName,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/zevren-wordmark.png`,
  image: `${SITE_CONFIG.url}/opengraph-image`,
  slogan: SITE_CONFIG.tagline,
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  vatID: SITE_CONFIG.btw,
  identifier: {
    "@type": "PropertyValue",
    name: "KVK",
    value: SITE_CONFIG.kvk,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: "Limburg",
    addressCountry: "NL",
  },
  sameAs: [SITE_CONFIG.social.linkedin],
  areaServed: "Worldwide",
  priceRange: "€€",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    availableLanguage: ["nl", "en", "de", "fr", "es", "ar"],
  },
  // The languages the site itself is served in.
  knowsLanguage: ["nl", "en", "de", "fr", "es", "ar"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    // Generated from the same list the site renders, so the two cannot drift.
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        url: `${SITE_CONFIG.url}/services#${service.slug}`,
      },
    })),
  },
};

function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    // Reports the language actually being served, not a fixed "en".
    inLanguage: locale,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} ${plusJakarta.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd} nonce={nonce} />
        <JsonLd data={websiteJsonLd(locale)} nonce={nonce} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Navbar locale={locale} dict={dict.nav} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer
          locale={locale}
          dict={dict.footer}
          navDict={dict.nav}
          servicesDict={dict.services}
          workDict={dict.work}
        />
        {/* Cookieless page-view counting. The script is injected by a Next
            bundle that already carries the CSP nonce, so strict-dynamic
            covers it and the beacon stays same-origin. */}
        <Analytics />
        {/* Advertising measurement, which is a different matter: it needs a
            cookie, so it starts fully denied and only changes once the bar
            below has been answered. */}
        <GoogleTag nonce={nonce} />
        <ConsentBanner dict={dict.consent} />
        {/* Rendered only when the server holds an API key, so a deployment
            without one shows no button that leads nowhere. */}
        {chatConfigured() && <AssistantWidget locale={locale} dict={dict.assistant} />}
      </body>
    </html>
  );
}
