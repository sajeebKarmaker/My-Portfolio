"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

const SECTIONS = ["about", "projects", "blog", "resume", "contact"];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "About", section: "about", href: isHomePage ? "#about" : "/#about" },
    { name: "Projects", section: "projects", href: isHomePage ? "#projects" : "/#projects" },
    { name: "Blog", section: "blog", href: isHomePage ? "#blog" : "/#blog" },
    { name: "Resume", section: "resume", href: isHomePage ? "#resume" : "/#resume" },
    { name: "Contact", section: "contact", href: isHomePage ? "#contact" : "/#contact" },
  ];

  // Scroll-spy: track which section is in view on the home page
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      // Find the section whose top is closest to (and above) 120px from the viewport top
      const scrollY = window.scrollY + 120;
      let current = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Determine the active section from context
  const currentSection = isHomePage
    ? activeSection
    : pathname.startsWith("/blog")
    ? "blog"
    : "";

  const isActive = (section: string) => currentSection === section;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 lg:px-20 bg-background/80 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center">

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 border border-border rounded-full bg-card/50 backdrop-blur-sm">
          {/* Logo */}
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center flex-shrink-0"
          >
            <span className="text-white text-lg font-bold">A</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 px-2">
            {navItems.map((item) => {
              const active = isActive(item.section);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-6 py-2 text-sm rounded-full transition-colors duration-200 ${
                    active
                      ? "text-orange-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground font-normal"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-muted-foreground" />
            ) : (
              <Moon size={18} className="text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile: hamburger / close button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-t border-border md:hidden shadow-xl">
            <nav className="flex flex-col px-6 py-4">
              {navItems.map((item) => {
                const active = isActive(item.section);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`py-3 text-sm border-b border-border/50 last:border-0 transition-colors duration-200 ${
                      active
                        ? "text-orange-400 font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
