import { Github, Linkedin, Mail, Anchor } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "[ADD GITHUB LINK]", label: "GitHub" },
    { icon: Linkedin, href: "[ADD LINKEDIN LINK]", label: "LinkedIn" },
    { icon: Mail, href: "mailto:[ADD EMAIL]", label: "Email" },
  ];

  return (
    <footer className="py-12 border-t border-border glass-ocean">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Anchor className="w-5 h-5 text-primary" />
              <p className="font-display text-xl font-semibold text-ocean-gradient">
                Boubakar Diallo
              </p>
            </div>
            <p className="text-muted-foreground text-sm font-body">
              Future Naval Officer • Ocean Explorer • Submarine Engineer
            </p>
          </div>
          
          {/* Social links */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm font-body">
            © {new Date().getFullYear()} Boubakar Diallo. Exploring the depths.
          </p>
          <p className="text-muted-foreground/50 text-xs font-body italic">
            "The sea, once it casts its spell, holds one in its net of wonder forever." — Jacques Cousteau
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
