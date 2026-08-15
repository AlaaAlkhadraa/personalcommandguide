import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PricingSection } from "@/components/services/PricingSection";
import { SERVICES } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Websites, online stores, web applications and website support. See what ZEVREN can build for your business.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build"
        description="We focus on a small number of services and build each project around what the business actually needs."
      />
      <section className="py-20">
        <Container className="flex flex-col gap-20">
          {SERVICES.map((service, index) => (
            <div
              key={service.slug}
              id={service.slug}
              className="scroll-mt-28 grid gap-10 border-t border-white/10 pt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
            >
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <Icon name={service.icon} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  {service.title}
                </h2>
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-base leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-white/85"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Container>
      </section>
      <PricingSection />
      <section className="py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Not sure which service fits?
          </h2>
          <p className="max-w-lg text-muted">
            Tell us what you need in a short call. We&apos;ll give you an
            honest answer, even if that answer is &ldquo;not yet&rdquo;.
          </p>
          <Button href="/contact">Start a project</Button>
        </Container>
      </section>
    </>
  );
}
