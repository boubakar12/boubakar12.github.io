import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { OceanDivider } from "@/components/OceanDivider";
import { Users, Anchor, Ship, Compass } from "lucide-react";

const Leadership = () => {
  const leadershipRoles = [
    {
      title: "Submarine Crew Leader",
      org: "Naval Training Command",
      description: "Leading teams in simulated submarine operations, coordinating dive procedures, and ensuring crew safety in high-pressure environments.",
      impact: "[ADD METRICS]",
      icon: Ship,
    },
    {
      title: "Ocean Exploration Society President",
      org: "University Marine Club",
      description: "Founded and led a student organization dedicated to marine conservation and ocean exploration awareness.",
      impact: "[ADD MEMBER COUNT]",
      icon: Anchor,
    },
    {
      title: "Dive Team Coordinator",
      org: "Research Expedition",
      description: "Organized and led scientific diving expeditions, managing equipment, safety protocols, and data collection procedures.",
      impact: "[ADD DIVES/DISCOVERIES]",
      icon: Users,
    },
  ];

  const expeditionHighlights = [
    {
      title: "Deep Sea Specimen Collection",
      description: "Led teams in recovering samples from previously unexplored ocean zones.",
      icon: "🦑",
    },
    {
      title: "Shipwreck Documentation",
      description: "Coordinated archaeological surveys of historical wreck sites.",
      icon: "🏴‍☠️",
    },
    {
      title: "Marine Conservation Outreach",
      description: "Educated communities about ocean preservation and sustainable practices.",
      icon: "🐋",
    },
    {
      title: "Youth Ocean Exploration Camp",
      description: "Mentored aspiring marine scientists and future Navy personnel.",
      icon: "🧭",
    },
  ];

  return (
    <main className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-bioluminescent/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-bioluminescent font-body text-sm tracking-[0.3em] uppercase mb-4">
                🔱 Commanding The Depths
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-medium mb-6">
                <span className="text-ocean-gradient italic">Leadership</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg">
                Guiding teams through uncharted waters — from submarine crews to research expeditions.
              </p>
            </div>
          </div>
        </section>

        <OceanDivider variant="wave" />

        {/* Leadership Roles */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {leadershipRoles.map((role, index) => (
                <div
                  key={index}
                  className="p-8 depth-card rounded-2xl hover:border-bioluminescent/30 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-bioluminescent/10 flex items-center justify-center mb-6 group-hover:bg-bioluminescent/20 transition-colors">
                    <role.icon className="w-6 h-6 text-bioluminescent" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-2">{role.title}</h3>
                  <p className="text-bioluminescent text-sm font-body mb-4">{role.org}</p>
                  <p className="text-muted-foreground font-body text-sm mb-4">{role.description}</p>
                  <div className="px-4 py-2 bg-bioluminescent/10 rounded-full inline-block">
                    <span className="text-bioluminescent text-sm font-body">{role.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <OceanDivider variant="discovery" />

        {/* Expedition Highlights */}
        <section className="py-24 bg-abyss/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-medium mb-12 text-center">
                Expedition <span className="text-ocean-gradient italic">Highlights</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {expeditionHighlights.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 depth-card rounded-xl hover:border-bioluminescent/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-bioluminescent/10 flex items-center justify-center shrink-0 text-2xl">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-medium mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm font-body">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-8 animate-float">🛥️</div>
              <h2 className="font-display text-3xl font-medium mb-6">
                The Captain's <span className="text-ocean-gradient italic">Philosophy</span>
              </h2>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
                "A captain is only as strong as the crew they command. In the depths of the ocean, 
                trust, precision, and courage determine survival. I lead by diving first — showing 
                my team that no challenge is too deep when we face it together."
              </p>
              <blockquote className="text-bioluminescent/70 font-body italic border-l-2 border-bioluminescent/30 pl-4 text-left">
                "The sea, once it casts its spell, holds one in its net of wonder forever."
                <footer className="text-muted-foreground text-sm mt-2">— Jacques Cousteau</footer>
              </blockquote>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Leadership;
