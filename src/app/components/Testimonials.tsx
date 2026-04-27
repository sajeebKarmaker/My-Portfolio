import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-secondary">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-4xl md:text-5xl mb-12 text-center text-foreground" style={{ fontWeight: 700 }}>
          Word on the{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            street
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <Quote size={32} className="text-purple-500 mb-4" />
            <p className="text-foreground/90 mb-6 leading-relaxed">
              "Working with Ayoola was an absolute pleasure. Their attention to detail and ability to bring our vision to life exceeded all expectations. Highly recommended!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <div>
                <p className="text-foreground" style={{ fontWeight: 700 }}>Sarah Johnson</p>
                <p className="text-muted-foreground text-sm">CEO, TechStart</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <Quote size={32} className="text-purple-500 mb-4" />
            <p className="text-foreground/90 mb-6 leading-relaxed">
              "An exceptional developer with a keen eye for design. Ayoola delivered a stunning website that perfectly represents our brand. Professional and talented!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <div>
                <p className="text-foreground" style={{ fontWeight: 700 }}>Michael Chen</p>
                <p className="text-muted-foreground text-sm">Founder, Creative Labs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
