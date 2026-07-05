import { useEffect, useRef, useState } from 'react';

const ROW1_GRADIENTS: [string, string][] = [
  ['#EFF6FF', '#BFDBFE'],
  ['#ECFDF5', '#A7F3D0'],
  ['#FFF7ED', '#FED7AA'],
  ['#EFF6FF', '#93C5FD'],
  ['#F5F3FF', '#DDD6FE'],
  ['#ECFEFF', '#A5F3FC'],
  ['#EFF6FF', '#BFDBFE'],
  ['#FFF1F2', '#FECDD3'],
  ['#ECFDF5', '#A7F3D0'],
  ['#EFF6FF', '#93C5FD'],
  ['#FFFBEB', '#FDE68A'],
];

const ROW2_GRADIENTS: [string, string][] = [
  ['#F5F3FF', '#C4B5FD'],
  ['#EFF6FF', '#BFDBFE'],
  ['#ECFDF5', '#6EE7B7'],
  ['#FFF7ED', '#FDBA74'],
  ['#ECFEFF', '#67E8F9'],
  ['#EFF6FF', '#93C5FD'],
  ['#FFF1F2', '#FDA4AF'],
  ['#F5F3FF', '#DDD6FE'],
  ['#ECFDF5', '#A7F3D0'],
  ['#EFF6FF', '#BFDBFE'],
];

const LABELS = [
  'Mutual Funds', 'SIP Growth', 'Health Cover', 'Vehicle Insurance', 'LIC Plans',
  'Wealth Tracking', 'Tax Saving', 'Retirement', 'Term Life', 'Portfolio Review',
  'Goal Planning',
];

interface TileData {
  from: string;
  to: string;
  label: string;
}

function Tile({ from, to, label }: TileData) {
  return (
    <div
      className="rounded-2xl flex-shrink-0 flex items-end p-4 relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:shadow-xl"
      style={{ width: 420, height: 270, background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 420 270"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,220 60,190 120,200 180,140 240,110 300,90 360,50 420,30"
          fill="none"
          stroke="#0A2540"
          strokeWidth="3"
          strokeOpacity="0.25"
        />
      </svg>
      <span className="relative text-[#0A2540] font-medium uppercase tracking-wide text-sm bg-white/70 px-3 py-1.5 rounded-full">
        {label}
      </span>
    </div>
  );
}

function tripleArray<T>(arr: T[]): T[] {
  return [...arr, ...arr, ...arr];
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const newOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1: TileData[] = tripleArray(
    ROW1_GRADIENTS.map(([from, to], i) => ({ from, to, label: LABELS[i] }))
  );
  const row2: TileData[] = tripleArray(
    ROW2_GRADIENTS.map(([from, to], i) => ({ from, to, label: LABELS[(i + 5) % LABELS.length] }))
  );

  return (
    <section ref={sectionRef} className="bg-white pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div
        className="flex gap-3 mb-3"
        style={{ transform: `translateX(${offset - 200}px)`, willChange: 'transform' }}
      >
        {row1.map((item, i) => (
          <Tile key={i} from={item.from} to={item.to} label={item.label} />
        ))}
      </div>
      <div
        className="flex gap-3"
        style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: 'transform' }}
      >
        {row2.map((item, i) => (
          <Tile key={i} from={item.from} to={item.to} label={item.label} />
        ))}
      </div>
    </section>
  );
}
