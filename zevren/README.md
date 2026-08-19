# ZEVREN company website

Website for ZEVREN, an independent web studio based in Maastricht. Built with
Next.js 15 (App Router), TypeScript and Tailwind CSS.

## Contents

- [Content and honesty](#content-and-honesty)
- [Stack](#stack)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [Contact form](#contact-form)
- [GitHub](#github)
- [Deploying to Vercel](#deploying-to-vercel)
- [Connecting the domain (zevren.nl)](#connecting-the-domain-zevrennl)
- [Security checklist before launch](#security-checklist-before-launch)
- [Maintenance checklist](#maintenance-checklist)

## Content and honesty

ZEVREN is a new studio with no real clients yet, and the site is written to
reflect that honestly rather than pretend otherwise. Keep this in mind when
editing content in `lib/constants.ts`:

- Every project in `WORK_ITEMS` is a website concept, not real client work.
  That includes Tajex Logistics: the site presents it exactly like the other
  six, with no "real project" or "client" label anywhere. Nordwave Audio,
  ElleZone, Bergendal Accountants and the rest are invented businesses.
  Each one is a genuinely interactive demo (booking flow, shopping cart,
  property search, and so on) built with local mock data, not a static
  screenshot. Every project card and project page is labelled "Website
  concept", and the project pages end with a "ZEVREN CONCEPT" line stating
  they were created to demonstrate how that kind of digital experience
  could work, not delivered for a real client. Once there is real client
  work, replace concepts with real projects one at a time rather than
  mixing the two without labelling them differently.
- There is no testimonials section and no star ratings anywhere in the
  project, and none should be added until there are real reviews to show.
- There are no invented statistics (project counts, ratings, "founded in
  ..." claims). If you add a real number later (real project count, a
  founding date, a real review), it can go back in, but only if it is true.

## Stack

- **Next.js 15** — App Router, React Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — with a custom design token set (navy/blue palette)
- **Zod** — contact form validation
- **next/font** — Orbitron (logo), Space Grotesk (headings), Inter (body)

## Project structure

```
app/                  Routes (App Router), each folder = a page
  api/                 Route handlers: contact, project-request, csrf, admin
  services/ projects/ about/ process/ contact/
  projects/[slug]/     Individual concept project pages
  admin/               Private submissions area
  privacy-policy/ terms-and-conditions/
  layout.tsx           Root layout, fonts, metadata, structured data
  sitemap.ts robots.ts opengraph-image.tsx twitter-image.tsx
  icon.png apple-icon.png  Favicon / app icon (from your logo)
  error.tsx global-error.tsx not-found.tsx  Branded error/404 pages
components/
  layout/               Navbar, Footer
  home/                 Homepage sections (Hero, FAQ, Process, ...)
  projects/             registry.tsx (slug -> preview/demo), previews/,
                        ProjectCard
  pricing/              Package cards and the home pricing band
  demos/                The 7 interactive concept demos (tajex, barbershop,
                        garage, store, property, ellezone, accounting), each a
                        self-contained client component with its own identity
  three/                The WebGL hero: Scene3D, ZMark, fallback, boundary
  services/             PricingSection
  contact/              ContactForm
  ui/                   Reusable primitives (Button, Card, Icon, ...)
  seo/                  JsonLd helper
lib/
  constants.ts          Site content (services, project concepts, nav)
  assets.ts             The curated V2 image library: path, size and blur
                        placeholder for every image, so components cannot
                        guess an aspect ratio and cause layout shift
  offer.ts              Package prices and link helpers
  server/               Everything server-only: db, session, csrf, rate limit
  demos/                Local mock data for the 4 interactive concept demos
  seo.ts                Per-page metadata helper
  validations/contact.ts Zod schema for the contact form
types/                 Shared TypeScript types
public/
  v2/                   Curated imagery, WebP, about 900 kB for 26 files
  models/zevren-z.glb   The 3D mark (1.25 MB after texture recompression)
```

Edit content (copy, services, work concepts, pricing, FAQ) in
`lib/constants.ts`. That's the single place this kind of content lives.

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
3. Vercel detects Next.js automatically. The default settings (build
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
   redirect from the bare domain, or the other way round, just keep it
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
      Permissions-Policy, all configured in `next.config.ts` and
      `middleware.ts`
- [ ] Contact form tested with both valid and invalid input
- [ ] Honeypot field tested (filling in the hidden field should silently
      swallow the submission)
- [ ] `npm audit` run and any critical vulnerabilities resolved. As of
      this writing, `npm audit` flags 3 high-severity issues in `postcss`
      and `sharp`, both bundled *inside* `next@15.5.23` itself (the latest
      stable 15.x release) rather than top-level dependencies of this
      project. They affect build-time CSS/source-map processing and image
      transforms on attacker-supplied files, not something an anonymous
      visitor can trigger against the deployed site as it stands, since
      there's no user-upload or user-image feature. The real fix is
      Next.js 16, a breaking major version. Re-run `npm audit` before
      launch in case a patched 15.x has shipped since, and plan the
      Next 16 upgrade as a deliberate follow-up rather than doing it here
- [ ] Resend (or whichever email service you choose) connected with its
      own, non-shared API key
- [ ] Contact details in `lib/constants.ts` (phone, email, VAT and KvK
      numbers, LinkedIn URL, city) are all real. Add a street address
      there too if you want one shown on the site
- [ ] No fake statistics, testimonials or history have crept back in (see
      [Content and honesty](#content-and-honesty))

**Why does every page render dynamically (SSR) instead of statically?**
The CSP uses a nonce generated per request by `middleware.ts`, so
script-src doesn't need `unsafe-inline`. A nonce has to match between the
CSP header and the HTML of the same request, which is incompatible with
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
- [ ] Keep content in `lib/constants.ts` current (work concepts, pricing,
      FAQ), and replace concept projects with real work as it becomes
      available
- [ ] The repository is always backed up via GitHub, no separate action
      needed as long as you push regularly

## Backend

The site is a Next.js app with a server-side backend for its forms and a
private admin area. Everything below runs on the server; nothing in this
section is reachable from the browser bundle.

### Layout

| Path | Purpose |
| --- | --- |
| `lib/server/env.ts` | Validated server configuration. Imports `server-only`, so a client import is a build error. |
| `lib/server/db.ts` | Drizzle handle. Postgres in production, an embedded Postgres for local work. |
| `lib/server/schema.ts` | Tables: submissions, admin users, sessions, rate limits, audit log. |
| `lib/server/crypto.ts` | scrypt password hashing, keyed hashing, constant-time comparison. |
| `lib/server/session.ts` | Opaque server-side sessions with absolute and idle expiry. |
| `lib/server/csrf.ts` | Signed double-submit CSRF tokens. |
| `lib/server/rate-limit.ts` | Fixed-window limiter shared across instances via the database. |
| `lib/server/public-form.ts` | The pipeline behind both public write endpoints. |
| `app/api/*` | Route handlers. |
| `app/admin/*` | Admin area, `noindex`, session-gated on the server. |

### Endpoints

| Method | Route | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/csrf` | none | Issues a CSRF token and its paired HttpOnly cookie. |
| POST | `/api/contact` | CSRF + same-origin | Plain message. |
| POST | `/api/project-request` | CSRF + same-origin | Project brief (needs or budget filled in). |
| POST | `/api/admin/login` | CSRF + same-origin | Rate limited per client and per account. |
| POST | `/api/admin/logout` | CSRF + session | Revokes the session server-side. |
| GET | `/api/admin/submissions` | session | Paginated listing. |
| PATCH | `/api/admin/submissions` | CSRF + session | Status change, fixed set of values. |

Any other method on these routes returns 405. No route ever emits an
`Access-Control-Allow-Origin` header, so the API is same-origin only.

### Submission flow

`browser -> same-origin check -> rate limit -> CSRF -> schema validation ->
bot heuristics -> duplicate check -> database insert -> email -> 200`

The success response is sent only after a row exists. Email is best effort and
its outcome is recorded on the row; a mail outage never turns into a lost
message or a false confirmation.

### Setup

```bash
cp .env.example .env.local          # then fill it in
openssl rand -base64 48             # value for AUTH_SECRET
npm run db:migrate                  # create the tables
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npm run admin:create
```

The admin password is read from the environment, never from an argument, so it
does not land in shell history or `ps` output. No credential is stored in the
repository.

Local development without a Postgres server:

```bash
DATABASE_DRIVER=pglite npm run db:migrate
```

The embedded driver is refused when `NODE_ENV=production`, so a deployment
cannot silently fall back to a non-durable database.

### Security notes

- Passwords: scrypt (N=2^16, r=8) with a per-password salt, parameters stored
  alongside the hash. Verification is constant-time and spends the same work
  when the account does not exist, so login timing does not enumerate users.
- Sessions: 256-bit opaque tokens; the database stores a keyed hash. HttpOnly,
  Secure, SameSite=Strict, `__Host-` prefixed in production. Absolute and idle
  expiry, revocable, and re-read from the database on every request.
- CSRF: signed double-submit token plus an independent Origin/Referer check.
- Injection: every statement goes through Drizzle's parameter binding. No
  query string is built from user input.
- XSS: submissions render as React text children. There is no
  `dangerouslySetInnerHTML` anywhere in the app.
- SSRF: the only outbound request is to a hard-coded email endpoint, with
  redirects refused. No request body influences a URL.
- Errors: handlers return fixed messages and log detail server-side only.
- Images: every image ships from `public/`. `next.config.ts` declares no
  `remotePatterns`, so the image optimiser cannot be pointed at a third-party
  URL and used as an open proxy. There is no upload feature anywhere in the
  app, so no user-supplied file is ever written or processed.
- The 3D model is a static asset loaded by the client with both the Draco and
  meshopt decoders disabled, so no WebAssembly is instantiated and the CSP
  needs neither `wasm-unsafe-eval` nor a CDN in `script-src`.

### What this does not claim

This is a serious attempt at production-grade practice, not a guarantee.
No software can honestly promise it is unhackable, and this one does not.
Known limitations, stated plainly:

- Rate limiting is a fixed window keyed on a pseudonymised client IP. It
  slows a single source; it does not stop a distributed flood, and behind a
  proxy it is only as trustworthy as `TRUST_PROXY` and the platform in front
  of it.
- Bot detection is a honeypot plus a fill-time heuristic. A determined script
  can defeat both. They exist to cut noise, and nothing security-relevant
  depends on them.
- The admin area has one role and no second factor. Anyone with the password
  has full access to submissions.
- The dependency advisories below are unresolved by choice, not fixed.
- Everything here was verified locally. Nothing has been tested against the
  live deployment, because this environment cannot reach it.

### Known dependency advisories

`npm audit` reports two findings against the postcss that Next.js 15 pins
internally. They are build-time issues in a tool that only processes CSS
authored in this repository, not request-time exposure, and the published fix
is a major upgrade to Next.js 16. That upgrade is deliberately not bundled
with this work; it needs its own pass with the full visual regression suite.
