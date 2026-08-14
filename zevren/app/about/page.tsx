import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "ZEVREN is a small web development studio based in Maastricht. Read how we work and why we deliberately stay small.",
  path: "/about",
});

const VALUES = [
  {
    title: "Direct contact",
    description:
      "You talk to the people actually working on your project, not an account manager relaying messages back and forth.",
  },
  {
    title: "Honest advice",
    description:
      "If an idea isn't going to work for your audience, we'd rather say so upfront than quietly build it anyway.",
  },
  {
    title: "Fixed price, no surprises",
    description:
      "We work with a fixed proposal per project. If the scope changes, we discuss it first — never an unexpected line on the invoice.",
  },
  {
    title: "Maintenance is part of the deal",
    description:
      "A website you never update after launch is a liability a year later. We think about that before we even start building.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A small studio, on purpose"
        description="ZEVREN was founded in 2021 on a simple idea: a lot of agencies sell beautiful designs but deliver slow, hard-to-maintain websites. We wanted to do it the other way round."
      />
      <section className="py-20">
        <Container className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Our story
            </h2>
            <p className="leading-relaxed text-muted">
              We started out as two developers building freelance online
              stores for local businesses in Maastricht. What stood out: most
              clients had already worked with an agency before, and hadn&apos;t
              left over the design — they left because the site was slow,
              hard to manage, or because nobody picked up the phone after
              launch.
            </p>
            <p className="leading-relaxed text-muted">
              That&apos;s why ZEVREN is a small, fixed team rather than a growing
              agency with rotating freelancers. We deliberately take on a
              limited number of projects at a time, so every project gets the
              attention it deserves — from the first conversation to long
              after launch.
            </p>
            <p className="leading-relaxed text-muted">
              Today we work with businesses across the Netherlands and
              beyond, from sole traders to firms with twenty staff. The
              approach stays the same: understand what your visitor needs to
              do first, then design and build.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              How we work
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
          <Button href="/contact">Get in touch</Button>
        </Container>
      </section>
    </>
  );
}
