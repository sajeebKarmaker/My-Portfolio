import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "../context/ThemeContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "About", href: isHomePage ? "#about" : "/#about" },
    { name: "Projects", href: isHomePage ? "#projects" : "/#projects" },
    { name: "Blog", href: isHomePage ? "#blog" : "/#blog" },
    { name: "Resume", href: isHomePage ? "#resume" : "/#resume" },
    { name: "Contact", href: isHomePage ? "#contact" : "/#contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 lg:px-20 bg-background/80 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center">
        {/* Desktop Navigation - All in one rounded container */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 border border-border rounded-full bg-card/50 backdrop-blur-sm">
          {/* Logo */}
          <Link to="/" className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg" style={{ fontWeight: 700 }}>A</span>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 px-2">
            {navItems.map((item, index) => {
              const isActive = index === 0;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-6 py-2 text-sm transition-colors rounded-full ${
                    isActive
                      ? "text-orange-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  style={{ fontWeight: isActive ? 700 : 400 }}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-gray-300" />
            ) : (
              <Moon size={18} className="text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-t border-border md:hidden">
            <nav className="flex flex-col px-6 py-4">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`py-3 text-sm transition-colors ${
                    index === 0 ? "text-orange-400" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
