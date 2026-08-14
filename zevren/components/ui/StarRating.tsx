export function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-1 text-accent"
      role="img"
      aria-label={`${rating} van de 5 sterren`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.2}
          aria-hidden="true"
        >
          <path d="M10 1.5 12.4 7l6 .6-4.5 4 1.3 5.9L10 14.6 4.8 17.5l1.3-5.9-4.5-4 6-.6L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}
