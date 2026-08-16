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
    languagesHeading: string;
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
      | "websites"
      | "online-stores"
      | "web-applications"
      | "ui-ux-design"
      | "seo-foundations"
      | "website-support",
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
    viewConcept: string;
    allConcepts: string;
    allProjects: string;
    whatWeExplored: string;
    keyFeatures: string;
    ctaTitle: string;
    startProject: string;
    detailCtaTitle: string;
    detailCtaBody: string;
    seeMoreConcepts: string;
    conceptDisclaimer: string;
    items: Record<
      | "tajex-logistics"
      | "barbershop-website"
      | "garage-website"
      | "online-store"
      | "property-platform"
      | "ellezone"
      | "accounting-firm",
      { category: string; description: string; whatWeExplored: string; keyFeatures: string[] }
    >;
  };
  demoCommon: {
    back: string;
    continueLabel: string;
    fullName: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    reschedule: string;
    cancelAppointment: string;
    bookAnother: string;
    cancelledTitle: string;
    cancelledBody: string;
    bookNew: string;
    hoursHeading: string;
    monFri: string;
    saturday: string;
    sunday: string;
    closed: string;
    locationHeading: string;
    contactHeading: string;
    footerTagline: string;
    demoNote: string;
  };
  demos: {
    barbershop: {
      navServices: string;
      navTeam: string;
      navHours: string;
      navContact: string;
      bookNow: string;
      heroLocation: string;
      heroHeading: string;
      heroSubtitle: string;
      heroCta: string;
      servicesHeading: string;
      teamHeading: string;
      galleryHeading: string;
      reviewsHeading: string;
      bookingHeading: string;
      steps: { service: string; barber: string; datetime: string; details: string; review: string; done: string };
      selectDate: string;
      selectTime: string;
      reviewHeading: string;
      summaryService: string;
      summaryBarber: string;
      summaryDate: string;
      summaryTime: string;
      summaryName: string;
      summaryContact: string;
      confirmAppointment: string;
      confirmedTitle: string;
    };
    garage: {
      navServices: string;
      navAbout: string;
      navHours: string;
      navContact: string;
      bookService: string;
      heroLocation: string;
      heroHeading: string;
      heroSubtitle: string;
      heroCta: string;
      servicesHeading: string;
      aboutHeading: string;
      galleryHeading: string;
      reviewsHeading: string;
      bookingHeading: string;
      steps: { service: string; datetime: string; details: string; review: string; done: string };
      selectDate: string;
      selectTime: string;
      kenteken: string;
      lookupButton: string;
      lookupNote: string;
      vehicleFoundLabel: string;
      carBrand: string;
      selectBrand: string;
      model: string;
      mileage: string;
      reviewHeading: string;
      summaryService: string;
      summaryDate: string;
      summaryTime: string;
      summaryVehicle: string;
      summaryMileage: string;
      summaryContact: string;
      confirmAppointment: string;
      confirmedTitle: string;
      vehicleLabel: string;
    };
    store: {
      navShop: string;
      cart: string;
      newSeason: string;
      heroHeading: string;
      heroSubtitle: string;
      shopByPack: string;
      backToShop: string;
      addToCart: string;
      yourCart: string;
      cartEmpty: string;
      subtotal: string;
      continueToCheckout: string;
      checkoutHeading: string;
      fullName: string;
      address: string;
      addressPlaceholder: string;
      city: string;
      placeOrder: string;
      orderSummary: string;
      orderConfirmedTitle: string;
      orderConfirmedBody: string;
      orderNumber: string;
    };
    property: {
      conceptBadge: string;
      navOverview: string;
      navProperties: string;
      navCalendar: string;
      navBookings: string;
      navMessages: string;
      navSettings: string;
      overviewHeading: string;
      statProperties: string;
      statActiveBookings: string;
      statRevenue: string;
      statOccupancy: string;
      recentActivityHeading: string;
      propertiesHeading: string;
      statusActive: string;
      statusDraft: string;
      markActive: string;
      markDraft: string;
      backToProperties: string;
      pricePerNight: string;
      calendarHeading: string;
      selectProperty: string;
      legendAvailable: string;
      legendBooked: string;
      legendBlocked: string;
      blockDayHint: string;
      bookingsHeading: string;
      approve: string;
      decline: string;
      statusPending: string;
      statusConfirmed: string;
      statusDeclined: string;
      messagesHeading: string;
      noMessageSelected: string;
      replyPlaceholder: string;
      send: string;
      settingsHeading: string;
      businessNameLabel: string;
      saveChanges: string;
      savedConfirmation: string;
    };
    ellezone: {
      navShop: string;
      navWishlist: string;
      navAccount: string;
      cart: string;
      heroTagline: string;
      heroHeading: string;
      heroSubtitle: string;
      shopButton: string;
      shopByPackHeading: string;
      searchPlaceholder: string;
      allColours: string;
      colour: string;
      addToCart: string;
      saveToWishlist: string;
      savedLabel: string;
      wishlistHeading: string;
      wishlistEmpty: string;
      accountHeading: string;
      accountNote: string;
      profileHeading: string;
      orderHistoryHeading: string;
      noOrdersYet: string;
      checkoutHeading: string;
      checkoutNote: string;
      postalCode: string;
      country: string;
      placeOrderDemo: string;
      orderSummary: string;
      shipping: string;
      free: string;
      total: string;
      orderConfirmedTitle: string;
      orderConfirmedBody: string;
      orderNumber: string;
    };
    accounting: {
      navServices: string;
      navPricing: string;
      navAbout: string;
      navContact: string;
      portalDemo: string;
      backToWebsite: string;
      heroHeading: string;
      heroSubtitle: string;
      requestAppointment: string;
      servicesHeading: string;
      pricingHeading: string;
      aboutHeading: string;
      aboutBody: string;
      contactHeading: string;
      fullName: string;
      phone: string;
      reason: string;
      selectReason: string;
      appointmentReceivedTitle: string;
      appointmentReceivedBody: string;
      portalNote: string;
      dashboard: string;
      invoices: string;
      documents: string;
      tasks: string;
      vatOverview: string;
      financialOverview: string;
      messages: string;
      openInvoices: string;
      openTasks: string;
      unreadMessages: string;
    };
  };
}
