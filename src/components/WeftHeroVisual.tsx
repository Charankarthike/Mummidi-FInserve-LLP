import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Services data ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    key: 'mutual-funds',
    num: '01',
    icon: '📈',
    title: 'Mutual Funds',
    meta: 'Wealth Creation',
    desc: 'Goal-based SIP & lump-sum portfolios',
    accent: '#3B82F6',
    iconBg: 'rgba(59,130,246,0.18)',
    depth: 22,
    pos: { top: '8%', left: '2%' },
    connEnd: { x: 22, y: 22 },
  },
  {
    key: 'health',
    num: '02',
    icon: '❤️',
    title: 'Health Insurance',
    meta: 'Family Protection',
    desc: 'Cashless cover across 10,000+ hospitals',
    accent: '#10B981',
    iconBg: 'rgba(16,185,129,0.18)',
    depth: 18,
    pos: { top: '8%', right: '2%' },
    connEnd: { x: 78, y: 22 },
  },
  {
    key: 'vehicle',
    num: '03',
    icon: '🚗',
    title: 'Vehicle Insurance',
    meta: 'On-Road Security',
    desc: 'Comprehensive & third-party coverage',
    accent: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.18)',
    depth: 26,
    pos: { bottom: '18%', left: '2%' },
    connEnd: { x: 20, y: 72 },
  },
  {
    key: 'lic',
    num: '04',
    icon: '🛡️',
    title: 'LIC Policies',
    meta: 'Life Security',
    desc: 'Term, endowment & pension plans',
    accent: '#A78BFA',
    iconBg: 'rgba(167,139,250,0.18)',
    depth: 20,
    pos: { bottom: '18%', right: '2%' },
    connEnd: { x: 80, y: 72 },
  },
  {
    key: 'review',
    num: '05',
    icon: '📋',
    title: 'Annual Review',
    meta: 'Plan Optimisation',
    desc: 'Yearly portfolio health checks & rebalancing',
    accent: '#F87171',
    iconBg: 'rgba(248,113,113,0.18)',
    depth: 14,
    pos: { bottom: '4%', left: '50%', transform: 'translateX(-50%)' },
    connEnd: { x: 50, y: 88 },
  },
] as const;

// ─── Thread Sphere ─────────────────────────────────────────────────────────────
function ThreadSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const prev = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  const { points, linePositions, lineColors } = useMemo(() => {
    const COUNT = 90;
    const radius = 2.6;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
    }
    const goldC = new THREE.Color(0xe8b34a);
    const tealC = new THREE.Color(0x4fd1c5);
    const maxDist = 1.35;
    const linePos: number[] = [];
    const lineCol: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          const c = goldC.clone().lerp(tealC, Math.random());
          lineCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }
    return { points: pts, linePositions: linePos, lineColors: lineCol };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = (e: PointerEvent) => { dragging.current = true; prev.current = { x: e.clientX, y: e.clientY }; canvas.style.cursor = 'grabbing'; };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - prev.current.x, dy = e.clientY - prev.current.y;
      if (groupRef.current) { groupRef.current.rotation.y += dx * 0.006; groupRef.current.rotation.x += dy * 0.006; }
      vel.current = { x: dx * 0.006, y: dy * 0.006 };
      prev.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { dragging.current = false; canvas.style.cursor = 'grab'; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    canvas.style.cursor = 'grab';
    return () => { canvas.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;
    if (!dragging.current) {
      groupRef.current.rotation.y += 0.0018 + vel.current.x;
      groupRef.current.rotation.x += 0.0004;
      vel.current.x *= 0.94;
    }
  });

  const dotGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    return g;
  }, [linePositions, lineColors]);

  return (
    <group ref={groupRef}>
      <points geometry={dotGeo}>
        <pointsMaterial color={0xf3efe6} size={0.055} transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.45} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshBasicMaterial color={0x0d1f3c} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WeftHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLayerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let curRX = 0, curRY = 0, targetRX = 0, targetRY = 0;
    let rafId: number;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetRY = px * 10; targetRX = -py * 10;
      cardRefs.current.forEach((el, key) => {
        const svc = SERVICES.find(s => s.key === key);
        if (!svc || !el) return;
        el.style.transform = `${(svc.pos as { transform?: string }).transform ?? ''} translate(${px * svc.depth}px, ${py * svc.depth}px)`;
      });
    };
    const onLeave = () => {
      targetRX = 0; targetRY = 0;
      cardRefs.current.forEach((el, key) => {
        const svc = SERVICES.find(s => s.key === key);
        if (!el) return;
        el.style.transform = (svc?.pos as { transform?: string })?.transform ?? '';
      });
    };
    const tick = () => {
      curRX += (targetRX - curRX) * 0.06;
      curRY += (targetRY - curRY) * 0.06;
      if (cardLayerRef.current) cardLayerRef.current.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => { cancelAnimationFrame(rafId); container.removeEventListener('mousemove', onMove); container.removeEventListener('mouseleave', onLeave); };
  }, []);

  const VISUAL_H = 680;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: `${VISUAL_H}px`, perspective: '1400px', overflow: 'visible' }}
    >

      {/* Ambient glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,179,74,0.09), transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(79,209,197,0.08), transparent 60%)' }} />

      {/* Canvas — explicit size so WebGL renderer gets real pixels */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${VISUAL_H}px`, zIndex: 1 }}>
        <Canvas
          camera={{ position: [0, 0, 8.5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        >
          <ThreadSphere />
        </Canvas>
      </div>

      {/* SVG connector lines from cards to sphere centre */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 2 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <style>{`
            @keyframes weft-dash2 { to { stroke-dashoffset: -100; } }
            .wc { fill:none; stroke-width:0.4; stroke-dasharray:2 3; animation: weft-dash2 3.5s linear infinite; }
            @media (prefers-reduced-motion:reduce) { .wc { animation:none; } }
          `}</style>
        </defs>
        {SERVICES.map((svc, i) => (
          <path
            key={svc.key}
            className="wc"
            stroke={svc.accent}
            opacity={0.35}
            d={`M ${svc.connEnd.x} ${svc.connEnd.y} Q ${(svc.connEnd.x + 50) / 2} ${(svc.connEnd.y + 50) / 2} 50 50`}
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      {/* Card layer */}
      <div
        ref={cardLayerRef}
        style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', pointerEvents: 'none', zIndex: 3 }}
      >
        <style>{`
          @keyframes svc-bob-0{0%,100%{top: 8%} 50%{top: calc(8% - 10px)}}
          @keyframes svc-bob-1{0%,100%{top: 8%} 50%{top: calc(8% - 10px)}}
          @keyframes svc-bob-2{0%,100%{bottom:18%} 50%{bottom:calc(18% - 10px)}}
          @keyframes svc-bob-3{0%,100%{bottom:18%} 50%{bottom:calc(18% - 10px)}}
          @keyframes svc-bob-4{0%,100%{bottom:4%} 50%{bottom:calc(4% - 10px)}}
          .svc-card { transition: transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease; }
          .svc-card:hover { box-shadow: 0 0 28px 6px var(--accent-glow), 0 20px 50px rgba(0,0,0,0.45) !important; border-color: var(--accent-border) !important; }
          @media (prefers-reduced-motion:reduce) { .svc-card { animation:none!important; } }
        `}</style>

        {SERVICES.map((svc, i) => {
          const delays = [0, 2.1, 1.1, 1.7, 0.6];
          const bobName = `svc-bob-${i}`;
          // Separate transform from position for the centered card
          const { transform: extraTransform, ...posStyle } = svc.pos as { transform?: string; top?: string; bottom?: string; left?: string; right?: string };
          return (
            <div
              key={svc.key}
              className="svc-card"
              ref={el => { if (el) cardRefs.current.set(svc.key, el); else cardRefs.current.delete(svc.key); }}
              style={{
                position: 'absolute',
                ...posStyle,
                ...(extraTransform ? { transform: extraTransform } : {}),
                pointerEvents: 'auto',
                background: 'rgba(13,20,40,0.72)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${svc.accent}30`,
                borderRadius: 'clamp(16px, 2vw, 22px)',
                padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.40)`,
                minWidth: 'clamp(160px, 20vw, 220px)',
                maxWidth: 'clamp(200px, 25vw, 260px)',
                animation: `${bobName} 6s ease-in-out ${delays[i]}s infinite`,
                '--accent-glow': `${svc.accent}44`,
                '--accent-border': `${svc.accent}66`,
              } as React.CSSProperties}
            >
              {/* Number badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>
                <div style={{ 
                  width: 'clamp(60px, 8vw, 80px)', 
                  height: 'clamp(60px, 8vw, 80px)', 
                  borderRadius: 'clamp(14px, 2vw, 18px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: svc.iconBg, 
                  fontSize: 'clamp(32px, 5vw, 42px)', 
                  flexShrink: 0 
                }}>
                  {svc.icon}
                </div>
                <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: svc.accent, fontFamily: "'Inter', sans-serif" }}>{svc.num}</span>
              </div>
              {/* Title */}
              <div style={{ fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1.2, marginBottom: 'clamp(3px, 1vw, 5px)' }}>{svc.title}</div>
              {/* Meta */}
              <div style={{ fontSize: 'clamp(10.5px, 1.5vw, 12px)', color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif", marginBottom: 'clamp(5px, 1vw, 7px)' }}>{svc.meta}</div>
              {/* Desc */}
              <div style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', color: 'rgba(255,255,255,0.32)', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{svc.desc}</div>
              {/* Accent bar */}
              <div style={{ marginTop: 10, height: 2, borderRadius: 2, background: `linear-gradient(to right, ${svc.accent}, transparent)`, opacity: 0.6 }} />
            </div>
          );
        })}
      </div>

      {/* Centre label */}
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(148,144,166,0.5)', letterSpacing: '0.08em', zIndex: 4, pointerEvents: 'none', textTransform: 'uppercase' }}>
        drag to explore · hover to focus
      </div>
    </div>
  );
}
