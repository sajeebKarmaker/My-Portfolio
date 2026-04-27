import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

function RootLayout({ children }: { children: React.ReactNode }) {
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RootLayout>
        <HomePage />
      </RootLayout>
    ),
  },
  {
    path: "/project/:id",
    element: (
      <RootLayout>
        <ProjectDetailPage />
      </RootLayout>
    ),
  },
  {
    path: "/blog/:id",
    element: (
      <RootLayout>
        <BlogDetailPage />
      </RootLayout>
    ),
  },
]);
