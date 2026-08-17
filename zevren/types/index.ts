export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  icon: ServiceIcon;
}

export type ServiceIcon = "code" | "cart" | "wrench" | "compass" | "layers" | "search";

export interface WorkItem {
  slug: string;
  name: string;
  category: string;
  description: string;
  whatWeExplored: string;
  keyFeatures: string[];
  liveUrl?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  company?: string;
  needs?: string;
  budget?: string;
  message: string;
  website: string;
}
