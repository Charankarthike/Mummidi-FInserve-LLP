# Quick Reference Card

## 🚀 Running the Project

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

Website runs at: **http://localhost:5173/**

---

## 📝 Common Tasks

### Update Statistics
**File**: `src/components/HeroSection.tsx`
```typescript
const STATS = [
  { value: '20+', label: 'Years Experience' },    // Change here
  { value: '2000+', label: 'Families Served' },   // Change here
  { value: 'AMFI', label: 'Registered' },
  { value: 'IRDAI', label: 'Licensed' },
];
```

### Add New Service
**File**: `src/components/ServicesSection.tsx`
```typescript
{
  num: '06',
  Icon: YourIcon,
  name: 'Service Name',
  short: 'Short Description',
  desc: 'Full description...',
  bullets: ['Point 1', 'Point 2', 'Point 3'],
  accent: '#colorcode',
  dark: '#darkcolorcode',
  glow: 'rgba(r,g,b,0.20)',
}
```

### Change Flip Gallery Images
**File**: `src/components/FlipGallery.tsx`
```typescript
const images = [
  { title: '', url: 'your-image-url' },
  // Add more images here
];
```

### Enable Spline 3D Scene
**File**: `src/components/HeroSection.tsx`

1. Create scene at https://spline.design (see SPLINE_SCENE_GUIDE.md)
2. Uncomment this code:
```tsx
<SplineScene 
  sceneUrl="https://prod.spline.design/YOUR-SCENE-URL/scene.splinecode"
  opacity={0.35}
/>
```

---

## 🎨 Color Palette

```css
Navy:       #0A2540, #0d1f4e
Gold:       #D7A531, #c89b3c
Blue:       #3B82F6, #4a7fd4
Green:      #10B981
Amber:      #F59E0B
Purple:     #A78BFA
Red:        #F87171
```

---

## 📂 Key Files

```
HeroSection.tsx       - Main landing section
AboutSection.tsx      - About with flip gallery
ServicesSection.tsx   - Services with 3D globe
FlipGallery.tsx      - 3D flip card gallery
AMCStream.tsx        - Falling AMC chips
DottedSurface.tsx    - Particle wave background
```

---

## 🐛 Troubleshooting

**Problem**: Site won't start
```bash
npm install          # Reinstall dependencies
rm -rf node_modules  # Clean install
npm install
npm run dev
```

**Problem**: 3D animations laggy
- Reduce particle count in DottedSurface (amountX, amountY)
- Lower animation speed
- Disable on mobile

**Problem**: Spline scene not showing
- Check scene URL is correct
- Ensure scene is published in Spline
- Check browser console for errors
- Verify pointer-events: none is set

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1023px
Desktop: ≥ 1024px
```

Use Tailwind classes:
- `sm:` - ≥ 640px
- `md:` - ≥ 768px
- `lg:` - ≥ 1024px
- `xl:` - ≥ 1280px

---

## ⚡ Performance Tips

1. Keep images optimized (WebP format)
2. Lazy load heavy components
3. Test on mobile devices
4. Monitor bundle size
5. Use Chrome DevTools Performance tab

---

## 🔧 Useful Commands

```bash
# Check for errors
npm run build

# Format code
npm run format (if configured)

# Check types
npx tsc --noEmit

# View bundle size
npm run build && npx vite-bundle-visualizer
```

---

## 📞 Getting Help

1. Check PROJECT_SUMMARY.md for detailed info
2. Read SPLINE_SCENE_GUIDE.md for 3D scene creation
3. Check component files for inline documentation
4. Review Three.js docs: https://threejs.org/docs

---

**Last Updated**: January 2025
