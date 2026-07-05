# Spline 3D Scene Creation Guide
## Mummidi Finserve LLP Hero Background - "Depth Field" Concept

---

## 🎯 Scene Concept: "Depth Field"

**Visual Theme**: Layers of translucent glass panels floating at different depths, representing **depth of experience, layers of protection, and transparent financial services**.

**Emotion**: Premium, calm, sophisticated — quiet confidence and trust, not flashy.

**Purpose**: Create 3D depth behind hero text (headline, CTA, stats occupy left 2/3 of frame).

---

## 🎨 Brand Colors (STRICT)

- **Deep Navy**: `#0D1F4E` (primary dark, panel tints)
- **Gold/Amber**: `#C89B3C` (warm light, accent particles)
- **Soft Blue**: `#4A7FD4` (cool light, accent particles)

**Important**: NO other colors. Keep to this exact palette.

---

## 📋 Scene Requirements

### 1. **Floating Glass Panels** (5-6 pieces)

**Purpose**: Create layers of depth, like looking through stacked glass sheets

**Specifications**:
- **Count**: 5-6 panels
- **Shape**: Large rectangles or rounded rectangles (varying sizes)
  - Small: 300×400px
  - Medium: 400×600px
  - Large: 500×800px
- **Material**: Glassmorphism / Frosted Glass
  - **Transparency**: 80-90% (very see-through)
  - **Opacity**: 10-20% overall
  - **Color tint**: Deep navy (#0D1F4E) at 10-15% strength
  - **Blur/Frost**: Medium (20-30px)
  - **Refractive Index**: 1.05-1.15 (subtle)
  - **NO solid objects** - everything must be translucent

**Positioning**:
- **Z-depth**: Spread from Z: -300 to Z: 300
- **X-axis**: Concentrated on RIGHT 1/3 of frame (leave left 2/3 clear for text)
- **Y-axis**: Centered vertically, varying heights
- **Rotation**: Slight tilts (5-15° on X, Y, Z axes for natural placement)
- **Overlap**: Panels should softly overlap when viewed from camera

**Shadows**:
- Soft, diffused shadows only (blur: 80-100px)
- Very low intensity (10-20% opacity)
- NO hard edges

**Animation** (8-10 second loop):
- **Float**: Slow drift on Y-axis (±8-12px)
- **Rotate**: Gentle rotation on Y and Z axes (±2-3°)
- **Sway**: Subtle X-axis movement (±5-8px)
- **Easing**: ease-in-out or cubic-bezier
- **Loop**: Infinite, seamless

---

### 2. **Glowing Orb Particles** (15-20 total)

**Purpose**: Represent growth, opportunity, upward momentum

**Specifications**:
- **Shape**: Small spheres
  - Diameter: 12-25px (varying sizes)
- **Count**: 15-20 particles
- **Colors**: Mix of:
  - 50% Gold/Amber (#C89B3C)
  - 50% Soft Blue (#4A7FD4)
- **Material**: Emissive
  - **Emissive Intensity**: 1.2-1.8
  - **Opacity**: 40-60%
  - **Glow**: Outer glow 15-25px radius
  - **Blur**: Soft edges

**Positioning**:
- Scattered throughout 3D space
- Concentrated in RIGHT 2/3 of frame
- Various Z-depths (-200 to 200)

**Animation**:
- **Upward drift**: 250-350px over 12-18 seconds
- **Horizontal sway**: ±20-35px side-to-side (sine wave)
- **Fade in**: Start at opacity 0% at bottom
- **Fade out**: End at opacity 0% at top
- **Stagger**: Offset start times (0-10s delays) for continuous effect
- **Loop**: Infinite

---

### 3. **Lighting Setup**

#### **Light 1: Warm Gold (Primary)**
- **Type**: Point Light or Spotlight
- **Color**: Gold/Amber (#C89B3C)
- **Position**: Off-center right (e.g., x: 400, y: 150, z: 200)
- **Intensity**: Medium (not too bright - around 1.2-1.5)
- **Falloff**: Smooth, wide spread
- **Animation**:
  - Soft pulse: 90-110% intensity
  - Duration: 3-4 seconds
  - Easing: ease-in-out
  - Loop: Infinite

#### **Light 2: Cool Blue (Secondary/Balance)**
- **Type**: Point Light
- **Color**: Soft Blue (#4A7FD4)
- **Position**: Opposite side left (e.g., x: -400, y: 100, z: 150)
- **Intensity**: Lower than gold light (around 0.8-1.0)
- **Falloff**: Soft, diffused
- **Animation**:
  - Gentle pulse: 95-105% intensity
  - Duration: 4-5 seconds (offset from gold light)
  - Easing: ease-in-out
  - Loop: Infinite

#### **Ambient Light**
- Very subtle fill light
- Intensity: 0.2-0.3
- No color (neutral white)

---

### 4. **Camera Setup**

**Position**:
- **Wide shot**: Pulled back to see full scene depth
- **Framing**: LEFT 2/3 of frame CLEAR (no major objects blocking)
- **Height**: Eye-level, centered vertically
- **Field of View**: 50-60°

**Static/Wide**:
- Camera position is FIXED (no auto-rotation)
- Only responds to mouse parallax and scroll

**Mouse Parallax Interaction**:
- Map **mouse X position** → camera rotation Y (±2-3° max)
- Map **mouse Y position** → camera rotation X (±2-3° max)
- **Multiply by 0.015-0.02** for subtlety
- **Smooth interpolation** (ease factor: 0.05-0.08)

**Scroll-Based Movement** (if supported):
- As user scrolls down page:
  - Camera moves forward slightly (Z: -50px over scroll distance)
  - Or panels shift forward/scale up slightly
- Smooth, not jarring
- Total movement: subtle (20-30% change max)

---

## 🛠️ Step-by-Step Creation in Spline

### Step 1: Project Setup
1. Go to [https://spline.design](https://spline.design)
2. Create new project (blank canvas)
3. **Set canvas background to TRANSPARENT** (important!)
4. Set canvas size to 1920×1080 (or 16:9 ratio)

### Step 2: Camera Configuration
1. Select Camera in scene hierarchy
2. Set FOV to 50-60°
3. Position camera at (0, 0, 600-800) for wide view
4. Set camera as static (no auto-orbit)

### Step 3: Create Glass Panels

For each panel (repeat 5-6 times):

1. **Add Shape**: Rectangle or Rounded Rectangle
2. **Scale**: Set to desired size (300-500 width, 400-800 height, thin depth)
3. **Position**:
   - X: 100 to 600 (right side of frame)
   - Y: -200 to 200 (varying heights)
   - Z: -300 to 300 (spread in depth)
4. **Rotate**: Add subtle angles (5-15° on multiple axes)
5. **Material Settings**:
   - Type: Glass or Frosted Glass
   - Transparency: 85-90%
   - Color: Navy (#0D1F4E)
   - Color Opacity: 10-15%
   - Roughness: 0.2-0.3
   - Metalness: 0
   - Transmission: 0.9-1.0
   - Thickness: 0.5-1.0
   - IOR: 1.05-1.15
6. **Shadow Settings**:
   - Cast shadow: Yes
   - Receive shadow: Yes
   - Shadow blur: 80-100px
   - Shadow opacity: 15-20%

### Step 4: Create Particle Orbs

For each particle (repeat 15-20 times):

1. **Add Shape**: Sphere
2. **Scale**: 12-25px diameter (vary sizes)
3. **Position**: Scatter throughout space (focus right side)
4. **Material Settings**:
   - Type: Basic (Emissive)
   - Color: Alternate between Gold (#C89B3C) and Blue (#4A7FD4)
   - Emissive: ON
   - Emissive Intensity: 1.2-1.8
   - Opacity: 40-60%
5. **Add Glow Effect**:
   - Select particle
   - Add Effect → Glow
   - Glow radius: 15-25px
   - Glow intensity: 0.8-1.2

### Step 5: Add Lighting

**Gold Light**:
1. Add → Light → Point Light
2. Position: (400, 150, 200)
3. Color: #C89B3C
4. Intensity: 1.3
5. Decay: 2
6. Distance: 800

**Blue Light**:
1. Add → Light → Point Light
2. Position: (-400, 100, 150)
3. Color: #4A7FD4
4. Intensity: 0.9
5. Decay: 2
6. Distance: 700

**Ambient Light**:
1. Add → Light → Ambient Light
2. Intensity: 0.25
3. Color: White

### Step 6: Animate Glass Panels

For EACH panel:

1. Select panel
2. Create animation state "Idle Float"
3. Add keyframes:

```
Time 0s:    position.y = start,  rotation.y = 0°,    rotation.z = 0°
Time 4s:    position.y = +10px,  rotation.y = +3°,   rotation.z = +2°
Time 8s:    position.y = start,  rotation.y = 0°,    rotation.z = 0°
```

4. Add X-axis sway:
```
Time 0s:    position.x = start
Time 5s:    position.x = +8px
Time 10s:   position.x = start
```

5. Set easing: ease-in-out
6. Loop: Infinite
7. **Stagger delays**: Panel 1 (0s), Panel 2 (1s), Panel 3 (2s), etc.

### Step 7: Animate Particles

For EACH particle:

1. Select particle
2. Create animation state "Upward Drift"
3. Add keyframes:

```
Time 0s:     position.y = -400,  opacity = 0%
Time 2s:     opacity = 60%
Time 15s:    position.y = +350,  opacity = 60%
Time 17s:    opacity = 0%
```

4. Add horizontal sway:
```
Time 0s:     position.x = start
Time 8s:     position.x = ±30px
Time 16s:    position.x = start
```

5. Set easing: linear (for Y), ease-in-out (for X)
6. Loop: Infinite
7. **Stagger delays**: Random delays (0-10s) for continuous effect

### Step 8: Animate Lights

**Gold Light**:
1. Select light
2. Create animation "Pulse Warm"
3. Keyframes:
```
Time 0s:    intensity = 1.2
Time 2s:    intensity = 1.5
Time 4s:    intensity = 1.2
```
4. Loop: Infinite

**Blue Light**:
1. Select light
2. Create animation "Pulse Cool"
3. Keyframes:
```
Time 0s:    intensity = 0.8
Time 2.5s:  intensity = 1.0
Time 5s:    intensity = 0.8
```
4. Loop: Infinite

### Step 9: Add Mouse Parallax

1. Select Camera
2. Add Event → Mouse Position
3. Create State "Mouse Follow"
4. Link mouse X → Camera rotation Y
   - Multiply by 0.02
   - Clamp: -3° to +3°
5. Link mouse Y → Camera rotation X
   - Multiply by 0.02
   - Clamp: -3° to +3°
6. Set interpolation: Smooth (ease: 0.06)

### Step 10: Add Scroll Interaction (Optional)

1. Select panel group or camera
2. Add Event → Scroll
3. Create State "Scroll Forward"
4. Link scroll position → Camera Z position
   - Start: Z = 700
   - End (100% scroll): Z = 650
5. Or link to panel scale (1.0 → 1.1)

### Step 11: Optimize Performance

1. **Check polygon count**: Keep under 15,000 total
2. **Simplify geometries**: Use low-poly spheres (8-12 segments)
3. **Limit shadows**: Only key panels cast shadows
4. **Reduce effects**: One glow layer per particle max
5. **Test preview**: Check FPS (should be 50-60fps)

### Step 12: Final Checks

- [ ] Transparent background enabled
- [ ] Left 2/3 of frame is CLEAR for text content
- [ ] All colors match brand palette exactly
- [ ] All animations loop smoothly
- [ ] Mouse parallax is subtle (±3° max)
- [ ] No harsh shadows or high contrast
- [ ] All materials are translucent (no solid objects)
- [ ] Scene loads in < 3 seconds
- [ ] Tested on both desktop and mobile

### Step 13: Export & Publish

1. **Preview**: Test full scene in Spline preview mode
2. **Optimize**: Use "Optimize for Web" option if available
3. **Publish**:
   - Click "Export" → "Publish to Web"
   - Copy the scene URL (format: `https://prod.spline.design/XXXXX/scene.splinecode`)
4. **Download backup**: Export as .splinecode file for local backup

---

## 🔗 Integration Code

Update `/src/components/HeroSection.tsx`:

```tsx
// Uncomment this section
<SplineScene 
  sceneUrl="https://prod.spline.design/YOUR-SCENE-URL/scene.splinecode"
  opacity={0.35}
/>
```

---

## 📱 Performance Targets

- **Desktop**: 60fps, < 100MB memory
- **Mobile**: 30-45fps, < 50MB memory
- **Load time**: < 3 seconds on 4G
- **Polygon count**: < 15,000 total
- **Texture size**: < 2MB total

---

## 🎯 Visual Goals Checklist

The final scene should feel:

- [ ] **Premium**: High-end financial services aesthetic
- [ ] **Calm**: Slow, gentle motion — no jarring movements
- [ ] **Sophisticated**: Layers of depth, not flat
- [ ] **Subtle**: Background element, not main focus
- [ ] **Clean**: No clutter, clear left side for content
- [ ] **Professional**: Appropriate for financial services
- [ ] **Transparent**: Literally and metaphorically (see-through materials)
- [ ] **Modern**: Contemporary 3D design language
- [ ] **Trustworthy**: Solid, stable foundation despite floating elements

---

## 🚫 What NOT to Include

- ❌ No literal objects (planets, rockets, generic shapes)
- ❌ No sci-fi aesthetic
- ❌ No solid/opaque materials
- ❌ No hard shadows
- ❌ No fast or jarring animations
- ❌ No colors outside brand palette
- ❌ No objects blocking left 2/3 of frame
- ❌ No text or typography in 3D scene
- ❌ No realistic textures (wood, metal, etc.)
- ❌ No complex particle systems (keep simple)

---

## 💡 Pro Tips

1. **Test early**: Export a simple version first to test integration
2. **Iterate in Spline**: Easy to adjust after seeing in browser
3. **Mobile first**: If it works on mobile, desktop will be fine
4. **Subtle > Flashy**: When in doubt, reduce intensity/opacity
5. **Brand alignment**: Every element should reinforce trust and professionalism
6. **Performance monitoring**: Use Chrome DevTools to check FPS
7. **Fallback ready**: Consider static image fallback for low-power devices

---

## 🆘 Troubleshooting

**Scene too busy**:
- Reduce opacity to 0.25-0.30
- Remove 1-2 panels
- Reduce particle count to 10-12

**Performance issues**:
- Lower polygon count (use simpler spheres)
- Reduce particle count
- Simplify materials (remove unnecessary effects)
- Disable shadows on smaller objects

**Blocks content**:
- Move panels further right (X: 200+)
- Reduce panel sizes
- Lower overall opacity

**Colors look wrong**:
- Double-check hex codes in Spline
- Adjust monitor calibration
- Test on multiple devices

**Mouse parallax too strong**:
- Reduce multiplier from 0.02 to 0.01
- Reduce max rotation from ±3° to ±2°

---

**Once complete, you'll have a premium, performance-optimized 3D background that enhances your hero section without overpowering it!** 🎨✨
