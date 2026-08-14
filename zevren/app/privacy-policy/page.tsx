import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacybeleid",
  description:
    "Lees hoe ZEVREN omgaat met persoonsgegevens die worden verzameld via de website en het contactformulier.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Juridisch" title="Privacybeleid" />
      <section className="py-16">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-heading prose-a:text-accent">
            <p>Laatst bijgewerkt: 14 augustus 2026</p>

            <p>
              {SITE_CONFIG.legalName} (&ldquo;ZEVREN&rdquo;, &ldquo;wij&rdquo;, &ldquo;ons&rdquo;), gevestigd aan
              {" "}
              {SITE_CONFIG.address.street}, {SITE_CONFIG.address.postalCode}{" "}
              {SITE_CONFIG.address.city}, is verantwoordelijk voor de
              verwerking van persoonsgegevens zoals beschreven in dit
              privacybeleid. We houden ons aan de Algemene Verordening
              Gegevensbescherming (AVG).
            </p>

            <h2>Welke gegevens we verwerken</h2>
            <p>
              Wanneer je het contactformulier op deze website invult,
              verwerken we de gegevens die je zelf aanlevert: je naam,
              e-mailadres, eventueel je bedrijfsnaam en de inhoud van je
              bericht. We verzamelen geen gegevens via het formulier die je
              niet zelf hebt ingevuld.
            </p>

            <h2>Waarom we deze gegevens verwerken</h2>
            <p>
              We gebruiken deze gegevens uitsluitend om te reageren op je
              aanvraag en, als daar een opdracht uit volgt, om de
              overeenkomst met je uit te voeren. De grondslag hiervoor is
              artikel 6 lid 1 sub b AVG (uitvoering van een overeenkomst of
              precontractuele maatregelen) en, waar van toepassing, ons
              gerechtvaardigd belang om vragen van geïnteresseerde bedrijven
              te beantwoorden.
            </p>

            <h2>Bewaartermijn</h2>
            <p>
              Gegevens uit het contactformulier bewaren we maximaal 24
              maanden na het laatste contactmoment, tenzij er een
              overeenkomst uit voortvloeit. In dat geval bewaren we gegevens
              zolang als nodig is voor de uitvoering van de overeenkomst en
              de wettelijke bewaartermijnen die daarna gelden, zoals de
              fiscale bewaarplicht van 7 jaar voor administratieve gegevens.
            </p>

            <h2>Delen met derden</h2>
            <p>
              We verkopen geen persoonsgegevens aan derden. We maken gebruik
              van een beperkt aantal verwerkers om deze website en onze
              dienstverlening te laten functioneren, zoals onze
              hostingpartij (Vercel) en, zodra geconfigureerd, een
              e-maildienst voor het afhandelen van formulierinzendingen (
              Resend). Met deze partijen zijn verwerkersovereenkomsten
              afgesloten waar de AVG dat vereist.
            </p>

            <h2>Cookies</h2>
            <p>
              Deze website gebruikt geen trackingcookies. Er worden geen
              analytics- of marketingcookies geplaatst zonder dat je daar
              vooraf toestemming voor hebt gegeven. Mocht dat in de toekomst
              veranderen, dan werken we dit privacybeleid bij en vragen we om
              expliciete toestemming waar dat wettelijk vereist is.
            </p>

            <h2>Beveiliging</h2>
            <p>
              We nemen passende technische en organisatorische maatregelen om
              persoonsgegevens te beschermen tegen verlies of onrechtmatige
              verwerking, waaronder versleutelde verbindingen (HTTPS),
              beperkte toegang tot gegevens en actuele beveiligingsupdates
              van de systemen die we gebruiken.
            </p>

            <h2>Jouw rechten</h2>
            <p>
              Je hebt het recht om je persoonsgegevens in te zien, te laten
              corrigeren of te laten verwijderen. Ook kun je bezwaar maken
              tegen de verwerking van je gegevens of ons vragen de
              verwerking te beperken. Neem hiervoor contact met ons op via{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
              Je hebt daarnaast het recht om een klacht in te dienen bij de
              Autoriteit Persoonsgegevens.
            </p>

            <h2>Wijzigingen</h2>
            <p>
              We kunnen dit privacybeleid van tijd tot tijd aanpassen. De
              meest actuele versie staat altijd op deze pagina.
            </p>

            <h2>Contact</h2>
            <p>
              Vragen over dit privacybeleid? Neem contact op via{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>{" "}
              of {SITE_CONFIG.phoneDisplay}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
