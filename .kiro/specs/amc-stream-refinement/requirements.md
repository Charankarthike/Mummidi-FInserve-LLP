# Requirements Document

## Introduction

The AMC Stream Refinement enhances the existing `AMCStream` component in the Mummidi Finserve LLP hero section. The goals are to confine the chip animation strictly to the right-side hero zone (left: 45% → right: 100vw), reduce visible chips from 36 to 10 for a cleaner look, eliminate the 72 per-chip injected `<style>` tags by migrating all keyframes to a single shared CSS file with CSS custom properties, add premium 3-layer depth parallax with DOF blur effects, and optionally provide a lightweight SVG `ConstellationOverlay` as a drop-in replacement for the heavy Three.js `FamilyConstellationScene`.

---

## Glossary

- **AMCStream**: The React component that renders floating AMC fund-house chips in the hero right zone.
- **AMCStreamZone**: A new structural wrapper `<div>` inside `HeroSection` that provides the right-side clipping boundary for the animation.
- **Chip**: A single pill-shaped UI element displaying an AMC fund name, icon, and accent dot.
- **ChipConfig**: A plain TypeScript object holding all positioning, timing, and layer parameters for one chip.
- **LayerConfig**: Describes the visual properties (scale, opacity, blur, speed) for one of the three depth layers.
- **ConstellationOverlay**: An optional pure-SVG component rendering ~60 connected nodes with a slow CSS breathe animation.
- **seededRand**: A deterministic pseudo-random number function based on `Math.sin`, used to derive stable chip positions without `Math.random`.
- **CSSOM**: The browser's internal representation of parsed CSS — minimising it reduces style-recalculation cost.
- **DOF Blur**: Depth-of-field blur — a CSS `filter: blur()` effect proportional to the chip's depth layer.
- **CSS Custom Property**: A variable defined with `--name` syntax that allows a single `@keyframes` block to be shared across many elements with different per-element values.
- **glow pulse**: A temporary increase in `box-shadow` spread applied to chips when scroll or mouse activity is detected.
- **PBT**: Property-based testing — a testing technique that verifies universally quantified properties across many generated inputs.

---

## Requirements

### Requirement 1: Right-Side Zone Confinement

**User Story:** As a site visitor, I want the AMC chip animation to stay out of the text column, so that I can read the hero heading and CTA without visual interference.

#### Acceptance Criteria

1. THE AMCStreamZone SHALL be positioned `position: absolute; top: 0; bottom: 0; left: 45%; right: 0` within `HeroSection`.
2. THE AMCStreamZone SHALL have `overflow: hidden` so that any chip sway that extends leftward is clipped at the 45% boundary.
3. THE AMCStreamZone SHALL have `pointer-events: none` and `aria-hidden="true"` so that the animation does not intercept user interactions or assistive-technology focus.
4. WHEN a chip's horizontal sway is at its maximum leftward amplitude, THE AMCStream SHALL not render any chip pixel left of the AMCStreamZone left boundary.
5. THE AMCStream SHALL assign chip `left` positions in the range 5%–90% of the AMCStreamZone container width.
6. WHILE the viewport width is below 1024 px (below Tailwind `lg` breakpoint), THE AMCStreamZone SHALL reduce overall opacity to 0.4 and scale the chip group to 0.8 to prevent visual noise on small screens.
7. WHILE the viewport width is between 768 px and 1023 px (Tailwind `md` range), THE AMCStreamZone SHALL shift its left boundary to `left: 50%` and apply a chip group scale of 0.85.

---

### Requirement 2: Chip Count and Visual Density

**User Story:** As a site visitor, I want to see a sparse, curated stream of AMC chips rather than a crowded wall, so that the animation feels premium and does not overwhelm the hero content.

#### Acceptance Criteria

1. THE AMCStream SHALL render exactly the number of chips specified by the `chipCount` prop (default 10).
2. WHERE the `chipCount` prop is greater than 12, THE AMCStream SHALL clamp it silently to 12 and emit a `console.warn` in development mode.
3. WHERE the `chipCount` prop is less than 1, THE AMCStream SHALL clamp it silently to 8.
4. THE AMCStream SHALL distribute chips across 3 depth layers so that each layer contains between 3 and 4 chips when `chipCount` is 10.
5. THE AMCStream SHALL derive all chip positions and timing values from `seededRand` so that the layout is identical across re-renders and hot-reloads.

---

### Requirement 3: Performance — Shared CSS Keyframes

**User Story:** As a developer, I want the animation to inject the minimum number of CSS rules into the browser, so that style-recalculation cost is negligible and the page runs at 60 fps.

#### Acceptance Criteria

1. THE AMCStream SHALL inject exactly 2 `@keyframes` blocks into the CSSOM — `amc-fall` and `amc-dof` — regardless of chip count.
2. THE AMCStream SHALL express per-chip variation (sway amplitude, rotation, blur, opacity, duration, delay) exclusively as inline CSS custom properties (`--sway`, `--rot-start`, `--rot-end`, `--blur-base`, `--opacity-base`, `--duration`, `--delay`) on each chip wrapper element.
3. THE AMCStream SHALL NOT create or inject any per-chip `<style>` element into the DOM.
4. WHEN the component mounts, THE AMCStream SHALL apply `will-change: transform, opacity, filter` to each chip wrapper element.
5. THE AMCStream SHALL import all keyframe definitions from a single static CSS file (`amcStream.css`) rather than constructing them at runtime.

---

### Requirement 4: 3-Layer Depth Parallax

**User Story:** As a site visitor, I want the chips to appear to float at different depths, so that the animation has a three-dimensional, premium feel.

#### Acceptance Criteria

1. THE AMCStream SHALL define exactly 3 depth layers with the following properties:
   - Layer 0 (far): scale 0.72, opacity 0.12, blur 2.5 px, fall duration base 22 s
   - Layer 1 (mid): scale 0.88, opacity 0.22, blur 1 px, fall duration base 16 s
   - Layer 2 (front): scale 1.00, opacity 0.32, blur 0 px, fall duration base 11 s
2. WHEN rendering a chip, THE AMCStream SHALL apply the scale, opacity, blur, and speed of the chip's assigned depth layer.
3. THE AMCStream SHALL assign CSS `z-index` values 1, 2, and 3 to the far, mid, and front layers respectively.
4. THE AMCStream SHALL vary each chip's fall duration by ±6 s around its layer's base speed, derived from `seededRand`, to avoid lock-step movement.

---

### Requirement 5: Visual Effects — Sway, Rotation, DOF, and Glow Pulse

**User Story:** As a site visitor, I want each chip to drift, rotate slightly, and softly glow when I scroll, so that the animation feels alive and premium without being distracting.

#### Acceptance Criteria

1. THE `amc-fall` keyframe SHALL animate horizontal `translateX` using the chip's `--sway` custom property across 5 keyframe stops (0%, 25%, 50%, 75%, 100%) to produce a sine-wave-like drift.
2. THE `amc-fall` keyframe SHALL animate chip `rotate` from `--rot-start` to `--rot-end` across the fall duration for a micro-rotation effect; rotation values SHALL fall in the range ±5°.
3. THE `amc-dof` keyframe SHALL animate `filter: blur()` between `calc(var(--blur-base) + 3px)` at entry/exit and `0px` at mid-fall to simulate depth-of-field focus.
4. THE `amc-dof` keyframe SHALL animate chip `opacity` from 0 at entry, to the layer's `--opacity-base` value, to `calc(var(--opacity-base) * 1.15)` at the focal zone (45%–55% of fall), and back to 0 at exit.
5. WHEN a scroll or mousemove event is detected on the container, THE AMCStream SHALL activate glow state for 1200 ms and then deactivate it.
6. WHILE glow state is active, THE AMCStream SHALL render each chip with an augmented `box-shadow` that includes a coloured spread glow matching the chip's accent colour.
7. THE AMCStream SHALL render a top edge fade overlay (height 18% of container, white gradient top-to-transparent) and a bottom edge fade overlay (height 22%, white gradient bottom-to-transparent) inside the animation container.

---

### Requirement 6: seededRand Pure Function

**User Story:** As a developer, I want chip layouts to be deterministic, so that the animation looks the same on every page load and does not cause hydration mismatches.

#### Acceptance Criteria

1. THE `seededRand` function SHALL accept a single numeric `seed` argument and return a value in the half-open interval [0, 1).
2. WHEN called with the same `seed`, THE `seededRand` function SHALL always return the same value.
3. THE `seededRand` function SHALL be implemented as a pure function with no side effects.

---

### Requirement 7: ConstellationOverlay (Optional Layer)

**User Story:** As a developer, I want an opt-in SVG constellation layer behind the chips, so that I can replace the heavy Three.js FamilyConstellationScene with a zero-runtime-cost decorative background.

#### Acceptance Criteria

1. THE ConstellationOverlay SHALL render as a single `<svg>` element with `aria-hidden="true"` and `pointer-events: none`.
2. THE ConstellationOverlay SHALL generate node positions once at mount using `seededRand` and SHALL NOT re-generate positions on subsequent renders.
3. THE ConstellationOverlay SHALL render a maximum of 60 `<circle>` nodes and approximately 60 `<line>` connections, keeping total DOM nodes at or below 120.
4. THE ConstellationOverlay SHALL apply a single CSS `@keyframes breathe` animation to the `<svg>` element — cycling opacity between 0.08 and 0.18 over 6 s — with no `requestAnimationFrame` loop.
5. WHERE the `breathe` prop is `false`, THE ConstellationOverlay SHALL render the SVG at a static opacity of 0.13 without animation.
6. THE ConstellationOverlay SHALL be rendered behind the AMCStream chips at `z-index: 0`, with chips at `z-index: 1–3`.
7. THE ConstellationOverlay SHALL be opt-in; THE AMCStreamZone SHALL not render it unless explicitly enabled.

---

### Requirement 8: AMCStreamZone Structural Integration

**User Story:** As a developer, I want a clearly scoped wrapper component for the right animation zone, so that positioning, clipping, and z-index concerns are isolated from the rest of HeroSection.

#### Acceptance Criteria

1. THE AMCStreamZone SHALL be a non-interactive `<div>` with `aria-hidden="true"` rendered inside `HeroSection` alongside — but independent of — the left text column.
2. THE HeroSection SHALL remove the existing `absolute inset-0` placement of `<AMCStream />` and replace it with the new `<AMCStreamZone>` wrapper at `left: 45%, right: 0`.
3. THE HeroSection left text column SHALL retain `z-index: 10` so that it renders above the animation zone at all times.
4. THE AMCStreamZone SHALL contain the `<ConstellationOverlay>` (when enabled) and `<AMCStream>` as its only children.

---

### Requirement 9: Accessibility and Pointer Isolation

**User Story:** As a keyboard or screen-reader user, I want the chip animation to be completely invisible to assistive technologies, so that navigating the hero section is unaffected by the decorative background.

#### Acceptance Criteria

1. THE AMCStreamZone SHALL have `aria-hidden="true"` set on its root element.
2. THE AMCStream container SHALL have `pointer-events: none` applied so that chip elements never capture mouse or touch events.
3. IF the user has set `prefers-reduced-motion: reduce` in their OS, THEN THE AMCStream SHALL pause all chip animations by setting `animation-play-state: paused` on every chip.
