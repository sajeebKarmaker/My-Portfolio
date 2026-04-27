import { Github, Linkedin, Twitter } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-20">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight" style={{ fontWeight: 700 }}>
              <span className="text-white">CREATIVE</span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                FRONTEND
              </span>
              <br />
              <span className="text-white">DEVELOPER &</span>
              <br />
              <span className="text-white">UI DESIGNER</span>
            </h1>
          </div>

          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
            I'm a passionate frontend developer and UI designer dedicated to crafting
            beautiful, functional, and user-centered digital experiences. With expertise
            in modern web technologies and design principles, I bring ideas to life through
            clean code and stunning interfaces.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800 hover:bg-purple-500 flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} className="text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800 hover:bg-purple-500 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800 hover:bg-purple-500 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} className="text-white" />
            </a>
          </div>
        </div>

        {/* Right Content - Profile Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Decorative gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 scale-110"></div>

            {/* Profile image */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-purple-500/30">
              <img
                src="https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NzEyNzU1NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative dots */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 grid grid-cols-4 gap-2 opacity-50">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-purple-500 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
