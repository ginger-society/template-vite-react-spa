import { LegendConfigs, LegendItemT } from "@/components/atoms/Legend/types";
import { FunctionComponent } from "react";

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


export interface LegendProps {
  items: LegendConfigs;
}

export interface LegendItemProps {
  item: LegendItemT;
  marker: MarkerType
}

export enum EditorTypeEnum {
  ROW = 'row',
  BLOCK = 'block'
}

export interface EditorData {
  rowIndex: number | undefined;
  blockId: string;
}

export interface UMLEditorProps {
  setBlocks: React.Dispatch<React.SetStateAction<{
    [key: string]: Block;
  }>>
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>
  blocks: { [key: string]: Block }
  connections: Connection[]
  legendConfigs: LegendConfigs
  RowEditor: FunctionComponent<{ editorData: EditorData }>
  BlockEditor: FunctionComponent<{ editorData: EditorData }>
  RowRenderer?: FunctionComponent<{ rowData: Row }>
}