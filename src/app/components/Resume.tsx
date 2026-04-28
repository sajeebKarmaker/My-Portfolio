import { GraduationCap, Briefcase } from "lucide-react";

export function Resume() {
  const education = [
    {
      degree: "Bachelor of Science in Electrical  & Computer Engineering",
      institution: "Rajshahi University of Engineering & Technology",
      period: "2019 - 2024",
      description: "Focused on software engineering, web development, and competitive programming."
    }
  ];

  const experience = [
    {
      title: "Software Engineer - L2",
      company: "Enosis Solutions",
      period: "2026 - Present",
      description: "Working on various projects and learning new technologies."
    },
    {
      title: "Software Engineer - L1",
      company: "Enosis Solutions",
      period: "2025 - 2026",
      description: "Working on various projects and learning new technologies."
    },
    
  ];

  return (
    <section id="resume" className="py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <GraduationCap size={24} className="text-white" />
              </div>
              <h2 className="text-3xl" style={{ fontWeight: 700 }}>Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((item, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-2xl border border-border"
                >
                  <p className="text-purple-400 text-sm mb-2">{item.period}</p>
                  <h3 className="text-xl text-foreground mb-1" style={{ fontWeight: 700 }}>
                    {item.degree}
                  </h3>
                  <p className="text-muted-foreground mb-3">{item.institution}</p>
                  <p className="text-muted-foreground text-sm opacity-80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Briefcase size={24} className="text-white" />
              </div>
              <h2 className="text-3xl" style={{ fontWeight: 700 }}>Work Experience</h2>
            </div>
            <div className="space-y-6">
              {experience.map((item, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-2xl border border-border"
                >
                  <p className="text-purple-400 text-sm mb-2">{item.period}</p>
                  <h3 className="text-xl text-foreground mb-1" style={{ fontWeight: 700 }}>
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">{item.company}</p>
                  <p className="text-muted-foreground text-sm opacity-80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
