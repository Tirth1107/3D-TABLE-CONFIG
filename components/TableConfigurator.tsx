
import React from 'react';
import { TableConfig, TableShape, TableMaterial, TableLeg, TableSize } from '../types';
import { MATERIALS, LEGS, SIZES, SHAPES, LEG_COLORS } from '../constants';

interface Props {
  config: TableConfig;
  onChange: (updates: Partial<TableConfig>) => void;
}

const TableConfigurator: React.FC<Props> = ({ config, onChange }) => {
  const totalPrice = config.size.price + config.material.priceModifier + config.legType.priceModifier;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 overflow-y-auto custom-scrollbar p-8 space-y-12">
      <header>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">Customise</h1>
            <div className="flex items-center gap-2">
               <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">Dining Series 01</span>
               <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
               <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Handmade</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 ring-1 ring-gray-200 shadow-inner">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-5xl font-black text-gray-900 tracking-tighter">€{totalPrice.toLocaleString()}</span>
            <span className="text-gray-400 line-through text-lg font-bold">€{(totalPrice * 1.15).toFixed(0)}</span>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-5 items-center px-2 bg-green-100 text-green-700 rounded-md text-[9px] font-black uppercase tracking-widest">Premium Build</div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Free Global Shipping</p>
          </div>
          
          <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-black transition-all transform hover:-translate-y-1 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] active:scale-[0.98]">
            Order Configuration
          </button>
        </div>
      </header>

      <div className="space-y-12 pb-20">
        {/* Material */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">01 / Texture Selection</h3>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{config.material.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {MATERIALS.map((mat) => (
              <button
                key={mat.id}
                onClick={() => onChange({ material: mat })}
                className={`group flex flex-col items-center p-2 rounded-2xl border-2 transition-all duration-500 ${
                  config.material.id === mat.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 bg-white hover:border-gray-200 shadow-sm'
                }`}
              >
                <div 
                  className="w-full aspect-square rounded-[1.25rem] mb-3 shadow-md relative overflow-hidden" 
                  style={{ backgroundColor: mat.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                  {config.material.id === mat.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/10">
                      <div className="bg-indigo-600 p-1.5 rounded-full shadow-2xl">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black text-gray-900 truncate w-full text-center tracking-tight">{mat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Shape */}
        <section>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">02 / Geometric Shape</h3>
          <div className="grid grid-cols-3 gap-3">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                onClick={() => onChange({ shape: shape as TableShape })}
                className={`py-4 rounded-2xl border-2 text-[10px] font-black transition-all tracking-widest uppercase ${
                  config.shape === shape ? 'border-indigo-600 bg-black text-white' : 'border-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </section>

        {/* Size */}
        <section>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">03 / Dimension Scale</h3>
          <div className="grid grid-cols-1 gap-3">
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => onChange({ size })}
                className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 transition-all ${
                  config.size.id === size.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-black tracking-tight ${config.size.id === size.id ? 'text-indigo-600' : 'text-gray-900'}`}>{size.label}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Full Capacity Setup</span>
                </div>
                {config.size.id === size.id && <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-2xl shadow-indigo-600"></div>}
              </button>
            ))}
          </div>
        </section>

        {/* Leg Style */}
        <section>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">04 / Structural Base</h3>
          <div className="grid grid-cols-1 gap-4">
            {LEGS.map((leg) => (
              <button
                key={leg.id}
                onClick={() => onChange({ legType: leg })}
                className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-500 ${
                  config.legType.id === leg.id ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${config.legType.id === leg.id ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-300'}`}>
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className={`font-black text-sm tracking-tight ${config.legType.id === leg.id ? 'text-indigo-600' : 'text-gray-900'}`}>{leg.name}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Precision Steel Frame</span>
                  </div>
                </div>
                {leg.priceModifier > 0 && <span className="text-[10px] font-black text-indigo-600">+{leg.priceModifier}€</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Frame Finish */}
        <section className="pb-12">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">05 / Material Finish</h3>
          <div className="flex gap-6">
            {LEG_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => onChange({ legColor: color.hex })}
                className={`group flex flex-col items-center gap-3 transition-transform active:scale-90`}
              >
                <div 
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    config.legColor === color.hex ? 'border-indigo-600 bg-indigo-50 p-1.5' : 'border-transparent'
                  }`}
                >
                  <div 
                    className="w-full h-full rounded-full shadow-lg border border-black/5" 
                    style={{ backgroundColor: color.hex }}
                  />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${config.legColor === color.hex ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TableConfigurator;
