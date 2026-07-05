import { useEffect, useRef, useState } from 'react';

// ─── AMC data — real brand colors, monogram badges ────────────────────────────
// Colors sourced from each AMC's official brand identity. No logo artwork used.
const AMC_LIST = [
  {
    name:       'HDFC Mutual Fund',
    initials:   'HD',
    bgColor:    '#004C97',
    textColor:  '#004C97',
    borderColor:'#004C97',
  },
  {
    name:       'SBI Mutual Fund',
    initials:   'SBI',
    bgColor:    '#0C6BB5',
    textColor:  '#0C6BB5',
    borderColor:'#0C6BB5',
  },
  {
    name:       'ICICI Prudential',
    initials:   'IC',
    bgColor:    '#B02A30',
    textColor:  '#B02A30',
    borderColor:'#B02A30',
  },
  {
    name:       'Axis Mutual Fund',
    initials:   'AX',
    bgColor:    '#97144D',
    textColor:  '#97144D',
    borderColor:'#97144D',
  },
  {
    name:       'Nippon India',
    initials:   'NI',
    bgColor:    '#E60012',
    textColor:  '#C00010',
    borderColor:'#E60012',
  },
  {
    name:       'Kotak Mahindra',
    initials:   'KM',
    bgColor:    '#EE3224',
    textColor:  '#CC2010',
    borderColor:'#EE3224',
  },
  {
    name:       'UTI Mutual Fund',
    initials:   'UTI',
    bgColor:    '#004B87',
    textColor:  '#004B87',
    borderColor:'#004B87',
  },
  {
    name:       'Franklin Templeton',
    initials:   'FT',
    bgColor:    '#00538B',
    textColor:  '#00538B',
    borderColor:'#00538B',
  },
  {
    name:       'Mirae Asset',
    initials:   'MA',
    bgColor:    '#005BAA',
    textColor:  '#005BAA',
    borderColor:'#005BAA',
  },
  {
    name:       'DSP Mutual Fund',
    initials:   'DSP',
    bgColor:    '#003087',
    textColor:  '#003087',
    borderColor:'#003087',
  },
  {
    name:       'Aditya Birla',
    initials:   'AB',
    bgColor:    '#B31917',
    textColor:  '#B31917',
    borderColor:'#B31917',
  },
] as const;

// ─── Depth layers ─────────────────────────────────────────────────────────────
const LAYERS = [
  { scale: 0.88, speedS: 26, z: 1 }, // far
  { scale: 0.94, speedS: 18, z: 2 }, // mid
  { scale: 1.00, speedS: 13, z: 3 }, // front
];

// ─── Deterministic seeded random ──────────────────────────────────────────────
function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Chip configs ─────────────────────────────────────────────────────────────
interface ChipCfg {
  id: number;
  amc: (typeof AMC_LIST)[number];
  layer: (typeof LAYERS)[number];
  leftPct: number;
  durationS: number;
  delayS: number;
  swayPx: number;
  swayFreq: number;
  rotStart: number;
  rotEnd: number;
}

const CHIPS: ChipCfg[] = AMC_LIST.map((amc, i) => {
  const layer = LAYERS[i % LAYERS.length];
  const g = (n: number) => sr(i * 113 + n);
  return {
    id:        i,
    amc,
    layer,
    leftPct:   g(1) * 78 + 6,
    durationS: layer.speedS + g(2) * 6,
    delayS:    -(g(3) * layer.speedS),
    swayPx:    g(4) * 20 + 8,
    swayFreq:  g(5) * 0.5 + 0.7,
    rotStart:  (g(6) - 0.5) * 6,
    rotEnd:    (g(7) - 0.5) * 6,
  };
});

// ─── Shared CSS — injected once ───────────────────────────────────────────────
const GLOBAL_CSS = `
@keyframes amc-fall {
  0%   { transform: translateX(calc(var(--sw) * -1px))             translateY(-130px) rotate(var(--rs)); }
  25%  { transform: translateX(calc(var(--sw) * var(--sf) * 1px))  translateY(25vh)   rotate(calc(var(--rs) * 0.4)); }
  50%  { transform: translateX(calc(var(--sw) * -0.6px))           translateY(50vh)   rotate(0deg); }
  75%  { transform: translateX(calc(var(--sw) * 0.8px))            translateY(75vh)   rotate(calc(var(--re) * 0.5)); }
  100% { transform: translateX(calc(var(--sw) * -0.3px))           translateY(calc(100vh + 130px)) rotate(var(--re)); }
}
@keyframes amc-fade {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { opacity: 0; }
}
.amc-chip {
  position: absolute;
  top: 0;
  transform-origin: center top;
  animation:
    amc-fall var(--dur) linear var(--del) infinite,
    amc-fade var(--dur) linear var(--del) infinite;
  will-change: transform, opacity;
}
.amc-inner {
  transition: box-shadow 0.4s ease;
}
.amc-glow .amc-inner {
  box-shadow: 0 0 22px 5px var(--gc), 0 6px 20px rgba(0,0,0,0.15) !important;
}
`;

// ─── Monogram badge ───────────────────────────────────────────────────────────
function MonogramBadge({ initials, bgColor }: { initials: string; bgColor: string }) {
  const fontSize = initials.length >= 3 ? '11px' : '14px';
  return (
    <span
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '42px',
        height:         '42px',
        borderRadius:   '50%',
        background:     bgColor,
        color:          '#ffffff',
        fontFamily:     "'Kanit', sans-serif",
        fontSize,
        fontWeight:     800,
        letterSpacing:  '0.04em',
        flexShrink:     0,
        boxShadow:      `0 3px 10px ${bgColor}66`,
      }}
    >
      {initials}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AMCStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glowing, setGlowing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = 'amc-keyframes';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = GLOBAL_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const trigger = () => {
      setGlowing(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setGlowing(false), 1400);
    };
    window.addEventListener('scroll', trigger, { passive: true });
    const el = containerRef.current;
    el?.addEventListener('mousemove', trigger, { passive: true });
    return () => {
      window.removeEventListener('scroll', trigger);
      el?.removeEventListener('mousemove', trigger);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={glowing ? 'amc-glow' : ''}
      style={{ position: 'relative', width: '100%', height: '100%' }}
      aria-hidden
    >
      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '15%',
        background: 'linear-gradient(to bottom, rgba(5,12,29,1) 0%, transparent 100%)',
        zIndex: 20, pointerEvents: 'none',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
        background: 'linear-gradient(to top, rgba(5,12,29,1) 0%, transparent 100%)',
        zIndex: 20, pointerEvents: 'none',
      }} />

      {CHIPS.map((chip) => {
        const { amc, layer } = chip;
        return (
          <div
            key={chip.id}
            className="amc-chip"
            style={{
              left:   `${chip.leftPct}%`,
              zIndex: layer.z,
              transform: `scale(${layer.scale})`,
              '--dur': `${chip.durationS}s`,
              '--del': `${chip.delayS}s`,
              '--sw':  chip.swayPx,
              '--sf':  chip.swayFreq,
              '--rs':  `${chip.rotStart}deg`,
              '--re':  `${chip.rotEnd}deg`,
              '--gc':  `${amc.bgColor}70`,
            } as React.CSSProperties}
          >
            <div
              className="amc-inner"
              style={{
                display:              'inline-flex',
                alignItems:           'center',
                gap:                  '13px',
                padding:              '7px 22px 7px 7px',
                borderRadius:         '999px',
                background:           '#ffffff',
                border:               `1px solid ${amc.borderColor}28`,
                borderLeft:           `4px solid ${amc.borderColor}`,
                boxShadow:            `0 6px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(255,255,255,0.8)`,
                whiteSpace:           'nowrap',
                userSelect:           'none',
              }}
            >
              {/* Coloured monogram circle — brand color, white initial(s) */}
              <MonogramBadge initials={amc.initials} bgColor={amc.bgColor} />

              {/* AMC full name */}
              <span style={{
                fontFamily:    "'Kanit', sans-serif",
                fontSize:      '15px',
                fontWeight:    700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color:         amc.textColor,
                lineHeight:    1,
              }}>
                {amc.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
