import FadeIn from './FadeIn';

interface CategoryCard {
  title: string;
  gradient: string;
  lineColor: string;
}

const categories: CategoryCard[] = [
  {
    title: 'MUTUAL FUNDS',
    gradient: 'from-blue-200 via-blue-100 to-blue-50',
    lineColor: 'rgba(147, 197, 253, 0.6)',
  },
  {
    title: 'SIP GROWTH',
    gradient: 'from-green-200 via-green-100 to-green-50',
    lineColor: 'rgba(134, 239, 172, 0.6)',
  },
  {
    title: 'HEALTH COVER',
    gradient: 'from-orange-200 via-orange-100 to-orange-50',
    lineColor: 'rgba(253, 186, 116, 0.6)',
  },
  {
    title: 'WEALTH TRACKING',
    gradient: 'from-purple-200 via-purple-100 to-purple-50',
    lineColor: 'rgba(216, 180, 254, 0.6)',
  },
  {
    title: 'TAX SAVING',
    gradient: 'from-sky-200 via-sky-100 to-sky-50',
    lineColor: 'rgba(125, 211, 252, 0.6)',
  },
  {
    title: 'RETIREMENT',
    gradient: 'from-emerald-200 via-emerald-100 to-emerald-50',
    lineColor: 'rgba(110, 231, 183, 0.6)',
  },
];

export default function ServiceCategories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {categories.map((category, index) => (
        <FadeIn key={category.title} delay={index * 0.1}>
          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} p-8 h-56 group hover:scale-105 transition-transform duration-300 cursor-pointer`}
          >
            {/* Trending line SVG */}
            <svg
              className="absolute inset-0 w-full h-full opacity-40 group-hover:opacity-60 transition-opacity"
              viewBox="0 0 400 250"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={category.lineColor} stopOpacity="0" />
                  <stop offset="50%" stopColor={category.lineColor} stopOpacity="1" />
                  <stop offset="100%" stopColor={category.lineColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Smooth upward trending curve */}
              <path
                d="M 0 200 Q 100 180, 200 120 T 400 60"
                fill="none"
                stroke={`url(#gradient-${index})`}
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Secondary curve for depth */}
              <path
                d="M 0 210 Q 100 190, 200 130 T 400 70"
                fill="none"
                stroke={category.lineColor}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>

            {/* Title - centered like "Our Works" reference */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 tracking-wide text-center drop-shadow-sm">
                {category.title}
              </h3>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
