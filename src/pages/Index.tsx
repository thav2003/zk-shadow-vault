import CircuitBackground from '@/components/CircuitBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ArchitectureSection from '@/components/ArchitectureSection';
import WorkflowSection from '@/components/WorkflowSection';
import UseCasesSection from '@/components/UseCasesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated circuit background */}
      <CircuitBackground />
      
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none noise" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ArchitectureSection />
          <WorkflowSection />
          <UseCasesSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
