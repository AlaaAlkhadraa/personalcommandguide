import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-grid-glow py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="font-heading text-6xl font-semibold text-primary-light/70">
          404
        </span>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          This page doesn&apos;t exist (anymore)
        </h1>
        <p className="max-w-md text-muted">
          The page you&apos;re looking for has moved or no longer exists. Go
          back to the homepage or take a look at our services.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/">Back to homepage</Button>
          <Button href="/contact" variant="secondary">
            Get in touch
          </Button>
        </div>
      </Container>
    </section>
  );
}
