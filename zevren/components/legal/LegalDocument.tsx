import { Fragment } from "react";

import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SITE_CONFIG } from "@/lib/constants";
import type { LegalBlock, LegalDocument as Doc } from "@/lib/legal/types";

/**
 * Tokens the legal texts use instead of hard-coding company details, so a
 * changed KvK number or address is corrected in one place rather than in
 * twelve translated paragraphs.
 */
const TOKENS: Record<string, { text: string; href?: string }> = {
  "{company}": { text: SITE_CONFIG.legalName },
  "{kvk}": { text: SITE_CONFIG.kvk },
  "{city}": { text: SITE_CONFIG.address.city },
  "{email}": { text: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
  "{phone}": { text: SITE_CONFIG.phoneDisplay, href: `tel:${SITE_CONFIG.phone}` },
};

const TOKEN_PATTERN = /(\{company\}|\{kvk\}|\{city\}|\{email\}|\{phone\})/g;

function withTokens(text: string) {
  return text.split(TOKEN_PATTERN).map((part, index) => {
    const token = TOKENS[part];
    if (!token) return <Fragment key={index}>{part}</Fragment>;
    return token.href ? (
      <a key={index} href={token.href}>
        {token.text}
      </a>
    ) : (
      <Fragment key={index}>{token.text}</Fragment>
    );
  });
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{withTokens(block.text)}</h2>;
    case "h3":
      return <h3>{withTokens(block.text)}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>{withTokens(item)}</li>
          ))}
        </ul>
      );
    default:
      return <p>{withTokens(block.text)}</p>;
  }
}

export function LegalDocument({ doc }: { doc: Doc }) {
  return (
    <>
      <PageHero eyebrow={doc.eyebrow} title={doc.title} />
      <section className="py-16">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-heading prose-a:text-accent">
            <p>{doc.updated}</p>
            {doc.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
