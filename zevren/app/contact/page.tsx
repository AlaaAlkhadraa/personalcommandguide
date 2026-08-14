import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with ZEVREN about a website or online store. Book a call or send a message through the form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your project"
        description="Fill in the form or reach out directly. We typically reply within one business day."
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
              <h2 className="text-lg font-semibold text-white">Office</h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
                {SITE_CONFIG.address.city}
                <br />
                {SITE_CONFIG.address.country}
              </address>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                What to expect
              </h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
                <li>A reply within one business day</li>
                <li>A short, no-obligation introductory call</li>
                <li>A fixed proposal with price and timeline</li>
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
