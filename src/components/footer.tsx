export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-mute">
          © {new Date().getFullYear()} William Martinez — Développeur full
          stack freelance
        </p>
        <div className="flex gap-6 font-mono text-xs">
          {/* TODO: remplace par tes vrais liens */}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mute transition-colors hover:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mute transition-colors hover:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
