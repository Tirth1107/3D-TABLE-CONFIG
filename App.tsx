
import React, { useState, useCallback } from 'react';
import TableViewer from './components/TableViewer';
import TableConfigurator from './components/TableConfigurator';
import { TableConfig } from './types';
import { MATERIALS, LEGS, SIZES, LEG_COLORS } from './constants';

const App: React.FC = () => {
  // Initial state for the configurator
  const [config, setConfig] = useState<TableConfig>({
    shape: 'Rectangular',
    material: MATERIALS[2], // Calacatta Black
    size: SIZES[1], // 200 x 100
    legType: LEGS[0], // Cross Leg
    legColor: LEG_COLORS[0].hex, // Black
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth update handler with safety
  const handleConfigChange = useCallback((updates: Partial<TableConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      // Ensure we don't accidentally set undefined states
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-screen h-[100dvh] overflow-hidden bg-[#fcfcfc] text-gray-900 selection:bg-indigo-100">
      
      {/* Dynamic Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-6 bg-white/80 backdrop-blur-xl border-b z-50">
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tighter leading-none">TIRTH<span className="text-indigo-600">JOSHI</span></span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configurator Demo</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-sm ${
            isMenuOpen ? 'bg-black text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          {isMenuOpen ? 'VIEW 3D' : 'CONFIGURE'}
        </button>
      </div>

      {/* Main Visualizer */}
      <main className="relative flex-1 h-full overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <TableViewer config={config} />
        </div>
        
        {/* Desktop Branding Overlay */}
        <div className="hidden md:block absolute top-12 left-12 z-20 pointer-events-none select-none">
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">
            TIRTH<span className="text-indigo-600">JOSHI</span>
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-[1.5px] bg-indigo-600"></div>
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.4em]">Interactive Demo</span>
          </div>
        </div>

        {/* Version Badge */}
        <div className="hidden lg:block absolute bottom-12 left-12 z-20 pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 bg-black text-white px-4 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-widest">v2.8.5 Stable</span>
            </div>
            <p className="text-[10px] font-bold text-gray-300 ml-4">Advanced PBR Rendering Engine</p>
          </div>
        </div>
      </main>

      {/* Configuration Side Panel */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:inset-auto md:w-[460px] lg:w-[500px] h-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) bg-white
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button - Integrated into panel side */}
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden absolute -left-14 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md w-10 h-24 rounded-l-3xl shadow-2xl border-l border-y flex items-center justify-center transition-all active:scale-95"
        >
          <svg className="w-6 h-6 text-indigo-600 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <TableConfigurator config={config} onChange={handleConfigChange} />
      </aside>

      <style>{`
        canvas { touch-action: none; outline: none; }
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; background: #fff; }
        .config-panel-enter { transform: translateX(100%); }
        .config-panel-enter-active { transform: translateX(0); transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default App;
