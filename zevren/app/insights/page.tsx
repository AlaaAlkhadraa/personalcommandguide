import Link from "next/link";
import { headers } from "next/headers";

import { ARTICLES, resolveContent } from "@/lib/insights/articles";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd, buildMetadata, localizedUrl } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export async function generateMetadata() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return buildMetadata({
    title: dict.insights.metaTitle,
    description: dict.insights.metaDescription,
    path: "/insights",
    locale,
  });
}

export default async function InsightsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.insights;
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ARTICLES.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: localizedUrl(`/insights/${article.slug}`, locale),
      name: resolveContent(article, locale).content.title,
    })),
  };

  return (
    <>
      <JsonLd data={listJsonLd} nonce={nonce} />
      <JsonLd
        data={breadcrumbJsonLd(dict.nav.home, [{ name: t.eyebrow, path: "/insights" }], locale)}
        nonce={nonce}
      />
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.subtitle} />
      <RevealGroup>
        <section className="py-14 sm:py-20">
          <Container data-reveal-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => {
              const { content, category } = resolveContent(article, locale);
              return (
                <Link
                  key={article.slug}
                  href={`/insights/${article.slug}`}
                  data-reveal-item
                  data-tilt
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-navy/60 p-6 transition-colors duration-300 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-7"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -end-14 -top-14 h-36 w-36 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="relative flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
                      {category}
                    </span>
                    <time dateTime={article.date} className="text-xs text-muted">
                      {dateFormat.format(new Date(article.date))}
                    </time>
                  </span>
                  <h2 className="relative font-heading text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-accent">
                    {content.title}
                  </h2>
                  <p className="relative flex-1 text-sm leading-relaxed text-muted">
                    {content.excerpt}
                  </p>
                  <span className="relative flex items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-muted">
                    <span>
                      {article.readingMinutes} {t.minuteRead}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-accent">
                      {t.readMore}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                      >
                        &rarr;
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </Container>
        </section>
      </RevealGroup>
    </>
  );
}
