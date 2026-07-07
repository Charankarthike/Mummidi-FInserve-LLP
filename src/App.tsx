import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VideoScrollSection from './components/VideoScrollSection';
import ScrollVideoSection from './components/ScrollVideoSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration:   1.2,
      easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="main-wrapper">
      <Navbar />
      <HeroSection />
      <VideoScrollSection />
      <ScrollVideoSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </div>
  );
}
