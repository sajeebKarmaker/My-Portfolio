import { Code2, Palette, Smartphone } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Code2,
      title: "Web Development",
      description: "Building responsive, performant web applications with modern technologies and best practices."
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Creating beautiful, intuitive interfaces that provide exceptional user experiences."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Ensuring seamless experiences across all devices with responsive design principles."
    }
  ];

  return (
    <section id="services" className="py-20 px-6 md:px-12 lg:px-20 bg-secondary">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontWeight: 700 }}>
            Code that solves problems,
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              one project at a time.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border border-border hover:border-purple-500/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl mb-4 text-foreground" style={{ fontWeight: 700 }}>
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
