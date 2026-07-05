# Mummidi Finserve LLP — 3D Animated Portfolio

A scroll-driven, motion-rich landing page built with React, TypeScript, Tailwind CSS, and Framer Motion. Adapted from a 3D-creator portfolio template into a financial services site for Mummidi Finserve LLP (Mutual Funds, Health Insurance, Vehicle Insurance, LIC).

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Replacing the placeholder photo

The hero section currently uses `/public/team-photo-placeholder.svg`. To use your real team/office photo:

1. Add your image file to `public/`, e.g. `public/team-photo.jpg`
2. In `src/components/HeroSection.tsx`, change:
   ```tsx
   src="/team-photo-placeholder.svg"
   ```
   to:
   ```tsx
   src="/team-photo.jpg"
   ```

You can do the same for the gradient tile placeholders in `MarqueeSection.tsx` and `PlansSection.tsx` if you'd like real photos/screenshots there instead of abstract color blocks — just swap the `<div style={{ background: ... }}>` blocks for `<img>` tags.

## Structure

```
src/
  components/
    FadeIn.tsx          — scroll-reveal wrapper (Framer Motion whileInView)
    Magnet.tsx           — mouse-following magnetic hover effect
    AnimatedText.tsx      — character-by-character scroll-reveal text
    Buttons.tsx          — ContactButton, LiveProjectButton
    HeroSection.tsx       — full-screen hero with nav, heading, magnetic portrait
    MarqueeSection.tsx    — dual-row scroll-driven horizontal tile marquee
    AboutSection.tsx      — corner icons + animated paragraph + CTA
    ServicesSection.tsx   — 5-item numbered service list (Mutual Funds, Health, Vehicle, LIC, Review)
    PlansSection.tsx      — 3 sticky-stacking client plan cards
    ContactSection.tsx    — closing CTA + contact details + footer
  App.tsx                — assembles all sections in order
  index.css              — global resets + .hero-heading gradient text class
  main.tsx               — React entry point
```

## Customizing content

- **Colors**: edit `tailwind.config.js` (`navy`, `accent`, `accentLight`) and the `.hero-heading` gradient in `src/index.css`.
- **Services**: edit the `SERVICES` array in `ServicesSection.tsx`.
- **Client plans**: edit the `PLANS` array in `PlansSection.tsx`.
- **Contact details**: edit `ContactSection.tsx`.
- **Nav links**: edit `NAV_LINKS` in `HeroSection.tsx`.

## Notes on the original spec

This project was adapted from a generic "3D Creator portfolio for Jack" spec. The original referenced third-party hosted images/GIFs (motionsites.ai, figma.site, higgs.ai CloudFront URLs) that belong to someone else's existing project — those have been replaced with original abstract gradient/SVG placeholders so nothing here infringes on another site's assets. Swap in your own photography wherever you see a gradient placeholder block.
