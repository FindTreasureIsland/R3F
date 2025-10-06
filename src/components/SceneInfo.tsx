import * as THREE from 'three';
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Vector3, Euler, Group } from "three";

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

function Model({ onInfoUpdate }: { 
  onInfoUpdate: (info: ModelInfo) => void;
}) {
  const { camera } = useThree();
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
    (error: unknown) => {
      console.error('GLTF loading error:', error);
      setLoadingError(error instanceof Error ? error.message : String(error));
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

  // 已移除未使用的指针移动处理逻辑

  useFrame((_state, delta) => {
    if (mixer.current) {
      // 使用更平滑的动画更新，减少突然的动作变化
      mixer.current.update(delta * 0.8); // 减慢动画播放速度
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
        
        // 移除控制台日志以减少性能影响
        lastModelInfo.current = {
          position: newModelInfo.position.clone(),
          rotation: new Euler().copy(newModelInfo.rotation),
          scale: newModelInfo.scale.clone()
        };
        onInfoUpdate(newModelInfo);
      }
    }
  });

  // 已移除未使用的 transformModel

  // onTransform 回调不再向外暴露 transformModel，避免类型不匹配的调用

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
        onChange={() => {
          if (camera instanceof THREE.PerspectiveCamera) {
            onInfoUpdate({
              position: camera.position.clone(),
              rotation: camera.rotation.clone(),
              scale: camera.scale.clone(),
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
  
  useFrame((_state, delta) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // 使用更平滑的缓动函数，减慢插值速度并添加缓动效果
      const rawT = Math.min(delta * 1.2, 1); // 减慢速度从2到1.2
      // 使用ease-out缓动函数，开始快，结束慢
      const t = 1 - Math.pow(1 - rawT, 3);
      
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
      <Model onInfoUpdate={handleModelUpdate} />
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
