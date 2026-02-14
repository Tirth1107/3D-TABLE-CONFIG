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
  BakeShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import { TableConfig } from '../types';

interface ModelProps {
  config: TableConfig;
}

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50 p-4">
          <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-red-100 max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Renderer Error</h2>
            <p className="text-sm text-gray-500 mb-4">The 3D view could not load.</p>
            <button onClick={() => window.location.reload()} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold">
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Loading model...</span>
    </div>
  </Html>
);

const TableModel: React.FC<ModelProps> = ({ config }) => {
  const [width, depth, height] = config.size.dimensions;

  const tabletopGeometry = useMemo(() => {
    let geo: THREE.BufferGeometry;
    const thickness = 0.04;

    switch (config.shape) {
      case 'Oval': {
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
          bevelSegments: 12,
        });
        geo.rotateX(Math.PI / 2);
        break;
      }
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
          bevelSegments: 16,
        });
        geo.rotateX(Math.PI / 2);
        break;
      }
      default:
        geo = new THREE.BoxGeometry(width, thickness, depth);
    }

    return geo;
  }, [config.shape, width, depth]);

  return (
    <group>
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
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
              <mesh key={i} rotation={[0.55, angle, 0]} position={[Math.sin(angle) * 0.12, 0, Math.cos(angle) * 0.12]} castShadow frustumCulled={false}>
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
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex flex-col gap-3">
          <button
            onClick={resetView}
            className="group w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white hover:bg-black transition-colors flex items-center justify-center pointer-events-auto"
            title="Reset Camera"
            aria-label="Reset camera"
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>

        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true,
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <PerspectiveCamera makeDefault position={[4, 3.5, 4]} fov={30} near={0.1} far={1000} />

          <Suspense fallback={<LoadingFallback />}>
            <Environment preset="studio" intensity={1} />

            <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.05}>
              <Center top>
                <TableModel config={config} />
              </Center>
            </Float>

            <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={15} blur={2.5} far={5} />

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
      </SceneErrorBoundary>
    </div>
  );
};

export default TableViewer;
