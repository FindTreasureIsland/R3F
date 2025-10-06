import * as THREE from 'three';
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Vector3, Euler, Group, Color, PerspectiveCamera } from "three";

interface ModelInfo {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

interface CameraInfo {
  position: Vector3;
  fov: number;
  lookAt: Vector3;
}

interface SceneInfoProps {
  onCameraTargetChange?: (position: Vector3, lookAt: Vector3) => void;
}

function Model({ onInfoUpdate, onTransform }: { 
  onInfoUpdate: (info: ModelInfo) => void;
  onTransform: (position: [number, number, number], scale: [number, number, number], rotation: Partial<{ x: number, y: number, z: number }>) => void;
}) {
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const modelRef = useRef<Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const lastModelInfo = useRef<ModelInfo>({
    position: new Vector3(0, -1, -10),
    rotation: new Euler(0, 0, 0),
    scale: new Vector3(0.02, 0.02, 0.02)
  });

  const { scene, animations } = useGLTF("/models/spaceship.glb", true, 
    undefined,
    (error) => {
      console.error('GLTF loading error:', error);
      setLoadingError(error.message);
    }
  );

  useEffect(() => {
    if (scene) {
      try {
        const clonedScene = scene.clone();
        
        clonedScene.scale.set(0.02, 0.02, 0.02);
        clonedScene.position.set(0, -1, -10);
        clonedScene.rotation.set(0, 0, 0);

        if (modelRef.current) {
          modelRef.current.clear();
          modelRef.current.add(clonedScene);
        }

        if (animations.length > 0) {
          mixer.current = new THREE.AnimationMixer(clonedScene);
          animations.forEach((clip) => {
            const action = mixer.current?.clipAction(clip);
            action?.play();
          });
        }
      } catch (error) {
        console.error('Scene setup error:', error);
        setLoadingError(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
        mixer.current = null;
      }
    };
  }, [scene, animations]);

  const handlePointerMove = useCallback(() => {
    if (modelRef.current) {
      const newModelInfo = {
        position: modelRef.current.position.clone(),
        rotation: modelRef.current.rotation.clone(),
        scale: modelRef.current.scale.clone()
      };
      onInfoUpdate(newModelInfo);
    }
  }, [onInfoUpdate]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
    if (modelRef.current) {
      const newModelInfo = {
        position: modelRef.current.position.clone(),
        rotation: modelRef.current.rotation.clone(),
        scale: modelRef.current.scale.clone()
      };

      if (!newModelInfo.position.equals(lastModelInfo.current.position) ||
          !newModelInfo.rotation.equals(lastModelInfo.current.rotation) ||
          !newModelInfo.scale.equals(lastModelInfo.current.scale)) {
        
        console.log('Model Update:', {
          position: {
            x: newModelInfo.position.x.toFixed(3),
            y: newModelInfo.position.y.toFixed(3),
            z: newModelInfo.position.z.toFixed(3)
          },
          rotation: {
            x: (newModelInfo.rotation.x * 180 / Math.PI).toFixed(3),
            y: (newModelInfo.rotation.y * 180 / Math.PI).toFixed(3),
            z: (newModelInfo.rotation.z * 180 / Math.PI).toFixed(3)
          },
          scale: {
            x: newModelInfo.scale.x.toFixed(3),
            y: newModelInfo.scale.y.toFixed(3),
            z: newModelInfo.scale.z.toFixed(3)
          }
        });

        lastModelInfo.current = newModelInfo;
        onInfoUpdate(newModelInfo);
      }
    }
  });

  const transformModel = useCallback((position: [number, number, number], scale: [number, number, number], rotation: Partial<{ x: number, y: number, z: number }>) => {
    if (scene) {
      scene.position.set(...position);
      scene.scale.set(...scale);
      if (rotation.x !== undefined) scene.rotation.x = rotation.x;
      if (rotation.y !== undefined) scene.rotation.y = rotation.y;
      if (rotation.z !== undefined) scene.rotation.z = rotation.z;
    }
  }, [scene]);

  useEffect(() => {
    onTransform && onTransform(transformModel);
  }, [onTransform, transformModel]);

  if (loadingError) {
    console.error('Model loading error:', loadingError);
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <OrbitControls />
      </mesh>
    );
  }

  return (
    <group ref={modelRef}>
      <OrbitControls
        makeDefault
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={1.0}
        panSpeed={1.0}
        rotateSpeed={0.8}
        minDistance={5}
        maxDistance={50}
        target={[0, 0, 0]}
        onChange={(e) => {
          if (e.target.object instanceof THREE.PerspectiveCamera) {
            onInfoUpdate({
              position: new Vector3().copy(e.target.object.position),
              rotation: new Euler().copy(e.target.object.rotation),
              scale: new Vector3().copy(e.target.object.scale)
            });
          }
        }}
      />
    </group>
  );
}

export function SceneInfo({ onCameraTargetChange }: SceneInfoProps) {
  const { camera } = useThree();
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    position: new Vector3(0, 0, -10),
    rotation: new Euler(0, 0, 0),
    scale: new Vector3(0.02, 0.02, 0.02),
  });
  const [cameraInfo, setCameraInfo] = useState<CameraInfo>({
    position: new Vector3(-6.774, 0.835, 6.782),
    fov: 45,
    lookAt: new Vector3(0, 0, 0)
  });

  const targetCamera = useRef({
    position: new Vector3(-6.774, 0.835, 6.782),
    lookAt: new Vector3(0, 0, 7)
  });
  
  const handleModelUpdate = useCallback((info: ModelInfo) => {
    const hasPositionChanged = !modelInfo.position.equals(info.position);
    const hasRotationChanged = !modelInfo.rotation.equals(info.rotation);
    const hasScaleChanged = !modelInfo.scale.equals(info.scale);

    if (hasPositionChanged || hasRotationChanged || hasScaleChanged) {
      setModelInfo({
        position: info.position.clone(),
        rotation: new Euler().copy(info.rotation),
        scale: info.scale.clone(),
      });
    }
  }, [modelInfo]);

  useEffect(() => {
    // onInfoUpdate(modelInfo, cameraInfo); // No longer needed as App doesn't manage cameraInfo
  }, [modelInfo, cameraInfo]); // Removed onInfoUpdate from dependencies
  
  useFrame((state, delta) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const t = Math.min(delta * 2, 1);
      
      const newPosition = lerpVector3(
        camera.position,
        targetCamera.current.position,
        t
      );
      const newLookAt = lerpVector3(
        cameraInfo.lookAt,
        targetCamera.current.lookAt,
        t
      );

      camera.position.copy(newPosition);
      camera.lookAt(newLookAt);

      const newCameraInfo = { 
        position: newPosition,
        fov: camera.fov,
        lookAt: newLookAt
      };
      
      const positionChanged = !newCameraInfo.position.equals(cameraInfo.position);
      const lookAtChanged = !newCameraInfo.lookAt.equals(cameraInfo.lookAt);
      
      if (positionChanged || lookAtChanged) {
        setCameraInfo(newCameraInfo);
        // onInfoUpdate(modelInfo, newCameraInfo); // No longer needed
      }
    }
  });

  const updateCamera = useCallback((targetPosition: [number, number, number], targetLookAt: [number, number, number]) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      targetCamera.current = {
        position: new Vector3(...targetPosition),
        lookAt: new Vector3(...targetLookAt)
      };
      onCameraTargetChange?.(targetCamera.current.position, targetCamera.current.lookAt);
    }
  }, [camera]);

  useEffect(() => {
    const cameraRef = camera;
    if (cameraRef) {
      window.__updateCamera = updateCamera;
      onCameraTargetChange?.(targetCamera.current.position, targetCamera.current.lookAt);
    }
  }, [camera, updateCamera]);

  return (
    <Suspense fallback={
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" wireframe />
        <OrbitControls />
      </mesh>
    }>
      <Model 
        onInfoUpdate={handleModelUpdate}
        onTransform={() => {}} // onTransform is no longer used by App
      />
    </Suspense>
  );
}

function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

function lerpVector3(start: Vector3, end: Vector3, t: number): Vector3 {
  return new Vector3(
    lerp(start.x, end.x, t),
    lerp(start.y, end.y, t),
    lerp(start.z, end.z, t)
  );
}
