# FSM Engine

A web-based tool for creating, and visualizing, Finite State Machines (FSMs). Built with React, TypeScript, Tailwind CSS, Jotai, and React Konva for an interactive canvas experience.

<img width="2770" height="1522" alt="FSM Engine Demo" src="https://github.com/user-attachments/assets/8ebd2706-f122-41ce-84ed-8d0ec04c0c74" />

## Features

- Interactive Canvas Editor
  - Zoom and Pan across an infinite canvas
  - Smooth drag to reposition states
- Multiple Modes
  - Create: Click on the canvas to add new states
  - Select: Drag states to move them
  - Connect: Click two states to create a directed transition (supports self-loops)
  - Delete: Remove states with a single click
  - Grab: Move the Nodes
- State Types
  - initial, intermediate, final
- Dynamic Transitions
  - Arrows automatically adjust their position and curve as you move states
- Welcome/Tutorial Overlay
  - First-run walkthrough with short clips

## Try it at
https://fsm-engine.vercel.app

## Tech Stack

- Frontend: React + TypeScript
- State Management: Jotai
- Canvas: React Konva
- Styling: Tailwind CSS
- Tooling: Vite
- Icons: lucide-react

## Contributing

Contributions are welcome!
- Open issues for bugs or feature requests
- Submit pull requests for fixes or enhancements
- Discuss larger changes in an issue first

## Roadmap
- [ ] Undo/Redo
- [ ] Export Project to JSON
- [ ] Import Project from JSON
- [ ] Generate the transition table for a given NFA/DFA
- [ ] NFA → DFA conversion
- [ ] DFA minimization
- [ ] Validation and error hints (unreachable states, parse a regex)
- [ ] Keyboard shortcuts and accessibility improvements
