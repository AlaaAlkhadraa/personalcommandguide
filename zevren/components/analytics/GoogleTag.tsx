import Script from "next/script";

import { GOOGLE_ADS_ID, adsConfigured } from "@/lib/analytics/google-ads";
import { ConsentSync } from "@/components/analytics/ConsentSync";

/**
 * The Google tag, loaded with every consent signal denied until the visitor
 * says otherwise.
 *
 * This is Google's consent mode: the tag is present from the first paint, but
 * while consent is denied it writes no cookie and reads no identifier. The
 * moment the banner is answered, ConsentSync updates the state in place, so a
 * visitor who agrees is measured on the page view they agreed on rather than
 * only from the next one.
 *
 * Order is the whole trick here. The denied default is a plain inline script
 * that the browser runs while parsing the document; gtag.js is fetched after
 * hydration. A default that arrives after the library has initialised is a
 * default that arrived too late, which is why this is not an effect.
 */
export function GoogleTag({ nonce }: { nonce?: string }) {
  if (!adsConfigured()) return null;

  return (
    <>
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html:
            "window.dataLayer=window.dataLayer||[];" +
            "function gtag(){dataLayer.push(arguments)}" +
            "window.gtag=gtag;" +
            "gtag('consent','default',{" +
            "ad_storage:'denied'," +
            "ad_user_data:'denied'," +
            "ad_personalization:'denied'," +
            "analytics_storage:'denied'," +
            "wait_for_update:500});",
        }}
      />
      <Script
        id="google-tag"
        strategy="afterInteractive"
        nonce={nonce}
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script id="google-tag-config" strategy="afterInteractive" nonce={nonce}>
        {`gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}
      </Script>
      <ConsentSync />
    </>
  );
}
