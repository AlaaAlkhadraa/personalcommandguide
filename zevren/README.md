# ZEVREN — bedrijfswebsite

Website voor ZEVREN, een webdevelopment bureau uit Amsterdam. Gebouwd met
Next.js 15 (App Router), TypeScript en Tailwind CSS.

## Inhoud

- [Stack](#stack)
- [Projectstructuur](#projectstructuur)
- [Lokaal opzetten](#lokaal-opzetten)
- [Contactformulier](#contactformulier)
- [GitHub](#github)
- [Deployen naar Vercel](#deployen-naar-vercel)
- [Domein koppelen (zevren.nl)](#domein-koppelen-zevrennl)
- [Beveiligingschecklist vóór livegang](#beveiligingschecklist-vóór-livegang)
- [Onderhoudschecklist](#onderhoudschecklist)

## Beeldmateriaal

Er zit bewust geen stockfotografie in dit project — de laptop/mobiel-mockups
op de homepage (`components/home/DeviceMockups.tsx`) zijn met CSS getekend,
net als de portfolio-kaarten. Dat is beter voor laadtijd dan placeholder-
foto's, en voorkomt dat de site er sjabloonachtig uitziet met generieke
stockbeelden. Zodra er echte productfoto's, teamfoto's of klantlogo's zijn,
voeg je die toe met `next/image` (bijvoorbeeld in `PortfolioPreview.tsx` en
`about/page.tsx`) zodat ze automatisch worden geoptimaliseerd naar WebP/AVIF.

## Stack

- **Next.js 15** — App Router, React Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — met een eigen design-token set (navy/blue palette)
- **Zod** — validatie van het contactformulier
- **next/font** — Orbitron (logo), Space Grotesk (koppen), Inter (body)

## Projectstructuur

```
app/                  Routes (App Router), elke map = een pagina
  api/contact/         Route handler voor het contactformulier
  services/ portfolio/ reviews/ about/ contact/
  privacy-policy/ terms-and-conditions/
  layout.tsx           Root layout, fonts, metadata, structured data
  sitemap.ts robots.ts opengraph-image.tsx twitter-image.tsx
components/
  layout/               Navbar, Footer
  home/                 Secties van de homepage (Hero, FAQ, Process, ...)
  contact/              ContactForm
  ui/                   Herbruikbare primitives (Button, Card, Icon, ...)
  seo/                  JsonLd helper
lib/
  constants.ts          Alle site-content (diensten, portfolio, testimonials, FAQ)
  seo.ts                Metadata-helper per pagina
  validations/contact.ts Zod-schema voor het contactformulier
types/                 Gedeelde TypeScript types
public/                Statische bestanden (favicon)
```

Content aanpassen (teksten, diensten, portfolio, testimonials, FAQ) doe je in
`lib/constants.ts` — dat is de enige plek waar dit soort inhoud staat.

## Lokaal opzetten

Vereisten: Node.js 18.18 of hoger (Node 20+ aanbevolen).

```bash
# Dependencies installeren
npm install

# Development server starten
npm run dev
```

Open http://localhost:3000. Wijzigingen worden automatisch herladen.

Overige scripts:

```bash
npm run build       # Productie-build
npm run start       # Productie-server (na build)
npm run lint        # ESLint
npm run typecheck   # TypeScript, zonder output te schrijven
```

Kopieer `.env.example` naar `.env.local` als je de site-URL wilt overschrijven
of de Resend-integratie gaat toevoegen (zie hieronder). Voor lokaal draaien is
dit niet verplicht.

## Contactformulier

Het formulier (`components/contact/ContactForm.tsx`) post naar
`app/api/contact/route.ts`. Die route:

1. Valideert de invoer met Zod (`lib/validations/contact.ts`).
2. Controleert een verborgen honeypot-veld tegen spam.
3. Past een eenvoudige, in-memory rate limit toe per IP-adres.
4. Accepteert en logt de aanvraag server-side.

**E-mailverzending is nog niet aangesloten.** Er staat een duidelijke `TODO`
in `app/api/contact/route.ts` met een kant-en-klaar voorbeeld om
[Resend](https://resend.com) aan te sluiten. Kort samengevat:

```bash
npm install resend
```

```ts
// app/api/contact/route.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "ZEVREN website <noreply@zevren.nl>",
  to: process.env.CONTACT_INBOX_EMAIL!,
  replyTo: email,
  subject: `Nieuwe aanvraag van ${name}`,
  text: `...`,
});
```

Zet daarna `RESEND_API_KEY` en `CONTACT_INBOX_EMAIL` in je environment
variables (lokaal in `.env.local`, in productie in Vercel).

## GitHub

Als je met een nieuwe repository begint:

```bash
git init
git add .
git commit -m "Initial commit: ZEVREN website"
git branch -M main
git remote add origin https://github.com/<jouw-account>/zevren-website.git
git push -u origin main
```

Werk je in een bestaande repository (zoals deze), maak dan een feature branch
per wijziging en open een pull request in plaats van rechtstreeks naar main te
pushen.

## Deployen naar Vercel

1. Ga naar [vercel.com](https://vercel.com) en log in met je GitHub-account.
2. Klik op **Add New → Project** en selecteer deze repository.
3. Vercel herkent Next.js automatisch — de standaardinstellingen (build
   command `next build`, output `.next`) zijn correct, niets aanpassen nodig.
4. Voeg onder **Environment Variables** toe wat je gebruikt:
   - `NEXT_PUBLIC_SITE_URL` → `https://www.zevren.nl`
   - `RESEND_API_KEY` en `CONTACT_INBOX_EMAIL` (zodra Resend is aangesloten)
5. Klik op **Deploy**. Na een paar minuten staat de site live op een
   `*.vercel.app`-domein.

Elke push naar `main` triggert automatisch een nieuwe productie-deploy; elke
pull request krijgt een eigen preview-URL.

## Domein koppelen (zevren.nl)

1. Ga in het Vercel-project naar **Settings → Domains**.
2. Voer `zevren.nl` in en klik op **Add**. Doe hetzelfde voor `www.zevren.nl`
   en stel één van de twee in als de canonical (aanbevolen: `www.zevren.nl`
   met een redirect vanaf het kale domein, of andersom — consistent met
   `NEXT_PUBLIC_SITE_URL`).
3. Vercel toont de benodigde DNS-records. Log in bij je domeinregistrar (bijv.
   TransIP, Vimexx of een andere Nederlandse registrar) en voeg toe:
   - Een `A`-record voor `zevren.nl` naar het IP-adres dat Vercel aangeeft, of
   - Een `CNAME`-record voor `www` naar `cname.vercel-dns.com`
4. Wacht tot de DNS-wijziging is doorgevoerd (meestal binnen een uur, kan tot
   24 uur duren). Vercel geeft automatisch een geldig SSL-certificaat uit
   zodra de DNS correct staat.
5. Controleer na koppeling dat `NEXT_PUBLIC_SITE_URL` in de
   productie-environment variables overeenkomt met het uiteindelijke domein,
   zodat canonical URLs, sitemap en structured data kloppen.

## Beveiligingschecklist vóór livegang

- [ ] `NEXT_PUBLIC_SITE_URL` staat op het definitieve productiedomein
- [ ] Alle environment variables staan in Vercel, niet in de repository
- [ ] `.env.local` staat in `.gitignore` (staat er al) en is nooit gecommit
- [ ] Security headers zijn actief (gecontroleerd via
      [securityheaders.com](https://securityheaders.com) na livegang):
      CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
      Permissions-Policy — allemaal geconfigureerd in `next.config.ts`
- [ ] Contactformulier getest op zowel geldige als ongeldige invoer
- [ ] Honeypot-veld getest (verborgen veld invullen moet de submission
      stilzwijgend negeren)
- [ ] `npm audit` uitgevoerd en kritieke kwetsbaarheden opgelost
- [ ] Resend (of gekozen e-maildienst) aangesloten met een eigen, niet-gedeelde
      API key
- [ ] Alle placeholder-gegevens in `lib/constants.ts` (adres, KvK, BTW,
      telefoonnummer) vervangen door de echte bedrijfsgegevens
- [ ] robots.txt en sitemap.xml gecontroleerd op het productiedomein

**Waarom draait elke pagina dynamisch (SSR) in plaats van statisch?** De CSP
gebruikt een nonce die middleware.ts per request genereert (zie
`middleware.ts`), zodat script-src géén `unsafe-inline` nodig heeft. Een
nonce moet overeenkomen tussen de CSP-header en de HTML van hetzelfde
request — dat is onverenigbaar met vooraf gegenereerde statische pagina's.
Dit is de door Next.js gedocumenteerde aanpak voor een strikte CSP en heeft
op Vercel geen merkbare invloed op laadtijd of Lighthouse-score, omdat de
respons alsnog server-side wordt gerenderd binnen enkele tientallen
milliseconden.

## Onderhoudschecklist

Periodiek (maandelijks aanbevolen):

- [ ] `npm outdated` en `npm audit` controleren, dependencies bijwerken
- [ ] Next.js, React en Tailwind op een recente minor/patch-versie houden
- [ ] Lighthouse-score controleren (mobiel en desktop) na grotere wijzigingen
- [ ] Contactformulier end-to-end testen (verzenden, foutafhandeling)
- [ ] Uptime en Core Web Vitals in de gaten houden via Vercel Analytics of
      een externe monitor
- [ ] Inhoud in `lib/constants.ts` actueel houden (portfolio, testimonials,
      prijsindicaties in de FAQ)
- [ ] Back-up van de repository is altijd geborgd via GitHub — geen aparte
      actie nodig zolang er regelmatig wordt gepusht
