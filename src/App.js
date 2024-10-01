import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import './App.css'; // Ensure this CSS file exists with the styles below

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const App = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (
        file.type === 'model/gltf-binary' ||
        file.type === 'model/gltf+json' ||
        file.name.endsWith('.glb')
      ) {
        const url = URL.createObjectURL(file);
        setModelUrl(url);
      } else {
        alert('Please drop a valid GLB file.');
      }
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ height: '100vh', width: '100vw' }}
      >
        {/* Blurred Environment */}
        <Environment
          files="https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr"
          backgroundBlurriness={0.5} 
          background
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={true} />
        {modelUrl && <Model url={modelUrl} />}
      </Canvas>
      
      {/* Overlay Instructions */}
      <div className="overlay">
        {!modelUrl ? (
          <>
            <h1>3D Model Viewer</h1>
            <p>Drag and drop a GLB file anywhere on the screen to view your 3D model.</p>
          </>
        ) : (
          <>
            <h1>3D Model Loaded</h1>
            <p>You can drag and drop another GLB file to replace the current model.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;


