import React from "react";
import { Block, Connection, MarkerType } from "./types";

export const mockBlocks: { [key: number]: Block } = {
  1: { id: 1, ref: React.createRef(), rows: 4, position: { top: 100, left: 100 } },
  2: { id: 2, ref: React.createRef(), rows: 3, position: { top: 300, left: 500 } },
  3: { id: 3, ref: React.createRef(), rows: 2, position: { top: 500, left: 900 } },
  4: { id: 4, ref: React.createRef(), rows: 7, position: { top: 100, left: 300 } },
  // Add more blocks as needed
};

export const mockConnections: Connection[] = [
  {
    block1Id: 1,
    fromRow: 0,
    block2Id: 2,
    toRow: 0,
    marker: MarkerType.Circle,
    label: "User (tenant_id) -> Tenant  ",
  },
  {
    block1Id: 2,
    fromRow: 1,
    block2Id: 3,
    toRow: 0,
    marker: MarkerType.Triangle,
    label: "B to C",
  },
  {
    block1Id: 3,
    fromRow: 1,
    block2Id: 1,
    toRow: 2,
    marker: MarkerType.Rectangle,
    label: "C to A",
  },
  {
    block1Id: 3,
    fromRow: 1,
    block2Id: 4,
    toRow: 2,
    marker: MarkerType.Rectangle,
    label: "C to A",
  },
  // Add more connections as needed
]