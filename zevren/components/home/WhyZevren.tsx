import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { ServiceIcon } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

interface WhyZevrenProps {
  dict: Dictionary["whyZevren"];
  homeDict: Dictionary["home"]["why"];
}

const ICONS: ServiceIcon[] = ["layers", "compass", "code", "wrench", "search", "globe"];

export function WhyZevren({ dict, homeDict }: WhyZevrenProps) {
  return (
    <section className="border-b border-white/5 py-16 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <div data-reveal className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {homeDict.eyebrow}
          </span>
          <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-[-0.01em] text-white sm:text-3xl">
            {homeDict.title}
          </h2>
          <span aria-hidden="true" className="h-0.5 w-12 bg-accent" />
        </div>

        <ul data-reveal-stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {dict.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal-item
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-navy/60 p-4 transition-colors duration-300 hover:border-accent/40"
            >
              <span className="text-accent">
                <Icon name={ICONS[index] ?? "layers"} className="h-5 w-5" />
              </span>
              <h3 className="text-[12px] font-semibold leading-tight text-white">{item.title}</h3>
              <p className="text-[11px] leading-relaxed text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
