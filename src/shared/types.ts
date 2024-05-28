export enum MarkerType {
  Triangle = 'triangle',
  Rectangle = 'rectangle',
  Circle = 'circle',
  Hexagon = 'hexagon',
}

export interface Row {
  id: string,
  data: any
}

export interface Block {
  id: string;
  ref: React.RefObject<HTMLDivElement>;
  position: { top: number, left: number }
  rows: Row[]; // Number of rows for each block
  data: Record<string, any>
}

export type BlockData = {
  id: string;
  rows: Row[];
  position: { top: number; left: number };
  data: Record<string, any>
};

export interface Connection {
  block1Id: number;
  fromRow: number;
  block2Id: number;
  toRow: number;
  marker?: MarkerType; // Specify the marker types
  label?: string; // Add a label to the connection
}


export interface LegendItem {
  type: string;
  color: string;
  markerType: MarkerType;
}

export interface LegendProps {
  items: LegendItem[];
}

export interface LegendItemProps {
  item: {
    type: string;
    color: string;
    markerType: MarkerType;
  };
}

export enum EditorTypeEnum {
  ROW = 'row',
  BLOCK = 'block'
}