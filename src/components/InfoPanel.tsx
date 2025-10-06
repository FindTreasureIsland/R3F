import { Vector3 } from 'three'

interface CameraInfo {
  position: Vector3;
  fov: number;
  lookAt: Vector3;
}

interface InfoPanelProps {
  cameraInfo: CameraInfo;
  onUpdate: () => void;
}

export function InfoPanel({ cameraInfo, onUpdate }: InfoPanelProps) {
  const formatNumber = (num: number) => Number(num.toFixed(3));

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '20px',
      borderRadius: '10px',
      color: 'white',
      zIndex: 1000,
      minWidth: '250px',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid white',
        paddingBottom: '5px'
      }}>
        <h3 style={{ margin: 0 }}>相机参数</h3>
        <button
          onClick={onUpdate}
          style={{
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          更新信息
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>位置</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>X:</span><span>{formatNumber(cameraInfo.position.x)}</span>
          <span>Y:</span><span>{formatNumber(cameraInfo.position.y)}</span>
          <span>Z:</span><span>{formatNumber(cameraInfo.position.z)}</span>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>视场角 (FOV)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>角度:</span><span>{formatNumber(cameraInfo.fov)}°</span>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>视角向量</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>距离:</span><span>{formatNumber(cameraInfo.position.length())} 单位</span>
          <span>方位角:</span><span>{formatNumber(Math.atan2(cameraInfo.position.x, cameraInfo.position.z) * 180 / Math.PI)}°</span>
          <span>仰角:</span><span>{formatNumber(Math.asin(cameraInfo.position.y / cameraInfo.position.length()) * 180 / Math.PI)}°</span>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>观察点 (LookAt)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>X:</span><span>{formatNumber(cameraInfo.lookAt.x)}</span>
          <span>Y:</span><span>{formatNumber(cameraInfo.lookAt.y)}</span>
          <span>Z:</span><span>{formatNumber(cameraInfo.lookAt.z)}</span>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>其他信息</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>近平面:</span><span>0.1 单位</span>
          <span>远平面:</span><span>1000.0 单位</span>
          <span>纵横比:</span><span>{formatNumber(window.innerWidth / window.innerHeight)}</span>
        </div>
      </div>
    </div>
  )
} 