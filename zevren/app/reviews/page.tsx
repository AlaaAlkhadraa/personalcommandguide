import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { TESTIMONIALS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reviews",
  description:
    "Lees wat klanten van ZEVREN vinden van de samenwerking, communicatie en resultaten van hun website of webshop.",
  path: "/reviews",
});

export default function ReviewsPage() {
  const average = (
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Wat klanten van de samenwerking vinden"
        description={`Gemiddelde score van ${average} op basis van ${TESTIMONIALS.length} beoordelingen van klanten die we recent hebben opgeleverd.`}
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.name} className="flex flex-col gap-4">
                <StarRating rating={testimonial.rating} />
                <p className="text-sm leading-relaxed text-white/90">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto pt-2">
                  <p className="text-sm font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
