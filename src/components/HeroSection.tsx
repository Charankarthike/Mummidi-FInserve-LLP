import FadeIn from './FadeIn';
import { ShadowOverlay } from './ShadowOverlay';
import CurvedSlider from './CurvedSlider';

// Slider images - add financial-themed images here
const SLIDER_IMAGES = [
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop', // Charts
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop', // Finance
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Analytics
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', // Business
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Data
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop', // Investment
];

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col relative" style={{ overflowX: 'clip' }}>

      {/* ── 3D Curved Image Slider Background - highly visible with brightness ── */}
      <div 
        className="absolute z-[2] pointer-events-none"
        style={{
          top: '30%',
          left: '0',
          right: '0',
          height: '65%',
          opacity: 0.85,
          filter: 'brightness(1.1) contrast(1.05)',
        }}
      >
        <CurvedSlider
          images={SLIDER_IMAGES}
          speed={18}
          gap={10}
          curve={8}
          reverse={false}
        />
      </div>

      {/* ── Shadow Overlay Background - very subtle ── */}
      <div className="absolute inset-0 z-0">
        <ShadowOverlay
          sizing="fill"
          color="rgba(10, 37, 64, 0.01)"
          animation={{
            scale: 20,
            speed: 12,
          }}
          noise={{
            opacity: 0.5,
            scale: 0.5,
          }}
        />
      </div>

      {/* ── Decorative background ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <div
          className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(ellipse at center, #BFDBFE 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[50%] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, #93C5FD 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0A2540" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full opacity-[0.07]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '55%' }}
        >
          <polyline
            points="0,280 180,240 360,195 480,155 600,125 720,78 900,55 1080,38 1260,18 1440,8"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* ── Hero Content - Centered at Top ── */}
      <div className="flex-1 flex flex-col items-center justify-start relative z-10 px-5 sm:px-8 md:px-14 pt-24 max-w-6xl mx-auto w-full">

        {/* Badge */}
        <FadeIn delay={0} y={-16}>
          <span className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] uppercase tracking-[0.2em] text-[10px] sm:text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            Insurance &amp; Mutual Fund Distributor
          </span>
        </FadeIn>

        {/* Main Heading - Centered */}
        <FadeIn delay={0.12} y={40} className="overflow-hidden text-center">
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-[0.9] text-[#0A2540]"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
          >
            Mummidi
            <br />
            <span className="text-[#2563EB]">Finserve LLP</span>
          </h1>
        </FadeIn>

        {/* Description - Centered */}
        <FadeIn delay={0.25} y={20} className="text-center">
          <p
            className="text-[#0A2540]/60 font-light leading-relaxed max-w-3xl mt-4 mb-8"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          >
            A financial partner driven by building lasting wealth and security for every family — with over 20 years of trust.
          </p>
        </FadeIn>
      </div>

      {/* ── Scroll cue ── */}
      <FadeIn delay={0.7} y={0} className="flex justify-center pb-6 relative z-10">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[#0A2540]/30 text-[9px] uppercase tracking-widest font-medium">scroll</span>
          <div
            className="w-px h-8 bg-gradient-to-b from-[#0A2540]/25 to-transparent"
            style={{ animation: 'bounce 1.8s infinite' }}
          />
        </div>
      </FadeIn>
    </section>
  );
}
