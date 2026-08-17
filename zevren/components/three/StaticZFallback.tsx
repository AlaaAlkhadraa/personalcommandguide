export function StaticZFallback() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center"
    >
      <div
        className="relative h-56 w-56 sm:h-72 sm:w-72"
        style={{
          background:
            "linear-gradient(135deg, #1e293b 0%, #0b1020 45%, #1d4ed8 100%)",
          clipPath:
            "polygon(8% 8%, 92% 8%, 92% 26%, 34% 74%, 92% 74%, 92% 92%, 8% 92%, 8% 74%, 66% 26%, 8% 26%)",
          boxShadow:
            "0 0 60px 10px rgba(37,99,235,0.35), inset 0 0 40px rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}
