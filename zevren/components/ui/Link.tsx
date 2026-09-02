"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeHref } from "@/lib/i18n/href";

/**
 * next/link with the language folded in: on an English page every internal
 * link points at the /en address, so the English pages link to each other
 * and a crawler can walk them. Everywhere else it is a plain Link.
 */
export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const localized = typeof href === "string" ? localizeHref(href, locale) : href;
  return <NextLink href={localized} {...rest} />;
}
