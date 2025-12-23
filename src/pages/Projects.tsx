import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { OceanDivider } from "@/components/OceanDivider";
import { Github, ExternalLink, Star } from "lucide-react";
import { useState } from "react";

type Category = "All" | "Ocean Tech" | "Exploration" | "Research" | "Conservation";

interface Project {
  title: string;
  category: Category;
  tagline: string;
  bullets: string[];
  tech: string[];
  image: string;
  featured?: boolean;
  github?: string;
  demo?: string;
}

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filters: Category[] = ["All", "Ocean Tech", "Exploration", "Research", "Conservation"];

  const projects: Project[] = [
    {
      title: "Autonomous Underwater Vehicle (AUV)",
      category: "Ocean Tech",
      tagline: "Self-navigating submarine drone for deep-sea mapping and exploration.",
      bullets: [
        "Designed propulsion and navigation systems for depths up to 1000m",
        "Integrated sonar and camera systems for seafloor mapping"
      ],
      tech: ["Embedded C", "Sonar", "Computer Vision", "Robotics"],
      image: "🛥️",
      featured: true,
      github: "[ADD LINK]",
    },
    {
      title: "Bioluminescent Species Tracker",
      category: "Research",
      tagline: "ML pipeline to identify and catalog deep-sea bioluminescent creatures.",
      bullets: [
        "Built image classification model trained on 10,000+ deep-sea photographs",
        "Achieved 94% accuracy on species identification in low-light conditions"
      ],
      tech: ["Python", "TensorFlow", "OpenCV", "Marine Biology"],
      image: "🪼",
      featured: true,
      github: "[ADD LINK]",
    },
    {
      title: "Underwater Habitat Design",
      category: "Exploration",
      tagline: "Conceptual engineering for sustainable human habitation beneath the waves.",
      bullets: [
        "Modeled pressure dynamics and life support requirements",
        "Designed modular living quarters with renewable energy integration"
      ],
      tech: ["CAD", "Structural Analysis", "Life Support Systems"],
      image: "🏗️",
      featured: true,
      demo: "[ADD LINK]",
    },
    {
      title: "Shipwreck Archaeological Database",
      category: "Exploration",
      tagline: "Interactive mapping system for cataloging sunken vessels and artifacts.",
      bullets: [
        "Georeferenced database of 500+ documented shipwreck sites",
        "3D reconstruction from sonar and photogrammetry data"
      ],
      tech: ["React", "PostgreSQL", "3D Modeling", "GIS"],
      image: "🏴‍☠️",
      demo: "[ADD LINK]",
    },
    {
      title: "Coral Reef Health Monitor",
      category: "Conservation",
      tagline: "Sensor network for real-time coral ecosystem health tracking.",
      bullets: [
        "Deployed IoT sensors measuring temperature, pH, and dissolved oxygen",
        "Early warning system for bleaching events"
      ],
      tech: ["IoT", "Arduino", "Data Visualization", "Environmental Science"],
      image: "🪸",
    },
    {
      title: "Ocean Floor 3D Mapping System",
      category: "Ocean Tech",
      tagline: "High-resolution bathymetric mapping for unexplored ocean regions.",
      bullets: [
        "Multi-beam sonar data processing pipeline",
        "Generated detailed topographic models of underwater terrain"
      ],
      tech: ["Sonar Processing", "Python", "3D Rendering"],
      image: "🗺️",
      github: "[ADD LINK]",
    },
  ];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <main className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-bioluminescent/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <p className="text-bioluminescent font-body text-sm tracking-[0.3em] uppercase mb-4">
                🔬 Expeditions & Discoveries
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-medium mb-6">
                <span className="text-ocean-gradient italic">Projects</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg">
                Engineering solutions for ocean exploration and marine research.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-bioluminescent text-primary-foreground shadow-[0_0_20px_hsl(var(--bioluminescent)/0.5)]"
                      : "bg-card border border-border hover:border-bioluminescent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <OceanDivider variant="wave" />

        {/* Projects Grid */}
        <section className="py-8 pb-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={index}
                  className="group depth-card rounded-2xl overflow-hidden hover:border-bioluminescent/50 transition-all duration-500"
                >
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-bioluminescent/20 border border-bioluminescent/50 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-bioluminescent fill-bioluminescent" />
                      <span className="text-bioluminescent text-xs font-body">Featured</span>
                    </div>
                  )}

                  {/* Image area */}
                  <div className="aspect-video bg-abyss flex items-center justify-center relative overflow-hidden">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-500 animate-float">
                      {project.image}
                    </span>
                    <div className="absolute inset-0 bg-bioluminescent/0 group-hover:bg-bioluminescent/10 transition-colors duration-500" />
                    <p className="absolute bottom-2 text-muted-foreground text-xs font-body">[ADD SCREENSHOT]</p>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-bioluminescent/10 text-bioluminescent text-xs font-body rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-medium mb-2 group-hover:text-bioluminescent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm mb-4">
                      {project.tagline}
                    </p>
                    
                    {/* Bullets */}
                    <ul className="space-y-2 mb-6">
                      {project.bullets.map((bullet, i) => (
                        <li key={i} className="text-muted-foreground text-sm font-body flex items-start gap-2">
                          <span className="text-bioluminescent mt-1">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-xs font-body rounded-md text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-bioluminescent transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-bioluminescent transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                    </div>
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

export default Projects;
