import { Button } from "@/components/ui/Button";
import { DeviceMockups } from "@/components/home/DeviceMockups";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-glow">
      <div className="container-page grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Web development
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Websites that sell,
            <br />
            <span className="text-gradient">not just websites that look good</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted">
            ZEVREN builds websites and online stores for businesses in the
            Netherlands and across Europe. Fast to load, technically solid,
            and built to turn visitors into customers.
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button href="/contact">Request a quote</Button>
            <Button href="/portfolio" variant="secondary">
              See our work
            </Button>
          </div>
          <dl className="grid grid-cols-3 gap-6 pt-8">
            <div>
              <dt className="text-sm text-muted">Projects</dt>
              <dd className="text-2xl font-semibold text-white">60+</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Average rating</dt>
              <dd className="text-2xl font-semibold text-white">4.9/5</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Since</dt>
              <dd className="text-2xl font-semibold text-white">2021</dd>
            </div>
          </dl>
        </div>
        <DeviceMockups />
      </div>
    </section>
  );
}
