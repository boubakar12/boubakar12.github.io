import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Waves } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 relative bubbles-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="w-5 h-5 text-primary" />
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase">
              Join the Mission
            </p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-6">
            Ready to explore <span className="text-ocean-gradient italic">together?</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg mb-10 max-w-xl mx-auto">
            Whether you're interested in ocean exploration, naval careers, or building 
            the future of marine technology, I'd love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ocean" size="xl" asChild>
              <a href="mailto:[ADD EMAIL]">Contact Me</a>
            </Button>
            <Button variant="ocean-outline" size="xl" asChild>
              <Link to="/contact">Send Message</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
