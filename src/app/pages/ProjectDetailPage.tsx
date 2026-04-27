import { useParams, Link } from "react-router";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

const projectsData = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-featured online shopping platform with cart management and checkout.",
    image: "https://images.unsplash.com/photo-1760536928911-40831dacdbc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "TypeScript", "Tailwind"],
    fullDescription: "A comprehensive e-commerce solution built with modern web technologies. This platform provides a seamless shopping experience with features including product browsing, advanced filtering, shopping cart management, secure checkout process, and order tracking. The application is fully responsive and optimized for performance.",
    features: [
      "Product catalog with advanced search and filtering",
      "Shopping cart with real-time updates",
      "Secure checkout process with multiple payment options",
      "User authentication and profile management",
      "Order history and tracking",
      "Admin dashboard for inventory management"
    ],
    technologies: ["React 18", "TypeScript", "Tailwind CSS", "Redux Toolkit", "React Router", "Stripe API"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Real-time data visualization dashboard with interactive charts and metrics.",
    image: "https://images.unsplash.com/photo-1759884247173-3db27f7fafef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Next.js", "Chart.js", "API"],
    fullDescription: "A powerful analytics dashboard that provides real-time insights into business metrics. Features interactive charts, customizable widgets, and comprehensive data visualization tools. Built with performance in mind using Next.js for server-side rendering and optimal loading speeds.",
    features: [
      "Real-time data updates and visualizations",
      "Interactive and customizable charts",
      "Multiple dashboard views and layouts",
      "Export data in various formats (CSV, PDF)",
      "User role-based access control",
      "Mobile-responsive design"
    ],
    technologies: ["Next.js 14", "Chart.js", "Recharts", "TanStack Query", "Tailwind CSS", "REST API"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description: "Modern portfolio showcase with smooth animations and dark mode support.",
    image: "https://images.unsplash.com/photo-1758611971095-87f590f8c4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "Framer Motion", "CSS"],
    fullDescription: "A stunning portfolio website featuring smooth animations, dark mode support, and a modern design. Built to showcase projects and skills in an engaging and visually appealing way. Includes contact forms, project galleries, and about sections.",
    features: [
      "Smooth page transitions and animations",
      "Dark/Light mode toggle",
      "Interactive project showcase",
      "Contact form with validation",
      "Fully responsive design",
      "SEO optimized"
    ],
    technologies: ["React", "Framer Motion", "CSS Modules", "React Hook Form", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

export function ProjectDetailPage() {
  const { id } = useParams();
  const project = projectsData.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-white" style={{ fontWeight: 700 }}>Project Not Found</h1>
          <Link to="/" className="text-purple-500 hover:text-purple-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-white" style={{ fontWeight: 700 }}>
            {project.title}
          </h1>
          <p className="text-xl text-gray-400 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-3 mb-8">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <a
              href={project.liveUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
              style={{ fontWeight: 700 }}
            >
              <ExternalLink size={18} />
              View Live Demo
            </a>
            <a
              href={project.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a24] border border-gray-700 text-white rounded-full hover:border-purple-500 transition-colors"
              style={{ fontWeight: 700 }}
            >
              <Github size={18} />
              View Code
            </a>
          </div>
        </div>

        {/* Project Image */}
        <div className="rounded-2xl overflow-hidden mb-12">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-2xl mb-4 text-white" style={{ fontWeight: 700 }}>Overview</h2>
              <p className="text-gray-400 leading-relaxed">{project.fullDescription}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl mb-4 text-white" style={{ fontWeight: 700 }}>Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#12121a] p-6 rounded-2xl border border-gray-800 sticky top-32">
              <h3 className="text-xl mb-4 text-white" style={{ fontWeight: 700 }}>Technologies Used</h3>
              <div className="space-y-2">
                {project.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-[#1a1a24] rounded-lg text-gray-300 text-sm"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
