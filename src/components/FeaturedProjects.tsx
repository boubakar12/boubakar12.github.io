import { ArrowUpRight, Star, Anchor } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProjects = () => {
  const projects = [
    {
      title: "Autonomous Submarine Design",
      category: "Naval Engineering",
      description: "Conceptual design for an autonomous research submarine capable of deep-sea exploration and species documentation.",
      tech: ["CAD Design", "Hydrodynamics", "Navigation Systems"],
      image: "🚢",
      featured: true,
    },
    {
      title: "Ocean Floor Mapping System",
      category: "Marine Technology",
      description: "Sonar-based system for creating detailed 3D maps of the ocean floor and identifying potential archaeological sites.",
      tech: ["Sonar Tech", "3D Mapping", "Data Analysis"],
      image: "🗺️",
      featured: true,
    },
    {
      title: "Marine Species Database",
      category: "Scientific Research",
      description: "Comprehensive database for documenting and cataloging newly discovered marine species with AI-powered identification.",
      tech: ["Python", "Machine Learning", "Marine Biology"],
      image: "🐙",
      featured: true,
    },
  ];

  return (
    <section id="featured" className="py-32 relative bg-ocean-deep/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Anchor className="w-5 h-5 text-primary" />
              <p className="text-primary font-body text-sm tracking-[0.3em] uppercase">
                Featured Missions
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-medium">
              Selected <span className="text-ocean-gradient italic">Expeditions</span>
            </h2>
          </div>
          <Link 
            to="/projects" 
            className="mt-6 md:mt-0 text-primary font-body text-sm tracking-wide hover:underline flex items-center gap-2"
          >
            View All Missions <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative depth-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer"
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary/20 border border-primary/50 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-primary text-xs font-body">Featured</span>
                </div>
              )}

              {/* Project image area */}
              <div className="aspect-video bg-ocean-abyss flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-500 animate-float">
                  {project.image}
                </span>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>

              {/* Project info */}
              <div className="p-6">
                <p className="text-primary text-xs font-body tracking-wide mb-2">
                  {project.category}
                </p>
                <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                
                {/* Tech stack chips */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-ocean-deep text-xs font-body rounded-md text-muted-foreground border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                <ArrowUpRight className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
