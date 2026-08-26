import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ConceptBouwer } from "@/components/concept/ConceptBouwer";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({
    title: "Bouw je eigen website-concept",
    description:
      "Kies je stijl, kleuren en pagina's, zie direct hoe jouw website eruit kan zien, en vraag het concept gratis aan. Zonder verplichtingen.",
    path: "/concept-bouwer",
    locale,
  });
}

export default function ConceptBouwerPage() {
  return (
    <>
      <PageHero
        eyebrow="Concept-bouwer"
        title="Bouw je eigen website-concept"
        description="Kies je stijl en kleuren, zie direct hoe jouw website eruit kan zien — en vraag het concept gratis aan. Zonder verplichtingen."
      />
      <section className="pb-20 pt-4 sm:pt-8">
        <Container>
          <ConceptBouwer />
        </Container>
      </section>
    </>
  );
}
