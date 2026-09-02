import type { Metadata } from "next";
import { Link } from "@/components/ui/Link";
import { headers } from "next/headers";

import { CITIES } from "@/lib/local/cities";
import { SECTORS } from "@/lib/local/sectors";
import { Container } from "@/components/ui/Container";
import { PackagesSection } from "@/components/pricing/PackagesSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * The hub above the city pages: targets the head term "website laten maken"
 * itself and links every city page, so the whole cluster is one hop from
 * a page the footer links on every route.
 */

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Website laten maken: vaste prijzen, heel Nederland",
    description:
      "Een website laten maken zonder offertetraject: vier pakketten met openbare prijzen vanaf 299 euro, werkende demo's, volledig online geregeld vanuit Maastricht.",
    path: "/website-laten-maken",
    singleLocale: true,
    locale: "nl",
  });
}

export default async function WebsiteLatenMakenPage() {
  const dict = getDictionary("nl");
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const provinces = [...new Set(CITIES.map((city) => city.province))];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("Home", [
          { name: "Website laten maken", path: "/website-laten-maken" },
        ])}
        nonce={nonce}
      />

      <section className="border-b border-white/5 bg-grid-glow py-16 sm:py-24">
        <Container className="flex max-w-3xl flex-col gap-6">
          <h1 className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
            Website laten maken, zonder offertecircus
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Bij de meeste bureaus begint een website met een offertetraject. Bij ons
            begint hij met een prijs die al op de site staat: vier pakketten, vanaf
            299 euro, en wat op de kaart staat is wat op de factuur staat. We werken
            vanuit Maastricht, volledig online, voor ondernemers door heel Nederland.
          </p>
          <p className="text-base leading-relaxed text-muted">
            Twijfel je nog over stijl of opzet? Bouw eerst zelf een concept met{" "}
            <Link href="/concept-bouwer" className="text-accent underline-offset-2 hover:underline">
              de conceptbouwer
            </Link>
            , of klik door{" "}
            <Link href="/projects" className="text-accent underline-offset-2 hover:underline">
              onze werkende demo&apos;s
            </Link>
            . Zoek je specifiek een{" "}
            <Link
              href="/webshop-laten-maken"
              className="text-accent underline-offset-2 hover:underline"
            >
              webshop
            </Link>{" "}
            of een{" "}
            <Link
              href="/webapplicatie-laten-maken"
              className="text-accent underline-offset-2 hover:underline"
            >
              maatwerk webapplicatie
            </Link>
            ? Die hebben hun eigen pagina.
          </p>
        </Container>
      </section>

      <RevealGroup>
        <PackagesSection dict={dict.offer} pricingDict={dict.pricing} />

        {/* The city pages, grouped by province: the anchor text carries the
            city name, which is exactly the query each page targets. */}
        <section className="border-b border-slate-200 bg-white py-14 sm:py-20">
          <Container className="flex flex-col gap-8">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
                Actief in heel Nederland
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                Het hele traject loopt online, dus waar je zaak staat maakt voor het
                werk niet uit. Voor deze steden schreven we een eigen pagina:
              </p>
            </div>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {provinces.map((province) => (
                <div key={province} className="flex flex-col gap-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {province}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {CITIES.filter((city) => city.province === province).map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/website-laten-maken/${city.slug}`}
                          className="text-sm font-medium text-navy underline-offset-2 transition-colors hover:text-primary hover:underline"
                        >
                          Website laten maken in {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Per branche
              </h3>
              <p className="flex flex-wrap gap-x-5 gap-y-2">
                {SECTORS.map((sector) => (
                  <Link
                    key={sector.slug}
                    href={`/website-voor/${sector.slug}`}
                    className="text-sm font-medium text-navy underline-offset-2 transition-colors hover:text-primary hover:underline"
                  >
                    Website voor {sector.name}
                  </Link>
                ))}
              </p>
            </div>
          </Container>
        </section>

        <FinalCTA dict={dict.home.finalCta} contactDict={dict.contact} />
      </RevealGroup>
    </>
  );
}
