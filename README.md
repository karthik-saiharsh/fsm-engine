# FSM Engine

A web-based tool for creating, visualizing, and managing Finite State Machines (FSMs). Built with React, TypeScript, and Konva for an interactive canvas experience.

![FSM Engine]()

## Features

-   **Interactive Canvas Editor**: Create and manipulate FSMs on a zoomable, pannable canvas.
-   **Multiple Modes**:
    -   **Create**: Click on the canvas to add new states.
    -   **Select**: Drag states to reposition them.
    -   **Connect**: Click two states to create a directed transition. Supports self-loops.
    -   **Delete**: Remove states with a single click.
    -   **Grab**: Pan across the canvas to navigate your diagram.
-   **State Types**: Differentiate between `initial`, `intermediate`, and `final` states, each with a distinct visual representation.
-   **Dynamic Transitions**: Arrows automatically adjust their position and curve as you move states.
-   **Atomic State Management**: Uses Jotai for a predictable and efficient state model.

## Tech Stack

-   **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **State Management**: [Jotai](https://jotai.org/)
-   **Canvas Rendering**: [React Konva](https://konvajs.org/docs/react/index.html)
-   **Styling**: Tailwindcss

## Project Structure

```
src/
├── App.tsx             # Main application component
├── main.tsx            # React entry point
├── index.css           # Global styles
├── components/
│   ├── Editor.tsx      # The core canvas and logic for FSM manipulation
│   ├── Dock.tsx        # UI for switching between editor modes
│   ├── Settings.tsx    # Panel for adjusting state properties
│   └── ...             # Other UI components
└── lib/
    └── backend.ts      # Jotai atoms and type definitions for global state
```

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/karthik-saiharsh/fsm-engine.git
    cd fsm-engine
    ```

2.  **Install Dependencies:**
    *(Requires [pnpm](https://pnpm.io/))*
    ```bash
    pnpm install
    ```

3.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:5173`.

## How to Use

1.  **Select a mode** from the dock at the bottom of the screen.
2.  **Create Mode**: Click anywhere on the canvas to add a state. The first state is automatically set as the `initial` state.
3.  **Connect Mode**: Click on a source state, then a destination state, to draw a transition arrow. Clicking the same state twice creates a self-loop.
4.  **Select Mode**: Click and drag any state to move it. Transitions will update automatically.
5.  **Delete Mode**: Click on a state to remove it.

## Future Roadmap

-   [ ] Add labels to transitions.
-   [ ] Implement an "Undo/Redo" feature.
-   [ ] Export the FSM to JSON or an image format (PNG/SVG).
-   [ ] Import an FSM from a JSON file.
-   [ ] Implement algorithm to Automatically convert a NFA to a DFA
-   [ ] Implement algorithm to Automatically convert a NFA to a DFA
-   [ ] Add support for various types of FSMs like Meelay and Moore Machines