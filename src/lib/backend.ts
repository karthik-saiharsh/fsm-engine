//@ts-nocheck
import { atom } from "jotai";

type nodeTransition = {
  from: string;
  to: string;
  name: string;
  trID: string;
}

type Node = {
  x: number;
  y: number;
  radius: number;
  fill: string;
  id: number;
  strokeWidth: number;
  strokeColor: string;
  name: string;
  type: "initial" | "final" | "intermediate";
  transitions: nodeTransition[];
};

type Arrow = {
  x: number;
  y: number;
  points: number[];
  stroke: string;
  strokeWidth: string;
}

// Store for current editor state
export const editorState = atom("nil");

// Store for State Machine's States
export const Nodes: Node[] = atom([]);

// Store for Keeping track of currently active selected state
export const currentSelected = atom("nil");

// Alert Message
export const alert = atom("nil");

// Store for State transitions
export const arrows = atom([]);

// Store for tracking connections
export const arrowStates = atom(undefined);

// Store to manage visibility of save actions editor
export const saveFSMAtom = atom(false);

// Track the node whose controls were changed most recently
export const recentStateSave = atom("nil");

// Keep track of starting state
export const start_state = atom("nil");