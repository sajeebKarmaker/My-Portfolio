"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "../src/app/context/ThemeContext";
import { Header } from "../src/app/components/Header";
import { Footer } from "../src/app/components/Footer";

export default function RootShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        {children}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
