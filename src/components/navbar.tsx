"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#projets", label: "Projets" },
  { href: "#services", label: "Services" },
  { href: "#a-propos", label: "À propos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-void/70 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-mono text-sm tracking-widest text-fog transition-colors hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        >
          wm<span className="text-electric">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-mute transition-colors hover:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="rounded-full border border-electric/40 px-4 py-2 text-sm text-fog transition-all duration-300 hover:border-electric hover:bg-electric/10 hover:shadow-[0_0_24px_-6px_var(--color-electric)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        >
          Discutons
        </a>
      </nav>
    </header>
  );
}
