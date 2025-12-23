import { Ship, Anchor, Compass } from "lucide-react";

const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Naval & Marine Skills",
      skills: ["Submarine Design", "Navigation", "Hydrodynamics", "Sonar Systems", "Ocean Mapping", "Deep-Sea Diving", "Marine Biology", "Ship Operations"]
    },
    {
      title: "Technical Skills",
      skills: ["CAD Design", "Python", "Data Analysis", "3D Modeling", "Robotics", "Electronics", "GIS Mapping", "MATLAB"]
    },
  ];

  const tracks = [
    {
      icon: Ship,
      title: "Naval Operations",
      description: "Submarine command, naval tactics, and maritime operations.",
    },
    {
      icon: Anchor,
      title: "Ocean Exploration",
      description: "Deep-sea exploration, species discovery, and artifact recovery.",
    },
    {
      icon: Compass,
      title: "Marine Engineering",
      description: "Submarine design, underwater vehicles, and ocean technology.",
    },
  ];

  return (
    <section id="skills" className="py-32 relative bg-ocean-deep/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
            Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium">
            Skills & <span className="text-ocean-gradient italic">Focus Areas</span>
          </h2>
        </div>

        {/* Three tracks */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl depth-card hover:border-primary/50 transition-all duration-300 group text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <track.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                {track.title}
              </h4>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">
                {track.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Skills */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="p-8 rounded-2xl depth-card">
              <h3 className="font-display text-xl font-medium mb-6">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-4 py-2 bg-ocean-deep text-sm font-body rounded-full text-foreground border border-border hover:border-primary/50 hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dream */}
        <div className="mt-8 p-6 rounded-2xl depth-card border-primary/30 text-center">
          <p className="text-primary font-body text-sm tracking-wide mb-2">The Ultimate Dream</p>
          <p className="font-display text-lg">Build a Civilization Under the Sea 🌊</p>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
