import type { MetadataRoute } from "next";
import { WORK_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { ARTICLES } from "@/lib/insights/articles";
import { CITIES } from "@/lib/local/cities";
import { SECTORS } from "@/lib/local/sectors";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/concept-bouwer", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/website-laten-maken", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/webshop-laten-maken", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/webapplicatie-laten-maken", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/process", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on the static routes: stamping the build date claimed
  // "everything changed" on every deploy, which teaches a crawler to ignore
  // the field. The articles carry their real publication dates instead.
  // Routes that exist in Dutch and English get both addresses listed, each
  // carrying the hreflang pair; the Dutch-only landing cluster, the concept
  // builder and the legal pages are listed once.
  const localized = new Set(["/", "/services", "/projects", "/insights", "/about", "/process", "/contact"]);
  const pair = (path: string) => ({
    languages: {
      nl: `${SITE_CONFIG.url}${path}`,
      en: path === "/" ? `${SITE_CONFIG.url}/en` : `${SITE_CONFIG.url}/en${path}`,
    },
  });

  const staticRoutes = routes.flatMap((route) => {
    const nl = {
      url: `${SITE_CONFIG.url}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
    if (!localized.has(route.path)) return [nl];
    return [
      { ...nl, alternates: pair(route.path) },
      {
        url: pair(route.path).languages.en,
        changeFrequency: route.changeFrequency,
        priority: route.priority - 0.1,
        alternates: pair(route.path),
      },
    ];
  });

  const workRoutes = WORK_ITEMS.flatMap((item) => {
    const path = `/projects/${item.slug}`;
    return [
      { url: `${SITE_CONFIG.url}${path}`, changeFrequency: "monthly" as const, priority: 0.6, alternates: pair(path) },
      { url: pair(path).languages.en, changeFrequency: "monthly" as const, priority: 0.5, alternates: pair(path) },
    ];
  });

  const cityRoutes = CITIES.map((city) => ({
    url: `${SITE_CONFIG.url}/website-laten-maken/${city.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const sectorRoutes = SECTORS.map((sector) => ({
    url: `${SITE_CONFIG.url}/website-voor/${sector.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articleRoutes = ARTICLES.flatMap((article) => {
    const path = `/insights/${article.slug}`;
    const lastModified = new Date(article.date);
    return [
      { url: `${SITE_CONFIG.url}${path}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7, alternates: pair(path) },
      { url: pair(path).languages.en, lastModified, changeFrequency: "monthly" as const, priority: 0.6, alternates: pair(path) },
    ];
  });

  return [...staticRoutes, ...cityRoutes, ...sectorRoutes, ...workRoutes, ...articleRoutes];
}
