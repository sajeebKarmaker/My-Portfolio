import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "../data/blogPosts";

export function BlogPage() {
  return (
    <div className="py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground" style={{ fontWeight: 700 }}>
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughts on web development, design, and technology
          </p>
        </div>

        {/* Blog Posts Grid */}
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
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl mb-2 text-foreground group-hover:text-purple-500 transition-colors" style={{ fontWeight: 700 }}>
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-purple-500 text-sm">
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
