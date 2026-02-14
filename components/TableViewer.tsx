
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  Center,
  PerspectiveCamera,
  Float,
  Html,
  Preload,
  BakeShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { TableConfig } from '../types';

interface ModelProps {
  config: TableConfig;
}

interface ErrorBoundaryProps {
  // Fix: Make children optional to satisfy JSX expectations and avoid property missing errors
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fix: Simplified SceneErrorBoundary to resolve "props does not exist" and "children missing" errors
class SceneErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">
          <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-red-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Renderer Error</h2>
            <p className="text-gray-500 mb-4">The 3D engine encountered an unexpected issue.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Restart Configurator</button>
          </div>
        </div>
      );
    }
    // Fix: Access children through props property of class component
    return this.props.children;
  }
}

const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center gap-4 bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">Tirth Joshi Demo</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 animate-pulse">Syncing 3D Assets...</span>
      </div>
    </div>
  </Html>
);

const TableModel: React.FC<ModelProps> = ({ config }) => {
  const [width, depth, height] = config.size.dimensions;

  const tabletopGeometry = useMemo(() => {
    let geo: THREE.BufferGeometry;
    const thickness = 0.04;
    
    switch (config.shape) {
      case 'Oval':
        const ovalShape = new THREE.Shape();
        const r = depth / 2;
        const l = width - depth;
        ovalShape.absarc(l / 2, 0, r, -Math.PI / 2, Math.PI / 2, false);
        ovalShape.absarc(-l / 2, 0, r, Math.PI / 2, -Math.PI / 2, false);
        geo = new THREE.ExtrudeGeometry(ovalShape, { 
          depth: thickness, 
          bevelEnabled: true, 
          bevelThickness: 0.01, 
          bevelSize: 0.01, 
          bevelSegments: 12 
        });
        geo.rotateX(Math.PI / 2);
        break;
      case 'Round':
        geo = new THREE.CylinderGeometry(width / 2, width / 2, thickness, 128);
        break;
      case 'Square':
        geo = new THREE.BoxGeometry(width, thickness, width);
        break;
      case 'Pebble': {
        const shape = new THREE.Shape();
        shape.moveTo(0, depth * 0.4);
        shape.bezierCurveTo(width * 0.4, depth * 0.5, width * 0.5, -depth * 0.2, 0, -depth * 0.4);
        shape.bezierCurveTo(-width * 0.5, -depth * 0.5, -width * 0.4, depth * 0.3, 0, depth * 0.4);
        geo = new THREE.ExtrudeGeometry(shape, { 
          depth: thickness, 
          bevelEnabled: true, 
          bevelThickness: 0.01, 
          bevelSize: 0.02, 
          bevelSegments: 16 
        });
        geo.rotateX(Math.PI / 2);
        break;
      }
      default: // Rectangular
        geo = new THREE.BoxGeometry(width, thickness, depth);
    }
    return geo;
  }, [config.shape, width, depth]);

  return (
    <group>
      {/* Tabletop - Added frustumCulled={false} to ensure it never disappears during movement */}
      <mesh geometry={tabletopGeometry} position={[0, height, 0]} castShadow receiveShadow frustumCulled={false}>
        <meshPhysicalMaterial 
          color={config.material.color} 
          roughness={config.material.type === 'Glass' ? 0.01 : 0.45}
          metalness={config.material.type === 'Ceramic' ? 0.15 : 0.05}
          transmission={config.material.type === 'Glass' ? 0.98 : 0}
          ior={1.52}
          thickness={0.05}
          specularIntensity={1.2}
          envMapIntensity={1.5}
          clearcoat={config.material.type === 'Ceramic' ? 1 : 0.2}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Leg Structures */}
      <group position={[0, height / 2, 0]}>
        {config.legType.id === 'x-leg' && (
          <group>
            <mesh rotation={[0.45, 0, 0]} castShadow frustumCulled={false}>
              <boxGeometry args={[0.07, height * 1.2, 0.04]} />
              <meshStandardMaterial color={config.legColor} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh rotation={[-0.45, 0, 0]} castShadow frustumCulled={false}>
              <boxGeometry args={[0.07, height * 1.2, 0.04]} />
              <meshStandardMaterial color={config.legColor} roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        )}
        {config.legType.id === 'spider-leg' && (
           <group>
             {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => (
                <mesh key={i} rotation={[0.55, angle, 0]} position={[Math.sin(angle)*0.12, 0, Math.cos(angle)*0.12]} castShadow frustumCulled={false}>
                  <cylinderGeometry args={[0.015, 0.025, height * 1.15, 16]} />
                  <meshStandardMaterial color={config.legColor} roughness={0.2} metalness={0.9} />
                </mesh>
             ))}
           </group>
        )}
        {config.legType.id === 'u-leg' && (
          <group>
            {[1, -1].map((side) => (
              <group key={side} position={[width * 0.35 * side, 0, 0]}>
                <mesh position={[0, 0, 0]} castShadow frustumCulled={false}>
                   <boxGeometry args={[0.05, height, depth * 0.6]} />
                   <meshStandardMaterial color={config.legColor} metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Visual cutout effect for 'U' leg */}
                <mesh position={[0, 0.05, 0]} frustumCulled={false}>
                   <boxGeometry args={[0.055, height * 0.85, depth * 0.5]} />
                   <meshBasicMaterial color="#fcfcfc" />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};

const TableViewer: React.FC<ModelProps> = ({ config }) => {
  const controlsRef = useRef<any>(null);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="w-full h-full bg-[#fcfcfc] relative overflow-hidden">
      <SceneErrorBoundary>
        {/* Dynamic HUD */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none space-y-4">
          <div className="bg-white/95 backdrop-blur-3xl px-6 py-3 rounded-[2rem] shadow-2xl border border-gray-100 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 pointer-events-auto cursor-default">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-ping absolute opacity-40"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-600 relative"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Ultra HD Render</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Procedural V-Sync Optimized</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="absolute top-8 right-8 z-20 flex flex-col gap-4">
          <button 
            onClick={resetView}
            className="group w-14 h-14 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white hover:bg-black transition-all duration-300 flex items-center justify-center pointer-events-auto"
            title="Recenter Camera"
          >
            <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-all duration-500 transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>

        <Canvas 
          shadows 
          dpr={[1, 2]} 
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Increased Far clipping plane to 1000 to prevent disappearing */}
          <PerspectiveCamera makeDefault position={[4, 3.5, 4]} fov={30} near={0.1} far={1000} />
          
          <Suspense fallback={<LoadingFallback />}>
            <Environment preset="studio" intensity={1} />
            
            <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.05}>
              <Center top>
                <TableModel config={config} />
              </Center>
            </Float>

            <ContactShadows 
              position={[0, -0.01, 0]} 
              opacity={0.3} 
              scale={15} 
              blur={2.5} 
              far={5} 
            />

            <ambientLight intensity={0.6} />
            <spotLight 
              position={[10, 15, 10]} 
              angle={0.3} 
              penumbra={1} 
              intensity={400} 
              castShadow 
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />
            <Preload all />
            <BakeShadows />
          </Suspense>

          {/* Standard OrbitControls - Removed conflicting PresentationControls */}
          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            enablePan={false} 
            minDistance={1.5} 
            maxDistance={12}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Canvas>

        {/* Viewport Overlay Hints */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-8 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 360 Rotation
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Smooth Zoom
          </div>
        </div>
      </SceneErrorBoundary>
    </div>
  );
};

export default TableViewer;
