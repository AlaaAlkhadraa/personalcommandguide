import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { TESTIMONIALS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reviews",
  description:
    "Read what ZEVREN clients think about the collaboration, communication and results of their website or online store.",
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
        title="What clients say about working with us"
        description={`An average rating of ${average} based on ${TESTIMONIALS.length} reviews from clients we've recently delivered for.`}
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
