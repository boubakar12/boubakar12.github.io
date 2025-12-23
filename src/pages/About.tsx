import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { OceanDivider } from "@/components/OceanDivider";
import { Anchor, Compass, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Anchor,
      title: "Build what survives the deep",
      description: "Engineering systems that work reliably under pressure—tested, validated, trusted."
    },
    {
      icon: Compass,
      title: "Navigate by data",
      description: "Make decisions with evidence and metrics, not gut feelings alone."
    },
    {
      icon: Heart,
      title: "Chart paths for others",
      description: "Help fellow explorers succeed and discover faster than I did."
    },
  ];

  const timeline = [
    { year: "2021", event: "Immigrated to the U.S. — began a new expedition" },
    { year: "2022", event: "Joined Thrive Scholars — learned to navigate new waters" },
    { year: "2024", event: "Enrolled at Cornell University — started engineering journey" },
    { year: "2025+", event: "Navy enlistment — pursuing ocean exploration dreams" },
    { year: "Future", event: "Map the ocean floor, discover new species, build underwater civilizations" },
  ];

  return (
    <main className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bioluminescent/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-bioluminescent font-body text-sm tracking-[0.3em] uppercase mb-4">
                🧭 About The Explorer
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-medium mb-6">
                My <span className="text-ocean-gradient italic">Voyage</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden depth-card sticky top-32">
                  <div className="w-full h-full bg-gradient-to-br from-bioluminescent/20 to-transparent flex items-center justify-center">
                    <span className="text-8xl animate-float">🤿</span>
                  </div>
                  <p className="absolute bottom-4 left-0 right-0 text-center text-muted-foreground text-sm font-body">[ADD HEADSHOT]</p>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-12">
                <div>
                  <h2 className="font-display text-2xl font-medium mb-6 flex items-center gap-3">
                    <span className="text-2xl">⚓</span> The Journey
                  </h2>
                  <div className="space-y-6 text-muted-foreground font-body leading-relaxed">
                    <p>
                      I immigrated to the U.S. in November 2021 without speaking English — 
                      like diving into unknown waters. Programs like Thrive Scholars became 
                      my compass, helping me navigate a new country and new language.
                    </p>
                    <p>
                      Now I'm pursuing my lifelong dream: exploring the ocean's depths. The Navy 
                      offers the perfect vessel for this journey — submarines, deep-sea research, 
                      and the chance to chart the 80% of our oceans that remain unexplored.
                    </p>
                    <p>
                      I want to discover new species, recover ancient artifacts from shipwrecks, 
                      map the entire ocean floor, and ultimately help build sustainable 
                      civilizations beneath the waves. The sea is Earth's final frontier.
                    </p>
                  </div>
                </div>

                {/* Values */}
                <div>
                  <h2 className="font-display text-2xl font-medium mb-6 flex items-center gap-3">
                    <span className="text-2xl">🔱</span> Guiding Principles
                  </h2>
                  <div className="space-y-4">
                    {values.map((value, index) => (
                      <div key={index} className="p-6 depth-card rounded-xl hover:border-bioluminescent/30 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-bioluminescent/10 flex items-center justify-center shrink-0">
                            <value.icon className="w-5 h-5 text-bioluminescent" />
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-medium mb-1">{value.title}</h3>
                            <p className="text-muted-foreground text-sm font-body">{value.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h2 className="font-display text-2xl font-medium mb-6 flex items-center gap-3">
                    <span className="text-2xl">🌊</span> Ocean Obsessions
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "🛥️ Submarine Engineering", 
                      "🗺️ Ocean Mapping", 
                      "🦑 Marine Biology",
                      "🏺 Underwater Archaeology",
                      "🏗️ Underwater Habitats",
                      "🤖 ROV Development"
                    ].map((interest, i) => (
                      <span key={i} className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-body">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <OceanDivider variant="discovery" />

        {/* Timeline */}
        <section className="py-24 bg-abyss/30">
          <div className="container mx-auto px-6">
            <h2 className="font-display text-3xl font-medium mb-12 text-center">
              <span className="text-ocean-gradient italic">Expedition Log</span>
            </h2>
            <div className="max-w-2xl mx-auto">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-bioluminescent shrink-0 shadow-[0_0_15px_hsl(var(--bioluminescent))]" />
                    {index !== timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-bioluminescent/50 to-transparent" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-bioluminescent font-body text-sm mb-1">{item.year}</p>
                    <p className="font-body text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default About;
