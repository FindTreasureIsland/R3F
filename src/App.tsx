import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { LoopRepeat, Vector3, Euler } from "three";
import { InfoPanel } from "./components/InfoPanel";
import "./App.css";
function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);
  const fadeInterval = useRef(undefined);
  const fadeVolume = (start, end, duration) => {
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
    fadeInterval.current = setInterval(() => {
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
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0;
          await audioRef.current.play();
          fadeVolume(0, 0.5, 2000);
        } catch {
          console.log("Auto-play was prevented");
          setIsPlaying(false);
        }
      }
    };
    playAudio();
    return () => {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
      }
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
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: isPlaying ? "#4CAF50" : "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        {" "}
        {isPlaying ? (
          <>
            {" "}
            <span style={{ fontSize: "20px" }}>🔊</span> 音乐开启{" "}
          </>
        ) : (
          <>
            {" "}
            <span style={{ fontSize: "20px" }}>🔇</span> 音乐关闭{" "}
          </>
        )}{" "}
      </button>{" "}
    </>
  );
}
interface ModelProps {
  onInfoUpdate: (info: {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
  }) => void;
}
function Model({ onInfoUpdate }: ModelProps) {
  const { scene } = useGLTF("/models/spaceship.glb");
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      scene.scale.set(0.02, 0.02, 0.02);
      scene.position.set(0, 0, 0);
    }
  }, [scene]);

  useFrame(() => {
    if (modelRef.current) {
      const model = modelRef.current as any;
      model.rotation.y += 0.001;
      onInfoUpdate({
        position: model.position,
        rotation: model.rotation,
        scale: model.scale,
      });
    }
  });

  return <primitive ref={modelRef} object={scene} position={[0, 0, 0]} />;
}
function SceneInfo() {
  const [modelInfo, setModelInfo] = useState({
    position: new Vector3(0, 0, -10),
    rotation: new Euler(0, 0, 0),
    scale: new Vector3(0.02, 0.02, 0.02),
  });
  const [cameraInfo, setCameraInfo] = useState({
    position: new Vector3(0, 2, 12),
  });
  const { camera } = useThree();
  useFrame(() => {
    setCameraInfo({ position: camera.position.clone() });
  });
  return (
    <>
      {" "}
      <Model onInfoUpdate={setModelInfo} />{" "}
      <InfoPanel modelInfo={modelInfo} cameraInfo={cameraInfo} />{" "}
    </>
  );
}
function BlackHoleEffect() {
  return (
    <>
      {" "}
      <pointLight
        position={[-8, 0, 0]}
        intensity={10}
        distance={10}
        color="#ffffff"
      />{" "}
      <pointLight
        position={[-8, 0, 0]}
        intensity={500}
        distance={10}
        color="#ffffff"
      />{" "}
      <pointLight
        position={[-8, 2, 0]}
        intensity={500}
        distance={20}
        color="#ffffff"
      />{" "}
      <pointLight
        position={[-8, -2, 0]}
        intensity={200}
        distance={20}
        color="#ffffff"
      />{" "}
      <pointLight
        position={[-7, 1, 0]}
        intensity={150}
        distance={15}
        color="#ffffff"
      />{" "}
      <pointLight
        position={[-7, -1, 0]}
        intensity={150}
        distance={15}
        color="#ffffff"
      />{" "}
      <pointLight
        position={[-9, 0, 0]}
        intensity={150}
        distance={15}
        color="#ffffff"
      />{" "}
    </>
  );
}
function Lights() {
  return (
    <>
      {" "}
      <ambientLight intensity={0.2} />{" "}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />{" "}
      <directionalLight position={[-5, 3, 0]} intensity={1} />{" "}
      <BlackHoleEffect />{" "}
    </>
  );
}
function App() {
  return (
    <div className="scene-container">
      {" "}
      <BackgroundMusic />{" "}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 2, 12], fov: 45 }}
      >
        {" "}
        <color attach="background" args={["#000000"]} />{" "}
        <fog attach="fog" args={["#000000", 10, 100]} /> <Lights />{" "}
        <Suspense fallback={null}>
          {" "}
          <SceneInfo />{" "}
        </Suspense>{" "}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={20}
          zoomSpeed={0.5}
          panSpeed={0.8}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />{" "}
      </Canvas>{" "}
    </div>
  );
}
export default App;
useGLTF.preload("/models/spaceship.glb");
