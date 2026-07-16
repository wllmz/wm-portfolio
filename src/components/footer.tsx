export function Footer() {
  return (
    <footer className="bg-ink text-paper/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-paper/10 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} William Martinez — Développeur full
          stack freelance
        </p>
        <div className="flex gap-6 font-mono text-xs">
          {/* TODO: remplace par tes vrais liens */}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
