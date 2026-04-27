import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "I specialize in frontend development, UI/UX design, and creating responsive web applications using modern technologies like React, TypeScript, and Tailwind CSS."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on complexity and scope. A simple website might take 2-3 weeks, while more complex applications can take 2-3 months. I'll provide a detailed timeline during our initial consultation."
    },
    {
      question: "What is your development process?",
      answer: "My process includes discovery and planning, design mockups, development, testing, and deployment. I maintain clear communication throughout and provide regular updates on progress."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! I offer maintenance packages and ongoing support to ensure your website or application continues to run smoothly and stays up-to-date with the latest technologies."
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-4xl md:text-5xl mb-4 text-center text-foreground" style={{ fontWeight: 700 }}>
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Everything you need to know about working with me
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-foreground pr-4" style={{ fontWeight: 700 }}>
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-purple-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
