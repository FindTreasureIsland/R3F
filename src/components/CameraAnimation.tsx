import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3 } from 'three';

interface CameraAnimationProps {
  targetPosition: Vector3;
  targetLookAt: Vector3;
  onAnimationComplete?: () => void;
}

export function CameraAnimation({ targetPosition, targetLookAt, onAnimationComplete }: CameraAnimationProps) {
  const { camera } = useThree();
  const targetRef = useRef({
    position: targetPosition.clone(),
    lookAt: targetLookAt.clone(),
    midPosition: targetPosition.clone().add(targetLookAt.clone()).multiplyScalar(0.5),
    midLookAt: targetLookAt.clone().sub(targetPosition.clone()).multiplyScalar(0.5)
  });

  const currentLookAt = useRef(new Vector3());
  const lerpFactor = useRef(0);
  const prevTargetPos = useRef(targetPosition.clone());
  const prevTargetLookAt = useRef(targetLookAt.clone());
  const isAnimating = useRef(false);
  const animationPhase = useRef(1); // 1: 第一阶段, 2: 第二阶段

  // 同步更新目标位置
  useEffect(() => {
    lerpFactor.current = 0;
    animationPhase.current = 1;
    targetRef.current.position.copy(targetPosition);
    targetRef.current.lookAt.copy(targetLookAt);
    prevTargetPos.current.copy(camera.position.clone());
    prevTargetLookAt.current.copy(new Vector3().copy(camera.position));
    currentLookAt.current.copy(camera.position);
    isAnimating.current = true;
  }, [targetPosition, targetLookAt, onAnimationComplete]);

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    const currentPos = camera.position;
    lerpFactor.current = Math.min(lerpFactor.current + delta * 0.8, 1);
    const t = 1 - Math.pow(1 - lerpFactor.current, 2);
    
    if (animationPhase.current === 1) {
      // 第一阶段：移动到中间位置
      const newPos = prevTargetPos.current.clone().lerp(targetRef.current.midPosition, t);
      const newLookAt = prevTargetLookAt.current.clone().lerp(targetRef.current.midLookAt, t);
      currentPos.copy(newPos);
      currentLookAt.current.copy(newLookAt);
      camera.lookAt(currentLookAt.current);
      
      if (t >= 0.999) {
        // 第一阶段结束，开始第二阶段
        lerpFactor.current = 0;
        animationPhase.current = 2;
        prevTargetPos.current.copy(currentPos);
        prevTargetLookAt.current.copy(currentLookAt.current);
      }
    } else {
      // 第二阶段：移动到最终位置
      currentPos.lerp(targetRef.current.position, t);
      currentLookAt.current.lerp(targetRef.current.lookAt, t);
      camera.lookAt(currentLookAt.current);
      
      if (t >= 0.999) {
        // 动画完全结束
        currentPos.copy(targetRef.current.position);
        currentLookAt.current.copy(targetRef.current.lookAt);
        camera.lookAt(currentLookAt.current);
        isAnimating.current = false;
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }
  });

  return null;
}