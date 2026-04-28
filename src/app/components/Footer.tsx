import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-foreground text-xl font-semibold tracking-tight">
            AYOOLA<span className="text-purple-500">.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sajeebKarmaker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted hover:bg-purple-500 flex items-center justify-center transition-colors group"
              aria-label="GitHub"
            >
              <Github size={18} className="text-foreground group-hover:text-white" />
            </a>
            <a
              href="https://www.linkedin.com/in/saanto/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted hover:bg-purple-500 flex items-center justify-center transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} className="text-foreground group-hover:text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted hover:bg-purple-500 flex items-center justify-center transition-colors group"
              aria-label="Twitter"
            >
              <Twitter size={18} className="text-foreground group-hover:text-white" />
            </a>
          </div>

          <p className="text-muted-foreground text-sm">
            © 2026 Ayoola. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
