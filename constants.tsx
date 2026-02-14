
import { TableMaterial, TableLeg, TableSize } from './types';

export const MATERIALS: TableMaterial[] = [
  { id: 'oak', name: 'Natural Oak', type: 'Wood', color: '#d2b48c', priceModifier: 0 },
  { id: 'walnut', name: 'Walnut', type: 'Wood', color: '#5d4037', priceModifier: 200 },
  { id: 'ceramic-black', name: 'Calacatta Black', type: 'Ceramic', color: '#1a1a1a', priceModifier: 500 },
  { id: 'ceramic-white', name: 'Calacatta White', type: 'Ceramic', color: '#f5f5f5', priceModifier: 450 },
  { id: 'ceramic-green', name: 'Verde Alpi', type: 'Ceramic', color: '#1b4d3e', priceModifier: 600 },
  { id: 'glass-smoke', name: 'Smoked Glass', type: 'Glass', color: '#333333', priceModifier: 300 },
];

export const LEGS: TableLeg[] = [
  { id: 'x-leg', name: 'Cross Leg', priceModifier: 0 },
  { id: 'spider-leg', name: 'Spider Leg', priceModifier: 150 },
  { id: 'u-leg', name: 'U-Leg', priceModifier: 80 },
];

export const SIZES: TableSize[] = [
  { id: 's', label: '180 x 90 cm', dimensions: [1.8, 0.9, 0.75], price: 1599 },
  { id: 'm', label: '200 x 100 cm', dimensions: [2.0, 1.0, 0.75], price: 1799 },
  { id: 'l', label: '220 x 110 cm', dimensions: [2.2, 1.1, 0.75], price: 1999 },
  { id: 'xl', label: '240 x 120 cm', dimensions: [2.4, 1.2, 0.75], price: 2299 },
];

export const SHAPES = ['Oval', 'Rectangular', 'Round', 'Pebble', 'Square'] as const;

export const LEG_COLORS = [
  { id: 'black', name: 'Matt Black', hex: '#111111' },
  { id: 'white', name: 'Signal White', hex: '#f0f0f0' },
  { id: 'steel', name: 'Brushed Steel', hex: '#8e8e8e' },
];
