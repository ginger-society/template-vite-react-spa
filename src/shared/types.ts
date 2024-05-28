export type MarkerType = 'triangle' | 'rectangle' | 'circle' | 'hexagon';


export interface Block {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
  rows: number; // Number of rows for each block
}

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