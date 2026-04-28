import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Projects() {
  const projects = [
    {
      id: "ecommerce-platform",
      title: "E-Commerce Platform",
      description: "A full-featured online shopping platform with cart management and checkout.",
      image: "https://images.unsplash.com/photo-1760536928911-40831dacdbc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["React", "TypeScript", "Tailwind"]
    },
    {
      id: "analytics-dashboard",
      title: "Analytics Dashboard",
      description: "Real-time data visualization dashboard with interactive charts and metrics.",
      image: "https://images.unsplash.com/photo-1759884247173-3db27f7fafef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["Next.js", "Chart.js", "API"]
    },
    {
      id: "portfolio-website",
      title: "Portfolio Website",
      description: "Modern portfolio showcase with smooth animations and dark mode support.",
      image: "https://images.unsplash.com/photo-1758611971095-87f590f8c4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["React", "Framer Motion", "CSS"]
    }
  ];

  return (
    <section id="projects" className="py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
            Innovative side
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              projects
            </span>
          </h2>
          <button className="hidden md:flex items-center gap-2 text-foreground hover:text-purple-500 transition-colors" style={{ fontWeight: 700 }}>
            View all <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link
              key={index}
              href={`/project/${project.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2 text-foreground" style={{ fontWeight: 700 }}>
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
