import { ArrowDown, Github, Linkedin, Mail, Anchor, Waves } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { value: "10,000m+", label: "Depth Explored" },
    { value: "50+", label: "Species Documented" },
    { value: "∞", label: "Ocean to Map" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bubbles-bg">
      {/* Animated ocean orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ocean-bioluminescent/10 rounded-full blur-3xl animate-float animation-delay-400" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-ocean-surface/5 rounded-full blur-3xl animate-float animation-delay-600" />
      
      {/* Sonar rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[600px] h-[600px] border border-primary/10 rounded-full animate-sonar" />
        <div className="absolute inset-0 w-[600px] h-[600px] border border-ocean-bioluminescent/10 rounded-full animate-sonar animation-delay-700" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-up opacity-0">
            <Anchor className="w-5 h-5 text-primary" />
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase">
              Future Naval Officer • Ocean Explorer • Submarine Engineer
            </p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-6 animate-fade-up opacity-0 animation-delay-200">
            Boubakar
            <span className="block text-ocean-gradient italic">Diallo</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body leading-relaxed animate-fade-up opacity-0 animation-delay-400">
            Exploring the depths of the ocean, building submarines, discovering new species, 
            and mapping the mysteries that lie beneath the waves. My dream: to build a 
            civilization under the sea and bring the ocean to the world.
          </p>
          
          {/* Quick proof stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-up opacity-0 animation-delay-500">
            {stats.map((stat, index) => (
              <div key={index} className="px-4 py-2 glass-ocean rounded-full">
                <span className="text-primary font-display font-semibold">{stat.value}</span>
                <span className="text-muted-foreground text-sm font-body ml-2">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 animation-delay-600">
            <Button variant="ocean" size="xl" asChild>
              <Link to="/projects">Explore My Missions</Link>
            </Button>
            <Button variant="ocean-outline" size="xl" asChild>
              <a href="[ADD RESUME LINK]" target="_blank" rel="noopener noreferrer">
                Download Resume
              </a>
            </Button>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mt-8 animate-fade-up opacity-0 animation-delay-700">
            <a
              href="[ADD GITHUB LINK]"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="[ADD LINKEDIN LINK]"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:[ADD EMAIL]"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animation-delay-800">
        <a
          href="#featured"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs tracking-widest uppercase font-body">Dive Deeper</span>
          <Waves className="w-5 h-5 animate-float" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
