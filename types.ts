
export type TableShape = 'Oval' | 'Rectangular' | 'Round' | 'Pebble' | 'Square';
export type MaterialType = 'Wood' | 'Ceramic' | 'HPL' | 'Glass';

export interface TableMaterial {
  id: string;
  name: string;
  type: MaterialType;
  color: string;
  textureUrl?: string;
  priceModifier: number;
}

export interface TableLeg {
  id: string;
  name: string;
  priceModifier: number;
}

export interface TableSize {
  id: string;
  label: string;
  dimensions: [number, number, number]; // [width, depth, height] in meters
  price: number;
}

export interface TableConfig {
  shape: TableShape;
  material: TableMaterial;
  size: TableSize;
  legType: TableLeg;
  legColor: string;
}
