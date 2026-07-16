const items = [
  "Disponible pour vos projets",
  "Next.js",
  "React Native",
  "Node.js",
  "De l'idée à la prod",
  "TypeScript",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            {item}
          </span>
          <span aria-hidden className="text-accent-light">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/** Bandeau noir défilant — la signature du site. */
export function Marquee() {
  return (
    <div
      className="relative z-10 overflow-hidden border-y border-ink bg-ink py-5 text-paper"
      aria-label="Disponible pour vos projets — Next.js, React Native, Node.js, TypeScript"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <Row />
        <div aria-hidden>
          <Row />
        </div>
      </div>
    </div>
  );
}
