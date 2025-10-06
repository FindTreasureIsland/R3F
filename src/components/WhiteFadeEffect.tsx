import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface WhiteFadeEffectProps {
  isActive: boolean;
  onFadeComplete?: () => void;
}

export function WhiteFadeEffect({ isActive, onFadeComplete }: WhiteFadeEffectProps) {
  const { scene } = useThree();
  const fadeRef = useRef<THREE.Mesh | null>(null);
  const startTimeRef = useRef<number>(0);
  const duration = 2000; // 2 seconds in milliseconds

  useEffect(() => {
    if (!fadeRef.current) {
      const geometry = new THREE.PlaneGeometry(100, 100);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthTest: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 9999;
      mesh.position.z = 1;
      fadeRef.current = mesh;
      scene.add(mesh);
    }

    return () => {
      if (fadeRef.current) {
        scene.remove(fadeRef.current);
      }
    };
  }, [scene]);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        if (fadeRef.current && fadeRef.current.material instanceof THREE.MeshBasicMaterial) {
          fadeRef.current.material.opacity = progress;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (onFadeComplete) {
          onFadeComplete();
        }
      };
      animate();
    } else if (fadeRef.current && fadeRef.current.material instanceof THREE.MeshBasicMaterial) {
      fadeRef.current.material.opacity = 0;
    }
  }, [isActive, onFadeComplete]);

  return null;
}