import { useEffect, useState } from 'react';

const NAV_LINKS = ['About', 'Services', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        boxShadow: scrolled ? '0 1px 32px rgba(10,37,64,0.08)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(10,37,64,0.07)' : 'none',
      }}
    >
      <div className="flex justify-between items-center px-6 md:px-10 py-4 md:py-5 max-w-screen-xl mx-auto">
        <a href="#" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Mummidi Finserve LLP"
            className="h-10 sm:h-11 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(10,37,64,0.10))' }}
          />
        </a>
        <div className="flex items-center gap-6 sm:gap-8 md:gap-12">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#0A2540] font-semibold uppercase tracking-wider text-sm md:text-base relative group"
            >
              {link}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#2563EB] transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
