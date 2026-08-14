import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Neem contact op met ZEVREN voor een website of webshop. Plan een gesprek of stuur een bericht via het formulier.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Vertel ons over je project"
        description="Vul het formulier in of neem direct contact op. We reageren doorgaans binnen één werkdag."
      />
      <section className="py-20">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Direct contact
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="transition-colors hover:text-white"
                >
                  {SITE_CONFIG.email}
                </a>
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="transition-colors hover:text-white"
                >
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Kantoor</h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
                {SITE_CONFIG.address.street}
                <br />
                {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
                <br />
                {SITE_CONFIG.address.country}
              </address>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Wat je kunt verwachten
              </h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
                <li>Reactie binnen één werkdag</li>
                <li>Een kort, vrijblijvend kennismakingsgesprek</li>
                <li>Een vast voorstel met prijs en planning</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface/50 p-8 sm:p-10">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
