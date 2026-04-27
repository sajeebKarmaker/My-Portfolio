export function About() {
  return (
    <section id="about" className="py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl mb-6 text-white" style={{ fontWeight: 700 }}>
            I develop{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              frontend
            </span>{" "}
            solutions that delight and inspire users.
          </h2>
          <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors" style={{ fontWeight: 700 }}>
            Hire me
          </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="rounded-2xl overflow-hidden h-80">
            <img
              src="https://images.unsplash.com/photo-1771887536502-71eb6dc95389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Workspace"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden h-80">
            <img
              src="https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NzEyNzU1NXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden h-80">
            <img
              src="https://images.unsplash.com/photo-1763568258266-3794097e5837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGNvZGluZ3xlbnwxfHx8fDE3NzcxMjc3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Creative work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
