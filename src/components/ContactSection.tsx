import { useState } from 'react';
import FadeIn from './FadeIn';
import { ContactButton } from './Buttons';
import ConsultationModal from './ConsultationModal';
import { Phone, Mail, MapPin, MessageCircle, Instagram } from 'lucide-react';

const CONTACT_ITEMS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '98481 35760',
    href: 'https://wa.me/919848135760',
    color: '#25D366',
  },
  {
    icon: Phone,
    label: 'Office',
    value: '81145 06070',
    href: 'tel:+918114506070',
    color: '#2563EB',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'mummidfinserve@gmail.com',
    href: 'mailto:mummidfinserve@gmail.com',
    color: '#E85D3C',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@mummidi_finservellp',
    href: 'https://www.instagram.com/mummidi_finservellp?igsh=M2tpazlubTJ6czRl&utm_source=qr',
    color: '#E4405F',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'D.No. 26-2-12, A.R. Road, Opp. Sailaja Theatre, Gandhi Nagar, Vijayawada',
    href: 'https://maps.app.goo.gl/S2XNEPhkbN4Jnzfi9',
    color: '#0A2540',
  },
];

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section id="contact" className="overflow-hidden">
      {/* ── Dark top band ── */}
      <div className="bg-[#0A2540] px-5 sm:px-8 md:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24 relative overflow-hidden">
        {/* Subtle bg decoration */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.22) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <FadeIn delay={0} y={30}>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[#93C5FD] uppercase tracking-[0.25em] text-xs sm:text-sm font-medium">
                Insurance &amp; Mutual Fund Distributor
              </span>
              <h2
                className="font-black uppercase leading-none text-center"
                style={{
                  fontSize: 'clamp(2rem, 7vw, 90px)',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #93C5FD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Let&apos;s talk money
              </h2>
              <p className="text-white/40 font-medium tracking-wide text-sm sm:text-base mt-1">
                Durga Rao Mummidi
              </p>
            </div>
            <p className="text-white/55 font-light text-base sm:text-lg max-w-lg">
              No sales pressure, just honest guidance. Tell us your goals and we&apos;ll map out a plan within 24 hours.
            </p>
            <ContactButton label="Book free consultation" onClick={() => setIsModalOpen(true)} />
          </div>
        </FadeIn>
      </div>

      {/* ── Light bottom band — contact cards ── */}
      <div className="bg-[#F8FAFC] px-5 sm:px-8 md:px-10 pt-10 pb-16 sm:pb-20">
        <FadeIn delay={0.1} y={20}>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-start gap-4 bg-white border border-[#0A2540]/08 rounded-2xl px-5 py-4 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-[#0A2540]/40 text-[10px] uppercase tracking-widest font-medium mb-0.5">
                    {label}
                  </p>
                  <p className="text-[#0A2540] text-sm sm:text-base font-medium leading-snug break-words group-hover:text-[#2563EB] transition-colors duration-200">
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── Footer ── */}
      <div className="bg-[#0A2540] px-5 sm:px-8 md:px-10 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Mummidi Finserve LLP" className="h-12 w-auto object-contain" />
            <span className="text-white/50 text-xs font-light">Building wealth, one family at a time.</span>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest text-center sm:text-right">
            Mummidi Finserve LLP &middot; AMFI Registered &middot; IRDAI Licensed &middot; © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
