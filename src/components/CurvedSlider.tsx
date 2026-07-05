import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CurvedSliderProps {
  images: string[];
  speed?: number;
  gap?: number;
  curve?: number;
  reverse?: boolean;
  className?: string;
}

export default function CurvedSlider({
  images,
  speed = 30,
  gap = 10,
  curve = 12,
  reverse = false,
  className = '',
}: CurvedSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planesRef = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;

    const el = containerRef.current;
    const direction = reverse ? 1 : -1;

    // Helper functions
    const getWidth = (gap: number) => 1 + gap / 100;

    const getPlaneWidth = (camera: THREE.PerspectiveCamera) => {
      const vFov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * camera.position.z;
      const aspect = el.clientWidth / el.clientHeight;
      const width = height * aspect;
      return el.clientWidth / width;
    };

    // Initialize Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      el.clientWidth / el.clientHeight,
      0.1,
      20
    );
    camera.position.z = 2;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Clear previous canvas if exists
    const previousCanvas = el.querySelector('canvas');
    if (previousCanvas) el.removeChild(previousCanvas);
    el.appendChild(renderer.domElement);

    // Create planes
    const geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    const planeSpace = getPlaneWidth(camera) * getWidth(gap);
    const totalImage = Math.ceil(el.clientWidth / planeSpace) + 1 + images.length;
    const initialOffset = Math.ceil(el.clientWidth / (2 * planeSpace) - 0.5);

    // Duplicate images for infinite scroll
    const allImages = [...images];
    for (let i = images.length; i < totalImage; i++) {
      allImages.push(images[i % images.length]);
    }

    const planes: THREE.Mesh[] = [];

    allImages.forEach((imageSrc, i) => {
      const loader = new THREE.TextureLoader();
      loader.load(imageSrc, (texture) => {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            tex: { value: texture },
            curve: { value: curve },
          },
          vertexShader: `
            uniform float curve;
            varying vec2 vertexUV;
            void main(){
              vertexUV = uv;
              vec3 newPosition = position;
              float distanceFromCenter = abs(modelMatrix*vec4(position, 1.0)).x;
              newPosition.y *= 1.0 + (curve/100.0)*pow(distanceFromCenter,2.0);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D tex;
            varying vec2 vertexUV;
            void main(){
              gl_FragColor = texture2D(tex, vertexUV);
            }
          `,
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.position.x = -1 * direction * (i - initialOffset) * getWidth(gap);
        planes[i] = plane;
        scene.add(plane);
      });
    });

    planesRef.current = planes;

    // Animation
    let previousTime = 0;

    const animate = (currentTime: number) => {
      const timePassed = currentTime - previousTime;

      if (Math.abs(scene.position.x) >= getWidth(gap) * images.length) {
        timeRef.current = 0;
      }
      timeRef.current += direction * timePassed * 0.00001;
      scene.position.x = timeRef.current * speed;

      renderer.render(scene, camera);
      previousTime = currentTime;
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!el || !camera || !renderer) return;
      
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      planesRef.current.forEach((plane) => {
        if (plane.geometry) plane.geometry.dispose();
        if (plane.material) {
          if (Array.isArray(plane.material)) {
            plane.material.forEach((mat) => mat.dispose());
          } else {
            plane.material.dispose();
          }
        }
      });
    };
  }, [images, speed, gap, curve, reverse]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'var(--min-height, 100vh)',
      }}
    />
  );
}
