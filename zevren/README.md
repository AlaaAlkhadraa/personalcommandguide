# ZEVREN — company website

Website for ZEVREN, a web development studio based in Maastricht. Built with
Next.js 15 (App Router), TypeScript and Tailwind CSS.

## Contents

- [Stack](#stack)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [Contact form](#contact-form)
- [GitHub](#github)
- [Deploying to Vercel](#deploying-to-vercel)
- [Connecting the domain (zevren.nl)](#connecting-the-domain-zevrennl)
- [Security checklist before launch](#security-checklist-before-launch)
- [Maintenance checklist](#maintenance-checklist)

## Imagery

There's deliberately no stock photography in this project — the laptop/
mobile mockups on the homepage (`components/home/DeviceMockups.tsx`) are
drawn with CSS, as are the portfolio cards. That's better for load time
than placeholder photos, and keeps the site from looking templated with
generic stock imagery. The brand mark in the navbar and footer
(`public/logo-mark.png`) is your uploaded logo, cropped and processed to a
transparent PNG. Once there are real product photos, team photos or client
logos, add them with `next/image` (e.g. in `PortfolioPreview.tsx` and
`about/page.tsx`) so they get optimised to WebP/AVIF automatically.

## Stack

- **Next.js 15** — App Router, React Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — with a custom design token set (navy/blue palette)
- **Zod** — contact form validation
- **next/font** — Orbitron (logo), Space Grotesk (headings), Inter (body)

## Project structure

```
app/                  Routes (App Router), each folder = a page
  api/contact/         Route handler for the contact form
  services/ portfolio/ reviews/ about/ contact/
  privacy-policy/ terms-and-conditions/
  layout.tsx           Root layout, fonts, metadata, structured data
  sitemap.ts robots.ts opengraph-image.tsx twitter-image.tsx
  icon.png apple-icon.png  Favicon / app icon (from your logo)
components/
  layout/               Navbar, Footer
  home/                 Homepage sections (Hero, FAQ, Process, ...)
  contact/              ContactForm
  ui/                   Reusable primitives (Button, Card, Icon, ...)
  seo/                  JsonLd helper
lib/
  constants.ts          All site content (services, portfolio, testimonials, FAQ)
  seo.ts                Per-page metadata helper
  validations/contact.ts Zod schema for the contact form
types/                 Shared TypeScript types
public/                Static files (logo-mark.png)
```

Edit content (copy, services, portfolio, testimonials, FAQ) in
`lib/constants.ts` — that's the single place this kind of content lives.

## Local setup

Requirements: Node.js 18.18 or later (Node 20+ recommended).

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open http://localhost:3000. Changes reload automatically.

Other scripts:

```bash
npm run build       # Production build
npm run start       # Production server (after build)
npm run lint        # ESLint
npm run typecheck   # TypeScript, without emitting output
```

Copy `.env.example` to `.env.local` if you want to override the site URL or
wire up the Resend integration (see below). Neither is required to run
locally.

## Contact form

The form (`components/contact/ContactForm.tsx`) posts to
`app/api/contact/route.ts`. That route:

1. Validates input with Zod (`lib/validations/contact.ts`).
2. Checks a hidden honeypot field against spam.
3. Applies a simple in-memory rate limit per IP address.
4. Accepts and logs the submission server-side.

**Email delivery isn't wired up yet.** There's a clear `TODO` in
`app/api/contact/route.ts` with a ready-to-use example for connecting
[Resend](https://resend.com). In short:

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
  subject: `New enquiry from ${name}`,
  text: `...`,
});
```

Then set `RESEND_API_KEY` and `CONTACT_INBOX_EMAIL` in your environment
variables (locally in `.env.local`, in production in Vercel).

## GitHub

If you're starting a new repository:

```bash
git init
git add .
git commit -m "Initial commit: ZEVREN website"
git branch -M main
git remote add origin https://github.com/<your-account>/zevren-website.git
git push -u origin main
```

Working in an existing repository (like this one)? Create a feature branch
per change and open a pull request instead of pushing straight to main.

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub
   account.
2. Click **Add New → Project** and select this repository.
3. Vercel detects Next.js automatically — the default settings (build
   command `next build`, output `.next`) are correct, nothing to change.
4. Under **Environment Variables**, add what you're using:
   - `NEXT_PUBLIC_SITE_URL` → `https://www.zevren.nl`
   - `RESEND_API_KEY` and `CONTACT_INBOX_EMAIL` (once Resend is connected)
5. Click **Deploy**. Within a couple of minutes the site is live on a
   `*.vercel.app` domain.

Every push to `main` automatically triggers a new production deploy; every
pull request gets its own preview URL.

## Connecting the domain (zevren.nl)

1. In the Vercel project, go to **Settings → Domains**.
2. Enter `zevren.nl` and click **Add**. Do the same for `www.zevren.nl` and
   set one of the two as canonical (recommended: `www.zevren.nl` with a
   redirect from the bare domain, or the other way round — just keep it
   consistent with `NEXT_PUBLIC_SITE_URL`).
3. Vercel shows the required DNS records. Log in with your domain
   registrar and add:
   - An `A` record for `zevren.nl` pointing to the IP address Vercel gives
     you, or
   - A `CNAME` record for `www` pointing to `cname.vercel-dns.com`
4. Wait for the DNS change to propagate (usually within an hour, can take
   up to 24 hours). Vercel automatically issues a valid SSL certificate
   once the DNS is correctly set.
5. After connecting, verify that `NEXT_PUBLIC_SITE_URL` in the production
   environment variables matches the final domain, so canonical URLs, the
   sitemap and structured data are all correct.

## Security checklist before launch

- [ ] `NEXT_PUBLIC_SITE_URL` is set to the final production domain
- [ ] All environment variables live in Vercel, not in the repository
- [ ] `.env.local` is in `.gitignore` (already is) and was never committed
- [ ] Security headers are active (verify with
      [securityheaders.com](https://securityheaders.com) after launch):
      CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
      Permissions-Policy — all configured in `next.config.ts` and
      `middleware.ts`
- [ ] Contact form tested with both valid and invalid input
- [ ] Honeypot field tested (filling in the hidden field should silently
      swallow the submission)
- [ ] `npm audit` run and any critical vulnerabilities resolved — as of
      this writing, `npm audit` flags 3 high-severity issues in `postcss`
      and `sharp`, both bundled *inside* `next@15.5.23` itself (the latest
      stable 15.x release) rather than top-level dependencies of this
      project. They affect build-time CSS/source-map processing and image
      transforms on attacker-supplied files — not something an anonymous
      visitor can trigger against the deployed site as it stands, since
      there's no user-upload or user-image feature. The real fix is
      Next.js 16, a breaking major version; re-run `npm audit` before
      launch in case a patched 15.x has shipped since, and plan the
      Next 16 upgrade as a deliberate follow-up rather than doing it here
- [ ] Resend (or whichever email service you choose) connected with its
      own, non-shared API key
- [ ] Contact details in `lib/constants.ts` (phone, email, VAT and KvK
      numbers, LinkedIn URL, city) are all real — add a street address
      there too if you want one shown on the site

**Why does every page render dynamically (SSR) instead of statically?**
The CSP uses a nonce generated per request by `middleware.ts`, so
script-src doesn't need `unsafe-inline`. A nonce has to match between the
CSP header and the HTML of the same request — which is incompatible with
pre-generated static pages. This is Next.js's documented approach for a
strict CSP, and it has no noticeable effect on load time or Lighthouse
score on Vercel, since the response is still server-rendered within tens
of milliseconds.

## Maintenance checklist

Periodically (monthly recommended):

- [ ] Check `npm outdated` and `npm audit`, update dependencies
- [ ] Keep Next.js, React and Tailwind on a recent minor/patch version
- [ ] Check Lighthouse score (mobile and desktop) after larger changes
- [ ] Test the contact form end to end (sending, error handling)
- [ ] Monitor uptime and Core Web Vitals via Vercel Analytics or an
      external monitor
- [ ] Keep content in `lib/constants.ts` current (portfolio, testimonials,
      pricing indications in the FAQ)
- [ ] The repository is always backed up via GitHub — no separate action
      needed as long as you push regularly
