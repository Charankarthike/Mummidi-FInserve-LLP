import { Suspense, lazy } from 'react';

// Lazy load Spline for better performance
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  sceneUrl?: string;
  opacity?: number;
  className?: string;
}

export default function SplineScene({ 
  sceneUrl = 'https://prod.spline.design/YOUR-SCENE-URL/scene.splinecode',
  opacity = 0.35,
  className = ''
}: SplineSceneProps) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: 0, 
        opacity: opacity,
      }}
    >
      <Suspense fallback={
        <div className="w-full h-full bg-gradient-to-br from-blue-50/20 to-amber-50/20 animate-pulse" />
      }>
        <Spline scene={sceneUrl} />
      </Suspense>
    </div>
  );
}

/**
 * INSTRUCTIONS FOR CREATING YOUR SPLINE SCENE:
 * 
 * 1. Go to https://spline.design and create a new project
 * 
 * 2. Create the scene with these elements:
 *    - 4-6 floating glass/glassmorphism panels
 *    - Panels: semi-transparent (10-20% opacity), varying depths/rotations
 *    - 15-20 small glowing orb particles (gold #c89b3c / blue #4a7fd4)
 *    - 1 soft pulsing gold light source off to one side
 *    - Subtle mouse-parallax interaction (Mouse Position event)
 * 
 * 3. Animation setup:
 *    - Panels: idle drift animation (±10px, 8-10s loop)
 *    - Orbs: slow upward drift
 *    - Light: soft pulse (2-3s loop)
 * 
 * 4. Materials & Settings:
 *    - Use Glassmorphism material preset
 *    - Keep opacity low (10-20%)
 *    - Add soft/blurred shadows
 *    - Set transparent background
 * 
 * 5. Export:
 *    - Click "Export" → "Embed/Publish"
 *    - Copy the scene URL (looks like: https://prod.spline.design/XXXXX/scene.splinecode)
 *    - Replace the sceneUrl prop in HeroSection
 * 
 * 6. Colors to use:
 *    - Navy: #0d1f4e
 *    - Gold/Amber: #c89b3c
 *    - Soft Blue: #4a7fd4
 * 
 * PERFORMANCE TIPS:
 * - Keep polygon count low (< 10k total)
 * - Limit particle count (15-20 max)
 * - Use simple geometries (spheres, rounded boxes)
 * - Avoid complex reflections/refractions
 */
