import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a toast - in production, this would send to a backend
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "[ADD EMAIL]", href: "mailto:[ADD EMAIL]" },
    { icon: MapPin, label: "Location", value: "Cornell University, Ithaca NY" },
  ];

  const socialLinks = [
    { icon: Github, href: "[ADD GITHUB LINK]", label: "GitHub" },
    { icon: Linkedin, href: "[ADD LINKEDIN LINK]", label: "LinkedIn" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
              Get In Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-medium mb-6">
              <span className="text-ocean-gradient italic">Contact</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              Ready to explore the ocean together? Let's connect and discuss 
              naval careers, marine technology, or ocean exploration.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact form */}
              <div className="p-8 depth-card rounded-2xl">
                <h2 className="font-display text-2xl font-medium mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-body text-muted-foreground block mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Captain Nemo"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none transition-colors font-body"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="captain@nautilus.com"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none transition-colors font-body"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground block mb-2">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your ocean exploration ideas..."
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none transition-colors font-body resize-none"
                    />
                  </div>
                  <Button type="submit" variant="ocean" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-medium mb-6">Contact Info</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                          <info.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm font-body">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a 
                              href={info.href} 
                              className="font-body font-medium hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-body font-medium">{info.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social links */}
                <div className="pt-8 border-t border-border">
                  <p className="text-muted-foreground text-sm font-body mb-4">
                    Connect with me
                  </p>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick CTAs */}
                <div className="p-6 bg-secondary/50 rounded-xl border border-border">
                  <h3 className="font-display text-lg font-medium mb-3">Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:[ADD EMAIL]"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      Email me directly
                    </a>
                    <a
                      href="[ADD RESUME LINK]"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                    >
                      📄 Download my resume
                    </a>
                    <a
                      href="[ADD LINKEDIN LINK]"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
