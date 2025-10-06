import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { CameraAnimation } from "./components/CameraAnimation";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { WhiteFadeEffect } from "./components/WhiteFadeEffect";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Vector3, Euler, Group, Color, PerspectiveCamera } from "three";
import "./App.css";
import type { ThreeEvent } from "@react-three/fiber";
import { SceneInfo } from "./components/SceneInfo";
import { TextOverlay } from "./components/TextOverlay";

// 辅助函数定义
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

useGLTF.preload("/models/spaceship.glb");

function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeInterval = useRef<number | undefined>(undefined);
  const hasAttemptedPlay = useRef<boolean>(false);

  const fadeVolume = (start: number, end: number, duration: number) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = (end - start) / steps;
    let currentStep = 0;

    if (fadeInterval.current) {
      clearInterval(fadeInterval.current);
    }

    audio.volume = start;
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      const newVolume = start + volumeStep * currentStep;
      if (currentStep >= steps) {
        audio.volume = end;
        if (fadeInterval.current) {
          clearInterval(fadeInterval.current);
        }
        if (end === 0) {
          audio.pause();
        }
        return;
      }
      audio.volume = newVolume;
    }, stepTime);
  };
  
  // 尝试播放音乐的函数
  const attemptPlayAudio = async () => {
    if (audioRef.current && isPlaying) {
      try {
        audioRef.current.volume = 0;
        await audioRef.current.play();
        fadeVolume(0, 0.5, 2000);
        hasAttemptedPlay.current = true;
      } catch (error) {
        console.log("Auto-play was prevented", error);
        // 保持isPlaying为true，等待用户交互后再次尝试播放
      }
    }
  };
  
  useEffect(() => {
    attemptPlayAudio();
    
    // 添加全局点击事件监听器，在用户首次交互时尝试播放
    const handleUserInteraction = () => {
      if (!hasAttemptedPlay.current) {
        attemptPlayAudio();
      }
    };
    
    document.addEventListener('click', handleUserInteraction, { once: true });
    
    return () => {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
      }
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            fadeVolume(0, 0.5, 1000);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      } else {
        fadeVolume(audioRef.current.volume, 0, 1000);
      }
    }
  }, [isPlaying]);
  return (
    <>
      {" "}
      <audio ref={audioRef} src="/backsound.mp3" loop preload="auto" />{" "}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "transparent",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {" "}
        {isPlaying ? (
          <>
            {" "}
            <span style={{ fontSize: "20px" }}>🔊</span> 开启{" "}
          </>
        ) : (
          <>
            {" "}
            <span style={{ fontSize: "20px" }}>🔇</span> 关闭{" "}
          </>
        )}{" "}
      </button>{" "}
    </>
  );
}

function BlackHoleEffect() {
  return (
    <>
      <pointLight
        position={[-8, 0, 0]}
        intensity={10}
        distance={10}
        color="#ffffff"
      />
      <pointLight
        position={[-8, 0, 0]}
        intensity={500}
        distance={10}
        color="#ffffff"
      />
      <pointLight
        position={[-8, 2, 0]}
        intensity={500}
        distance={20}
        color="#ffffff"
      />
      <pointLight
        position={[-8, -2, 0]}
        intensity={200}
        distance={20}
        color="#ffffff"
      />
      <pointLight
        position={[-7, 1, 0]}
        intensity={150}
        distance={15}
        color="#ffffff"
      />
      <pointLight
        position={[-7, -1, 0]}
        intensity={150}
        distance={15}
        color="#ffffff"
      />
      <pointLight
        position={[-9, 0, 0]}
        intensity={150}
        distance={15}
        color="#ffffff"
      />
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, 0]} intensity={1} />
      <BlackHoleEffect />
    </>
  );
}

function App() {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [targetPosition, setTargetPosition] = useState(
    new Vector3(-6.774, 0.835, 6.782),
  );
  const [targetLookAt, setTargetLookAt] = useState(new Vector3(0, 0, 7));
  const [fadeActive, setFadeActive] = useState(false);
  const [textOverlayActive, setTextOverlayActive] = useState(false);
  const [showNewButton, setShowNewButton] = useState(false);

  const viewTexts = useRef([
    {
      title: "孤独与坚持",
      body: "创业正如在黑暗之中的摸索，这是一段孤独而勇敢的旅程。世界没有救世主，能够拯救的唯有自己。",
    },
    {
      title: "勇气和冒险",
      body: "创业最大的乐趣就在于永远充满了变化，生活一直都不会枯燥，勇敢去面对一切的不确定性。",
    },
    {
      title: "无所畏惧的心",
      body: "最终决定一切的都是你的内心，你是否足够坚定，是否可以战胜内心的恐惧，真正做到无所畏惧....",
    },
  ]);

  const views = useRef([
    { position: [-6.774, 0.835, 6.782], lookAt: [0, 0, 7] }, // 视角1
    { position: [-15.683, 3.047, 6.977], lookAt: [0, 0, 0] }, // 视角2
    { position: [-1.602, -0.267, 13.709], lookAt: [0, 0, 0] }, // 视角3
  ]);

  useEffect(() => {
    let interval: number;
    let fadeOutTimeout: number;

    const startAutoSwitching = () => {
      // Immediately activate text overlay for the first view
      setTextOverlayActive(true);
      setShowNewButton(false); // Hide button when starting auto-switch
      fadeOutTimeout = window.setTimeout(
        () => setTextOverlayActive(false),
        15000,
      ); // Fade out 5 seconds before next switch

      interval = setInterval(() => {
        setCurrentViewIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= views.current.length) {
            clearInterval(interval);
            // After text fades out (15s) + 1s delay = 16s after view starts
            setTimeout(() => setShowNewButton(true), 500); // 1 second after text fades out
            return prevIndex; // Stay on the last view
          }
          // Activate text overlay for the new view
          setTextOverlayActive(true);
          setShowNewButton(false); // Hide button for new view
          clearTimeout(fadeOutTimeout);
          fadeOutTimeout = window.setTimeout(
            () => setTextOverlayActive(false),
            20000,
          ); // Fade out 5 seconds before next switch
          return nextIndex;
        }); 
      }, 25000); // 增加切换间隔从20秒到25秒，给相机更多时间完成平滑过渡
    };

    // Start auto-switching immediately
    startAutoSwitching();

    return () => {
      clearInterval(interval);
      clearTimeout(fadeOutTimeout);
    };
  }, []); // Run once on mount

  useEffect(() => {
    if (window.__updateCamera) {
      const { position, lookAt } = views.current[currentViewIndex];
      window.__updateCamera(position, lookAt);
    }
  }, [currentViewIndex]);

  const playView4Animation = useCallback(() => {
    if (window.__updateCamera) {
      const completeUpdate = {
        position: [0, 0, -6],
        lookAt: [0, 0, -15],
        midPosition: [0, 0, 13.709],
        midLookAt: [0, 0, -3],
      };
      window.__updateCamera(
        completeUpdate.position,
        completeUpdate.lookAt,
        {
          midPosition: completeUpdate.midPosition,
          midLookAt: completeUpdate.midLookAt,
        },
      );
    }
  }, []);

  const playView5Animation = useCallback(() => {
    if (window.__updateFog) {
      const startTime = Date.now();
      const duration = 5000;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.__updateFog(
          "#ffffff",
          lerp(10, 0, progress),
          lerp(100, 1, progress),
        );
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, []);

  const handleNewButtonClick = useCallback(() => {
    setShowNewButton(false); // Hide button after click
    playView4Animation();
    // No delay between 4 and 5
    playView5Animation();
  }, [playView4Animation, playView5Animation]);

  return (
    <div
      className="scene-container"
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <BackgroundMusic />

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        {/* Debug buttons - hidden in production */}
        {/* 视角4和视角5按钮已删除 */}
      </div>
      
      {/* 将Look4ti按钮放在屏幕中间位置 */}
      {showNewButton && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleNewButtonClick}
            style={{
              padding: "15px 30px",
              backgroundColor: "rgba(255, 255, 255, 0)", // No background
              color: "white",
              border: "1px solid white", // White border
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.5s ease, box-shadow 0.5s ease, opacity 0.5s ease",
              opacity: showNewButton ? 1 : 0,
              boxShadow: "none",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img 
              src="/src/assets/logoicon.png" 
              alt="Logo" 
              style={{
                width: "36px",
                height: "36px",
              }}
            />
            Look4ti，一起寻找金银岛
          </button>
        </div>
      )}
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        camera={{
          position: [-6.774, 0.835, 6.782],
          fov: 45,
          type: "PerspectiveCamera",
        }}
        onCreated={({ camera }) => {
          if (camera instanceof THREE.PerspectiveCamera) {
            camera.position.set(-6.774, 0.835, 6.782);
            camera.lookAt(0, 0, 7);
            camera.updateProjectionMatrix();
          }
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog
          attach="fog"
          args={["#000000", 10, 100]}
          ref={(fog) => {
            if (fog) {
              window.__updateFog = (
                color: string,
                near: number,
                far: number,
              ) => {
                fog.color = new Color(color);
                fog.near = near;
                fog.far = far;
              };
            }
          }}
        />
        <Lights />
        <CameraAnimation
          targetPosition={targetPosition}
          targetLookAt={targetLookAt}
        />
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
        />
        <Suspense fallback={null}>
          <SceneInfo
            onCameraTargetChange={(position, lookAt) => {
              setTargetPosition(position);
              setTargetLookAt(lookAt);
            }}
          />
          <WhiteFadeEffect
            isActive={fadeActive}
            onFadeComplete={() => setFadeActive(false)}
          />
          <TextOverlay
            title={viewTexts.current[currentViewIndex].title}
            body={viewTexts.current[currentViewIndex].body}
            isActive={textOverlayActive}
            fadeDuration={3000} // 3 seconds fade out
            typewriterSpeed={100} // 100ms per character for 5-second total duration
            offsetX={currentViewIndex === 0 ? "1000px" : "0px"}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
