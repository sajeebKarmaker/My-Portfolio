"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const blogPostsData = [
  {
    id: "react-best-practices-2026",
    title: "React Best Practices for 2026",
    date: "April 20, 2026",
    readTime: "8 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    content: [
      {
        type: "paragraph",
        text: "React continues to evolve, and with it, the best practices for building scalable applications. In this article, we'll explore the latest patterns and techniques that will help you write better React code in 2026."
      },
      {
        type: "heading",
        text: "1. Use Server Components When Possible"
      },
      {
        type: "paragraph",
        text: "Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client. This improves performance and user experience."
      },
      {
        type: "code",
        language: "tsx",
        code: `// app/page.tsx (Server Component)
export default async function HomePage() {
  const data = await fetch('https://api.example.com/posts');
  const posts = await data.json();

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}`
      },
      {
        type: "heading",
        text: "2. Optimize Re-renders with useMemo and useCallback"
      },
      {
        type: "paragraph",
        text: "Unnecessary re-renders can slow down your application. Use React's built-in hooks to optimize performance."
      },
      {
        type: "code",
        language: "tsx",
        code: `import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data, onItemClick }) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [data]);

  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <ul>
      {processedData.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.computed}
        </li>
      ))}
    </ul>
  );
}`
      },
      {
        type: "heading",
        text: "3. Embrace TypeScript for Type Safety"
      },
      {
        type: "paragraph",
        text: "TypeScript helps catch errors early and improves code maintainability. Define proper types for your components and props."
      },
      {
        type: "code",
        language: "tsx",
        code: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface UserCardProps {
  user: User;
  onEdit?: (userId: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>
          Edit
        </button>
      )}
    </div>
  );
}`
      }
    ]
  },
  {
    id: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns",
    date: "April 15, 2026",
    readTime: "10 min read",
    category: "TypeScript",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    content: [
      {
        type: "paragraph",
        text: "TypeScript offers powerful features that go beyond basic type annotations. Let's explore some advanced patterns that will make your code more robust and maintainable."
      },
      {
        type: "heading",
        text: "Discriminated Unions"
      },
      {
        type: "paragraph",
        text: "Discriminated unions allow you to create type-safe state machines and handle different cases explicitly."
      },
      {
        type: "code",
        language: "typescript",
        code: `type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data;
    case 'error':
      return state.error;
  }
}`
      }
    ]
  },
  {
    id: "tailwind-css-tips",
    title: "Tailwind CSS Tips and Tricks",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
    content: [
      {
        type: "paragraph",
        text: "Tailwind CSS has become the go-to utility-first CSS framework. Here are some tips to boost your productivity and create better designs."
      },
      {
        type: "heading",
        text: "Custom Utilities with @layer"
      },
      {
        type: "paragraph",
        text: "Create your own utility classes that work seamlessly with Tailwind's system."
      },
      {
        type: "code",
        language: "css",
        code: `@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}`
      }
    ]
  }
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-6">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors z-10 opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <Copy size={16} className="text-gray-300" />
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          borderRadius: '0.75rem'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function BlogDetailPage({ id }: { id: string }) {
  const post = blogPostsData.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-white" style={{ fontWeight: 700 }}>Post Not Found</h1>
          <Link href="/#blog" className="text-purple-500 hover:text-purple-400">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        {/* Back Button */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

        {/* Post Header */}
        <div className="mb-8">
          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl mt-4 mb-4 text-white" style={{ fontWeight: 700 }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Post Content */}
        <article className="prose prose-invert max-w-none">
          {post.content.map((block, index) => {
            if (block.type === 'paragraph') {
              return (
                <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'heading') {
              return (
                <h2 key={index} className="text-2xl md:text-3xl mt-12 mb-4 text-white" style={{ fontWeight: 700 }}>
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'code') {
              if (!block.code || !block.language) {
                return null;
              }
              return (
                <CodeBlock
                  key={index}
                  code={block.code}
                  language={block.language}
                />
              );
            }
            return null;
          })}
        </article>

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-center">
            Thanks for reading! Share this article if you found it helpful.
          </p>
        </div>
      </div>
    </div>
  );
}
