declare global {
  interface Window {
    __updateCamera?: (
      position: [number, number, number],
      lookAt: [number, number, number],
    ) => void;
    __updateFog?: (color: string, near: number, far: number) => void;
    __r3f?: {
      camera: THREE.PerspectiveCamera;
    };
  }
}
