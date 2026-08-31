"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0B1530] px-6 text-center font-sans text-white">
        <div className="flex flex-col items-center gap-6">
          <span className="text-6xl font-semibold text-[#60A5FA]/70">
            Oops
          </span>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-[#94A3B8]">
            That&apos;s on us, not you. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#60A5FA]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
