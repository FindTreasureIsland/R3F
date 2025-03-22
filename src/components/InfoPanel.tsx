import { Vector3, Euler } from 'three'

interface ModelInfo {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

interface CameraInfo {
  position: Vector3;
}

interface InfoPanelProps {
  modelInfo: ModelInfo;
  cameraInfo: CameraInfo;
}

export function InfoPanel({ modelInfo, cameraInfo }: InfoPanelProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <div style={{ marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '5px' }}>
        模型信息:
      </div>
      <div>位置:</div>
      <div>X: {modelInfo.position.x.toFixed(2)}</div>
      <div>Y: {modelInfo.position.y.toFixed(2)}</div>
      <div>Z: {modelInfo.position.z.toFixed(2)}</div>
      <div style={{ marginTop: '10px' }}>旋转角度:</div>
      <div>X: {(modelInfo.rotation.x * 180 / Math.PI).toFixed(2)}°</div>
      <div>Y: {(modelInfo.rotation.y * 180 / Math.PI).toFixed(2)}°</div>
      <div>Z: {(modelInfo.rotation.z * 180 / Math.PI).toFixed(2)}°</div>
      <div style={{ marginTop: '10px' }}>缩放比例:</div>
      <div>X: {modelInfo.scale.x.toFixed(3)}</div>
      <div>Y: {modelInfo.scale.y.toFixed(3)}</div>
      <div>Z: {modelInfo.scale.z.toFixed(3)}</div>
      <div style={{ marginTop: '15px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '5px' }}>
        相机信息:
      </div>
      <div>位置:</div>
      <div>X: {cameraInfo.position.x.toFixed(2)}</div>
      <div>Y: {cameraInfo.position.y.toFixed(2)}</div>
      <div>Z: {cameraInfo.position.z.toFixed(2)}</div>
    </div>
  )
} 