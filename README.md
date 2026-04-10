<div align="center">

# ✦ FSM Engine

**A visual, interactive toolkit for building and simulating Finite State Machines.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Built with Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Bun](https://img.shields.io/badge/Bun-Runtime-f9f1e1?logo=bun&logoColor=000)](https://bun.sh)

Design, connect, and explore DFAs, NFAs, and free-form state machines — all from your browser.

[**Try it Live →**](https://fsm-engine-v3.vercel.app)

<br/>

<img width="100%" alt="FSM Engine – Interactive Canvas Editor" src="https://github.com/user-attachments/assets/4e85ac97-f47b-46ad-88b5-0760492dc26b" />

</div>

<br/>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Engine API](#engine-api)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

**FSM Engine** is an open-source, web-based tool for creating, editing, and visualizing Finite State Machines. It pairs a powerful, **framework-agnostic TypeScript engine** (`@fsm/engine`) with a rich, canvas-driven **Svelte 5 frontend** — giving you both a programmatic API and a visual editor in a single monorepo.

Whether you're a student learning automata theory, an educator preparing a lecture, or an engineer prototyping state-driven logic, FSM Engine gets you from concept to diagram in seconds.

---

## Features

### 🎨 Interactive Canvas Editor
- **Infinite canvas** with smooth zoom & pan (scroll / pinch / trackpad)
- **Drag-to-reposition** states anywhere on the canvas
- Light & dark theme with toggleable grid overlay (light and dark theme switching will be available soon)

### ⚡ Multiple Interaction Modes
| Mode | Description |
|:-------|:------------|
| **Add** | Click the canvas to place a new state |
| **Connect** | Click two states to draw a directed transition (self-loops supported) |
| **Remove** | Single-click to delete any state or transition |
| **Zoom** | Zoom in / out with buttons or scroll wheel |

### 🔧 State & Transition Customization
- Rename states and set custom fill colors via a right-click properties panel
- Mark any state as **Start**, **Intermediate**, or **End**
- Edit transition labels with inline controls

### 🗂️ Project Management
- **New / Open / Save** projects in a portable `.fsm` (JSON) format
- **Export to PNG** at 1×, 2×, or 3× resolution
- Project metadata (name, author, creation date) fully editable from the UI

### ✨ Auto Layout
- One-click **Dagre-powered** graph layout that smoothly animates nodes into an optimal arrangement

### 🧠 Headless Engine (`@fsm/engine`)
- Pure TypeScript, zero-DOM — use it in Node.js, Bun, Deno, or any JS runtime
- Supports **Free-form**, **DFA**, and **NFA** engine types (More coming soon)
- DFA mode enforces deterministic constraints and provides **string validation** with path tracing
- Efficient ID recycling via min-heap for states and transitions
- Full **save / load** serialization out of the box

---

## Architecture

FSM Engine is structured as a **Bun workspace monorepo** with a clear separation between the computational core and the visual layer:

```
┌─────────────────────────────────────────────────────────┐
│                       Monorepo Root                     │
│                   (bun workspaces)                      │
├──────────────┬──────────────────────┬───────────────────┤
│              │                      │                   │
│  packages/   │     apps/web         │    apps/docs      │
│   engine     │   (Svelte 5 + Konva) │  (Astro Starlight)│
│              │                      │                   │
│  ┌─────────┐ │  ┌────────────────┐  │  ┌─────────────┐  │
│  │FSMEngine│◄┼──│  store.svelte  │  │  │  Starlight  │  │
│  │  DFA    │ │  │  (Project)     │  │  │  Docs Site  │  │
│  │ types   │ │  │                │  │  │             │  │
│  └─────────┘ │  └───────┬────────┘  │  └─────────────┘  │
│              │          │           │                   │
│              │    ┌─────▼─────┐     │                   │
│              │    │  Editor   │     │                   │
│              │    │  Canvas   │     │                   │
│              │    │  (Konva)  │     │                   │
│              │    └───────────┘     │                   │
└──────────────┴──────────────────────┴───────────────────┘
```

**Key design decisions**:
- The **engine** package has zero UI dependencies — it can be consumed independently as a library.
- The **web** app uses Svelte 5 runes (`$state`, `$effect`, `$derived`) with `SvelteMap` for fine-grained reactive state management.
- Canvas rendering is powered by **Konva** via `svelte-konva`, giving hardware-accelerated 2D drawing.
- The engine's internal `Map<number, State>` store is shared by reference with the Svelte frontend's reactive `SvelteMap`, keeping both layers synchronized with minimal overhead.

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Runtime** | [Bun](https://bun.sh) |
| **Language** | TypeScript 5 (strict mode) |
| **Frontend Framework** | [Svelte 5](https://svelte.dev) (Runes mode) |
| **Canvas** | [Konva](https://konvajs.org) + [svelte-konva](https://github.com/konvajs/svelte-konva) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn-svelte](https://shadcn-svelte.com) |
| **Graph Layout** | [@dagrejs/dagre](https://github.com/dagrejs/dagre) |
| **Icons** | [@lucide/svelte](https://lucide.dev) |
| **Bundler** | [Rolldown Vite](https://rolldown.rs) |
| **Documentation** | [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) |
| **Linting** | ESLint 9 + Prettier |
| **Git Hooks** | Husky + lint-staged |

---

## Getting Started

### Prerequisites

- [**Bun**](https://bun.sh) ≥ 1.3 (used as both package manager and runtime)

### Installation

```bash
# Clone the repository
git clone https://github.com/karthik-saiharsh/fsm-engine.git
cd fsm-engine

# Install all workspace dependencies
bun install
```

### Development

```bash
# Start the web editor (apps/web)
cd apps/web
bun run dev

# Start the documentation site (apps/docs)
cd apps/docs
bun run dev
```

### Build for Production

```bash
cd apps/web
bun run build
bun run preview    # Preview the production build locally
```

---

## Project Structure

```
fsm-engine/
├── packages/
│   └── engine/                  # @fsm/engine — headless FSM library
│       ├── FSMEngine.ts         # Base engine: states, transitions, save/load
│       ├── DFA.ts               # DFA subclass: alphabet enforcement, string validation
│       ├── index.ts             # Public API barrel export
│       └── utils/
│           └── types.ts         # Shared types: State, Transition, EngineTypes
│
├── apps/
│   ├── web/                     # Svelte 5 visual editor
│   │   ├── src/
│   │   │   ├── App.svelte       # Root component: Launch screen ↔ Editor
│   │   │   ├── app.css          # Design tokens (oklch), Geist font, Tailwind
│   │   │   └── lib/
│   │   │       ├── brain/       # State management layer
│   │   │       │   ├── store.svelte.ts   # Project singleton (engine + UI state)
│   │   │       │   ├── extras.svelte.ts  # Secondary reactive stores
│   │   │       │   └── types.ts          # Frontend-specific types
│   │   │       └── components/  # UI components
│   │   │           ├── Editor.svelte     # Konva canvas + rendering loop
│   │   │           ├── Dock.svelte       # Bottom toolbar (Add/Remove/Connect/Zoom)
│   │   │           ├── Launch.svelte     # Welcome / project picker screen
│   │   │           ├── Alert.svelte      # Notification overlay
│   │   │           ├── editor/           # TopBar, MachinePicker
│   │   │           ├── popus/            # NodeCustomizer, TransitionCustomizer, etc.
│   │   │           ├── generic/          # Window, ScreenSizeFallback
│   │   │           └── ui/              # shadcn-svelte primitives
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── svelte.config.js
│   │
│   └── docs/                    # Astro Starlight documentation site
│       ├── astro.config.mjs
│       └── src/content/docs/
│
├── package.json                 # Workspace root (bun workspaces)
├── tsconfig.json                # Shared TypeScript config
├── eslint.config.mts            # ESLint flat config
├── .prettierrc                  # Prettier formatting rules
└── .husky/pre-commit            # Pre-commit lint hook
```

---

## Engine API

The `@fsm/engine` package exposes two main classes that can be used **independently of the UI**:

### `FSMEngine` (Free-form)

```typescript
import { FSMEngine } from "@fsm/engine";

const fsm = new FSMEngine("MyStateMachine");

// Add states (returns a numeric reference ID)
const s0 = fsm.addState("q0");
const s1 = fsm.addState("q1");
const s2 = fsm.addState("q2");

// Mark state types
fsm.setStart(s0);
fsm.setEnd(s2);

// Add transitions
fsm.addTransition(s0, s1, "a");
fsm.addTransition(s1, s2, "b");
fsm.addTransition(s1, s1, "a");  // self-loop

// Query the machine
fsm.searchStates("q1");               // → [1]
fsm.searchTransition(s0, s1);         // → [0]
fsm.getTransitionsOn("a");            // → [0, 2]

// Serialize / Deserialize
const snapshot = fsm.saveProject();
fsm.loadProject(snapshot);
```

### `DFA` (Deterministic Finite Automaton)

```typescript
import { DFA } from "@fsm/engine";

const dfa = new DFA("BinaryStrings");

// Define language alphabet
dfa.addAlphabets("0", "1");

// Build states
const q0 = dfa.addState("q0");
const q1 = dfa.addState("q1");
dfa.setStartState(q0);
dfa.endState.add(q1);

// Add deterministic transitions
dfa.addTransition(q0, q1, "1");
dfa.addTransition(q0, q0, "0");
dfa.addTransition(q1, q1, "0");
dfa.addTransition(q1, q0, "1");

// Validate strings
dfa.validateString("1010");
// → { path: [0, 1, 1, 0], accepted: true }
```

> **DFA enforcement**: Adding a duplicate transition on the same alphabet from the same state will throw an error, guaranteeing determinism at the API level.

---

## Contributing

Contributions are welcome and greatly appreciated! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to your branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Run `bun run lint` before submitting to ensure code quality
- Discuss larger architectural changes in an issue first
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Pre-commit hooks (Husky + lint-staged) will auto-lint staged files

---

## Roadmap

- [x] Interactive canvas editor with zoom & pan
- [x] Add / Remove / Connect states & transitions
- [x] State types: Start, Intermediate, End
- [x] Project export / import (`.fsm` JSON format)
- [x] Export canvas as PNG (1×, 2×, 3×)
- [x] Auto layout (Dagre)
- [x] Dark / Light theme
- [x] DFA string validation with path tracing
- [ ] Transition table generation & display
- [ ] NFA → DFA subset construction
- [ ] DFA minimization
- [ ] Undo / Redo
- [ ] Validation & error hints (unreachable states, dead states)
- [ ] Regular expression → NFA conversion
- [ ] Keyboard shortcuts & accessibility improvements
- [ ] Collaborative editing

---

## License

This project is licensed under the **GNU General Public License v3.0**.

```
Copyright (C) 2026 Illindala Karthik Saiharsh

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

---

<div align="center">

**Built with ♥ by [Karthik Saiharsh](https://github.com/karthik-saiharsh) and [contributors](https://github.com/karthik-saiharsh/fsm-engine/graphs/contributors)**

[Report Bug](https://github.com/karthik-saiharsh/fsm-engine/issues) · [Request Feature or Ask/Share Something](https://github.com/karthik-saiharsh/fsm-engine/issues) · [Live Demo](https://fsm-engine-v3.vercel.app)

</div>
