import { Link } from "react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: "react-best-practices-2026",
    title: "React Best Practices for 2026",
    excerpt: "Explore the latest patterns and practices for building scalable React applications in 2026.",
    date: "April 20, 2026",
    readTime: "8 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
  },
  {
    id: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns that will make your code more type-safe and maintainable.",
    date: "April 15, 2026",
    readTime: "10 min read",
    category: "TypeScript",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800"
  },
  {
    id: "tailwind-css-tips",
    title: "Tailwind CSS Tips and Tricks",
    excerpt: "Master Tailwind CSS with these productivity-boosting tips and custom configuration techniques.",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800"
  }
];

export function BlogPage() {
  return (
    <div className="py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl mb-4 text-white" style={{ fontWeight: 700 }}>
            Blog
          </h1>
          <p className="text-xl text-gray-400">
            Thoughts on web development, design, and technology
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-[#12121a] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl mb-2 text-white group-hover:text-purple-400 transition-colors" style={{ fontWeight: 700 }}>
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400 text-sm">
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
