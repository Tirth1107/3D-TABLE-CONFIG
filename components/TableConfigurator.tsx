import React from 'react';
import { TableConfig, TableShape } from '../types';
import { MATERIALS, LEGS, SIZES, SHAPES, LEG_COLORS } from '../constants';

interface Props {
  config: TableConfig;
  onChange: (updates: Partial<TableConfig>) => void;
}

const TableConfigurator: React.FC<Props> = ({ config, onChange }) => {
  const totalPrice = config.size.price + config.material.priceModifier + config.legType.priceModifier;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 overflow-y-auto custom-scrollbar px-4 pt-14 pb-8 sm:px-6 md:px-8 md:pt-8 space-y-8 md:space-y-10">
      <header className="space-y-5">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">Customize Table</h1>

        <div className="bg-gray-50 rounded-3xl p-5 md:p-6 border border-gray-200">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">${totalPrice.toLocaleString()}</span>
          </div>
          <button className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm uppercase hover:bg-black transition-colors">
            Add To Quote
          </button>
        </div>
      </header>

      <div className="space-y-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Material</h3>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{config.material.name}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MATERIALS.map((mat) => (
              <button
                key={mat.id}
                onClick={() => onChange({ material: mat })}
                className={`group flex flex-col items-center p-2 rounded-2xl border-2 transition-colors ${
                  config.material.id === mat.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 bg-white hover:border-gray-200 shadow-sm'
                }`}
              >
                <div
                  className="w-full aspect-square rounded-xl mb-2 shadow-md relative overflow-hidden"
                  style={{ backgroundColor: mat.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                  {config.material.id === mat.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/10">
                      <div className="bg-indigo-600 p-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black text-gray-900 truncate w-full text-center tracking-tight">{mat.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Shape</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                onClick={() => onChange({ shape: shape as TableShape })}
                className={`py-3 rounded-xl border-2 text-[10px] font-black transition-colors tracking-widest uppercase ${
                  config.shape === shape ? 'border-indigo-600 bg-black text-white' : 'border-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Size</h3>
          <div className="grid grid-cols-1 gap-2.5">
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => onChange({ size })}
                className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-colors ${
                  config.size.id === size.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 bg-white hover:border-gray-200'
                }`}
              >
                <span className={`text-sm font-black tracking-tight ${config.size.id === size.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {size.label}
                </span>
                {config.size.id === size.id && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Leg Style</h3>
          <div className="grid grid-cols-1 gap-3">
            {LEGS.map((leg) => (
              <button
                key={leg.id}
                onClick={() => onChange({ legType: leg })}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-colors ${
                  config.legType.id === leg.id ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${config.legType.id === leg.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-300'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <span className={`font-black text-sm tracking-tight ${config.legType.id === leg.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {leg.name}
                  </span>
                </div>
                {leg.priceModifier > 0 && <span className="text-[10px] font-black text-indigo-600">+${leg.priceModifier}</span>}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Leg Color</h3>
          <div className="flex gap-4 flex-wrap">
            {LEG_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => onChange({ legColor: color.hex })}
                className="group flex flex-col items-center gap-2 transition-transform active:scale-90"
              >
                <div
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors ${
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
