import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Orbitron, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [
    "web design agency Amsterdam",
    "website development Netherlands",
    "custom website design",
    "Next.js developer Europe",
    "ecommerce website development",
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
  "@type": "Organization",
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.legalName,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo-mark.png`,
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address.street,
    postalCode: SITE_CONFIG.address.postalCode,
    addressLocality: SITE_CONFIG.address.city,
    addressCountry: "NL",
  },
  sameAs: [SITE_CONFIG.social.linkedin],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  inLanguage: "en",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd} nonce={nonce} />
        <JsonLd data={websiteJsonLd} nonce={nonce} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
