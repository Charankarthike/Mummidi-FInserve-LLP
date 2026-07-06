import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * ScrollVideoSection
 * -------------------
 * Pins itself for `SCRUB_VH` viewport-heights of scroll distance, while
 * setting `video.currentTime` directly from scroll progress (0 -> 1 maps
 * to 0 -> video.duration). The video never "plays" — it's seeked frame by
 * frame, which is what creates the Apple product-page scrubbing effect.
 *
 * IMPORTANT for smooth scrubbing: export your source video with every
 * frame as a keyframe, e.g.:
 *   ffmpeg -i input.mp4 -vf "fps=30" -g 1 -crf 18 public/hero-scrub.mp4
 * Without -g 1, browsers can only seek cleanly to keyframes (typically
 * every ~2s), which makes the scrub feel jumpy/laggy.
 */

const SCRUB_VH = 300; // how many vh of scroll distance the pin+scrub lasts for

const CAPTIONS = [
  { at: 0.05, text: 'Every plan starts with a goal.' },
  { at: 0.35, text: 'We map mutual funds to your timeline.' },
  { at: 0.6,  text: 'Insurance that protects what matters.' },
  { at: 0.85, text: 'Built for fourteen years of trust.' },
];

export default function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const [videoExists, setVideoExists] = useState<boolean | null>(null);
  const [duration,    setDuration]    = useState(0);
  const [videoReady,  setVideoReady]  = useState(false);

  useEffect(() => {
    fetch('/hero-scrub.mp4', { method: 'HEAD' })
      .then((res) => setVideoExists(res.ok))
      .catch(() => setVideoExists(false));
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth-ish caption progress for fade timing
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const captionOpacities = CAPTIONS.map((c, i) => {
    const next = CAPTIONS[i + 1]?.at ?? 1;
    return useTransform(
      scrollYProgress,
      [c.at - 0.05, c.at, next - 0.08, next - 0.03],
      [0, 1, 1, 0]
    );
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setDuration(video.duration || 0);
      setVideoReady(true);
    };

    if (video.readyState >= 1) handleLoaded();
    video.addEventListener('loadedmetadata', handleLoaded);
    return () => video.removeEventListener('loadedmetadata', handleLoaded);
  }, [videoExists]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const targetTime = Math.min(duration, Math.max(0, progress * duration));
    if (Math.abs(video.currentTime - targetTime) > 0.01) {
      video.currentTime = targetTime;
    }
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0A2540]"
      style={{ height: `${SCRUB_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Video layer — only mounted once the file is confirmed present, seeked never played */}
        {videoExists && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero-scrub.mp4"
            muted
            playsInline
            preload="auto"
          />
        )}

        {/* Fallback image shown until a real video is uploaded / while loading */}
        {!videoReady && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/mutual-fund.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <PlaceholderScrubVisual progress={scrollYProgress} />
          </div>
        )}

        {/* Dark gradient for caption legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,37,64,0.5) 0%, rgba(10,37,64,0.1) 30%, rgba(10,37,64,0.1) 70%, rgba(10,37,64,0.6) 100%)',
          }}
        />

        {/* Scrubbing captions */}
        <div className="relative z-10 px-6 max-w-2xl text-center">
          {CAPTIONS.map((c, i) => (
            <motion.p
              key={c.text}
              style={{ opacity: captionOpacities[i] }}
              className="absolute inset-0 flex items-center justify-center text-[#0A2540] font-black uppercase tracking-wide leading-snug"
            >
              <span style={{ fontSize: 'clamp(1.4rem, 4vw, 2.6rem)', textShadow: '0 2px 10px rgba(255,255,255,0.15)' }}>{c.text}</span>
            </motion.p>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-40 h-1 bg-[#0A2540]/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#0A2540]"
            style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Lightweight CSS/SVG stand-in so the section looks intentional before a
 * real video file is dropped in. Animates a simple "growth" motif tied to
 * scroll progress, same mechanism as the real video would use.
 */
function PlaceholderScrubVisual({
  progress,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const barHeight = useTransform(progress, [0, 1], ['10%', '85%']);
  const rotate    = useTransform(progress, [0, 1], [0, 360]);
  const scale     = useTransform(progress, [0, 0.5, 1], [0.8, 1.1, 1]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        style={{
          rotate,
          scale,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          boxShadow: '0 8px 32px rgba(10, 37, 64, 0.15)',
        }}
        className="relative w-80 h-80 sm:w-[550px] sm:h-[550px] rounded-full border-2 border-white/30 flex items-end justify-center overflow-hidden"
      >
        <motion.div
          style={{ height: barHeight }}
          className="w-full bg-gradient-to-t from-blue-400/80 to-blue-200/50"
        />
      </motion.div>

    </div>
  );
}
