import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Anchor } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Missions" },
    { href: "/experience", label: "Experience" },
    { href: "/leadership", label: "Leadership" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-ocean"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-2xl font-semibold text-ocean-gradient"
          >
            <Anchor className="w-6 h-6 text-primary" />
            BD
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`transition-colors duration-300 font-body text-sm tracking-wide link-wave ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a
              href="[ADD RESUME LINK]"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-body text-sm font-medium hover:shadow-lg hover:shadow-primary/20"
            >
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 transition-colors duration-300 font-body text-base ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="[ADD RESUME LINK]"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 font-body text-sm font-medium"
            >
              Resume
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
