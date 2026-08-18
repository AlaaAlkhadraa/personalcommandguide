import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-white/5 bg-grid-glow py-14 sm:py-24">
      <Container className="flex max-w-3xl flex-col gap-5">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-lg leading-relaxed text-muted">{description}</p>
        )}
      </Container>
    </section>
  );
}
