import { ADD_ONS, PLANS } from "@/lib/offer";
import { ARTICLES } from "@/lib/insights/articles";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";

/**
 * /llms.txt — the site condensed for AI assistants, in the emerging llms.txt
 * convention: an H1, a one-paragraph summary, then sections of links with a
 * one-line description each.
 *
 * Everything is generated from the same constants the pages render, so an
 * assistant quoting this file can never quote a price or a service the site
 * itself does not show. That is also why the plan names are spelled out here
 * rather than read from a locale dictionary: this file serves one language,
 * and these are the four packages as the Dutch site publishes them.
 */

const PLAN_NAMES: Record<string, string> = {
  starter: "Starter Website",
  business: "Business Website",
  store: "Webshop",
  custom: "Maatwerk Webapplicatie",
};

export const dynamic = "force-static";

export function GET(): Response {
  const base = SITE_CONFIG.url;

  const lines = [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${SITE_CONFIG.description} Independent web studio based in ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.country}, working with businesses worldwide. The site is served in Dutch, English, German, French, Spanish and Arabic. All prices are published openly; every project quote equals the published price.`,
    "",
    "## Services",
    "",
    ...SERVICES.map(
      (service) => `- [${service.title}](${base}/services#${service.slug}): ${service.summary}`
    ),
    "",
    "## Fixed prices (EUR, excl. VAT)",
    "",
    ...PLANS.map(
      (plan) => `- ${PLAN_NAMES[plan.key]}: EUR ${plan.price} one-off ([details](${base}/services))`
    ),
    `- Care plan (hosting, maintenance, small changes): EUR 49,99 per month, optional with every package`,
    ...ADD_ONS.map((addOn) =>
      addOn.key === "extraPage"
        ? `- Extra page: EUR ${addOn.price} per page`
        : `- Extra languages: EUR ${addOn.price} for three languages`
    ),
    "",
    "## Key pages",
    "",
    `- [Homepage](${base}/): what ZEVREN builds, with the four packages and prices on the page`,
    `- [Website laten maken](${base}/website-laten-maken): the Dutch service hub, with city pages for Maastricht, the Limburg region and the major Dutch cities`,
    `- [Concept builder](${base}/concept-bouwer): pick a style and colours and see a live preview of your own homepage, free and without obligation`,
    `- [Projects](${base}/projects): interactive concept demos you can click through (booking systems, a webshop with checkout, a client portal)`,
    `- [Process](${base}/process): what happens in each step from first conversation to launch`,
    `- [About](${base}/about): the studio, and who you work with`,
    `- [Contact](${base}/contact): project form, ${SITE_CONFIG.email}, ${SITE_CONFIG.phone}`,
    "",
    "## Articles",
    "",
    ...ARTICLES.map(
      (article) => `- [${article.content.en.title}](${base}/insights/${article.slug})`
    ),
    "",
    "## Business details",
    "",
    `- Legal name: ${SITE_CONFIG.legalName}`,
    `- KVK: ${SITE_CONFIG.kvk}`,
    `- VAT: ${SITE_CONFIG.btw}`,
    `- LinkedIn: ${SITE_CONFIG.social.linkedin}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
