import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Phone, Mail, ChevronDown, MessageSquare } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  city: string;
  message: string;
}

const SERVICES = [
  'Mutual Funds / SIP',
  'Health Insurance',
  'Vehicle Insurance',
  'LIC Policies',
  'Complete Financial Planning',
  'Portfolio Review',
];

const INITIAL: FormData = {
  name: '',
  phone: '',
  email: '',
  service: '',
  city: '',
  message: '',
};

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  /* Focus first field when modal opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 300);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.service) e.service = 'Please select a service';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    /* Simulate API call — replace with your actual endpoint */
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setForm(INITIAL);
      setErrors({});
      setSubmitted(false);
    }, 400);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(5, 12, 30, 0.85)', backdropFilter: 'blur(8px)' }}
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl my-8 rounded-[20px] md:rounded-[28px] overflow-hidden"
              style={{
                background:
                  'linear-gradient(160deg, #0D1B35 0%, #0A1628 60%, #08112A 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow:
                  '0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                maxHeight: 'calc(100vh - 64px)',
              }}
            >
              <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
              {/* Glow accent top */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent)',
                }}
              />

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 sm:p-7 md:p-9"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5 md:mb-7">
                      <div>
                        <p className="text-[#60A5FA] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-1.5">
                          Free · No obligation
                        </p>
                        <h2 className="text-white font-black uppercase text-xl sm:text-2xl md:text-3xl leading-tight tracking-tight">
                          Book Free
                          <br />
                          Consultation
                        </h2>
                      </div>
                      <button
                        onClick={handleClose}
                        className="text-white/40 hover:text-white/80 transition-colors mt-1 p-1.5 rounded-full hover:bg-white/10"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 md:gap-4">
                      {/* Name */}
                      <Field label="Full Name *" error={errors.name} icon={<User size={15} />}>
                        <input
                          ref={firstInputRef}
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          autoComplete="name"
                          className={inputCls(!!errors.name)}
                        />
                      </Field>

                      {/* Phone + Email row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <Field label="Mobile Number *" error={errors.phone} icon={<Phone size={15} />}>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            autoComplete="tel"
                            className={inputCls(!!errors.phone)}
                          />
                        </Field>
                        <Field label="Email (optional)" error={errors.email} icon={<Mail size={15} />}>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            autoComplete="email"
                            className={inputCls(!!errors.email)}
                          />
                        </Field>
                      </div>

                      {/* Service */}
                      <Field
                        label="I'm Interested In *"
                        error={errors.service}
                        icon={<ChevronDown size={15} />}
                      >
                        <select
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          className={selectCls(!!errors.service)}
                        >
                          <option value="">Select a service</option>
                          {SERVICES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>

                      {/* City */}
                      <Field label="City / Town" error={undefined}>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="e.g. Vijayawada, Guntur"
                          className={inputCls(false)}
                        />
                      </Field>

                      {/* Message */}
                      <Field
                        label="Message (optional)"
                        error={undefined}
                        icon={<MessageSquare size={15} />}
                      >
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us briefly about your financial goals…"
                          rows={3}
                          className={inputCls(false) + ' resize-none'}
                        />
                      </Field>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="mt-1 md:mt-2 w-full rounded-full text-white font-bold uppercase tracking-widest py-3 md:py-4 text-xs md:text-sm relative overflow-hidden"
                        style={{
                          background: loading
                            ? 'rgba(37,99,235,0.5)'
                            : 'linear-gradient(123deg, #0A2540 7%, #1D4ED8 37%, #2563EB 72%, #3B82F6 100%)',
                          outline: '2px solid rgba(255,255,255,0.7)',
                          outlineOffset: '-3px',
                          boxShadow: loading
                            ? 'none'
                            : '0 8px 32px rgba(37,99,235,0.4), 4px 4px 12px rgba(29,78,216,0.3) inset',
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Sending…
                          </span>
                        ) : (
                          'Book Free Consultation'
                        )}
                      </motion.button>

                      <p className="text-center text-white/25 text-[10px] md:text-xs mt-1">
                        We'll call you within 24 hours · No spam, ever
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  /* Success state */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="p-7 md:p-9 flex flex-col items-center justify-center text-center gap-4 md:gap-5 min-h-[320px] md:min-h-[380px]"
                  >
                    <button
                      onClick={handleClose}
                      className="absolute top-5 right-5 text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-full hover:bg-white/10"
                    >
                      <X size={20} />
                    </button>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle
                        size={56}
                        className="text-[#60A5FA] md:w-16 md:h-16"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(96,165,250,0.5))' }}
                      />
                    </motion.div>

                    <div>
                      <h3 className="text-white font-black uppercase text-xl md:text-2xl tracking-tight mb-2">
                        We'll be in touch!
                      </h3>
                      <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-xs px-4">
                        Thanks, <span className="text-white/80">{form.name.split(' ')[0]}</span>. Our
                        advisor will call you at{' '}
                        <span className="text-[#60A5FA]">{form.phone}</span> within 24 hours.
                      </p>
                    </div>

                    <div
                      className="w-full mt-4 p-4 rounded-2xl"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
                        Selected service
                      </p>
                      <p className="text-white/80 text-sm font-medium">{form.service}</p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="text-[#60A5FA] text-sm hover:text-white transition-colors uppercase tracking-widest font-medium"
                    >
                      Close ↗
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */
function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 md:gap-1.5">
      <label className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1.5">
        {icon && <span className="text-[#60A5FA]">{icon}</span>}
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-[10px] md:text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Style helpers ──────────────────────────────────────────────────────────── */
function inputCls(hasError: boolean) {
  return [
    'w-full rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-white placeholder-white/25 outline-none',
    'transition-all duration-200 font-light',
    hasError
      ? 'border border-red-500/60 bg-red-500/10 focus:border-red-400'
      : 'border border-white/10 bg-white/[0.06] focus:border-[#3B82F6]/70 focus:bg-white/[0.09]',
  ].join(' ');
}

function selectCls(hasError: boolean) {
  return [
    inputCls(hasError),
    'appearance-none cursor-pointer',
    '[&>option]:bg-[#0D1B35] [&>option]:text-white',
  ].join(' ');
}
