export function Articles() {
  const articles = [
    {
      title: "10 Best UI/UX Design Trends",
      date: "March 15, 2026",
      readTime: "5 min read"
    },
    {
      title: "The Future of JavaScript Frameworks",
      date: "March 10, 2026",
      readTime: "8 min read"
    },
    {
      title: "Understanding Modern Web Architecture",
      date: "March 5, 2026",
      readTime: "6 min read"
    },
    {
      title: "Accessibility Best Practices for 2026",
      date: "February 28, 2026",
      readTime: "7 min read"
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#12121a]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
            Latest Articles
          </h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
              ←
            </button>
            <button className="w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-[#1a1a24] p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer"
            >
              <p className="text-gray-400 text-sm mb-2">{article.date} • {article.readTime}</p>
              <h3 className="text-xl text-white" style={{ fontWeight: 700 }}>
                {article.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
