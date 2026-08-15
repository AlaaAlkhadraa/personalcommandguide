import type { Dictionary } from "@/lib/i18n/dictionary-type";

const fr: Dictionary = {
  nav: {
    work: "Réalisations",
    services: "Services",
    about: "À propos",
    contact: "Contact",
    startProject: "Démarrer un projet",
    orCall: "ou appelez le",
  },
  footer: {
    description:
      "Nous concevons et développons des sites web modernes pour les entreprises qui veulent une présence en ligne claire et professionnelle.",
    navigationHeading: "Navigation",
    contactHeading: "Contact",
    officeHeading: "Bureau",
    companyHeading: "Entreprise",
    allRightsReserved: "Tous droits réservés.",
    builtIn: "Conçu à Maastricht.",
    privacyPolicy: "Politique de confidentialité",
    termsAndConditions: "Conditions générales",
  },
  home: {
    hero: {
      badge: "Studio web à Maastricht",
      titleBefore: "Des sites qui facilitent",
      titleHighlight: "le choix de votre entreprise",
      subtitle:
        "Nous concevons et développons des sites web modernes pour les entreprises qui veulent une présence en ligne claire et professionnelle.",
      ctaPrimary: "Démarrer un projet",
      ctaSecondary: "Voir nos réalisations",
      trustLine: "Basés à Maastricht. Nous travaillons avec des entreprises du monde entier.",
    },
    services: {
      eyebrow: "Services",
      title: "Ce que nous faisons de mieux",
      subtitle:
        "D'un premier site web à une boutique en ligne ou une application sur mesure. Nous gardons une équipe restreinte pour que la communication reste directe.",
      learnMore: "En savoir plus",
    },
    work: {
      eyebrow: "Réalisations",
      title: "Concepts de sites web",
      subtitle:
        "Une sélection de concepts de sites web créés par ZEVREN pour explorer différents secteurs, mises en page et expériences numériques.",
      allConcepts: "Tous les concepts",
    },
    why: {
      eyebrow: "Pourquoi ZEVREN",
      title: "Pourquoi travailler avec ZEVREN ?",
    },
    process: {
      eyebrow: "Processus",
      title: "Comment se déroule un projet avec nous",
      subtitle:
        "Cinq étapes, du premier échange jusqu'au lancement. Chaque étape a un résultat clair, pour que vous sachiez toujours où en est votre projet.",
    },
    faq: {
      eyebrow: "Questions fréquentes",
      title: "Encore des questions ? Voici les plus fréquentes",
    },
    finalCta: {
      title: "Prêt à démarrer votre projet ?",
      subtitle:
        "Pas de discours commercial. Parlez-nous de votre projet, nous vous recontactons pour discuter de la prochaine étape.",
      ctaPrimary: "Démarrer un projet",
      ctaSecondary: "Voir nos services",
    },
  },
  services: {
    eyebrow: "Services",
    title: "Ce que nous créons",
    subtitle:
      "Nous nous concentrons sur un nombre limité de services et construisons chaque projet autour des besoins réels de l'entreprise.",
    pricingEyebrow: "Tarifs",
    pricingTitle: "Tarifs de départ",
    pricingSubtitle: "Chaque projet est tarifé selon ce dont vous avez réellement besoin.",
    pricingNote: "Le tarif final dépend de l'ampleur et des exigences du projet.",
    from: "À partir de",
    notSureTitle: "Vous ne savez pas quel service vous convient ?",
    notSureBody:
      "Expliquez-nous votre besoin lors d'un court échange. Nous vous donnerons une réponse honnête, même si cette réponse est « pas encore ».",
    notSureCta: "Démarrer un projet",
    list: {
      websites: {
        title: "Sites web",
        summary:
          "Des sites web modernes conçus autour de votre entreprise, de vos clients et de ce que le site doit accomplir.",
        description:
          "Nous commençons par comprendre ce que votre site doit faire, puis nous concevons et développons en conséquence. Pas un thème tout fait avec votre logo dessus.",
        features: [
          "Design sur mesure, pas un modèle",
          "Développé avec Next.js pour la rapidité",
          "Contenu que vous pouvez modifier vous-même",
          "Fonctionne bien sur tous les appareils",
        ],
      },
      "online-stores": {
        title: "Boutiques en ligne",
        summary:
          "Des boutiques en ligne claires qui facilitent la navigation et la commande pour vos clients.",
        description:
          "De la navigation au paiement, chaque étape est pensée pour être simple. Nous mettons en place une boutique que vous pourrez gérer vous-même une fois en ligne.",
        features: [
          "Paiement et transactions sécurisés",
          "Gestion des produits simplifiée",
          "Fiches produits claires",
          "Fonctionne bien sur mobile",
        ],
      },
      "web-applications": {
        title: "Applications web",
        summary:
          "Des tableaux de bord, portails et outils web sur mesure pour les entreprises qui ont besoin de plus qu'un site standard.",
        description:
          "Quand un outil standard ne correspond pas à votre façon de travailler, nous construisons quelque chose qui correspond vraiment.",
        features: [
          "Portails clients et tableaux de bord",
          "Outils de réservation et de planification",
          "Connexion avec vos systèmes existants",
          "Conçu autour de votre processus spécifique",
        ],
      },
      "website-support": {
        title: "Maintenance de site",
        summary: "Mises à jour, corrections et améliorations continues après la mise en ligne de votre site.",
        description: "Un site a besoin d'entretien après son lancement. Nous le maintenons à jour, sécurisé et performant.",
        features: [
          "Mises à jour de sécurité",
          "Sauvegardes régulières",
          "Petites modifications traitées rapidement",
          "Un seul point de contact",
        ],
      },
    },
  },
  pricing: {
    plans: {
      starter: { name: "Site Starter", price: "399", description: "Un site petit et ciblé pour lancer votre présence en ligne." },
      business: { name: "Site Business", price: "699", description: "Un site complet construit autour de votre entreprise et de votre contenu." },
      store: { name: "Boutique en ligne", price: "999", description: "Pour les entreprises qui veulent vendre des produits en ligne." },
      custom: { name: "Application web sur mesure", price: "1 499", description: "Pour les applications web, portails et tout ce qui va au-delà d'un site standard." },
    },
  },
  whyZevren: {
    items: [
      { title: "Petit par choix", description: "Vous travaillez directement avec la personne qui construit votre site." },
      { title: "Pas d'extras inutiles", description: "Nous nous concentrons sur ce dont votre entreprise a réellement besoin." },
      { title: "Tarifs clairs", description: "Vous savez ce que vous payez avant même de commencer." },
      { title: "Bien construit", description: "Design responsive, structure soignée et un site qui fonctionne sur tous les appareils." },
    ],
  },
  process: {
    steps: [
      { title: "Dites-nous ce dont vous avez besoin", description: "Nous découvrons votre entreprise et ce que le site doit accomplir." },
      { title: "Planifier", description: "Nous définissons les pages, contenus et fonctionnalités réellement nécessaires." },
      { title: "Concevoir", description: "Nous créons la direction visuelle et l'affinons avec vos retours." },
      { title: "Développer", description: "Nous développons le site et nous assurons que tout fonctionne correctement." },
      { title: "Lancer", description: "Nous testons le site et le préparons pour le lancement." },
    ],
  },
  faq: {
    items: [
      { question: "Combien coûte un site web ?", answer: "La plupart des projets ZEVREN démarrent à partir de 399 €. Le tarif final dépend de l'ampleur et des exigences du projet." },
      { question: "Combien de temps prend un site web ?", answer: "Le délai dépend du projet. Nous vous donnerons une estimation claire avant le début du développement." },
      { question: "Pouvez-vous refaire un site existant ?", answer: "Oui. Nous pouvons améliorer un site existant ou le reconstruire si nécessaire." },
      { question: "Travaillez-vous avec des entreprises en dehors de Maastricht ?", answer: "Oui. Maastricht est le siège du studio, pas une limite à qui nous aidons. Nous travaillons à distance avec des entreprises aux Pays-Bas et à l'international." },
      { question: "Proposez-vous un support après le lancement ?", answer: "Oui. Un support peut être mis en place après la mise en ligne du site, des petites corrections aux modifications plus importantes." },
    ],
  },
  about: {
    eyebrow: "À propos",
    title: "Un studio web indépendant à Maastricht",
    subtitle:
      "ZEVREN est un studio web indépendant basé à Maastricht, aux Pays-Bas. Nous créons des sites web et des produits numériques pour les entreprises qui veulent mieux se présenter en ligne.",
    howWeWorkTitle: "Comment nous travaillons",
    howWeWorkP1: "Nous gardons les choses simples : comprendre l'entreprise, construire ce qui est nécessaire et éviter d'ajouter des éléments pour la forme.",
    howWeWorkP2: "Nous gardons le studio petit pour rester proches de chaque projet et communiquer directement avec les personnes avec qui nous travaillons.",
    valuesTitle: "Ce qui compte pour nous",
    values: [
      { title: "Communication directe", description: "Vous travaillez directement avec la personne qui s'occupe de votre projet." },
      { title: "Des conseils francs", description: "Si quelque chose est inutile, nous vous le dirons." },
      { title: "Pas de complexité inutile", description: "Nous nous concentrons sur ce dont votre site a réellement besoin." },
      { title: "Une vision à long terme", description: "Le site doit rester utile à mesure que votre entreprise évolue." },
    ],
    ctaTitle: "Vous ne savez pas si nous sommes faits pour votre projet ?",
    ctaBody: "Parlez-nous de votre entreprise et de ce que vous voulez construire. Nous vous répondrons honnêtement.",
    ctaButton: "Démarrer un projet",
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre projet.",
    subtitle:
      "Parlez-nous brièvement de votre entreprise et de ce que vous voulez construire. Nous examinerons votre demande et vous recontacterons avec la prochaine étape.",
    directContactTitle: "Contact direct",
    officeTitle: "Bureau",
    expectTitle: "À quoi vous attendre",
    expectItems: [
      "Une réponse sous un jour ouvré",
      "Une réponse claire sur votre projet",
      "Un prix et un calendrier si nous sommes compatibles",
    ],
    form: {
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "vous@entreprise.fr",
      companyLabel: "Entreprise",
      companyPlaceholder: "Optionnel",
      needsLabel: "De quoi avez-vous besoin ?",
      needsOptions: [
        "Sélectionner une option",
        "Nouveau site web",
        "Refonte de site web",
        "Boutique en ligne",
        "Application web",
        "Maintenance de site",
        "Pas encore certain",
      ],
      budgetLabel: "Budget",
      budgetOptions: [
        "Sélectionner une option (facultatif)",
        "Moins de 1 500 €",
        "1 500 € à 3 000 €",
        "3 000 € à 5 000 €",
        "5 000 €+",
        "Pas encore certain",
      ],
      messageLabel: "Parlez-nous de votre projet",
      messagePlaceholder: "Quel est votre problème, et que voulez-vous accomplir ?",
      sendButton: "Envoyer le message",
      sendingButton: "Envoi en cours…",
      successTitle: "Message envoyé",
      successBody: "Merci de nous avoir contactés. Nous répondons généralement sous un jour ouvré.",
      connectError: "Connexion impossible. Vérifiez votre connexion internet et réessayez.",
      genericError: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      privacyPrefix: "En envoyant ce formulaire, vous acceptez notre",
      privacyLink: "politique de confidentialité",
    },
  },
  work: {
    eyebrow: "Réalisations",
    title: "Concepts de sites web",
    subtitle:
      "Une sélection de concepts de sites web créés par ZEVREN pour explorer différents secteurs, mises en page et expériences numériques. Chacun est une démo fonctionnelle, pas une simple capture d'écran.",
    concept: "Concept",
    websiteConcept: "Concept de site web",
    realProject: "Projet réel",
    viewConcept: "Voir le concept",
    viewProject: "Voir le projet",
    allConcepts: "Tous les concepts",
    allProjects: "Tous les projets",
    whatWeExplored: "Ce que nous avons exploré",
    keyFeatures: "Fonctionnalités clés",
    ctaTitle: "Votre projet pourrait être le prochain",
    startProject: "Démarrer un projet",
    detailCtaTitle: "Vous voulez quelque chose de similaire pour votre entreprise ?",
    detailCtaBody: "Chaque projet commence par une conversation sur ce dont vous avez réellement besoin, pas un modèle que nous adaptons.",
    seeMoreConcepts: "Voir plus de concepts",
    seeMoreWork: "Voir plus de réalisations",
    conceptDisclaimer: "CONCEPT ZEVREN : un concept de site web créé par ZEVREN pour démontrer comment ce type d'expérience numérique pourrait fonctionner.",
    realDisclaimer: "PROJET RÉEL ZEVREN : un site web créé par ZEVREN pour une entreprise réelle.",
    items: {
      "barbershop-website": {
        category: "Salon de coiffure",
        description: "Un site web moderne pour barbier avec réservation en ligne, choix du service et une expérience client simple.",
        whatWeExplored: "Ce concept explore comment un salon de coiffure moderne pourrait faciliter la prise de rendez-vous grâce à un site simple, pensé d'abord pour mobile.",
        keyFeatures: ["Réservation de rendez-vous en ligne", "Choix du service", "Choix du coiffeur", "Créneaux disponibles", "Design mobile-first"],
      },
      "garage-website": {
        category: "Automobile",
        description: "Un site professionnel pour garage automobile axé sur l'entretien, les contrôles et les rendez-vous en ligne.",
        whatWeExplored: "Ce concept explore comment un garage pourrait permettre aux clients de réserver un entretien en ligne et de partager les détails de leur véhicule à l'avance, plutôt que tout gérer par téléphone.",
        keyFeatures: ["Réservation de service en ligne", "Champ immatriculation", "Détails du véhicule", "Planification des rendez-vous", "Aperçu des services"],
      },
      "online-store": {
        category: "E-commerce",
        description: "Une boutique en ligne complète pour des produits de maison et de style de vie haut de gamme, de la navigation au paiement.",
        whatWeExplored: "Ce concept explore à quoi pourrait ressembler une boutique haut de gamme d'articles pour la maison en ligne, de la découverte des produits à un paiement simple et clair.",
        keyFeatures: ["Catalogue de produits", "Filtrage des produits", "Panier d'achat", "Processus de paiement", "Confirmation de commande"],
      },
      "property-platform": {
        category: "Application web sur mesure",
        description: "Une plateforme de location immobilière avec recherche, filtrage et demandes de visite, construite comme une application web sur mesure.",
        whatWeExplored: "Ce concept explore comment une plateforme immobilière pourrait aider les locataires à chercher, filtrer et demander des visites sans avoir à appeler chaque annonce individuellement.",
        keyFeatures: ["Recherche de biens", "Filtrage avancé", "Détails du bien", "Biens sauvegardés", "Demandes de visite"],
      },
      ellezone: {
        category: "E-commerce",
        description: "Un concept de boutique en ligne haut de gamme pour ElleZone, un pot à épices en verre avec doseur intégré.",
        whatWeExplored: "Ce concept explore à quoi pourrait ressembler le lancement d'une boutique en ligne centrée sur un seul produit, de la fiche produit au paiement, en passant par la liste d'envies et un aperçu de compte simple.",
        keyFeatures: ["Variantes de produit", "Liste d'envies", "Panier d'achat", "Processus de paiement", "Aperçu du compte"],
      },
      "accounting-firm": {
        category: "Services professionnels",
        description: "Un concept de site web et de portail client pour un cabinet comptable néerlandais, de la comptabilité à la TVA et aux comptes annuels.",
        whatWeExplored: "Ce concept explore comment un cabinet comptable pourrait associer un site web clair à un portail client simple, permettant aux clients de voir factures, documents et échéances au même endroit.",
        keyFeatures: ["Pages de services et tarifs", "Demande de rendez-vous", "Tableau de bord du portail client", "Factures et documents", "Aperçu TVA et financier"],
      },
    },
  },
};

export default fr;
