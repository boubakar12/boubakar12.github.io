import { Link } from "react-router-dom";
import { ArrowUpRight, Ship, Waves } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-ocean-bioluminescent/10 flex items-center justify-center">
                <span className="text-8xl animate-submarine">🚢</span>
                <p className="absolute bottom-4 text-muted-foreground text-sm font-body">[ADD HEADSHOT]</p>
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          {/* Content side */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-5 h-5 text-primary" />
              <p className="text-primary font-body text-sm tracking-[0.3em] uppercase">
                About Me
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-8">
              A dreamer with a mission to
              <span className="text-ocean-gradient italic block">explore the deep</span>
            </h2>
            <div className="space-y-6 text-muted-foreground font-body leading-relaxed">
              <p>
                I am deeply passionate about the ocean and the Navy. My dream is to explore 
                the depths of the sea, build submarines, and discover what lies beneath the 
                waves—new species, ancient artifacts, and the mysteries of the deep.
              </p>
              <p>
                I want to map the entire ocean, recover lost treasures and sunken ships, 
                and ultimately help build a civilization under the sea. The ocean is the 
                last frontier, and I want to bring its wonders to the world.
              </p>
            </div>

            {/* Now section */}
            <div className="mt-8 p-6 depth-card rounded-xl">
              <h3 className="font-display text-lg font-medium mb-3 text-primary flex items-center gap-2">
                <Ship className="w-5 h-5" />
                Current Mission
              </h3>
              <ul className="space-y-2 text-muted-foreground font-body text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  Preparing to join the U.S. Navy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  Studying ocean engineering and submarine design
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  Researching deep-sea exploration technology
                </li>
              </ul>
            </div>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 mt-8 text-primary font-body text-sm tracking-wide hover:underline"
            >
              Read My Full Story <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
