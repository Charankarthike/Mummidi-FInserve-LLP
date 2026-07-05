import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { TrendingUp, HeartPulse, Car, Shield, ClipboardList, ArrowUpRight, CheckCircle } from 'lucide-react';
import AMCStream from './AMCStream';

const SERVICES = [
  {
    num: '01', Icon: TrendingUp, name: 'Mutual Funds', short: 'Wealth Creation',
    desc: 'Disciplined SIP and lump-sum portfolios aligned to your goals, risk appetite, and time horizon.',
    bullets: ['Goal-based SIP planning', 'Lump-sum & tax-saving funds', 'Multi-AMC portfolio access'],
    accent: '#3B82F6', dark: '#1D4ED8', glow: 'rgba(59,130,246,0.20)',
  },
  {
    num: '02', Icon: HeartPulse, name: 'Health Insurance', short: 'Family Protection',
    desc: 'Individual and family floater cover with cashless hospital access across India.',
    bullets: ['Cashless across 10,000+ hospitals', 'Family floater plans', 'Critical illness add-ons'],
    accent: '#10B981', dark: '#047857', glow: 'rgba(16,185,129,0.20)',
  },
  {
    num: '03', Icon: Car, name: 'Vehicle Insurance', short: 'On-Road Security',
    desc: 'Third-party and comprehensive coverage for cars and two-wheelers with quick claim support.',
    bullets: ['Instant online renewals', 'Zero-depreciation cover', 'Quick claim settlement'],
    accent: '#F59E0B', dark: '#B45309', glow: 'rgba(245,158,11,0.20)',
  },
  {
    num: '04', Icon: Shield, name: 'LIC Policies', short: 'Life Security',
    desc: "Term, endowment, and pension plans from India's most trusted life insurer.",
    bullets: ['Term & endowment plans', 'Pension & annuity options', 'Child future plans'],
    accent: '#A78BFA', dark: '#6D28D9', glow: 'rgba(167,139,250,0.20)',
  },
  {
    num: '05', Icon: ClipboardList, name: 'Annual Review', short: 'Plan Optimisation',
    desc: 'Transparent yearly portfolio health checks so your financial plan evolves with your life.',
    bullets: ['Portfolio performance audit', 'Rebalancing recommendations', 'Tax harvesting insights'],
    accent: '#F87171', dark: '#B91C1C', glow: 'rgba(248,113,113,0.20)',
  },
] as const;

function ServiceCard({ s, index, active, onClick }: { s: (typeof SERVICES)[number]; index: number; active: boolean; onClick: () => void; }) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;
  const neonOn = hovered;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setEntered(true), index * 100); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateX(-18px) translateY(6px)', transition: `opacity 0.45s ease ${index * 60}ms, transform 0.45s ease ${index * 60}ms`, cursor: 'pointer' }}>
      <style>{`@keyframes neon-pulse-${index}{0%,100%{box-shadow:0 0 6px 1px ${s.accent}55,0 0 18px 3px ${s.accent}33,inset 0 0 8px 1px ${s.accent}22}50%{box-shadow:0 0 10px 2px ${s.accent}88,0 0 30px 6px ${s.accent}44,inset 0 0 14px 2px ${s.accent}33}}`}</style>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '16px', padding: isActive ? '22px 20px' : '16px 20px', borderRadius: '18px', marginBottom: '10px', overflow: 'visible', transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)', background: isActive ? `linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)` : 'rgba(255,255,255,0.025)', border: neonOn ? `1px solid ${s.accent}99` : `1px solid rgba(255,255,255,0.07)`, boxShadow: neonOn ? `0 0 8px 2px ${s.accent}66, 0 0 24px 5px ${s.accent}33, 0 0 48px 8px ${s.accent}18, inset 0 0 12px 1px ${s.accent}22, 0 8px 32px -8px rgba(0,0,0,0.5)` : '0 2px 8px rgba(0,0,0,0.25)', animation: neonOn ? `neon-pulse-${index} 2.2s ease-in-out infinite` : 'none' }}>
        <div style={{ position: 'absolute', left: 0, top: '12px', bottom: '12px', width: '3px', borderRadius: '999px', background: s.accent, opacity: isActive ? 1 : 0, transform: isActive ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top', transition: 'opacity 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }} />
        {isActive && (<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 10% 50%, ${s.glow} 0%, transparent 60%)` }} />)}
        <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? `${s.accent}22` : 'rgba(255,255,255,0.06)', border: `1px solid ${isActive ? s.accent + '44' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.3s', boxShadow: isActive ? `0 0 20px -4px ${s.accent}66` : 'none' }}>
          <s.Icon style={{ color: isActive ? s.accent : 'rgba(255,255,255,0.45)', width: '20px', height: '20px' }} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: isActive ? s.accent : 'rgba(255,255,255,0.22)' }}>{s.num}</span>
            <h3 style={{ fontFamily: "'Kanit', sans-serif", fontSize: 'clamp(0.88rem, 1.4vw, 1.15rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)', lineHeight: 1.2, margin: 0, transition: 'color 0.3s' }}>{s.name}</h3>
          </div>
          <div style={{ maxHeight: isActive ? '200px' : '0', overflow: 'hidden', opacity: isActive ? 1 : 0, transition: 'max-height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.50)', marginBottom: '10px' }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {s.bullets.map((b, bi) => (
                <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <CheckCircle style={{ width: '13px', height: '13px', color: s.accent, flexShrink: 0 }} strokeWidth={2.5} />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ArrowUpRight style={{ flexShrink: 0, width: '18px', height: '18px', color: isActive ? s.accent : 'rgba(255,255,255,0.15)', transform: isActive ? 'translate(2px,-2px)' : 'none', transition: 'all 0.3s' }} strokeWidth={2} />
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 30, damping: 25 });
  const titleY = useTransform(smoothP, [0, 0.22], [50, 0]);
  const titleOp = useTransform(smoothP, [0, 0.20], [0, 1]);
  const globeX = useTransform(smoothP, [0.05, 0.38], [90, 0]);
  const globeOp = useTransform(smoothP, [0.05, 0.38], [0, 1]);
  const cur = SERVICES[active];

  return (
    <section ref={sectionRef} id="services" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #050C1D 0%, #0D1F3C 100%)', borderRadius: '48px 48px 0 0' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs><pattern id="svc-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" strokeWidth="0.7"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#svc-grid)"/>
        </svg>
        <div style={{ position: 'absolute', top: '-10%', left: '5%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)', filter: 'blur(90px)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '8%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(215,165,49,0.12) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: '30%', right: '20%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${cur.glow} 0%, transparent 70%)`, filter: 'blur(60px)', opacity: 0.35, transition: 'background 0.7s ease' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 10, padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)' }}>
        <motion.div style={{ y: titleY, opacity: titleOp }} className="flex flex-col items-center mb-16 sm:mb-20">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '16px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D7A531', display: 'inline-block', animation: 'pulse 2s infinite' }} />What We Offer
          </span>
          <h2 style={{ fontFamily: "'Kanit', sans-serif", fontSize: 'clamp(3rem, 9vw, 112px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, textAlign: 'center', margin: 0, color: '#ffffff' }}>Services</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cur.accent, boxShadow: `0 0 10px 2px ${cur.accent}`, transition: 'background 0.5s, box-shadow 0.5s' }} />
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }} />
          </div>
        </motion.div>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', gap: 'clamp(24px, 4vw, 80px)', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0 }}>{SERVICES.map((s, i) => (<ServiceCard key={s.num} s={s} index={i} active={active === i} onClick={() => setActive(i)} />))}</div>
          <motion.div style={{ x: globeX, opacity: globeOp }} className="hidden lg:flex flex-col items-center gap-6 flex-shrink-0" aria-hidden>
            <div style={{ width: '420px' }}>
              <div style={{ position: 'relative', width: '420px', height: '430px', overflow: 'hidden', borderRadius: '24px', background: 'rgba(5,12,29,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <AMCStream />
                <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '12px', zIndex: 30 }}>
                  {SERVICES.map((s, i) => (<button key={s.num} onClick={() => setActive(i)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: '4px' }}><span style={{ display: 'block', borderRadius: '50%', width: active === i ? '10px' : '6px', height: active === i ? '10px' : '6px', background: s.accent, boxShadow: active === i ? `0 0 10px 3px ${s.accent}` : 'none', transition: 'all 0.35s' }} /></button>))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' }}>
                {[['20+', 'Years'], ['2000+', 'Families'], ['5', 'Services']].map(([v, l]) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 10px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontFamily: "'Kanit', sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{v}</span>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.32)', marginTop: '4px' }}>{l}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: '100%', padding: '18px 20px', borderRadius: '20px', background: `linear-gradient(135deg, ${cur.glow} 0%, rgba(255,255,255,0.03) 100%)`, border: `1px solid ${cur.accent}35`, transition: 'all 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <cur.Icon style={{ color: cur.accent, width: '18px', height: '18px' }} strokeWidth={1.8} />
                  <span style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: '0.88rem', letterSpacing: '0.07em', color: '#ffffff' }}>{cur.name}</span>
                </div>
                <p style={{ fontSize: '0.78rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.48)', fontWeight: 300, margin: 0 }}>{cur.desc}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
