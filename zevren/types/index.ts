import type { ImageKey } from "@/lib/assets";

export interface NavLink {
  /** English label, used where no dictionary is in scope (footer legal links). */
  label: string;
  href: string;
  /**
   * Key into the nav dictionary. Carried on the link itself rather than in a
   * parallel array, so reordering the menu cannot silently mislabel it.
   */
  key?: "home" | "services" | "projects" | "insights" | "about" | "process" | "contact";
  /** Shown beside the label in the mobile menu. */
  icon?: ServiceIcon;
}

export interface Service {
  slug: ServiceSlug;
  title: string;
  summary: string;
  description: string;
  features: string[];
  icon: ServiceIcon;
  /** Key into lib/assets, so each card carries its own visual. */
  image: ImageKey;
}

export type ServiceSlug =
  | "web-design"
  | "ecommerce"
  | "web-applications"
  | "ui-ux-design"
  | "maintenance"
  | "global-focus";

export type ServiceIcon =
  | "code"
  | "cart"
  | "wrench"
  | "compass"
  | "layers"
  | "search"
  | "globe"
  | "home"
  | "grid"
  | "info"
  | "mail"
  | "user"
  | "building"
  | "route";

export interface WorkItem {
  slug: WorkSlug;
  name: string;
  category: string;
  description: string;
  whatWeExplored: string;
  keyFeatures: string[];
  liveUrl?: string;
  /** Card artwork. Every concept gets its own, so no two cards repeat. */
  image: ImageKey;
}

export type WorkSlug =
  | "tajex-logistics"
  | "barbershop-website"
  | "garage-website"
  | "online-store"
  | "ellezone"
  | "accounting-firm";

export interface ContactFormValues {
  name: string;
  email: string;
  company?: string;
  needs?: string;
  budget?: string;
  projectInfo?: string;
  message: string;
  website: string;
}
