import type { Metadata } from "next";
import { headers } from "next/headers";
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
import { SERVICES, SITE_CONFIG } from "@/lib/constants";
import { getLocale } from "@/lib/i18n/get-locale";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [
    "web studio Maastricht",
    "website development Netherlands",
    "custom website design",
    "Next.js developer Netherlands",
    "online store development",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  // ProfessionalService rather than a bare Organization: it is the type
  // search engines use for a business that sells services, and it lets the
  // service list below be attached to it.
  "@type": "ProfessionalService",
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.legalName,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo-mark.png`,
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CONFIG.address.city,
    addressCountry: "NL",
  },
  sameAs: [SITE_CONFIG.social.linkedin],
  areaServed: "Worldwide",
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
      </body>
    </html>
  );
}
