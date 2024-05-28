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
  marker?: "triangle" | "square" | "circle" | "hexagon"; // Specify the marker types
  label?: string; // Add a label to the connection
}