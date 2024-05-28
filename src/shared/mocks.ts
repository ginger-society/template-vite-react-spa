import React from "react";
import { Block, Connection } from "./types";

export const mockBlocks: { [key: number]: Block } = {
  1: { id: 1, ref: React.createRef(), rows: 4 },
  2: { id: 2, ref: React.createRef(), rows: 3 },
  3: { id: 3, ref: React.createRef(), rows: 2 },
  4: { id: 4, ref: React.createRef(), rows: 7 },
  // Add more blocks as needed
}

export const mockConnections: Connection[] = [
  {
    block1Id: 1,
    fromRow: 0,
    block2Id: 2,
    toRow: 0,
    marker: "circle",
    label: "User (tenant_id) -> Tenant  ",
  },
  {
    block1Id: 2,
    fromRow: 1,
    block2Id: 3,
    toRow: 0,
    marker: "triangle",
    label: "B to C",
  },
  {
    block1Id: 3,
    fromRow: 1,
    block2Id: 1,
    toRow: 2,
    marker: "square",
    label: "C to A",
  },
  {
    block1Id: 3,
    fromRow: 1,
    block2Id: 4,
    toRow: 2,
    marker: "hexagon",
    label: "C to A",
  },
  // Add more connections as needed
]