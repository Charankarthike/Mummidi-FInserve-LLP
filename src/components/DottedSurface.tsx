import { cn } from '../lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  isDark?: boolean;
  amountX?: number;
  amountY?: number;
  separation?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  dotSize?: number;
  opacity?: number;
};

export function DottedSurface({
  className,
  isDark = true,
  amountX = 50,
  amountY = 70,
  separation = 120,
  waveSpeed = 0.08,
  waveAmplitude = 40,
  dotSize = 6,
  opacity = 0.6,
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    points: THREE.Points;
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(isDark ? 0x000000 : 0xffffff, 1500, 8000);

    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      1,
      10000,
    );
    camera.position.set(0, 280, 1000);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // disabled for better performance
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(scene.fog.color, 0);
    container.appendChild(renderer.domElement);

    // Create particles
    const positions: number[] = [];
    const colors: number[] = [];

    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        const x = ix * separation - (amountX * separation) / 2;
        const y = 0; // Will be animated
        const z = iy * separation - (amountY * separation) / 2;

        positions.push(x, y, z);

        if (isDark) {
          colors.push(215, 165, 49); // Gold color (#D7A531)
        } else {
          colors.push(59, 130, 246); // Blue color (#3B82F6)
        }
      }
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: true,
      transparent: true,
      opacity: opacity,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number = 0;

    // Animation function
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const positionAttribute = geometry.attributes.position;
      const positions = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < amountX; ix++) {
        for (let iy = 0; iy < amountY; iy++) {
          const index = i * 3;

          // Complex wave animation with multiple frequencies
          positions[index + 1] =
            Math.sin((ix + count) * 0.25) * waveAmplitude +
            Math.sin((iy + count) * 0.4) * waveAmplitude * 0.8 +
            Math.sin((ix + iy + count * 0.5) * 0.15) * waveAmplitude * 0.5;

          i++;
        }
      }

      positionAttribute.needsUpdate = true;

      // Gentle camera sway
      camera.position.x = Math.sin(count * 0.02) * 100;
      camera.position.y = 280 + Math.cos(count * 0.03) * 50;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      count += waveSpeed;
    };

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      animationId,
      count,
    };

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        // Clean up Three.js objects
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        sceneRef.current.renderer.dispose();

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [isDark, amountX, amountY, separation, waveSpeed, waveAmplitude, dotSize, opacity]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
      {...props}
    />
  );
}
