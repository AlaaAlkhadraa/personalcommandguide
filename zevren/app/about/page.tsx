import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Over ons",
  description:
    "ZEVREN is een klein webdevelopment bureau uit Amsterdam. Lees hoe we werken en waarom we bewust klein blijven.",
  path: "/about",
});

const VALUES = [
  {
    title: "Direct contact",
    description:
      "Je schakelt met de mensen die ook daadwerkelijk aan je project werken, niet met een accountmanager die alles doorzet.",
  },
  {
    title: "Eerlijk advies",
    description:
      "Als een idee niet gaat werken voor je doelgroep, zeggen we dat liever van tevoren dan dat we het stilzwijgend bouwen.",
  },
  {
    title: "Vaste prijs, geen verrassingen",
    description:
      "We werken met een vast voorstel per project. Wijzigt de scope, dan bespreken we dat eerst — nooit een onverwachte regel op de factuur.",
  },
  {
    title: "Onderhoud hoort erbij",
    description:
      "Een website die je na oplevering nooit meer bijwerkt, is over een jaar een risico. We denken daar vooraf al over na.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Over ons"
        title="Een klein bureau, met opzet"
        description="ZEVREN is opgericht in 2021 vanuit een simpel idee: veel bureaus verkopen mooie ontwerpen, maar leveren trage, moeilijk te onderhouden websites op. Wij wilden het andersom doen."
      />
      <section className="py-20">
        <Container className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Ons verhaal
            </h2>
            <p className="leading-relaxed text-muted">
              We zijn begonnen als twee developers die freelance webshops
              bouwden voor lokale ondernemers in Amsterdam. Wat opviel: de
              meeste klanten hadden al een bureau gehad, en waren daar niet om
              het ontwerp weggegaan, maar omdat de site traag was, moeilijk te
              beheren, of omdat er na oplevering niemand meer opnam.
            </p>
            <p className="leading-relaxed text-muted">
              Dat is de reden dat ZEVREN bestaat uit een klein, vast team in
              plaats van een groeiend bureau met wisselende freelancers. We
              nemen bewust een beperkt aantal projecten tegelijk aan, zodat
              elk project de aandacht krijgt die het verdient — van het eerste
              gesprek tot lang na livegang.
            </p>
            <p className="leading-relaxed text-muted">
              Inmiddels werken we met ondernemers door heel Nederland en
              daarbuiten, van eenmanszaken tot kantoren met twintig man
              personeel. De aanpak is steeds hetzelfde: eerst begrijpen wat je
              bezoeker moet doen, dan pas ontwerpen en bouwen.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Hoe we werken
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
            Benieuwd of we bij jouw project passen?
          </h2>
          <p className="max-w-lg text-muted">
            Plan een kort gesprek. Geen verplichtingen, gewoon een eerlijk
            beeld van wat mogelijk is.
          </p>
          <Button href="/contact">Neem contact op</Button>
        </Container>
      </section>
    </>
  );
}
