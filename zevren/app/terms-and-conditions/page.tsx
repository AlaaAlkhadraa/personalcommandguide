import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "The terms and conditions that apply to quotes and agreements with ZEVREN.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <section className="py-16">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-heading prose-a:text-accent">
            <p>Last updated: 14 August 2026</p>
            <p>
              These terms and conditions apply to all quotes, agreements and
              work carried out by {SITE_CONFIG.legalName}{" "}
              (Dutch Chamber of Commerce, KvK {SITE_CONFIG.kvk}), hereinafter
              referred to as &ldquo;ZEVREN&rdquo;.
            </p>

            <h2>1. Applicability</h2>
            <p>
              These terms apply to every quote and agreement between ZEVREN
              and a client, unless the parties have agreed otherwise in
              writing. Any purchasing or other terms put forward by the
              client are explicitly rejected.
            </p>

            <h2>2. Quotes and formation of the agreement</h2>
            <p>
              Quotes from ZEVREN are non-binding and valid for 30 days unless
              stated otherwise. An agreement comes into effect once the
              client confirms the quote in writing (including by email).
            </p>

            <h2>3. Performance of the agreement</h2>
            <p>
              ZEVREN carries out the agreement to the best of its ability.
              Any delivery timelines stated are indicative and don&apos;t
              constitute a strict deadline unless explicitly agreed
              otherwise. Delays caused by the client not providing required
              content, feedback or approval on time are not ZEVREN&apos;s
              responsibility.
            </p>

            <h2>4. Pricing and payment</h2>
            <p>
              All prices are in euros and exclusive of VAT unless stated
              otherwise. Unless agreed otherwise, ZEVREN invoices 50% at the
              start of the project and the remaining 50% on delivery.
              Invoices must be paid within 14 days of the invoice date. If
              this term is exceeded, the client is automatically in default
              and statutory commercial interest becomes payable.
            </p>

            <h2>5. Changes to the assignment (additional work)</h2>
            <p>
              Changes to the original assignment, requested by the client,
              are only carried out after written approval of the resulting
              additional costs and any adjustment to the timeline.
            </p>

            <h2>6. Intellectual property</h2>
            <p>
              Upon full payment, the client obtains the right to use the
              delivered website or application for the agreed purpose.
              Underlying source code, components and methods that ZEVREN
              already owned before the start of the project, or that are
              generically reusable, remain the property of ZEVREN.
            </p>

            <h2>7. Maintenance and warranty</h2>
            <p>
              A warranty period of 30 days applies after delivery, during
              which ZEVREN fixes defects free of charge that are
              demonstrably the result of errors in the delivery. This
              warranty doesn&apos;t cover changes made after delivery by the
              client or third parties. Maintenance beyond this period is
              only provided under a separate maintenance plan.
            </p>

            <h2>8. Liability</h2>
            <p>
              ZEVREN&apos;s liability for damages arising from the
              performance of the agreement is limited to the amount invoiced
              for the relevant assignment, with a maximum of €10,000. ZEVREN
              is never liable for indirect damages, including lost profit or
              consequential loss. This limitation doesn&apos;t apply in
              cases of intent or deliberate recklessness on ZEVREN&apos;s
              part.
            </p>

            <h2>9. Termination and dissolution</h2>
            <p>
              Either party may terminate the agreement in writing, observing
              a reasonable notice period. In the event of early termination,
              the client is required to pay for work already carried out, at
              the agreed rate.
            </p>

            <h2>10. Governing law and disputes</h2>
            <p>
              Dutch law applies to all agreements with ZEVREN. Disputes are
              submitted in the first instance to the competent court in the
              Limburg district, unless mandatory law provides otherwise.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Reach out via{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
