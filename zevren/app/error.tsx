"use client";

import { useEffect } from "react";
import { Button, SubmitButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side console only — nothing about the error is shown to the
    // visitor beyond a generic message.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-grid-glow py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <span className="font-heading text-6xl font-semibold text-primary-light/70">
          Oops
        </span>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted">
          That&apos;s on us, not you. Try again, or head back to the
          homepage. If it keeps happening, let us know.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <SubmitButton type="button" onClick={reset}>
            Try again
          </SubmitButton>
          <Button href="/" variant="secondary">
            Back to homepage
          </Button>
        </div>
      </Container>
    </section>
  );
}
