import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

export default function VideoScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth spring physics
  const spring = { stiffness: 80, damping: 25, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, spring);

  // 3D card transforms
  const rotateX = useTransform(smoothProgress, [0, 0.45, 0.65, 1], [28, 0, 0, -8]);
  const rotateY = useTransform(smoothProgress, [0, 0.45, 0.65, 1], [-14, 0, 0, 4]);
  const scale   = useTransform(smoothProgress, [0, 0.45, 0.65, 1], [0.72, 1, 1, 0.9]);
  const translateY = useTransform(smoothProgress, [0, 0.45, 1], [60, 0, -30]);

  // Glow: peaks when card is flat
  const glowOpacity = useTransform(smoothProgress, [0.3, 0.5, 0.7], [0, 1, 0]);

  // Text / label reveal
  const labelY       = useTransform(smoothProgress, [0.35, 0.55], [30, 0]);
  const labelOpacity = useTransform(smoothProgress, [0.35, 0.55], [0, 1]);

  // Floating badge parallax
  const badgeY = useTransform(smoothProgress, [0, 1], [-20, 30]);

  // Scroll cue fade
  const cueOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center overflow-hidden bg-[#F8FAFC] py-32 sm:py-44"
      style={{ perspective: '1200px', perspectiveOrigin: '50% 60%' }}
    >
      {/* Section title */}
      <motion.div
        style={{ y: labelY, opacity: labelOpacity }}
        className="mb-12 sm:mb-16 flex flex-col items-center gap-3 relative z-20"
      >
        <span className="text-[#2563EB] uppercase tracking-[0.25em] text-xs sm:text-sm font-medium">
          In action
        </span>
        <h2
          className="hero-heading font-black uppercase leading-none text-center"
          style={{ fontSize: 'clamp(2rem, 8vw, 100px)' }}
        >
          See it work
        </h2>
      </motion.div>

      {/* Floating badge — parallaxes independently */}
      <motion.div
        style={{ y: badgeY }}
        className="absolute top-16 right-[8%] sm:right-[12%] z-30 hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#0A2540]/10 rounded-full px-4 py-2 shadow-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[#0A2540] text-xs font-medium uppercase tracking-widest">
          14+ years experience
        </span>
      </motion.div>

      {/* ── 3D Video Card ── */}
      <div className="relative w-full max-w-[900px] px-5 sm:px-8">

        {/* Ambient glow behind card */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 pointer-events-none rounded-[40px]"
          aria-hidden
        >
          <div
            className="w-full h-full rounded-[40px]"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.28) 0%, transparent 70%)',
              filter: 'blur(40px)',
              transform: 'translateY(30px) scale(1.1)',
            }}
          />
        </motion.div>

        {/* 3D card */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale,
            y: translateY,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
          }}
          className="relative w-full rounded-[32px] sm:rounded-[40px] md:rounded-[48px] overflow-hidden border-2 border-[#0A2540]/12"
        >
          {/* Glass reflection overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.06) 100%)',
            }}
          />

          {/* Inner border highlight */}
          <div
            className="absolute inset-0 z-10 pointer-events-none rounded-[32px] sm:rounded-[40px] md:rounded-[48px]"
            style={{
              boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35)',
            }}
          />

          {/* Video */}
          <video
            src="/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full block"
            style={{
              aspectRatio: '16/9',
              maxHeight: '540px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Card drop shadow */}
        <motion.div
          style={{
            scale,
            y: translateY,
            opacity: glowOpacity,
          }}
          className="absolute -bottom-8 left-[10%] right-[10%] h-16 rounded-[50%] pointer-events-none"
          aria-hidden
        >
          <div
            className="w-full h-full rounded-[50%]"
            style={{
              background: 'rgba(10, 37, 64, 0.18)',
              filter: 'blur(30px)',
            }}
          />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
      >
        <span className="text-[#0A2540]/40 text-[10px] uppercase tracking-widest font-medium">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#0A2540]/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
