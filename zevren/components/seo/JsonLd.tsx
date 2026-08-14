// Structured data is rendered as a plain text child of <script>, not via
// dangerouslySetInnerHTML — React serializes string children as a text
// node, which is all a JSON-LD script tag needs. The nonce lets it run
// under the site's nonce-based CSP (see middleware.ts).
export function JsonLd({
  data,
  nonce,
}: {
  data: Record<string, unknown>;
  nonce?: string;
}) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // Browsers blank out the `nonce` attribute in the DOM after applying
      // it (so it can't be read back out), which always mismatches the
      // server-rendered value here — harmless, so hydration warnings for
      // it are suppressed.
      suppressHydrationWarning
    >
      {JSON.stringify(data)}
    </script>
  );
}
