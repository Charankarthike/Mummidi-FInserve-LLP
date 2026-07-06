import { useRef } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import WeftHeroVisual from './WeftHeroVisual';

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 30, damping: 25 });
  const titleY = useTransform(smoothP, [0, 0.22], [60, 0]);
  const titleOp = useTransform(smoothP, [0, 0.20], [0, 1]);
  const sphereScale = useTransform(smoothP, [0.05, 0.35], [0.88, 1]);
  const sphereOp = useTransform(smoothP, [0.05, 0.30], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #050C1D 0%, #0D1F3C 55%, #050C1D 100%)',
        borderRadius: '48px 48px 0 0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Background grid + glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035 }}>
          <defs>
            <pattern id="svc-grid2" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svc-grid2)"/>
        </svg>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,179,74,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,209,197,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Header */}
      <motion.div
        style={{ y: titleY, opacity: titleOp, zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 'clamp(60px,8vw,110px)' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D7A531', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          What We Offer
        </span>
        <h2 style={{ fontFamily: "'Kanit', sans-serif", fontSize: 'clamp(3rem, 9vw, 112px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, textAlign: 'center', margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Services
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px' }}>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', boxShadow: '0 0 10px 2px #3B82F6' }} />
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }} />
        </div>

      </motion.div>

      {/* Sphere — WeftHeroVisual owns its 680px height */}
      <motion.div
        style={{ scale: sphereScale, opacity: sphereOp, width: '100%', position: 'relative', zIndex: 5, paddingBottom: '40px' }}
      >
        <WeftHeroVisual />
      </motion.div>
    </section>
  );
}
