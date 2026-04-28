export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "code"; language: string; code: string };

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content?: BlogContentBlock[];
  markdownPath?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "spring-framework-complete-guide",
    title: "Spring Framework Complete Guide: 15 Topics Deep Dive",
    excerpt:
      "A complete, interview-focused guide to Spring fundamentals, container internals, DI, AOP, transactions, MVC, security, Boot, and production readiness.",
    date: "April 28, 2026",
    readTime: "45 min read",
    category: "Spring",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    markdownPath: "/blog/spring-framework-complete-guide.md",
  },
  {
    id: "react-best-practices-2026",
    title: "React Best Practices for 2026",
    excerpt:
      "Explore the latest patterns and practices for building scalable React applications in 2026.",
    date: "April 20, 2026",
    readTime: "8 min read",
    category: "React",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    content: [
      {
        type: "paragraph",
        text: "React continues to evolve, and with it, the best practices for building scalable applications. In this article, we'll explore the latest patterns and techniques that will help you write better React code in 2026.",
      },
      {
        type: "heading",
        text: "1. Use Server Components When Possible",
      },
      {
        type: "paragraph",
        text: "Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client. This improves performance and user experience.",
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
}`,
      },
      {
        type: "heading",
        text: "2. Optimize Re-renders with useMemo and useCallback",
      },
      {
        type: "paragraph",
        text: "Unnecessary re-renders can slow down your application. Use React's built-in hooks to optimize performance.",
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
}`,
      },
      {
        type: "heading",
        text: "3. Embrace TypeScript for Type Safety",
      },
      {
        type: "paragraph",
        text: "TypeScript helps catch errors early and improves code maintainability. Define proper types for your components and props.",
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
}`,
      },
    ],
  },
  {
    id: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns",
    excerpt:
      "Deep dive into advanced TypeScript patterns that will make your code more type-safe and maintainable.",
    date: "April 15, 2026",
    readTime: "10 min read",
    category: "TypeScript",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    content: [
      {
        type: "paragraph",
        text: "TypeScript offers powerful features that go beyond basic type annotations. Let's explore some advanced patterns that will make your code more robust and maintainable.",
      },
      {
        type: "heading",
        text: "Discriminated Unions",
      },
      {
        type: "paragraph",
        text: "Discriminated unions allow you to create type-safe state machines and handle different cases explicitly.",
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
}`,
      },
    ],
  },
  {
    id: "tailwind-css-tips",
    title: "Tailwind CSS Tips and Tricks",
    excerpt:
      "Master Tailwind CSS with these productivity-boosting tips and custom configuration techniques.",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "CSS",
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
    content: [
      {
        type: "paragraph",
        text: "Tailwind CSS has become the go-to utility-first CSS framework. Here are some tips to boost your productivity and create better designs.",
      },
      {
        type: "heading",
        text: "Custom Utilities with @layer",
      },
      {
        type: "paragraph",
        text: "Create your own utility classes that work seamlessly with Tailwind's system.",
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
}`,
      },
    ],
  },
];
