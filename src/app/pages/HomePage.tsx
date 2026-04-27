"use client";

import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { Blog } from "../components/Blog";
import { Resume } from "../components/Resume";
import { Testimonials } from "../components/Testimonials";
import { FAQ } from "../components/FAQ";
import { Contact } from "../components/Contact";

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Blog />
      <Resume />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
