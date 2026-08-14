import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { StarRating } from "@/components/ui/StarRating";

export function Testimonials() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Reviews"
          title="What clients say"
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((testimonial) => (
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
  );
}
