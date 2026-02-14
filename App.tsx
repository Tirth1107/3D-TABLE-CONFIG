
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
    <div className="flex flex-col md:flex-row w-screen h-[100dvh] overflow-hidden bg-[#fcfcfc] text-gray-900">
      <div className="md:hidden flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tight leading-none">Luxe Table Configurator</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-colors ${
            isMenuOpen ? 'bg-black text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          {isMenuOpen ? 'View Model' : 'Customize'}
        </button>
      </div>

      <main className="relative flex-1 h-full overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <TableViewer config={config} />
        </div>
      </main>

      <aside className={`
        fixed inset-0 z-40 md:relative md:inset-auto md:w-[380px] lg:w-[440px] h-full transition-transform duration-500 ease-out bg-white
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden absolute right-4 top-4 bg-white w-9 h-9 rounded-full shadow border border-gray-200 flex items-center justify-center"
          aria-label="Close customization panel"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <TableConfigurator config={config} onChange={handleConfigChange} />
      </aside>

      <style>{`
        canvas { touch-action: none; outline: none; }
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; background: #fff; }
      `}</style>
    </div>
  );
};

export default App;
