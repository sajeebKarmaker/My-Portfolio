import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "../data/blogPosts";

export function Blog() {
  return (
    <section id="blog" className="py-20 px-6 md:px-12 lg:px-20 bg-secondary">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl text-foreground" style={{ fontWeight: 700 }}>
            Latest from the{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Blog
            </span>
          </h2>
          <button className="hidden md:flex items-center gap-2 text-foreground hover:text-purple-500 transition-colors" style={{ fontWeight: 700 }}>
            View all <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-purple-500/50 transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl mb-2 text-foreground group-hover:text-purple-400 transition-colors" style={{ fontWeight: 700 }}>
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{post.excerpt}</p>
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
    </section>
  );
}
