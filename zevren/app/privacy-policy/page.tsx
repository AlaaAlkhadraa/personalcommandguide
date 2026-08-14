import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read how ZEVREN handles personal data collected through the website and the contact form.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="py-16">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-heading prose-a:text-accent">
            <p>Last updated: 14 August 2026</p>

            <p>
              {SITE_CONFIG.legalName} (&ldquo;ZEVREN&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), based at
              {" "}
              {SITE_CONFIG.address.street}, {SITE_CONFIG.address.postalCode}{" "}
              {SITE_CONFIG.address.city}, the Netherlands, is responsible for
              the processing of personal data as described in this privacy
              policy. We comply with the EU General Data Protection
              Regulation (GDPR).
            </p>

            <h2>What data we process</h2>
            <p>
              When you fill in the contact form on this website, we process
              the data you provide yourself: your name, email address,
              optionally your company name, and the content of your message.
              We don&apos;t collect any data through the form beyond what you
              enter.
            </p>

            <h2>Why we process this data</h2>
            <p>
              We use this data solely to respond to your enquiry and, if it
              leads to an engagement, to carry out the agreement with you.
              The legal basis for this is Article 6(1)(b) GDPR (performance
              of a contract or steps taken prior to entering into a
              contract) and, where applicable, our legitimate interest in
              answering enquiries from prospective clients.
            </p>

            <h2>Retention period</h2>
            <p>
              We keep contact form data for a maximum of 24 months after the
              last point of contact, unless it leads to an agreement. In
              that case we keep data for as long as necessary to perform the
              agreement, plus any statutory retention periods that follow,
              such as the 7-year retention obligation for financial records
              under Dutch tax law.
            </p>

            <h2>Sharing with third parties</h2>
            <p>
              We don&apos;t sell personal data to third parties. We use a
              limited number of processors to operate this website and our
              services, such as our hosting provider (Vercel) and, once
              configured, an email service for handling form submissions
              (Resend). Data processing agreements are in place with these
              parties wherever the GDPR requires one.
            </p>

            <h2>Cookies</h2>
            <p>
              This website doesn&apos;t use tracking cookies. No analytics or
              marketing cookies are placed without your prior consent. If
              that changes in the future, we&apos;ll update this privacy
              policy and ask for explicit consent wherever legally required.
            </p>

            <h2>Security</h2>
            <p>
              We take appropriate technical and organisational measures to
              protect personal data against loss or unlawful processing,
              including encrypted connections (HTTPS), restricted access to
              data, and up-to-date security patches for the systems we use.
            </p>

            <h2>Your rights</h2>
            <p>
              You have the right to access, correct or have your personal
              data deleted. You can also object to the processing of your
              data or ask us to restrict it. To do so, contact us at{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
              You also have the right to lodge a complaint with the Dutch
              Data Protection Authority (Autoriteit Persoonsgegevens).
            </p>

            <h2>Changes</h2>
            <p>
              We may update this privacy policy from time to time. The most
              current version is always available on this page.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this privacy policy? Reach out via{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>{" "}
              or {SITE_CONFIG.phoneDisplay}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
