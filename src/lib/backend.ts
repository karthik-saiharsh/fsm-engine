//@ts-nocheck
import { atom } from "jotai";

type Node = {
  x: number;
  y: number;
  radius: number;
  fill: string;
  id: number;
};

// Store for current editor state
export const editorState = atom("nil");

// Store for State Machine's States
export const Nodes: Node[] = atom([]);

// Store for Keeping track of currently active selected state
export const currentSelected = atom("nil");
