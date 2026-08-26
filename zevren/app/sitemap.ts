import type { MetadataRoute } from "next";
import { WORK_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { ARTICLES } from "@/lib/insights/articles";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/concept-bouwer", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/process", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const workRoutes = WORK_ITEMS.map((item) => ({
    url: `${SITE_CONFIG.url}/projects/${item.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const articleRoutes = ARTICLES.map((article) => ({
    url: `${SITE_CONFIG.url}/insights/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...articleRoutes];
}
