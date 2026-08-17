import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Tell ZEVREN about your website, online store or web application project. Send a message through the form and we will get back to you.",
  path: "/contact",
});

export default async function ContactPage() {
  const locale = await getLocale();
  const { contact: c } = getDictionary(locale);

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} description={c.subtitle} />
      <section className="py-20">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-semibold text-white">{c.directContactTitle}</h2>
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
              <h2 className="text-lg font-semibold text-white">{c.officeTitle}</h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
                {SITE_CONFIG.address.city}
                <br />
                {SITE_CONFIG.address.country}
              </address>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{c.expectTitle}</h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
                {c.expectItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface/50 p-8 sm:p-10">
            <ContactForm dict={c.form} />
          </div>
        </Container>
      </section>
    </>
  );
}
