//@ts-nocheck
import { atom } from "jotai";

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
};

// Store for current editor state
export const editorState = atom("nil");

// Store for State Machine's States
export const Nodes: Node[] = atom([]);

// Store for Keeping track of currently active selected state
export const currentSelected = atom("nil");

// Alert Message
export const alert = atom("nil");
