import type { LegalContent } from "@/lib/legal/types";

export const TERMS: LegalContent = {
  en: {
    eyebrow: "Legal",
    title: "Terms & Conditions",
    updated: "Last updated: 19 August 2026",
    metaTitle: "Terms & Conditions",
    metaDescription:
      "The terms and conditions that apply to quotes and agreements with ZEVREN.",
    blocks: [
      {
        type: "p",
        text: "These terms and conditions apply to all quotes, agreements and work carried out by {company} (Dutch Chamber of Commerce, KvK {kvk}), hereinafter referred to as ZEVREN.",
      },
      { type: "h2", text: "1. Applicability" },
      {
        type: "p",
        text: "These terms apply to every quote and agreement between ZEVREN and a client, unless the parties have agreed otherwise in writing. Any purchasing or other terms put forward by the client are explicitly rejected.",
      },
      { type: "h2", text: "2. Quotes and formation of the agreement" },
      {
        type: "p",
        text: "Quotes from ZEVREN are non-binding and valid for 30 days unless stated otherwise. An agreement comes into effect once the client confirms the quote in writing, including by email.",
      },
      { type: "h2", text: "3. Performance of the agreement" },
      {
        type: "p",
        text: "ZEVREN carries out the agreement to the best of its ability. Any delivery timelines stated are indicative and don't constitute a strict deadline unless explicitly agreed otherwise. Delays caused by the client not providing required content, feedback or approval on time are not ZEVREN's responsibility.",
      },
      { type: "h2", text: "4. Pricing and payment" },
      {
        type: "p",
        text: "All prices are in euros and exclusive of VAT unless stated otherwise. Unless agreed otherwise, ZEVREN invoices 50% at the start of the project and the remaining 50% on delivery. Invoices must be paid within 14 days of the invoice date. If this term is exceeded, the client is automatically in default and statutory commercial interest becomes payable.",
      },
      { type: "h2", text: "5. Changes to the assignment (additional work)" },
      {
        type: "p",
        text: "Changes to the original assignment, requested by the client, are only carried out after written approval of the resulting additional costs and any adjustment to the timeline.",
      },
      { type: "h2", text: "6. Intellectual property" },
      {
        type: "p",
        text: "Upon full payment, the client obtains the right to use the delivered website or application for the agreed purpose. Underlying source code, components and methods that ZEVREN already owned before the start of the project, or that are generically reusable, remain the property of ZEVREN.",
      },
      { type: "h2", text: "7. Maintenance and warranty" },
      {
        type: "p",
        text: "A warranty period of 30 days applies after delivery, during which ZEVREN fixes defects free of charge that are demonstrably the result of errors in the delivery. This warranty doesn't cover changes made after delivery by the client or third parties. Maintenance beyond this period is only provided under the plan described below.",
      },
      { type: "h2", text: "8. Maintenance and hosting plan" },
      {
        type: "p",
        text: "The maintenance and hosting plan is a separate, optional agreement alongside the build. The fee is invoiced monthly in advance and is exclusive of VAT.",
      },
      { type: "p", text: "The plan covers:" },
      {
        type: "ul",
        items: [
          "Hosting of the website and management of the domain name",
          "Backups and restoring the site if something goes wrong",
          "Security patches and software updates",
          "Text and image changes requested by the client, up to one hour per month. Unused time doesn't carry over to the next month.",
        ],
      },
      {
        type: "p",
        text: "New pages, new features, redesigns and any work beyond the hour included fall outside the plan and are quoted separately before the work starts.",
      },
      { type: "h3", text: "8.1 Term and cancellation" },
      {
        type: "p",
        text: "The first month is a trial month. The client may end the plan at any point during that first month, in writing, without giving a reason and without any cancellation charge. The month already started is payable; nothing further is owed.",
      },
      {
        type: "p",
        text: "If the plan isn't ended during the trial month, a term of 12 months begins when the trial month finishes. After those 12 months the plan continues for an indefinite period and either party may end it in writing at any time, observing one month's notice.",
      },
      { type: "h3", text: "8.2 What the client keeps" },
      {
        type: "p",
        text: "However and whenever the plan ends, the client keeps everything the site is made of. The domain name is registered in the client's name wherever the registrar allows it, and is transferred to the client or a registrar of their choosing at no charge. The client also receives the website files. Nothing is held back as leverage, and no transfer, exit or administration fee is charged. Hosting continues until the end of the period already paid for and stops after that.",
      },
      { type: "h3", text: "8.3 Price and payment" },
      {
        type: "p",
        text: "ZEVREN may adjust the fee once per calendar year, announced at least one month in advance. If the client doesn't accept the new fee, they may end the plan by the date it takes effect, regardless of the 12 month term. If an invoice remains unpaid after a reminder and a further 14 days, ZEVREN may suspend the plan until payment is received; the site may go offline for that period. Suspension doesn't affect the client's right to their domain name and files under 8.2.",
      },
      { type: "h2", text: "9. Liability" },
      {
        type: "p",
        text: "ZEVREN's liability for damages arising from the performance of the agreement is limited to the amount invoiced for the relevant assignment, with a maximum of EUR 10,000. ZEVREN is never liable for indirect damages, including lost profit or consequential loss. This limitation doesn't apply in cases of intent or deliberate recklessness on ZEVREN's part.",
      },
      { type: "h2", text: "10. Termination and dissolution" },
      {
        type: "p",
        text: "Either party may terminate the agreement in writing, observing a reasonable notice period. In the event of early termination, the client is required to pay for work already carried out, at the agreed rate.",
      },
      { type: "h2", text: "11. Governing law and disputes" },
      {
        type: "p",
        text: "Dutch law applies to all agreements with ZEVREN. Disputes are submitted in the first instance to the competent court in the Limburg district, unless mandatory law provides otherwise.",
      },
      { type: "h2", text: "Contact" },
      { type: "p", text: "Questions about these terms? Reach out via {email}." },
    ],
  },

  nl: {
    eyebrow: "Juridisch",
    title: "Algemene voorwaarden",
    updated: "Laatst bijgewerkt: 19 augustus 2026",
    metaTitle: "Algemene voorwaarden",
    metaDescription:
      "De algemene voorwaarden die gelden voor offertes en overeenkomsten met ZEVREN.",
    blocks: [
      {
        type: "p",
        text: "Deze algemene voorwaarden gelden voor alle offertes, overeenkomsten en werkzaamheden van {company} (KvK {kvk}), hierna ZEVREN genoemd.",
      },
      { type: "h2", text: "1. Toepasselijkheid" },
      {
        type: "p",
        text: "Deze voorwaarden gelden voor elke offerte en overeenkomst tussen ZEVREN en een opdrachtgever, tenzij partijen schriftelijk iets anders zijn overeengekomen. Inkoop- of andere voorwaarden van de opdrachtgever worden uitdrukkelijk van de hand gewezen.",
      },
      { type: "h2", text: "2. Offertes en totstandkoming van de overeenkomst" },
      {
        type: "p",
        text: "Offertes van ZEVREN zijn vrijblijvend en 30 dagen geldig, tenzij anders vermeld. De overeenkomst komt tot stand zodra de opdrachtgever de offerte schriftelijk bevestigt, e-mail daaronder begrepen.",
      },
      { type: "h2", text: "3. Uitvoering van de overeenkomst" },
      {
        type: "p",
        text: "ZEVREN voert de overeenkomst naar beste kunnen uit. Genoemde opleverdata zijn indicatief en gelden niet als fatale termijn, tenzij dat uitdrukkelijk is afgesproken. Vertraging doordat de opdrachtgever content, feedback of goedkeuring niet op tijd aanlevert, komt niet voor rekening van ZEVREN.",
      },
      { type: "h2", text: "4. Prijzen en betaling" },
      {
        type: "p",
        text: "Alle prijzen zijn in euro's en exclusief btw, tenzij anders vermeld. Tenzij anders afgesproken factureert ZEVREN 50% bij aanvang van het project en de resterende 50% bij oplevering. Facturen moeten binnen 14 dagen na factuurdatum betaald zijn. Bij overschrijding van die termijn is de opdrachtgever van rechtswege in verzuim en is de wettelijke handelsrente verschuldigd.",
      },
      { type: "h2", text: "5. Wijzigingen in de opdracht (meerwerk)" },
      {
        type: "p",
        text: "Wijzigingen op de oorspronkelijke opdracht, aangevraagd door de opdrachtgever, worden pas uitgevoerd na schriftelijke akkoordverklaring op de daaruit voortvloeiende meerkosten en een eventuele aanpassing van de planning.",
      },
      { type: "h2", text: "6. Intellectueel eigendom" },
      {
        type: "p",
        text: "Na volledige betaling verkrijgt de opdrachtgever het recht de opgeleverde website of applicatie te gebruiken voor het overeengekomen doel. Onderliggende broncode, componenten en methodes die ZEVREN al vóór aanvang van het project bezat, of die generiek herbruikbaar zijn, blijven eigendom van ZEVREN.",
      },
      { type: "h2", text: "7. Onderhoud en garantie" },
      {
        type: "p",
        text: "Na oplevering geldt een garantietermijn van 30 dagen waarin ZEVREN kosteloos gebreken herstelt die aantoonbaar het gevolg zijn van fouten in de oplevering. Deze garantie geldt niet voor wijzigingen die na oplevering door de opdrachtgever of derden zijn aangebracht. Onderhoud na deze periode wordt uitsluitend geleverd onder het hieronder beschreven abonnement.",
      },
      { type: "h2", text: "8. Onderhouds- en hostingabonnement" },
      {
        type: "p",
        text: "Het onderhouds- en hostingabonnement is een aparte, optionele overeenkomst naast de bouw. Het bedrag wordt maandelijks vooraf gefactureerd en is exclusief btw.",
      },
      { type: "p", text: "Het abonnement omvat:" },
      {
        type: "ul",
        items: [
          "Hosting van de website en beheer van de domeinnaam",
          "Back-ups en het herstellen van de site als er iets misgaat",
          "Beveiligingspatches en software-updates",
          "Tekst- en beeldwijzigingen op verzoek van de opdrachtgever, tot één uur per maand. Niet gebruikte tijd schuift niet door naar de volgende maand.",
        ],
      },
      {
        type: "p",
        text: "Nieuwe pagina's, nieuwe functionaliteit, herontwerpen en al het werk boven het inbegrepen uur vallen buiten het abonnement en worden vooraf apart geoffreerd.",
      },
      { type: "h3", text: "8.1 Looptijd en opzegging" },
      {
        type: "p",
        text: "De eerste maand is een proefmaand. De opdrachtgever kan het abonnement gedurende die eerste maand op elk moment schriftelijk beëindigen, zonder opgaaf van reden en zonder opzegkosten. De reeds begonnen maand is verschuldigd; verder is niets verschuldigd.",
      },
      {
        type: "p",
        text: "Wordt het abonnement niet in de proefmaand beëindigd, dan begint na afloop van die proefmaand een looptijd van 12 maanden. Na die 12 maanden loopt het abonnement voor onbepaalde tijd door en kan elke partij het op elk moment schriftelijk beëindigen met inachtneming van één maand opzegtermijn.",
      },
      { type: "h3", text: "8.2 Wat de opdrachtgever houdt" },
      {
        type: "p",
        text: "Hoe en wanneer het abonnement ook eindigt, de opdrachtgever houdt alles waaruit de site bestaat. De domeinnaam staat op naam van de opdrachtgever waar de registrar dat toelaat, en wordt kosteloos overgedragen aan de opdrachtgever of een registrar naar keuze. De opdrachtgever ontvangt daarnaast de websitebestanden. Er wordt niets achtergehouden als drukmiddel en er worden geen overdrachts-, uitstap- of administratiekosten berekend. De hosting loopt door tot het einde van de reeds betaalde periode en stopt daarna.",
      },
      { type: "h3", text: "8.3 Prijs en betaling" },
      {
        type: "p",
        text: "ZEVREN mag het bedrag eenmaal per kalenderjaar aanpassen, aangekondigd ten minste één maand van tevoren. Gaat de opdrachtgever niet akkoord met het nieuwe bedrag, dan kan hij het abonnement beëindigen per de datum waarop het ingaat, ongeacht de looptijd van 12 maanden. Blijft een factuur na een herinnering en nog eens 14 dagen onbetaald, dan mag ZEVREN het abonnement opschorten tot betaling is ontvangen; de site kan in die periode offline gaan. Opschorting doet niets af aan het recht van de opdrachtgever op zijn domeinnaam en bestanden zoals beschreven in 8.2.",
      },
      { type: "h2", text: "9. Aansprakelijkheid" },
      {
        type: "p",
        text: "De aansprakelijkheid van ZEVREN voor schade die voortvloeit uit de uitvoering van de overeenkomst is beperkt tot het voor de betreffende opdracht gefactureerde bedrag, met een maximum van EUR 10.000. ZEVREN is nooit aansprakelijk voor indirecte schade, waaronder gederfde winst en gevolgschade. Deze beperking geldt niet bij opzet of bewuste roekeloosheid van ZEVREN.",
      },
      { type: "h2", text: "10. Beëindiging en ontbinding" },
      {
        type: "p",
        text: "Elke partij kan de overeenkomst schriftelijk beëindigen met inachtneming van een redelijke opzegtermijn. Bij tussentijdse beëindiging is de opdrachtgever gehouden het reeds verrichte werk te vergoeden tegen het afgesproken tarief.",
      },
      { type: "h2", text: "11. Toepasselijk recht en geschillen" },
      {
        type: "p",
        text: "Op alle overeenkomsten met ZEVREN is Nederlands recht van toepassing. Geschillen worden in eerste aanleg voorgelegd aan de bevoegde rechter in het arrondissement Limburg, tenzij dwingend recht anders bepaalt.",
      },
      { type: "h2", text: "Contact" },
      { type: "p", text: "Vragen over deze voorwaarden? Neem contact op via {email}." },
    ],
  },

  de: {
    eyebrow: "Rechtliches",
    title: "Allgemeine Geschäftsbedingungen",
    updated: "Zuletzt aktualisiert: 19. August 2026",
    metaTitle: "Allgemeine Geschäftsbedingungen",
    metaDescription:
      "Die Bedingungen, die für Angebote und Verträge mit ZEVREN gelten.",
    blocks: [
      {
        type: "p",
        text: "Diese Geschäftsbedingungen gelten für alle Angebote, Verträge und Arbeiten von {company} (Handelsregister der Niederlande, KvK {kvk}), nachfolgend ZEVREN genannt.",
      },
      { type: "h2", text: "1. Geltungsbereich" },
      {
        type: "p",
        text: "Diese Bedingungen gelten für jedes Angebot und jeden Vertrag zwischen ZEVREN und einem Auftraggeber, sofern die Parteien nicht schriftlich etwas anderes vereinbart haben. Einkaufs- oder sonstige Bedingungen des Auftraggebers werden ausdrücklich zurückgewiesen.",
      },
      { type: "h2", text: "2. Angebote und Vertragsschluss" },
      {
        type: "p",
        text: "Angebote von ZEVREN sind freibleibend und, sofern nicht anders angegeben, 30 Tage gültig. Der Vertrag kommt zustande, sobald der Auftraggeber das Angebot schriftlich bestätigt, auch per E-Mail.",
      },
      { type: "h2", text: "3. Durchführung des Vertrags" },
      {
        type: "p",
        text: "ZEVREN führt den Vertrag nach bestem Können aus. Genannte Liefertermine sind Richtwerte und gelten nicht als Fixtermin, sofern dies nicht ausdrücklich vereinbart wurde. Verzögerungen, weil der Auftraggeber Inhalte, Feedback oder Freigaben nicht rechtzeitig bereitstellt, gehen nicht zulasten von ZEVREN.",
      },
      { type: "h2", text: "4. Preise und Zahlung" },
      {
        type: "p",
        text: "Alle Preise verstehen sich in Euro und zzgl. MwSt., sofern nicht anders angegeben. Sofern nichts anderes vereinbart ist, stellt ZEVREN 50% bei Projektbeginn und die restlichen 50% bei Lieferung in Rechnung. Rechnungen sind innerhalb von 14 Tagen ab Rechnungsdatum zu bezahlen. Bei Überschreitung dieser Frist befindet sich der Auftraggeber automatisch in Verzug und es fallen die gesetzlichen Verzugszinsen an.",
      },
      { type: "h2", text: "5. Änderungen des Auftrags (Mehrarbeit)" },
      {
        type: "p",
        text: "Vom Auftraggeber gewünschte Änderungen am ursprünglichen Auftrag werden erst nach schriftlicher Zustimmung zu den daraus entstehenden Mehrkosten und einer eventuellen Anpassung des Zeitplans ausgeführt.",
      },
      { type: "h2", text: "6. Geistiges Eigentum" },
      {
        type: "p",
        text: "Nach vollständiger Bezahlung erhält der Auftraggeber das Recht, die gelieferte Website oder Anwendung für den vereinbarten Zweck zu nutzen. Zugrunde liegender Quellcode, Komponenten und Methoden, die ZEVREN bereits vor Projektbeginn besaß oder die allgemein wiederverwendbar sind, bleiben Eigentum von ZEVREN.",
      },
      { type: "h2", text: "7. Wartung und Gewährleistung" },
      {
        type: "p",
        text: "Nach der Lieferung gilt eine Gewährleistungsfrist von 30 Tagen, in der ZEVREN Mängel kostenfrei behebt, die nachweislich auf Fehler in der Lieferung zurückgehen. Diese Gewährleistung gilt nicht für Änderungen, die nach der Lieferung durch den Auftraggeber oder Dritte vorgenommen wurden. Wartung darüber hinaus erfolgt ausschließlich im Rahmen des unten beschriebenen Vertrags.",
      },
      { type: "h2", text: "8. Wartungs- und Hostingvertrag" },
      {
        type: "p",
        text: "Der Wartungs- und Hostingvertrag ist eine gesonderte, optionale Vereinbarung neben der Erstellung. Der Betrag wird monatlich im Voraus berechnet und versteht sich zzgl. MwSt.",
      },
      { type: "p", text: "Der Vertrag umfasst:" },
      {
        type: "ul",
        items: [
          "Hosting der Website und Verwaltung des Domainnamens",
          "Backups und Wiederherstellung der Website, falls etwas schiefgeht",
          "Sicherheitspatches und Software-Updates",
          "Text- und Bildänderungen auf Wunsch des Auftraggebers, bis zu einer Stunde pro Monat. Nicht genutzte Zeit wird nicht in den Folgemonat übertragen.",
        ],
      },
      {
        type: "p",
        text: "Neue Seiten, neue Funktionen, Neugestaltungen und alle Arbeiten über die enthaltene Stunde hinaus fallen nicht unter den Vertrag und werden vor Beginn gesondert angeboten.",
      },
      { type: "h3", text: "8.1 Laufzeit und Kündigung" },
      {
        type: "p",
        text: "Der erste Monat ist ein Probemonat. Der Auftraggeber kann den Vertrag während dieses ersten Monats jederzeit schriftlich beenden, ohne Angabe von Gründen und ohne Kündigungsgebühr. Der bereits begonnene Monat ist zu zahlen; darüber hinaus ist nichts geschuldet.",
      },
      {
        type: "p",
        text: "Wird der Vertrag nicht im Probemonat beendet, beginnt nach Ablauf des Probemonats eine Laufzeit von 12 Monaten. Nach diesen 12 Monaten läuft der Vertrag auf unbestimmte Zeit weiter und kann von jeder Partei jederzeit schriftlich mit einer Frist von einem Monat gekündigt werden.",
      },
      { type: "h3", text: "8.2 Was der Auftraggeber behält" },
      {
        type: "p",
        text: "Wie und wann der Vertrag auch endet, der Auftraggeber behält alles, woraus die Website besteht. Der Domainname wird auf den Namen des Auftraggebers registriert, soweit die Registrierungsstelle dies zulässt, und kostenfrei an den Auftraggeber oder eine Registrierungsstelle seiner Wahl übertragen. Der Auftraggeber erhält außerdem die Website-Dateien. Nichts wird als Druckmittel zurückgehalten, und es werden keine Übertragungs-, Ausstiegs- oder Verwaltungsgebühren berechnet. Das Hosting läuft bis zum Ende des bereits bezahlten Zeitraums und endet danach.",
      },
      { type: "h3", text: "8.3 Preis und Zahlung" },
      {
        type: "p",
        text: "ZEVREN darf den Betrag einmal pro Kalenderjahr anpassen, mit einer Ankündigung von mindestens einem Monat. Stimmt der Auftraggeber dem neuen Betrag nicht zu, kann er den Vertrag zum Wirksamkeitsdatum beenden, unabhängig von der Laufzeit von 12 Monaten. Bleibt eine Rechnung nach einer Mahnung und weiteren 14 Tagen unbezahlt, darf ZEVREN den Vertrag bis zum Zahlungseingang aussetzen; die Website kann in diesem Zeitraum offline gehen. Eine Aussetzung berührt das Recht des Auftraggebers auf seinen Domainnamen und seine Dateien gemäß 8.2 nicht.",
      },
      { type: "h2", text: "9. Haftung" },
      {
        type: "p",
        text: "Die Haftung von ZEVREN für Schäden aus der Durchführung des Vertrags ist auf den für den betreffenden Auftrag in Rechnung gestellten Betrag begrenzt, höchstens jedoch EUR 10.000. ZEVREN haftet nie für indirekte Schäden, einschließlich entgangenen Gewinns und Folgeschäden. Diese Beschränkung gilt nicht bei Vorsatz oder bewusster Fahrlässigkeit seitens ZEVREN.",
      },
      { type: "h2", text: "10. Beendigung und Auflösung" },
      {
        type: "p",
        text: "Jede Partei kann den Vertrag schriftlich unter Einhaltung einer angemessenen Frist beenden. Bei vorzeitiger Beendigung ist der Auftraggeber verpflichtet, bereits erbrachte Leistungen zum vereinbarten Satz zu vergüten.",
      },
      { type: "h2", text: "11. Anwendbares Recht und Streitigkeiten" },
      {
        type: "p",
        text: "Auf alle Verträge mit ZEVREN ist niederländisches Recht anwendbar. Streitigkeiten werden in erster Instanz dem zuständigen Gericht im Bezirk Limburg vorgelegt, sofern zwingendes Recht nichts anderes bestimmt.",
      },
      { type: "h2", text: "Kontakt" },
      { type: "p", text: "Fragen zu diesen Bedingungen? Melden Sie sich unter {email}." },
    ],
  },

  fr: {
    eyebrow: "Mentions légales",
    title: "Conditions générales",
    updated: "Dernière mise à jour : 19 août 2026",
    metaTitle: "Conditions générales",
    metaDescription:
      "Les conditions générales applicables aux devis et aux contrats conclus avec ZEVREN.",
    blocks: [
      {
        type: "p",
        text: "Les présentes conditions générales s'appliquent à tous les devis, contrats et travaux réalisés par {company} (registre du commerce néerlandais, KvK {kvk}), ci-après dénommée ZEVREN.",
      },
      { type: "h2", text: "1. Champ d'application" },
      {
        type: "p",
        text: "Ces conditions s'appliquent à chaque devis et à chaque contrat entre ZEVREN et un client, sauf accord écrit contraire entre les parties. Les conditions d'achat ou autres conditions avancées par le client sont expressément écartées.",
      },
      { type: "h2", text: "2. Devis et formation du contrat" },
      {
        type: "p",
        text: "Les devis de ZEVREN sont sans engagement et valables 30 jours, sauf mention contraire. Le contrat prend effet dès que le client confirme le devis par écrit, e-mail compris.",
      },
      { type: "h2", text: "3. Exécution du contrat" },
      {
        type: "p",
        text: "ZEVREN exécute le contrat au mieux de ses capacités. Les délais de livraison indiqués sont indicatifs et ne constituent pas une échéance ferme, sauf accord exprès. Les retards dus au fait que le client ne fournit pas à temps les contenus, retours ou validations nécessaires ne sont pas imputables à ZEVREN.",
      },
      { type: "h2", text: "4. Prix et paiement" },
      {
        type: "p",
        text: "Tous les prix sont en euros et hors TVA, sauf mention contraire. Sauf accord contraire, ZEVREN facture 50% au démarrage du projet et les 50% restants à la livraison. Les factures sont payables dans les 14 jours suivant leur date. En cas de dépassement, le client est de plein droit en défaut et les intérêts commerciaux légaux deviennent exigibles.",
      },
      { type: "h2", text: "5. Modifications de la mission (travaux supplémentaires)" },
      {
        type: "p",
        text: "Les modifications de la mission initiale demandées par le client ne sont exécutées qu'après validation écrite des coûts supplémentaires qui en découlent et de toute adaptation du planning.",
      },
      { type: "h2", text: "6. Propriété intellectuelle" },
      {
        type: "p",
        text: "Après paiement intégral, le client obtient le droit d'utiliser le site ou l'application livrés pour l'usage convenu. Le code source, les composants et les méthodes sous-jacents que ZEVREN possédait déjà avant le début du projet, ou qui sont réutilisables de manière générique, restent la propriété de ZEVREN.",
      },
      { type: "h2", text: "7. Maintenance et garantie" },
      {
        type: "p",
        text: "Une période de garantie de 30 jours s'applique après la livraison, pendant laquelle ZEVREN corrige gratuitement les défauts résultant manifestement d'erreurs de livraison. Cette garantie ne couvre pas les modifications apportées après la livraison par le client ou par des tiers. La maintenance au-delà de cette période est uniquement assurée dans le cadre de la formule décrite ci-dessous.",
      },
      { type: "h2", text: "8. Formule de maintenance et d'hébergement" },
      {
        type: "p",
        text: "La formule de maintenance et d'hébergement est un contrat distinct et facultatif, en complément de la création. Le montant est facturé mensuellement d'avance et s'entend hors TVA.",
      },
      { type: "p", text: "La formule comprend :" },
      {
        type: "ul",
        items: [
          "L'hébergement du site et la gestion du nom de domaine",
          "Les sauvegardes et la restauration du site en cas de problème",
          "Les correctifs de sécurité et les mises à jour logicielles",
          "Les modifications de textes et d'images demandées par le client, jusqu'à une heure par mois. Le temps non utilisé n'est pas reporté au mois suivant.",
        ],
      },
      {
        type: "p",
        text: "Les nouvelles pages, les nouvelles fonctionnalités, les refontes et tout travail au-delà de l'heure incluse sortent du cadre de la formule et font l'objet d'un devis distinct avant le démarrage.",
      },
      { type: "h3", text: "8.1 Durée et résiliation" },
      {
        type: "p",
        text: "Le premier mois est un mois d'essai. Le client peut mettre fin à la formule à tout moment pendant ce premier mois, par écrit, sans justification et sans frais de résiliation. Le mois déjà entamé est dû ; rien d'autre n'est exigible.",
      },
      {
        type: "p",
        text: "Si la formule n'est pas résiliée pendant le mois d'essai, une durée de 12 mois commence à la fin de ce mois d'essai. Au terme de ces 12 mois, la formule se poursuit pour une durée indéterminée et chaque partie peut y mettre fin par écrit à tout moment, moyennant un préavis d'un mois.",
      },
      { type: "h3", text: "8.2 Ce que le client conserve" },
      {
        type: "p",
        text: "Quelles que soient les modalités et la date de fin de la formule, le client conserve tout ce qui compose son site. Le nom de domaine est enregistré au nom du client partout où le bureau d'enregistrement le permet, et lui est transféré, ou transféré au bureau d'enregistrement de son choix, sans frais. Le client reçoit également les fichiers du site. Rien n'est retenu comme moyen de pression et aucun frais de transfert, de sortie ou d'administration n'est facturé. L'hébergement se poursuit jusqu'à la fin de la période déjà payée, puis prend fin.",
      },
      { type: "h3", text: "8.3 Prix et paiement" },
      {
        type: "p",
        text: "ZEVREN peut ajuster le montant une fois par année civile, avec un préavis d'au moins un mois. Si le client n'accepte pas le nouveau montant, il peut mettre fin à la formule à la date de son entrée en vigueur, indépendamment de la durée de 12 mois. Si une facture reste impayée après une relance et 14 jours supplémentaires, ZEVREN peut suspendre la formule jusqu'au paiement ; le site peut être hors ligne pendant cette période. La suspension ne porte pas atteinte au droit du client sur son nom de domaine et ses fichiers, prévu au point 8.2.",
      },
      { type: "h2", text: "9. Responsabilité" },
      {
        type: "p",
        text: "La responsabilité de ZEVREN pour les dommages découlant de l'exécution du contrat est limitée au montant facturé pour la mission concernée, avec un maximum de 10 000 EUR. ZEVREN n'est jamais responsable des dommages indirects, y compris le manque à gagner et les pertes consécutives. Cette limitation ne s'applique pas en cas d'intention ou de négligence délibérée de la part de ZEVREN.",
      },
      { type: "h2", text: "10. Fin du contrat et résolution" },
      {
        type: "p",
        text: "Chaque partie peut mettre fin au contrat par écrit, moyennant un préavis raisonnable. En cas de fin anticipée, le client est tenu de payer les travaux déjà réalisés au tarif convenu.",
      },
      { type: "h2", text: "11. Droit applicable et litiges" },
      {
        type: "p",
        text: "Le droit néerlandais s'applique à tous les contrats conclus avec ZEVREN. Les litiges sont soumis en première instance au tribunal compétent de l'arrondissement du Limbourg, sauf disposition impérative contraire.",
      },
      { type: "h2", text: "Contact" },
      { type: "p", text: "Des questions sur ces conditions ? Écrivez-nous à {email}." },
    ],
  },

  es: {
    eyebrow: "Legal",
    title: "Términos y condiciones",
    updated: "Última actualización: 19 de agosto de 2026",
    metaTitle: "Términos y condiciones",
    metaDescription:
      "Los términos y condiciones aplicables a los presupuestos y contratos con ZEVREN.",
    blocks: [
      {
        type: "p",
        text: "Estos términos y condiciones se aplican a todos los presupuestos, contratos y trabajos realizados por {company} (registro mercantil neerlandés, KvK {kvk}), en adelante ZEVREN.",
      },
      { type: "h2", text: "1. Ámbito de aplicación" },
      {
        type: "p",
        text: "Estos términos se aplican a cada presupuesto y contrato entre ZEVREN y un cliente, salvo que las partes hayan acordado otra cosa por escrito. Cualquier condición de compra u otra condición propuesta por el cliente queda expresamente rechazada.",
      },
      { type: "h2", text: "2. Presupuestos y formación del contrato" },
      {
        type: "p",
        text: "Los presupuestos de ZEVREN no son vinculantes y tienen una validez de 30 días, salvo indicación en contrario. El contrato entra en vigor una vez que el cliente confirma el presupuesto por escrito, incluido por correo electrónico.",
      },
      { type: "h2", text: "3. Ejecución del contrato" },
      {
        type: "p",
        text: "ZEVREN ejecuta el contrato lo mejor que puede. Los plazos de entrega indicados son orientativos y no constituyen un plazo estricto, salvo acuerdo expreso en contrario. Los retrasos causados porque el cliente no facilita a tiempo el contenido, los comentarios o las aprobaciones necesarias no son responsabilidad de ZEVREN.",
      },
      { type: "h2", text: "4. Precios y pago" },
      {
        type: "p",
        text: "Todos los precios son en euros y sin IVA, salvo indicación en contrario. Salvo acuerdo en contrario, ZEVREN factura el 50% al inicio del proyecto y el 50% restante en la entrega. Las facturas deben pagarse dentro de los 14 días siguientes a su fecha. Si se supera ese plazo, el cliente incurre automáticamente en mora y se devengan los intereses comerciales legales.",
      },
      { type: "h2", text: "5. Cambios en el encargo (trabajo adicional)" },
      {
        type: "p",
        text: "Los cambios sobre el encargo original solicitados por el cliente solo se ejecutan tras la aprobación por escrito de los costes adicionales resultantes y de cualquier ajuste del calendario.",
      },
      { type: "h2", text: "6. Propiedad intelectual" },
      {
        type: "p",
        text: "Tras el pago íntegro, el cliente obtiene el derecho a usar el sitio web o la aplicación entregados para la finalidad acordada. El código fuente, los componentes y los métodos subyacentes que ZEVREN ya poseía antes del inicio del proyecto, o que son reutilizables de forma genérica, siguen siendo propiedad de ZEVREN.",
      },
      { type: "h2", text: "7. Mantenimiento y garantía" },
      {
        type: "p",
        text: "Tras la entrega se aplica un periodo de garantía de 30 días durante el cual ZEVREN corrige sin coste los defectos que sean demostrablemente consecuencia de errores en la entrega. Esta garantía no cubre los cambios realizados después de la entrega por el cliente o por terceros. El mantenimiento más allá de este periodo se presta únicamente bajo el plan descrito a continuación.",
      },
      { type: "h2", text: "8. Plan de mantenimiento y alojamiento" },
      {
        type: "p",
        text: "El plan de mantenimiento y alojamiento es un contrato aparte y opcional, adicional al desarrollo. El importe se factura mensualmente por adelantado y no incluye IVA.",
      },
      { type: "p", text: "El plan incluye:" },
      {
        type: "ul",
        items: [
          "Alojamiento del sitio web y gestión del nombre de dominio",
          "Copias de seguridad y restauración del sitio si algo falla",
          "Parches de seguridad y actualizaciones de software",
          "Cambios de textos e imágenes solicitados por el cliente, hasta una hora al mes. El tiempo no utilizado no se acumula para el mes siguiente.",
        ],
      },
      {
        type: "p",
        text: "Las páginas nuevas, las funcionalidades nuevas, los rediseños y cualquier trabajo que supere la hora incluida quedan fuera del plan y se presupuestan aparte antes de empezar.",
      },
      { type: "h3", text: "8.1 Duración y cancelación" },
      {
        type: "p",
        text: "El primer mes es un mes de prueba. El cliente puede finalizar el plan en cualquier momento durante ese primer mes, por escrito, sin dar motivos y sin coste de cancelación. El mes ya iniciado se abona; no se debe nada más.",
      },
      {
        type: "p",
        text: "Si el plan no se finaliza durante el mes de prueba, al terminar ese mes comienza una duración de 12 meses. Transcurridos esos 12 meses, el plan continúa por tiempo indefinido y cualquiera de las partes puede finalizarlo por escrito en cualquier momento, con un mes de preaviso.",
      },
      { type: "h3", text: "8.2 Lo que el cliente conserva" },
      {
        type: "p",
        text: "Termine como termine y cuando termine el plan, el cliente conserva todo aquello de lo que se compone su sitio. El nombre de dominio se registra a nombre del cliente siempre que el registrador lo permita, y se le transfiere a él o al registrador que elija sin coste alguno. El cliente recibe además los archivos del sitio web. No se retiene nada como medida de presión ni se cobran gastos de transferencia, de salida ni administrativos. El alojamiento continúa hasta el final del periodo ya pagado y termina después.",
      },
      { type: "h3", text: "8.3 Precio y pago" },
      {
        type: "p",
        text: "ZEVREN puede ajustar el importe una vez por año natural, anunciándolo con al menos un mes de antelación. Si el cliente no acepta el nuevo importe, puede finalizar el plan en la fecha en que entre en vigor, con independencia de la duración de 12 meses. Si una factura sigue impagada tras un recordatorio y otros 14 días, ZEVREN puede suspender el plan hasta recibir el pago; el sitio puede quedar fuera de línea durante ese periodo. La suspensión no afecta al derecho del cliente sobre su nombre de dominio y sus archivos conforme al punto 8.2.",
      },
      { type: "h2", text: "9. Responsabilidad" },
      {
        type: "p",
        text: "La responsabilidad de ZEVREN por los daños derivados de la ejecución del contrato se limita al importe facturado por el encargo correspondiente, con un máximo de 10.000 EUR. ZEVREN nunca responde de daños indirectos, incluidos el lucro cesante y los daños consecuenciales. Esta limitación no se aplica en casos de dolo o imprudencia deliberada por parte de ZEVREN.",
      },
      { type: "h2", text: "10. Finalización y resolución" },
      {
        type: "p",
        text: "Cualquiera de las partes puede finalizar el contrato por escrito, respetando un preaviso razonable. En caso de finalización anticipada, el cliente debe abonar el trabajo ya realizado a la tarifa acordada.",
      },
      { type: "h2", text: "11. Legislación aplicable y litigios" },
      {
        type: "p",
        text: "A todos los contratos con ZEVREN les es aplicable el derecho neerlandés. Los litigios se someten en primera instancia al tribunal competente del distrito de Limburgo, salvo que una norma imperativa disponga otra cosa.",
      },
      { type: "h2", text: "Contacto" },
      { type: "p", text: "¿Dudas sobre estas condiciones? Escríbenos a {email}." },
    ],
  },

  ar: {
    eyebrow: "قانوني",
    title: "الشروط والأحكام",
    updated: "آخر تحديث: 19 آب 2026",
    metaTitle: "الشروط والأحكام",
    metaDescription: "الشروط والأحكام اللي بتنطبق ع العروض والاتفاقيات مع ZEVREN.",
    blocks: [
      {
        type: "p",
        text: "هي الشروط والأحكام بتنطبق ع كل العروض والاتفاقيات والأعمال اللي بتنفذها {company} (السجل التجاري الهولندي، KvK {kvk})، ومشار إلها لاحقاً بـ ZEVREN.",
      },
      { type: "h2", text: "1. نطاق التطبيق" },
      {
        type: "p",
        text: "هي الشروط بتنطبق ع كل عرض واتفاقية بين ZEVREN والعميل، إلا إذا اتفق الطرفان ع غير هيك كتابياً. أي شروط شراء أو شروط تانية بيطرحها العميل مرفوضة صراحةً.",
      },
      { type: "h2", text: "2. العروض ونشوء الاتفاقية" },
      {
        type: "p",
        text: "عروض ZEVREN غير ملزمة وصالحة لمدة 30 يوم إلا إذا انذكر غير هيك. الاتفاقية بتصير نافذة لما العميل يأكد العرض كتابياً، بما فيه عبر الإيميل.",
      },
      { type: "h2", text: "3. تنفيذ الاتفاقية" },
      {
        type: "p",
        text: "ZEVREN بتنفذ الاتفاقية بأفضل ما تقدر. مواعيد التسليم المذكورة استرشادية وما بتشكّل موعد نهائي ملزم إلا إذا انتفق ع هيك صراحةً. التأخير الناتج عن عدم تزويد العميل للمحتوى أو الملاحظات أو الموافقات بالوقت المناسب مو مسؤولية ZEVREN.",
      },
      { type: "h2", text: "4. الأسعار والدفع" },
      {
        type: "p",
        text: "كل الأسعار باليورو وبدون ضريبة القيمة المضافة إلا إذا انذكر غير هيك. إلا إذا انتفق ع غير هيك، ZEVREN بتفوتر 50% عند بداية المشروع و50% الباقية عند التسليم. الفواتير لازم تندفع خلال 14 يوم من تاريخ الفاتورة. عند تجاوز هي المدة بيصير العميل بحالة تأخر تلقائياً وبتستحق الفوائد التجارية القانونية.",
      },
      { type: "h2", text: "5. تعديلات المهمة (أعمال إضافية)" },
      {
        type: "p",
        text: "التعديلات ع المهمة الأصلية اللي بيطلبها العميل ما بتتنفذ إلا بعد موافقة كتابية ع التكاليف الإضافية الناتجة وع أي تعديل بالجدول الزمني.",
      },
      { type: "h2", text: "6. الملكية الفكرية" },
      {
        type: "p",
        text: "بعد الدفع الكامل، بياخد العميل حق استخدام الموقع أو التطبيق المُسلَّم للغرض المتفق عليه. الكود المصدري والمكوّنات والأساليب اللي كانت ملك ZEVREN قبل بداية المشروع، أو اللي قابلة لإعادة الاستخدام بشكل عام، بتضل ملك ZEVREN.",
      },
      { type: "h2", text: "7. الصيانة والضمان" },
      {
        type: "p",
        text: "بعد التسليم في فترة ضمان 30 يوم، بتصلّح فيها ZEVREN مجاناً أي خلل ثابت إنو ناتج عن أخطاء بالتسليم. هاد الضمان ما بيغطي التعديلات اللي بيعملها العميل أو طرف تالت بعد التسليم. الصيانة بعد هي الفترة بتنقدَّم بس ضمن الاشتراك الموصوف تحت.",
      },
      { type: "h2", text: "8. اشتراك الصيانة والاستضافة" },
      {
        type: "p",
        text: "اشتراك الصيانة والاستضافة اتفاقية منفصلة واختيارية بجانب بناء الموقع. المبلغ بينفوتر شهرياً مقدماً وبدون ضريبة القيمة المضافة.",
      },
      { type: "p", text: "الاشتراك بيشمل:" },
      {
        type: "ul",
        items: [
          "استضافة الموقع وإدارة اسم الدومين",
          "نسخ احتياطي واستعادة الموقع إذا صار شي",
          "تحديثات الأمان وتحديثات البرمجيات",
          "تعديلات النصوص والصور بطلب العميل، لحد ساعة وحدة بالشهر. الوقت غير المستخدم ما بينتقل للشهر اللي بعده.",
        ],
      },
      {
        type: "p",
        text: "الصفحات الجديدة والميزات الجديدة وإعادة التصميم وأي شغل فوق الساعة المشمولة كلها خارج الاشتراك، وبتنسعّر بشكل منفصل قبل ما يبلش الشغل.",
      },
      { type: "h3", text: "8.1 المدة والإلغاء" },
      {
        type: "p",
        text: "الشهر الأول شهر تجريبي. العميل بيقدر ينهي الاشتراك بأي وقت خلال هاد الشهر الأول، كتابياً، بلا ما يعطي سبب وبلا أي رسوم إلغاء. الشهر اللي بلّش مستحق الدفع، وما في شي تاني مستحق.",
      },
      {
        type: "p",
        text: "إذا ما انتهى الاشتراك خلال الشهر التجريبي، بتبلش مدة 12 شهر بعد ما يخلص الشهر التجريبي. بعد هي الـ12 شهر بيكمّل الاشتراك لمدة غير محددة، وبيقدر أي طرف ينهيه كتابياً بأي وقت بإشعار شهر واحد.",
      },
      { type: "h3", text: "8.2 شو بياخد العميل" },
      {
        type: "p",
        text: "كيفما وقتما انتهى الاشتراك، العميل بياخد كل شي الموقع مكوّن منه. اسم الدومين مسجّل باسم العميل وين ما بيسمح المُسجِّل بهيك، وبينتقل إله أو للمُسجِّل اللي بيختاره بلا أي رسوم. والعميل كمان بياخد ملفات الموقع. ما في شي بينحجز كورقة ضغط، وما في رسوم نقل ولا خروج ولا رسوم إدارية. الاستضافة بتكمّل لآخر الفترة المدفوعة وبتوقف بعدها.",
      },
      { type: "h3", text: "8.3 السعر والدفع" },
      {
        type: "p",
        text: "ZEVREN بتقدر تعدّل المبلغ مرة وحدة بالسنة الميلادية، بإشعار مسبق شهر ع الأقل. إذا ما وافق العميل ع المبلغ الجديد، بيقدر ينهي الاشتراك بتاريخ سريانه، بغض النظر عن مدة الـ12 شهر. إذا ضلت الفاتورة غير مدفوعة بعد تذكير و14 يوم إضافية، ZEVREN بتقدر توقف الاشتراك لحد ما يوصل الدفع؛ وممكن الموقع يصير خارج الخدمة بهي الفترة. الإيقاف ما بيمس حق العميل بالدومين والملفات حسب البند 8.2.",
      },
      { type: "h2", text: "9. المسؤولية" },
      {
        type: "p",
        text: "مسؤولية ZEVREN عن الأضرار الناتجة عن تنفيذ الاتفاقية محدودة بالمبلغ المفوتر للمهمة المعنية، وبحد أقصى 10,000 يورو. ZEVREN مو مسؤولة أبداً عن الأضرار غير المباشرة، بما فيها الأرباح الفائتة والخسائر التبعية. هاد التحديد ما بينطبق بحالات القصد أو الإهمال المتعمّد من ZEVREN.",
      },
      { type: "h2", text: "10. الإنهاء والفسخ" },
      {
        type: "p",
        text: "بيقدر أي طرف ينهي الاتفاقية كتابياً بإشعار معقول. بحالة الإنهاء المبكر، العميل ملزم يدفع قيمة الشغل المنفَّذ فعلاً بالسعر المتفق عليه.",
      },
      { type: "h2", text: "11. القانون الواجب التطبيق والنزاعات" },
      {
        type: "p",
        text: "القانون الهولندي بينطبق ع كل الاتفاقيات مع ZEVREN. النزاعات بتنرفع بالدرجة الأولى للمحكمة المختصة بمنطقة ليمبورخ، إلا إذا نص القانون الآمر ع غير هيك.",
      },
      { type: "h2", text: "تواصل معنا" },
      { type: "p", text: "عندك سؤال عن هي الشروط؟ راسلنا ع {email}." },
    ],
  },
};
