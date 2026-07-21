export function Footer() {
  return (
    <footer className="relative z-10 bg-cream px-6 sm:px-9">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-3 border-t-[1.5px] border-navy/15 py-7 text-[0.78rem] font-semibold text-navy/60 sm:flex-row">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-logo text-[0.95rem] font-extrabold text-navy uppercase">
            wm<span className="text-burgundy">.</span>
          </span> · William
          Martinez, fullstack freelance
        </p>
        <div className="flex gap-6">
          {/* TODO: remplace par tes vrais liens */}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-burgundy focus-visible:rounded focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-burgundy"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-burgundy focus-visible:rounded focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-burgundy"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
