import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "ZEVREN is an independent web studio based in Maastricht, Netherlands. Read how we work and what we focus on.",
  path: "/about",
});

const VALUES = [
  {
    title: "Direct communication",
    description: "You work directly with the people working on your project.",
  },
  {
    title: "Honest advice",
    description: "If something is unnecessary, we will say so.",
  },
  {
    title: "No unnecessary complexity",
    description: "We focus on what your website actually needs.",
  },
  {
    title: "Long term thinking",
    description: "The website should remain useful as your business grows.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="An independent web studio in Maastricht"
        description="ZEVREN is an independent web studio based in Maastricht, Netherlands. We build modern websites and digital experiences for businesses that want to improve the way they present themselves online."
      />
      <section className="py-20">
        <Container className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              How we work
            </h2>
            <p className="leading-relaxed text-muted">
              We are keeping the studio small so we can stay close to every
              project and communicate directly with our clients.
            </p>
            <p className="leading-relaxed text-muted">
              We are currently building our portfolio and looking for
              businesses that care about quality, clear communication and a
              strong online presence.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              What matters to us
            </h2>
            <div className="grid gap-4">
              {VALUES.map((value) => (
                <Card key={value.title} className="flex flex-col gap-2 p-6">
                  <h3 className="text-base font-semibold text-white">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="border-t border-white/5 bg-surface/30 py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-3xl font-semibold text-white">
            Wondering if we&apos;re a fit for your project?
          </h2>
          <p className="max-w-lg text-muted">
            Book a short call. No commitment, just an honest picture of
            what&apos;s possible.
          </p>
          <Button href="/contact">Start a project</Button>
        </Container>
      </section>
    </>
  );
}
