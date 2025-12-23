import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { OceanDivider } from "@/components/OceanDivider";
import { Anchor, Ship, Compass, Waves } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      role: "Naval Officer Candidate",
      org: "United States Navy",
      type: "Military",
      dates: "[ADD DATES]",
      bullets: [
        "Training for submarine operations and deep-sea exploration missions",
        "Developing expertise in underwater navigation, sonar systems, and oceanographic research"
      ],
      icon: Anchor,
    },
    {
      role: "Marine Research Assistant",
      org: "Oceanographic Research Institute",
      type: "Research",
      dates: "[ADD DATES]",
      bullets: [
        "Assisted in deep-sea specimen collection and cataloging expeditions",
        "Operated ROV systems for underwater surveys and data collection"
      ],
      icon: Waves,
    },
    {
      role: "Submarine Systems Engineer Intern",
      org: "Naval Shipyard",
      type: "Engineering",
      dates: "[ADD DATES]",
      bullets: [
        "Contributed to pressure hull integrity testing and life support system maintenance",
        "Analyzed sonar data and assisted with navigation system calibration"
      ],
      icon: Ship,
    },
    {
      role: "Ocean Mapping Technician",
      org: "Bathymetric Survey Project",
      type: "Exploration",
      dates: "[ADD DATES]",
      bullets: [
        "Processed multi-beam sonar data to create 3D ocean floor maps",
        "Identified potential sites for archaeological investigation and biological research"
      ],
      icon: Compass,
    },
  ];

  return (
    <main className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-bioluminescent/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-bioluminescent font-body text-sm tracking-[0.3em] uppercase mb-4">
                ⚓ Voyages & Expeditions
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-medium mb-6">
                <span className="text-ocean-gradient italic">Experience</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg">
                From training decks to research vessels — charting my course through ocean exploration.
              </p>
            </div>
          </div>
        </section>

        <OceanDivider variant="wave" />

        {/* Experience List */}
        <section className="py-8 pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="p-8 depth-card rounded-2xl hover:border-bioluminescent/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-14 h-14 rounded-full bg-bioluminescent/10 flex items-center justify-center shrink-0">
                      <exp.icon className="w-6 h-6 text-bioluminescent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-display text-xl font-medium">{exp.role}</h3>
                          <p className="text-bioluminescent text-sm font-body">{exp.org}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-primary/10 text-xs font-body rounded-full text-muted-foreground">
                            {exp.type}
                          </span>
                          <span className="text-muted-foreground text-sm font-body whitespace-nowrap">
                            {exp.dates}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="text-muted-foreground font-body flex items-start gap-3">
                            <span className="text-bioluminescent mt-1.5 shrink-0">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <OceanDivider variant="discovery" />

        {/* Training & Certifications */}
        <section className="py-24 bg-abyss/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-medium mb-8 text-center">
                <span className="text-ocean-gradient italic">Training & Certifications</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 depth-card rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🤿</div>
                    <div>
                      <h3 className="font-display text-lg font-medium">SCUBA Certification</h3>
                      <p className="text-muted-foreground text-sm font-body mt-2">
                        [ADD CERTIFICATION LEVEL & DATE]
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 depth-card rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🛥️</div>
                    <div>
                      <h3 className="font-display text-lg font-medium">Submarine Operations</h3>
                      <p className="text-muted-foreground text-sm font-body mt-2">
                        [ADD TRAINING DETAILS]
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 depth-card rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🔊</div>
                    <div>
                      <h3 className="font-display text-lg font-medium">Sonar Operations</h3>
                      <p className="text-muted-foreground text-sm font-body mt-2">
                        [ADD TRAINING DETAILS]
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 depth-card rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🗺️</div>
                    <div>
                      <h3 className="font-display text-lg font-medium">Ocean Navigation</h3>
                      <p className="text-muted-foreground text-sm font-body mt-2">
                        [ADD TRAINING DETAILS]
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Experience;
