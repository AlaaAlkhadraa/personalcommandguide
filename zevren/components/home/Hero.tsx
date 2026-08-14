import { Button } from "@/components/ui/Button";
import { DeviceMockups } from "@/components/home/DeviceMockups";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-page grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Webdevelopment uit Amsterdam
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Websites die verkopen,
            <br />
            <span className="text-gradient">niet alleen die er goed uitzien</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            ZEVREN bouwt websites en webshops voor ondernemers in Nederland en
            Europa. Snel geladen, technisch solide en gemaakt om bezoekers om
            te zetten in klanten.
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">Vraag een offerte aan</Button>
            <Button href="/portfolio" variant="secondary">
              Bekijk ons werk
            </Button>
          </div>
          <dl className="grid grid-cols-3 gap-6 pt-8">
            <div>
              <dt className="text-sm text-muted">Projecten</dt>
              <dd className="text-2xl font-semibold text-white">60+</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Gemiddelde score</dt>
              <dd className="text-2xl font-semibold text-white">4,9/5</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Sinds</dt>
              <dd className="text-2xl font-semibold text-white">2021</dd>
            </div>
          </dl>
        </div>
        <DeviceMockups />
      </div>
    </section>
  );
}
