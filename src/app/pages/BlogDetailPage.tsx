"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Copy, Check, BookOpen } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { blogPosts } from "../data/blogPosts";

// ── Utilities ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in (children as { props?: { children?: ReactNode } })
  ) {
    return childrenToText(
      (children as { props: { children?: ReactNode } }).props.children
    );
  }
  return "";
}

type TocItem = { level: 1 | 2; text: string; id: string };

function extractHeadings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const seenIds = new Map<string, number>();
  let inCodeBlock = false;

  for (const line of markdown.split("\n")) {
    // Track fenced code block boundaries so we never treat # inside code as a heading
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,2})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length as 1 | 2;
    const rawText = match[2]
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();
    const baseId = slugify(rawText);
    if (!baseId) continue;

    // Deduplicate IDs: append -2, -3 … for any collisions that remain
    const count = seenIds.get(baseId) ?? 0;
    seenIds.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    items.push({ level, text: rawText, id });
  }
  return items;
}

// ── CodeBlock ──────────────────────────────────────────────────────────────

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden my-8">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-b border-white/10">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-100 transition-colors rounded"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.85rem",
          lineHeight: "1.7",
          borderRadius: "0 0 0.75rem 0.75rem",
          background: "#0d0d1a",
          fontFamily: "'Anthropic Mono', 'Courier New', monospace",
        }}
        codeTagProps={{
          style: { fontFamily: "'Anthropic Mono', 'Courier New', monospace" },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Markdown component map ─────────────────────────────────────────────────

const mdComponents: Components = {
  h1: ({ children }) => {
    const id = slugify(childrenToText(children));
    return (
      <h1
        id={id}
        className="font-serif scroll-mt-28 text-3xl md:text-4xl font-bold text-foreground mt-16 mb-6 leading-tight border-b border-border pb-4"
      >
        {children}
      </h1>
    );
  },
  h2: ({ children }) => {
    const id = slugify(childrenToText(children));
    return (
      <h2
        id={id}
        className="font-serif scroll-mt-28 text-2xl md:text-3xl font-bold text-foreground mt-14 mb-5 leading-tight"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugify(childrenToText(children));
    return (
      <h3
        id={id}
        className="font-serif scroll-mt-28 text-xl md:text-2xl font-semibold text-purple-600 dark:text-purple-300 mt-10 mb-4 leading-snug"
      >
        {children}
      </h3>
    );
  },
  h4: ({ children }) => (
    <h4 className="font-serif scroll-mt-28 text-lg font-semibold text-foreground/90 mt-8 mb-3 leading-snug">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="font-serif text-muted-foreground leading-8 mb-6 text-[1.05rem]">{children}</p>
  ),
  hr: () => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-foreground/80">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-5 pl-6 space-y-2 list-disc marker:text-purple-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 pl-6 space-y-2 list-decimal marker:text-purple-400 marker:font-semibold">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="font-serif text-muted-foreground leading-7 text-[1.02rem] pl-1">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-5 border-l-4 border-purple-500 bg-purple-500/5 rounded-r-lg py-4 pr-4">
      <div className="font-serif text-muted-foreground italic leading-7">{children}</div>
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-purple-500/10">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border/50">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-5 py-3 text-left text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-5 py-3.5 text-muted-foreground leading-relaxed align-top">
      {children}
    </td>
  ),
  code: ({ className, children }) => {
    const language = className?.replace("language-", "") || "text";
    const code = String(children).replace(/\n$/, "");
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-muted text-purple-600 dark:text-purple-300 font-mono text-[0.85em]" style={{ fontFamily: "'Anthropic Mono', 'Courier New', monospace" }}>
          {children}
        </code>
      );
    }
    return <CodeBlock code={code} language={language} />;
  },
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-2 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

// ── Table of Contents ──────────────────────────────────────────────────────

function TableOfContents({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  return (
    <nav aria-label="Table of contents">
      <div className="flex items-center gap-2 mb-5 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
        <BookOpen size={12} />
        On this page
      </div>

      <ul className="space-y-0.5 border-l border-border">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li key={`${item.id}-${index}`}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={[
                  "block py-1.5 pr-2 leading-snug transition-all duration-150",
                  "border-l-2 -ml-px",
                  item.level === 1
                    ? "pl-4 text-[0.8rem] font-medium"
                    : "pl-7 text-[0.75rem] font-normal",
                  isActive
                    ? "border-purple-500 text-purple-500 dark:text-purple-400"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                ].join(" ")}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export function BlogDetailPage({ id }: { id: string }) {
  const post = blogPosts.find((p) => p.id === id);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("");

  const tocItems = useMemo(
    () => (markdownContent ? extractHeadings(markdownContent) : []),
    [markdownContent]
  );

  useEffect(() => {
    if (!post?.markdownPath) {
      setMarkdownContent(null);
      return;
    }
    fetch(post.markdownPath)
      .then((r) => r.text())
      .then(setMarkdownContent)
      .catch(() => setMarkdownContent(null));
  }, [post?.markdownPath]);

  // Scroll spy — highlight whichever H1/H2 was most recently scrolled past
  useEffect(() => {
    if (!markdownContent) return;

    const handleScroll = () => {
      const headings = document.querySelectorAll(
        "#blog-content h1, #blog-content h2"
      );
      let current = "";
      headings.forEach((el) => {
        if (el.getBoundingClientRect().top <= 130) current = el.id;
      });
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialise after content renders
    const timer = setTimeout(handleScroll, 150);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [markdownContent]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-foreground font-bold">Post Not Found</h1>
          <Link href="/#blog" className="text-purple-600 hover:text-purple-500 dark:text-purple-500 dark:hover:text-purple-400">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const hasToc = tocItems.length > 0;

  return (
    <div className="py-32 px-6 md:px-10 lg:px-16">

      {/* ── Fixed TOC — always visible on xl+ regardless of scroll position ── */}
      {hasToc && (
        <nav
          className="hidden xl:block fixed top-28 left-4 z-20 overflow-y-auto"
          style={{
            width: "210px",
            maxHeight: "calc(100vh - 8rem)",
            scrollbarWidth: "thin",
            scrollbarColor: "#3d3d5c transparent",
          }}
        >
          <TableOfContents items={tocItems} activeId={activeId} />
        </nav>
      )}

      {/* ── Single centered column ── */}
      <div className="max-w-[800px] mx-auto">

        {/* Back link */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </Link>

        {/* Header — centered */}
        <div className="mb-10 text-center">
          <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium tracking-wide uppercase">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-5 mb-5 text-foreground leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-5 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden mb-14">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article */}
        <article id="blog-content">
          {markdownContent ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mdComponents}
            >
              {markdownContent}
            </ReactMarkdown>
          ) : (
            post.content?.map((block, index) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={index}
                    className="text-muted-foreground leading-8 mb-6 text-[1.05rem]"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "heading") {
                return (
                  <h2
                    key={index}
                      className="text-2xl md:text-3xl font-bold mt-14 mb-5 text-foreground leading-tight"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "code") {
                if (!block.code || !block.language) return null;
                return (
                  <CodeBlock
                    key={index}
                    code={block.code}
                    language={block.language}
                  />
                );
              }
              return null;
            })
          )}
        </article>

        <div className="mt-20 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            Thanks for reading! Share this article if you found it helpful.
          </p>
        </div>

      </div>
    </div>
  );
}
