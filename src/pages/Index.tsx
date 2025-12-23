import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import ExperiencePreview from "@/components/ExperiencePreview";
import SkillsSection from "@/components/SkillsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { OceanDivider } from "@/components/OceanDivider";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <OceanDivider variant="wave" />
        <FeaturedProjects />
        <OceanDivider variant="depth" />
        <AboutSection />
        <OceanDivider variant="discovery" />
        <ExperiencePreview />
        <OceanDivider variant="wave" />
        <SkillsSection />
        <OceanDivider variant="depth" />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
