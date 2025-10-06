import { Vector3 } from 'three';
import { useState, useEffect } from 'react';

interface CameraControlsProps {
  position: Vector3;
  lookAt: Vector3;
  fov: number;
  onUpdate: (position: Vector3, lookAt: Vector3, fov: number) => void;
}

export function CameraControls({ position, lookAt, fov, onUpdate }: CameraControlsProps) {
  const [editValues, setEditValues] = useState({
    viewVector: {
      distance: position.length(),
      azimuth: Math.atan2(position.x, position.z) * 180 / Math.PI,
      elevation: Math.asin(position.y / position.length()) * 180 / Math.PI
    },
    fov: fov
  });

  useEffect(() => {
    setEditValues({
      viewVector: {
        distance: position.length(),
        azimuth: Math.atan2(position.x, position.z) * 180 / Math.PI,
        elevation: Math.asin(position.y / position.length()) * 180 / Math.PI
      },
      fov: fov
    });
  }, [position, lookAt, fov]);

  const updatePositionFromVector = (distance: number, azimuth: number, elevation: number) => {
    const newLookAt = lookAt.clone();
    const azimuthRad = azimuth * Math.PI / 180;
    const elevationRad = elevation * Math.PI / 180;
    
    const x = distance * Math.sin(azimuthRad) * Math.cos(elevationRad);
    const y = distance * Math.sin(elevationRad);
    const z = distance * Math.cos(azimuthRad) * Math.cos(elevationRad);
    
    const newPosition = new Vector3(x, y, z);
    onUpdate(newPosition, lookAt.clone(), fov);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: '20px',
      borderRadius: '10px',
      color: 'white',
      zIndex: 2000,
      minWidth: '250px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(5px)',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid white',
        paddingBottom: '5px'
      }}>
        <h3 style={{ margin: 0 }}>相机参数信息</h3>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>位置</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>X:</span>
          <input
            type="text"
            value={position.x.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <span>Y:</span>
          <input
            type="text"
            value={position.y.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <span>Z:</span>
          <input
            type="text"
            value={position.z.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>观察点</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>X:</span>
          <input
            type="text"
            value={lookAt.x.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <span>Y:</span>
          <input
            type="text"
            value={lookAt.y.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <span>Z:</span>
          <input
            type="text"
            value={lookAt.z.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>视角向量</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>距离:</span>
          <input
            type="number"
            value={editValues.viewVector.distance}
            onChange={(e) => {
              const newDistance = Number(e.target.value);
              updatePositionFromVector(
                newDistance,
                editValues.viewVector.azimuth,
                editValues.viewVector.elevation
              );
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <span>方位角:</span>
          <input
            type="number"
            value={editValues.viewVector.azimuth}
            onChange={(e) => {
              const newAzimuth = Number(e.target.value);
              updatePositionFromVector(
                editValues.viewVector.distance,
                newAzimuth,
                editValues.viewVector.elevation
              );
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <span>仰角:</span>
          <input
            type="number"
            value={editValues.viewVector.elevation}
            onChange={(e) => {
              const newElevation = Number(e.target.value);
              updatePositionFromVector(
                editValues.viewVector.distance,
                editValues.viewVector.azimuth,
                newElevation
              );
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>视场角 (FOV)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', fontSize: '14px' }}>
          <span>角度:</span>
          <input
            type="number"
            value={editValues.fov}
            onChange={(e) => {
              const newFov = Number(e.target.value);
              setEditValues(prev => ({
                ...prev,
                fov: newFov
              }));
              onUpdate(position, lookAt, newFov);
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
          <input
            type="text"
            value={fov.toFixed(3)}
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              padding: '2px 5px'
            }}
          />
        </div>
      </div>
    </div>
  );
}