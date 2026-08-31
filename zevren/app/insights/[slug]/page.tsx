import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { ARTICLES, getArticle, resolveContent, type ArticleBlock } from "@/lib/insights/articles";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const { content } = resolveContent(article, await getLocale());
  return buildMetadata({
    title: content.title,
    description: content.excerpt,
    path: `/insights/${slug}`,
  });
}

function Block({ block }: { block: ArticleBlock }) {
  if (block.type === "h2") {
    return (
      <h2 className="pt-4 font-heading text-2xl font-bold leading-snug text-navy">
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="flex flex-col gap-3">
        {(block.items ?? []).map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-slate-700">
            <svg
              viewBox="0 0 20 20"
              className="mt-1.5 h-4 w-4 shrink-0 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-base leading-relaxed text-slate-700">{block.text}</p>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.insights;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const { content, category, isEnglishFallback } = resolveContent(article, locale);

  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const index = ARTICLES.findIndex((a) => a.slug === article.slug);
  const previous = ARTICLES[index - 1];
  const next = ARTICLES[index + 1];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.excerpt,
    datePublished: article.date,
    inLanguage: isEnglishFallback ? "en" : locale,
    url: `${SITE_CONFIG.url}/insights/${article.slug}`,
    author: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/zevren-wordmark.png` },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: SITE_CONFIG.url },
      { "@type": "ListItem", position: 2, name: t.eyebrow, item: `${SITE_CONFIG.url}/insights` },
      {
        "@type": "ListItem",
        position: 3,
        name: content.title,
        item: `${SITE_CONFIG.url}/insights/${article.slug}`,
      },
    ],
  };

  return (
    <RevealGroup>
      <JsonLd data={articleJsonLd} nonce={nonce} />
      <JsonLd data={breadcrumbJsonLd} nonce={nonce} />

      <section className="border-b border-white/5 bg-grid-glow py-14 sm:py-20">
        <Container className="flex max-w-3xl flex-col gap-6">
          <Link
            href="/insights"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-transform hover:-translate-x-0.5 rtl:hover:translate-x-0.5"
          >
            <span aria-hidden="true">&larr;</span>
            {t.backToInsights}
          </Link>

          <span className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
              {category}
            </span>
            <time dateTime={article.date} className="text-sm text-muted">
              {dateFormat.format(new Date(article.date))}
            </time>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted/50" />
            <span className="text-sm text-muted">
              {article.readingMinutes} {t.minuteRead}
            </span>
          </span>

          <h1
            className="font-heading text-3xl font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-5xl"
            dir={isEnglishFallback ? "ltr" : undefined}
          >
            {content.title}
          </h1>

          {isEnglishFallback && (
            <p className="w-fit rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-muted">
              {t.englishNote}
            </p>
          )}
        </Container>
      </section>

      {/* The reading surface is white on purpose: long-form text is easiest
          read as ink on paper, and the dark bands above and below frame it. */}
      <article className="bg-white py-14 sm:py-20" dir={isEnglishFallback ? "ltr" : undefined}>
        <Container className="flex max-w-3xl flex-col gap-6 text-start">
          {content.blocks.map((block, blockIndex) => (
            <Block key={blockIndex} block={block} />
          ))}
        </Container>
      </article>

      {/* Practice beats theory: every article closes with the door to a
          project, using the same fixed-price promise the article makes. */}
      <section className="border-t border-white/5 bg-surface/30 py-14 sm:py-16">
        <Container className="flex max-w-3xl flex-col items-start gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.ctaEyebrow}
          </span>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t.ctaTitle}</h2>
          <p className="max-w-xl text-base leading-relaxed text-muted">{t.ctaBody}</p>
          <div className="pt-2">
            <Button href="/contact">{t.ctaButton}</Button>
          </div>
        </Container>
      </section>

      {(previous || next) && (
        <section className="border-t border-white/5 py-10">
          <Container className="grid max-w-3xl gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/insights/${previous.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-navy/60 p-5 transition-colors hover:border-accent/50"
              >
                <span aria-hidden="true" className="text-muted/60">&larr;</span>
                <span className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-accent">
                  {resolveContent(previous, locale).content.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next && (
              <Link
                href={`/insights/${next.slug}`}
                className="group flex flex-col items-end gap-2 rounded-2xl border border-white/10 bg-navy/60 p-5 text-end transition-colors hover:border-accent/50"
              >
                <span aria-hidden="true" className="text-muted/60">&rarr;</span>
                <span className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-accent">
                  {resolveContent(next, locale).content.title}
                </span>
              </Link>
            )}
          </Container>
        </section>
      )}
    </RevealGroup>
  );
}
