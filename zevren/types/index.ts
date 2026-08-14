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

export type ServiceIcon =
  | "code"
  | "layers"
  | "cart"
  | "search"
  | "wrench"
  | "compass";

export interface PortfolioItem {
  slug: string;
  name: string;
  category: string;
  summary: string;
  result: string;
  year: string;
  tags: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
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

export interface ContactFormValues {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
  website: string;
}
