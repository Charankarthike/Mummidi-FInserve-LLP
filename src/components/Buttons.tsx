interface ButtonProps {
  onClick?: () => void;
  label?: string;
}

export function ContactButton({ onClick, label = 'Talk to an advisor' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-full text-white font-medium uppercase tracking-widest
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
        text-xs sm:text-sm md:text-base
        transition-transform duration-300 hover:scale-105
      "
      style={{
        background: 'linear-gradient(123deg, #0A2540 7%, #1D4ED8 37%, #2563EB 72%, #3B82F6 100%)',
        boxShadow:
          '0px 4px 16px rgba(37, 99, 235, 0.25), 4px 4px 12px rgba(29, 78, 216, 0.25) inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </button>
  );
}

export function LiveProjectButton({ onClick, label = 'View plan' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-full border-2 border-[#0A2540] text-[#0A2540] font-medium uppercase tracking-widest
        px-8 py-3 sm:px-10 sm:py-3.5
        text-sm sm:text-base
        transition-colors duration-300 hover:bg-[#0A2540]/5
      "
    >
      {label}
    </button>
  );
}
