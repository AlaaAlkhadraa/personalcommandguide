interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Set inside a white band; the default styling assumes the dark ground. */
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span
          className={`text-sm font-semibold uppercase tracking-[0.2em] ${
            light ? "text-primary" : "text-accent"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        data-reveal-words
        className={`text-3xl font-semibold leading-tight sm:text-4xl ${
          light ? "text-navy" : "text-white"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base leading-relaxed sm:text-lg ${
            light ? "text-slate-600" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
