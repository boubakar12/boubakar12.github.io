import { ArrowUpRight, Anchor, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const ExperiencePreview = () => {
  const experiences = [
    {
      role: "Future Naval Officer",
      org: "United States Navy (Aspiring)",
      dates: "2024 – Future",
      bullets: [
        "Preparing for a career in naval operations and submarine command",
        "Studying naval engineering and oceanography"
      ]
    },
    {
      role: "Ocean Exploration Researcher",
      org: "Cornell University",
      dates: "Sep 2024 – Present",
      bullets: [
        "Researching deep-sea exploration technology and marine biology",
        "Developing concepts for underwater mapping systems"
      ]
    },
    {
      role: "Marine Technology Enthusiast",
      org: "Personal Projects",
      dates: "Ongoing",
      bullets: [
        "Building autonomous underwater vehicle prototypes",
        "Studying submarine design and hydrodynamics"
      ]
    },
  ];

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-primary" />
              <p className="text-primary font-body text-sm tracking-[0.3em] uppercase">
                Experience
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-medium">
              My <span className="text-ocean-gradient italic">Journey</span>
            </h2>
          </div>
          <Link 
            to="/experience" 
            className="mt-6 md:mt-0 text-primary font-body text-sm tracking-wide hover:underline flex items-center gap-2"
          >
            View Full Experience <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="p-6 depth-card rounded-2xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-ocean-deep border border-primary/20 flex items-center justify-center shrink-0">
                    <Anchor className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium">{exp.role}</h3>
                    <p className="text-primary text-sm font-body">{exp.org}</p>
                    <ul className="mt-3 space-y-1">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="text-muted-foreground text-sm font-body flex items-start gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm font-body whitespace-nowrap">
                  {exp.dates}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencePreview;
