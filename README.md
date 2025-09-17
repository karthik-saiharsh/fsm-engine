# FSM Engine

A web-based tool for creating, and visualizing, Finite State Machines (FSMs). Built with React, TypeScript, Tailwind CSS, Jotai, and React Konva for an interactive canvas experience.

<!-- ![FSM Engine Screenshot](./.github/screenshot.png) -->

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
- [ ] NFA → DFA conversion
- [ ] DFA minimization
- [ ] Validation and error hints (unreachable states, parse a regex)
- [ ] Keyboard shortcuts and accessibility improvements

## License
<!--Yet to add a license-->