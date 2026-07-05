import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── Constants ────────────────────────────────────────────────────────────────
const COUNT        = 8000;
const REPEL_RADIUS = 80;   // px — converted to world units at runtime
const LERP_SPEED   = 0.055;

// ─── Formation builders ───────────────────────────────────────────────────────

function buildCoins(): Float32Array {
  const pos = new Float32Array(COUNT * 3);
  const LAYERS = 3;
  const perLayer = Math.floor(COUNT / LAYERS);
  let idx = 0;

  for (let l = 0; l < LAYERS; l++) {
    const y = (l - 1) * 0.35;
    const n = l === LAYERS - 1 ? COUNT - perLayer * (LAYERS - 1) : perLayer;
    for (let i = 0; i < n; i++) {
      // Uniform disc sampling
      const r     = Math.sqrt(Math.random()) * 2.8;
      const theta = Math.random() * Math.PI * 2;
      pos[idx++] = Math.cos(theta) * r;
      pos[idx++] = y + (Math.random() - 0.5) * 0.08;
      pos[idx++] = Math.sin(theta) * r;
    }
  }
  return pos;
}

function buildBarChart(): Float32Array {
  const pos   = new Float32Array(COUNT * 3);
  const BARS  = 5;
  const heights = [1.2, 1.8, 2.8, 2.2, 1.5];
  const spacing = 1.1;
  const startX  = -((BARS - 1) / 2) * spacing;
  const perBar  = Math.floor(COUNT / BARS);
  let idx = 0;

  for (let b = 0; b < BARS; b++) {
    const h = heights[b];
    const n = b === BARS - 1 ? COUNT - perBar * (BARS - 1) : perBar;
    const cx = startX + b * spacing;
    for (let i = 0; i < n; i++) {
      pos[idx++] = cx + (Math.random() - 0.5) * 0.7;
      pos[idx++] = -1.5 + Math.random() * h * 2;
      pos[idx++] = (Math.random() - 0.5) * 0.25;
    }
  }
  return pos;
}

function buildShield(): Float32Array {
  const pos = new Float32Array(COUNT * 3);
  let idx = 0;

  // Shield outline: parametric path
  const shieldPoint = (t: number): [number, number] => {
    // t: 0–1 traces the shield border
    const angle = t * Math.PI * 2;
    // Top-wide, bottom-pointy shape
    const r = 2.2 - Math.abs(Math.sin(angle * 0.5)) * 0.6;
    const x = Math.cos(angle) * r * (1 - Math.pow(Math.abs(Math.sin(angle)), 2) * 0.3);
    const y = Math.sin(angle) * r - Math.pow(Math.abs(Math.cos(angle * 0.5)), 1.5) * 1.2;
    return [x * 0.95, y * 0.95];
  };

  // Fill the shield with random interior points
  for (let i = 0; i < COUNT; i++) {
    // Pick random point on outline + some spread inward
    const t   = Math.random();
    const [ox, oy] = shieldPoint(t);
    const spread = Math.random() * 0.8;
    // push toward center
    pos[idx++] = ox * (1 - spread * 0.4) + (Math.random() - 0.5) * 0.15;
    pos[idx++] = oy * (1 - spread * 0.4) + (Math.random() - 0.5) * 0.15;
    pos[idx++] = (Math.random() - 0.5) * 0.3;
  }
  return pos;
}

// ─── Color arrays ─────────────────────────────────────────────────────────────

function makeColors(r: number, g: number, b: number, scatter = 0.15): Float32Array {
  const col = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    col[i * 3]     = Math.min(1, r + (Math.random() - 0.5) * scatter);
    col[i * 3 + 1] = Math.min(1, g + (Math.random() - 0.5) * scatter);
    col[i * 3 + 2] = Math.min(1, b + (Math.random() - 0.5) * scatter);
  }
  return col;
}

const COLORS = [
  makeColors(0.788, 0.643, 0.290),  // gold  #C9A44A
  makeColors(0.145, 0.388, 0.922),  // blue  #2563EB
  makeColors(0.749, 0.855, 0.996),  // light #BFDBFE
];

// ─── Particle mesh (inner R3F component) ──────────────────────────────────────
interface ParticleMeshProps {
  scrollProgress: number; // 0–1 across 3 formations
  mouseNDC: React.MutableRefObject<{ x: number; y: number }>;
}

function ParticleMesh({ scrollProgress, mouseNDC }: ParticleMeshProps) {
  const { size, camera } = useThree();
  const pointsRef  = useRef<THREE.Points>(null);
  const geoRef     = useRef<THREE.BufferGeometry>(null);

  // Pre-build all three formation targets once
  const formations = useMemo(() => [buildCoins(), buildBarChart(), buildShield()], []);

  // Working copy of positions (lerped each frame)
  const current  = useRef(new Float32Array(formations[0]));
  const velocity = useRef(new Float32Array(COUNT * 3)); // for repel spring

  // Lerp targets (gsap animates these scalar values)
  const blend = useRef({ t: 0 }); // 0=coins, 1=bar, 2=shield (continuous 0–2)

  // Animate blend.t with gsap whenever scrollProgress changes
  const prevProgress = useRef(0);
  useEffect(() => {
    const target = scrollProgress * 2; // map 0–1 → 0–2
    gsap.to(blend.current, {
      t:        target,
      duration: 0.9,
      ease:     'power2.inOut',
      overwrite: true,
    });
    prevProgress.current = scrollProgress;
  }, [scrollProgress]);

  useFrame(() => {
    const geo = geoRef.current;
    if (!geo) return;

    const pos = current.current;
    const vel = velocity.current;
    const t   = blend.current.t;

    // Determine which two formations to blend between
    const fA  = Math.min(2, Math.floor(t));      // 0, 1, or 2
    const fB  = Math.min(2, fA + 1);
    const mix = t - fA;                           // fractional 0–1 between fA and fB
    const A   = formations[fA];
    const B   = formations[fB];
    const CA  = COLORS[fA];
    const CB  = COLORS[fB];

    // Color attribute
    const colAttr = geo.getAttribute('color') as THREE.BufferAttribute;

    // Convert mouse NDC → world units at z=0 (approximate)
    const aspect  = size.width / size.height;
    const fov     = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const dist    = (camera as THREE.PerspectiveCamera).position.z;
    const worldH  = 2 * Math.tan(fov / 2) * dist;
    const worldW  = worldH * aspect;
    const mx      = mouseNDC.current.x * worldW * 0.5;
    const my      = mouseNDC.current.y * worldH * 0.5;

    // Repel radius in world units (based on viewport width)
    const repelR  = (REPEL_RADIUS / size.width) * worldW;
    const repelR2 = repelR * repelR;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // Target from formation blend
      const tx = A[i3]     + (B[i3]     - A[i3])     * mix;
      const ty = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * mix;
      const tz = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * mix;

      // Spring toward target
      const dx = tx - pos[i3];
      const dy = ty - pos[i3 + 1];
      const dz = tz - pos[i3 + 2];
      vel[i3]     += dx * LERP_SPEED;
      vel[i3 + 1] += dy * LERP_SPEED;
      vel[i3 + 2] += dz * LERP_SPEED;
      vel[i3]     *= 0.82;
      vel[i3 + 1] *= 0.82;
      vel[i3 + 2] *= 0.82;

      // Mouse repel (2D, ignore z)
      const ex  = pos[i3]     - mx;
      const ey  = pos[i3 + 1] - my;
      const ed2 = ex * ex + ey * ey;
      if (ed2 < repelR2 && ed2 > 0.0001) {
        const force = (1 - Math.sqrt(ed2) / repelR) * 0.08;
        vel[i3]     += (ex / Math.sqrt(ed2)) * force;
        vel[i3 + 1] += (ey / Math.sqrt(ed2)) * force;
      }

      pos[i3]     += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];

      // Blend colors
      colAttr.setXYZ(
        i,
        CA[i3]     + (CB[i3]     - CA[i3])     * mix,
        CA[i3 + 1] + (CB[i3 + 1] - CA[i3 + 1]) * mix,
        CA[i3 + 2] + (CB[i3 + 2] - CA[i3 + 2]) * mix,
      );
    }

    (geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  // Initial geometry setup
  const initPositions = useMemo(() => new Float32Array(formations[0]), [formations]);
  const initColors    = useMemo(() => new Float32Array(COLORS[0]), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={initPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={COUNT}
          array={initColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Labels overlay ───────────────────────────────────────────────────────────
const LABELS = [
  { title: 'Mutual Funds',      sub: 'Disciplined wealth creation',     color: '#C9A44A' },
  { title: 'Growth & Returns',  sub: 'Data-driven portfolio strategy',  color: '#2563EB' },
  { title: 'Protection First',  sub: 'Insurance as a financial pillar', color: '#BFDBFE' },
];

function SceneLabels({ progress }: { progress: number }) {
  // 0–1 → which label is most prominent
  const idx = Math.min(2, Math.round(progress * 2));
  const label = LABELS[idx];
  return (
    <div style={{
      position: 'absolute', bottom: '14%', left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center', pointerEvents: 'none', zIndex: 10,
      transition: 'opacity 0.5s',
    }}>
      <div style={{
        fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
        fontWeight: 800, fontFamily: "'Kanit', sans-serif",
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: label.color,
        textShadow: `0 0 40px ${label.color}88`,
        marginBottom: '6px',
        transition: 'color 0.7s, text-shadow 0.7s',
      }}>{label.title}</div>
      <div style={{
        fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
        color: 'rgba(255,255,255,0.45)', fontWeight: 300,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>{label.sub}</div>
    </div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ progress }: { progress: number }) {
  const active = Math.min(2, Math.round(progress * 2));
  const colors = ['#C9A44A', '#2563EB', '#BFDBFE'];
  return (
    <div style={{
      position: 'absolute', bottom: '8%', left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', gap: '10px', zIndex: 10,
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: active === i ? '28px' : '8px',
          height: '8px', borderRadius: '999px',
          background: active === i ? colors[i] : 'rgba(255,255,255,0.18)',
          boxShadow: active === i ? `0 0 10px 2px ${colors[i]}` : 'none',
          transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      ))}
    </div>
  );
}

// ─── Scroll hint ──────────────────────────────────────────────────────────────
function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'absolute', bottom: '3%', left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      opacity: visible ? 0.5 : 0, transition: 'opacity 0.6s',
      zIndex: 10, pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.6)', fontWeight: 600,
      }}>scroll to explore</span>
      <div style={{
        width: '1px', height: '32px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
        animation: 'particlePulse 1.8s ease-in-out infinite',
      }} />
    </div>
  );
}

// ─── Outer section wrapper ────────────────────────────────────────────────────
export default function ParticleVisual() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mouseNDC    = useRef({ x: 0, y: 0 });
  const [progress, setProgress]     = useRefState(0);
  const [showHint,  setShowHint]    = useRefState(true);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Scroll handler
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect   = section.getBoundingClientRect();
      const total  = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      progressRef.current = p;
      setProgress(p);
      if (p > 0.02) setShowHint(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mouse handler (NDC -1..1)
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseNDC.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  if (reducedMotion.current) {
    return (
      <section id="particle-visual" style={{ height: '100vh', background: '#0A2540', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontFamily: 'Kanit, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Mutual Funds · Insurance · Portfolio Review
        </span>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="particle-visual"
      style={{ position: 'relative', height: '300vh', background: '#0A2540' }}
    >
      {/* ── Keyframe for the scroll-hint pulse ── */}
      <style>{`
        @keyframes particlePulse {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.1); }
        }
      `}</style>

      {/* ── Sticky canvas container ── */}
      <div style={{
        position: 'sticky', top: 0,
        width: '100%', height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Background radial bloom */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.12) 0%, rgba(10,37,64,0) 65%)',
        }} />

        {/* Three.js canvas */}
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ alpha: false, antialias: false }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <color attach="background" args={['#0A2540']} />
          <ParticleMesh scrollProgress={progress} mouseNDC={mouseNDC} />
        </Canvas>

        {/* HTML overlays */}
        <SceneLabels  progress={progress} />
        <ProgressDots progress={progress} />
        <ScrollHint   visible={showHint} />
      </div>
    </section>
  );
}

// ─── tiny helper: ref-backed state ───────────────────────────────────────────
function useRefState<T>(init: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(init);
  const setter = useCallback((v: T) => setVal(v), []);
  return [val, setter];
}
