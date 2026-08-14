import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Algemene voorwaarden",
  description:
    "De algemene voorwaarden die van toepassing zijn op offertes en overeenkomsten van ZEVREN.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Juridisch" title="Algemene voorwaarden" />
      <section className="py-16">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-heading prose-a:text-accent">
            <p>Laatst bijgewerkt: 14 augustus 2026</p>
            <p>
              Deze algemene voorwaarden zijn van toepassing op alle offertes,
              overeenkomsten en werkzaamheden van {SITE_CONFIG.legalName}{" "}
              (KvK {SITE_CONFIG.kvk}), hierna te noemen &ldquo;ZEVREN&rdquo;.
            </p>

            <h2>1. Toepasselijkheid</h2>
            <p>
              Deze voorwaarden gelden voor iedere offerte en overeenkomst
              tussen ZEVREN en een opdrachtgever, tenzij partijen schriftelijk
              anders zijn overeengekomen. Eventuele inkoop- of andere
              voorwaarden van de opdrachtgever worden uitdrukkelijk van de
              hand gewezen.
            </p>

            <h2>2. Offertes en totstandkoming overeenkomst</h2>
            <p>
              Offertes van ZEVREN zijn vrijblijvend en 30 dagen geldig, tenzij
              anders vermeld. Een overeenkomst komt tot stand op het moment
              dat de opdrachtgever de offerte schriftelijk (waaronder per
              e-mail) bevestigt.
            </p>

            <h2>3. Uitvoering van de overeenkomst</h2>
            <p>
              ZEVREN voert de overeenkomst naar beste inzicht en vermogen uit.
              Genoemde levertermijnen zijn indicatief en gelden niet als
              fatale termijn, tenzij uitdrukkelijk anders overeengekomen.
              Vertraging die ontstaat doordat de opdrachtgever benodigde
              content, feedback of goedkeuring niet tijdig aanlevert, komt
              niet voor rekening van ZEVREN.
            </p>

            <h2>4. Prijzen en betaling</h2>
            <p>
              Alle prijzen zijn in euro&apos;s en exclusief btw, tenzij anders
              vermeld. Tenzij anders overeengekomen factureert ZEVREN 50% bij
              aanvang van het project en de resterende 50% bij oplevering.
              Facturen dienen binnen 14 dagen na factuurdatum te worden
              voldaan. Bij overschrijding van deze termijn is de opdrachtgever
              van rechtswege in verzuim en is de wettelijke handelsrente
              verschuldigd.
            </p>

            <h2>5. Wijzigingen in de opdracht (meerwerk)</h2>
            <p>
              Wijzigingen in de oorspronkelijke opdracht, op verzoek van de
              opdrachtgever, worden pas uitgevoerd na schriftelijke
              goedkeuring van de daaruit voortvloeiende meerkosten en
              eventuele aanpassing van de planning.
            </p>

            <h2>6. Intellectueel eigendom</h2>
            <p>
              Na volledige betaling verkrijgt de opdrachtgever het recht om de
              opgeleverde website of applicatie te gebruiken voor het
              overeengekomen doel. Onderliggende broncode, componenten en
              werkwijzen die ZEVREN al bezat vóór aanvang van het project of
              die generiek herbruikbaar zijn, blijven eigendom van ZEVREN.
            </p>

            <h2>7. Onderhoud en garantie</h2>
            <p>
              Na oplevering geldt een garantietermijn van 30 dagen waarin
              ZEVREN kosteloos gebreken herstelt die aantoonbaar het gevolg
              zijn van fouten in de oplevering. Deze garantie geldt niet voor
              wijzigingen die na oplevering door de opdrachtgever of derden
              zijn aangebracht. Onderhoud na deze periode wordt alleen
              geboden onder een separaat onderhoudsabonnement.
            </p>

            <h2>8. Aansprakelijkheid</h2>
            <p>
              De aansprakelijkheid van ZEVREN voor schade die voortvloeit uit
              de uitvoering van de overeenkomst is beperkt tot het bedrag dat
              voor de betreffende opdracht in rekening is gebracht, met een
              maximum van €10.000. ZEVREN is nooit aansprakelijk voor
              indirecte schade, waaronder gederfde winst of gevolgschade.
              Deze beperking geldt niet in geval van opzet of bewuste
              roekeloosheid van ZEVREN.
            </p>

            <h2>9. Opzegging en ontbinding</h2>
            <p>
              Beide partijen kunnen de overeenkomst schriftelijk opzeggen met
              inachtneming van een redelijke termijn. Bij tussentijdse
              beëindiging is de opdrachtgever verplicht het reeds uitgevoerde
              werk te vergoeden, tegen het overeengekomen tarief.
            </p>

            <h2>10. Toepasselijk recht en geschillen</h2>
            <p>
              Op alle overeenkomsten met ZEVREN is Nederlands recht van
              toepassing. Geschillen worden in eerste instantie voorgelegd
              aan de bevoegde rechter in het arrondissement Amsterdam, tenzij
              dwingend recht anders bepaalt.
            </p>

            <h2>Contact</h2>
            <p>
              Vragen over deze voorwaarden? Neem contact op via{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
