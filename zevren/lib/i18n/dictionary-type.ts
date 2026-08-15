export interface Dictionary {
  nav: {
    work: string;
    services: string;
    about: string;
    contact: string;
    startProject: string;
    orCall: string;
  };
  footer: {
    description: string;
    navigationHeading: string;
    contactHeading: string;
    officeHeading: string;
    companyHeading: string;
    allRightsReserved: string;
    builtIn: string;
    privacyPolicy: string;
    termsAndConditions: string;
  };
  home: {
    hero: {
      badge: string;
      titleBefore: string;
      titleHighlight: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      trustLine: string;
    };
    services: { eyebrow: string; title: string; subtitle: string; learnMore: string };
    work: { eyebrow: string; title: string; subtitle: string; allConcepts: string };
    why: { eyebrow: string; title: string };
    process: { eyebrow: string; title: string; subtitle: string };
    faq: { eyebrow: string; title: string };
    finalCta: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pricingEyebrow: string;
    pricingTitle: string;
    pricingSubtitle: string;
    pricingNote: string;
    from: string;
    notSureTitle: string;
    notSureBody: string;
    notSureCta: string;
    list: Record<
      "websites" | "online-stores" | "web-applications" | "website-support",
      { title: string; summary: string; description: string; features: string[] }
    >;
  };
  pricing: {
    plans: Record<
      "starter" | "business" | "store" | "custom",
      { name: string; price: string; description: string }
    >;
  };
  whyZevren: { items: { title: string; description: string }[] };
  process: { steps: { title: string; description: string }[] };
  faq: { items: { question: string; answer: string }[] };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    howWeWorkTitle: string;
    howWeWorkP1: string;
    howWeWorkP2: string;
    valuesTitle: string;
    values: { title: string; description: string }[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    directContactTitle: string;
    officeTitle: string;
    expectTitle: string;
    expectItems: string[];
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      companyLabel: string;
      companyPlaceholder: string;
      needsLabel: string;
      needsOptions: string[];
      budgetLabel: string;
      budgetOptions: string[];
      messageLabel: string;
      messagePlaceholder: string;
      sendButton: string;
      sendingButton: string;
      successTitle: string;
      successBody: string;
      connectError: string;
      genericError: string;
      privacyPrefix: string;
      privacyLink: string;
    };
  };
  work: {
    eyebrow: string;
    title: string;
    subtitle: string;
    concept: string;
    websiteConcept: string;
    realProject: string;
    viewConcept: string;
    viewProject: string;
    allConcepts: string;
    allProjects: string;
    whatWeExplored: string;
    keyFeatures: string;
    ctaTitle: string;
    startProject: string;
    detailCtaTitle: string;
    detailCtaBody: string;
    seeMoreConcepts: string;
    seeMoreWork: string;
    conceptDisclaimer: string;
    realDisclaimer: string;
    items: Record<
      | "barbershop-website"
      | "garage-website"
      | "online-store"
      | "property-platform"
      | "ellezone"
      | "accounting-firm",
      { category: string; description: string; whatWeExplored: string; keyFeatures: string[] }
    >;
  };
}
