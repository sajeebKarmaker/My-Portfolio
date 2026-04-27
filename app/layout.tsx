import type { Metadata } from "next";
import type { ReactNode } from "react";
import RootShell from "./RootShell";
import "../src/styles/index.css";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Portfolio website",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
