import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Shield, Target } from 'lucide-react';
import { DottedSurface } from './DottedSurface';
import FlipGallery from './FlipGallery';

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, delay }: { icon: any; value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300">
        <Icon className="w-8 h-8 text-amber-500 mb-3" strokeWidth={1.5} />
        <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-wider">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-32 overflow-hidden"
    >
      {/* Animated Dotted Surface Background */}
      <DottedSurface
        isDark={true}
        amountX={50}
        amountY={70}
        separation={120}
        waveSpeed={0.08}
        waveAmplitude={35}
        dotSize={5}
        opacity={0.4}
        className="z-0"
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-950/80 z-[1]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Flip Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <FlipGallery />
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-amber-500 text-sm font-semibold tracking-wider uppercase">
                  About Mummidi Finserve
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Building Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                  Financial Network
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                At Mummidi Finserve LLP, we don't just manage portfolios — we build lasting financial relationships. 
                For over <strong className="text-white">20 years</strong>, our network has connected families with 
                opportunities across mutual funds, insurance, and wealth management.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-10">
                Every client becomes a node in our ecosystem of trust, expertise, and growth. Our approach is 
                transparent, data-driven, and deeply personal — because your financial journey deserves a partner 
                who sees the bigger picture.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <StatCard icon={TrendingUp} value="20+" label="Years of Excellence" delay={0.2} />
                <StatCard icon={Users} value="2000+" label="Families Served" delay={0.3} />
                <StatCard icon={Shield} value="₹55Cr+" label="Assets Under Management" delay={0.4} />
                <StatCard icon={Target} value="5" label="Core Services" delay={0.5} />
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:-translate-y-1">
                  Start Your Journey
                </button>
                <button className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm text-white font-semibold rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300">
                  Learn More
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
