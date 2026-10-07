/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import {
    DFA,
    EngineTypes,
    FSMEngine,
    type State,
    type Transition,
} from "@fsm/engine";
import dagre from "@dagrejs/dagre";
import type { KonvaMouseEvent, KonvaDragTransformEvent } from "svelte-konva";
import { SvelteMap } from "svelte/reactivity";
import {
    DockModes,
    type NodeLook,
    type PartialNodeProps,
    type ProjectData,
    type ProjectDetailsType,
    type TransitionProps,
} from "./types";
import { downloadFromUrl } from "./download";
import secondary_stores from "./extras.svelte";

const date = new Date();

/** Details of a project that has just been created */
function createDefaultDetails(type: EngineTypes): ProjectDetailsType {
    return {
        name: `FSM_Project_${date.toDateString()}`,
        author: "Unnamed Author",
        created: date.toDateString(),
        type,
    };
}

/**
 * This monolithic beast of a class has every detail of the current project.
 */
class Project {
    project_details = $state(createDefaultDetails(EngineTypes.FREE));

    theme = $state<"dark" | "light">("dark"); // UI Theme

    current_mode: DockModes = $state(DockModes.NIL); // Current chosen Dock Mode

    /****** TOGGLER VARIABLES ******/
    togglers = $state({
        show_launch: true,
        show_proj_details: false,
        show_node_customizer: false,
        show_tr_customizer: false,
    });
    /****** TOGGLER VARIABLES ******/

    /****** STATE MACHINE VARIABLES ******/
    nodes = new SvelteMap<number, State>(); // This stores the actual nodes
    transitions = new SvelteMap<number, Transition>(); // This stores the actual nodes

    // This stores the look and feel of the nodes for the frontend
    get defaultNodeLook(): NodeLook {
        return {
            color: this.theme === "dark" ? "#ffffff80" : "#00000030",
            stroke: this.theme === "dark" ? "#ffffff80" : "#00000080",
            radius: 40,
        };
    }
    node_properties = new SvelteMap<number, PartialNodeProps>();
    transition_properties = new SvelteMap<number, TransitionProps>();
    /****** STATE MACHINE VARIABLES ******/

    /****** BACKEND CLASSES ******/
    engine: FSMEngine | DFA; // The backend FSM Engine Class
    /****** BACKEND CLASSES ******/

    /**
     * Create a new project
     */
    constructor() {
        this.engine = new FSMEngine(this.project_details.name);
        this.bindEngineStores();
    }

    /**
     * Makes the engine use this class's Svelte maps as its stores, so that
     * changes made by the engine are picked up by the UI.
     * This has to be done again every time a new engine is created.
     */
    private bindEngineStores() {
        this.engine.setNodes(this.nodes);
        this.engine.setTransitions(this.transitions);
    }

    /************** BACKEND AND LOGIC RELATED METHODS  **************/

    /**
     * Toggle Theme of the app
     */
    toggleTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";
        document.getElementById("body")?.classList.toggle("dark");
    }

    /************** BACKEND AND LOGIC RELATED METHODS  **************/

    /**
     * Change Project Details
     */
    saveProjectDetails(project_details: typeof this.project_details) {
        if (this.project_details.name !== project_details.name) {
            // Update the name of the project if it has changed in the engine
            this.engine.name = project_details.name;
        }

        // Apply new project metadata values
        this.project_details = project_details;
    }

    /**
     * the @see node_properties store keeps track of look and feel properties of a node
     * However, it is not synchronized with the @see nodes store.
     * I could use a $effect(), or $derived(), but I, instead prefer to use this function that will
     * Synchronize both @see node_properties and @see nodes, and call this whenever changes are made to @see nodes
     */
    syncNodePropStore() {
        for (const key of this.node_properties.keys()) {
            if (!this.nodes.has(key)) {
                this.node_properties.delete(key);
            }
        }
    }

    /**
     * To sync transition store to transition properties store
     */
    syncTrPropStore() {
        for (const key of this.transition_properties.keys()) {
            if (!this.transitions.has(key)) {
                this.transition_properties.delete(key);
            }
        }
    }

    /** Exports the project as JSON and triggers a local download */
    exportProject() {
        const data: ProjectData = {
            frontend: {
                project_details: {
                    ...this.project_details,
                },
                theme: this.theme,
                nodes_properties: Array.from(
                    this.node_properties.entries()
                ).map(
                    ([id, props]) =>
                        [id, { ...props }] as [number, PartialNodeProps]
                ),
                transition_properties: Array.from(
                    this.transition_properties.entries()
                ).map(
                    ([id, props]) =>
                        [id, { ...props }] as [number, TransitionProps]
                ),
            },
            backend: this.engine.saveProject(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        downloadFromUrl(url, `${this.project_details.name || "project"}.fsm`);
        URL.revokeObjectURL(url);
    }

    /** Prompts user to upload a JSON file and restores the project */
    importProject() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".fsm,application/json";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const data = JSON.parse(await file.text()) as ProjectData;

                this.engine.loadProject(data.backend);

                this.project_details = {
                    ...data.frontend.project_details,
                };
                this.theme = data.frontend.theme;

                this.node_properties.clear();
                for (const [id, props] of data.frontend.nodes_properties) {
                    this.node_properties.set(id, { ...props });
                }

                this.transition_properties.clear();
                for (const [id, props] of data.frontend.transition_properties) {
                    this.transition_properties.set(id, { ...props });
                }

                // Keep UI + look-and-feel stores aligned with engine maps after load.
                this.syncNodePropStore();
                this.syncTrPropStore();

                document
                    .getElementById("body")
                    ?.classList.toggle("dark", this.theme === "dark");
            } catch (error) {
                console.error("Failed to parse project file", error);
                secondary_stores.openAlert("info", "Invalid project file.");
            }
        };
        input.click();
    }

    /************** KONVA AND FRONTEND RELATED METHODS  **************/

    /** What should be done when the Konva Stage is Clicked ? */
    onStageClick(e: KonvaMouseEvent) {
        /**
         * If the editor is in add mode, then add a new state
         */
        if (this.current_mode === DockModes.ADD) {
            // get the mouse click position
            const mouse = e.target.getStage()?.getPointerPosition();
            if (!mouse) return;

            // Add New Node to Store
            const id = this.engine.addState(
                `q${secondary_stores.deleted_state_names.shift() ?? this.nodes.size}`
            );

            // Add an entry to keep track of the node's look and feel
            this.node_properties.set(id, { x: mouse.x, y: mouse.y });
        } else {
            // If it's nothing, remove focus from any selected states
            if (secondary_stores.current_select !== null) {
                secondary_stores.current_select = null;
            }
        }
    }

    /** What should be done when a Node is Clicked ? */
    onNodeClick(e: KonvaMouseEvent, id: number) {
        e.evt.preventDefault();

        const isLeftClick = e.evt.button === 0;

        if (this.current_mode === DockModes.REMOVE && isLeftClick) {
            this.removeNode(id);
            return;
        }

        if (this.current_mode === DockModes.CONNECT && isLeftClick) {
            this.connectNode(id);
            return;
        }

        // Keep track of current selected State
        if (isLeftClick) {
            secondary_stores.current_select =
                secondary_stores.current_select === id ? null : id;
        }

        if (e.evt.button === 2 /* Right click option menu */) {
            // Set current selected to this node
            secondary_stores.current_select = id;

            this.togglers.show_node_customizer =
                !this.togglers.show_node_customizer;
        }
    }

    /** What should be done when a Node is Dragged ? */
    onNodeDrag(e: KonvaDragTransformEvent, id: number) {
        // Position of the node would have changed, this has to be updated in it's properties
        this.node_properties.set(id, {
            ...this.node_properties.get(id),
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y,
        });
    }

    /** What should be done when a Transition is Clicked ? */
    onTransitionClick(e: KonvaMouseEvent, id: number) {
        if (this.current_mode === DockModes.REMOVE && e.evt.button === 0) {
            // Delete this transition
            this.engine.deleteTransition(id);

            // Sync Transition and Properties Stores
            this.syncTrPropStore();

            return;
        }

        if (e.evt.button === 0) {
            secondary_stores.current_tr = id;
            this.togglers.show_tr_customizer = true;
        }
    }

    /** The look of a transition that has not been customized */
    private createTransitionProps(): TransitionProps {
        return {
            curvature: 0.5,
            strokeWidth: 2,
            stroke: this.defaultNodeLook.stroke,
        };
    }

    /** Deletes a node, and everything that was attached to it */
    private removeNode(id: number) {
        this.engine.deleteState(id);

        // Sync node, transition properties to nodes and transitions store
        this.syncNodePropStore();
        this.syncTrPropStore();

        // Make this name available for reuse
        secondary_stores.deleted_state_names.push(id);

        // sort so that the smaller number is used before a larger one
        // i could've used a priority que here, but again,
        // the array isn't going to be that large anyways, so i'll let sort do the job for now :)
        secondary_stores.deleted_state_names.sort();

        // Make sure this isn't a selected State
        if (secondary_stores.current_select === id) {
            secondary_stores.current_select = null;
        }
    }

    /**
     * Connect mode: the first clicked node starts a transition,
     * the second one finishes it.
     */
    private connectNode(id: number) {
        const from = secondary_stores.from_node;

        // new transition ? keep the first clicked node in memory
        if (from === null) {
            secondary_stores.from_node = id;
            return;
        }

        let trId: number;

        /**
         * If not in Free Style mode, first add a transition automatically, then let user change the alphabet
         */
        if ("addAutoTransition" in this.engine) {
            const result = this.engine.addAutoTransition(from, id);

            if (!result.success) {
                secondary_stores.openAlert("info", result.error ?? "");
                secondary_stores.from_node = null;
                return;
            }
            trId = result.tr_id!;
        } else {
            trId = this.engine.addTransition(from, id, "...");
        }

        // Add Details of this transition to Transition Props
        this.transition_properties.set(trId, this.createTransitionProps());

        // Clear memory
        secondary_stores.from_node = null;
    }

    /** Automatically calculate a good layout for the FSM on screen */
    autoLayout() {
        this.animateNodesTo(this.calculateLayout());
    }

    /**
     * Uses dagre to work out where every node should go so that the graph is laid out
     * neatly and centered on screen.
     * @returns The new position of every node, by node id
     */
    private calculateLayout(): Map<number, { x: number; y: number }> {
        const graph = new dagre.graphlib.Graph();

        // Set an object for the graph label
        graph.setGraph({
            rankdir: "LR", // L-to-R flow (use 'TB' for Top-to-Bottom)
            nodesep: 80, // Vertical spacing between nodes
            ranksep: 150, // Horizontal spacing between layers
            marginx: 50, // Graph margins
            marginy: 50,
        });

        // Default configuration for edges
        graph.setDefaultEdgeLabel(() => ({}));

        // Feed States into Dagre
        // Dagre uses width and height. For Konva circles, this is radius * 2.
        const defaultRadius = this.defaultNodeLook.radius;
        for (const key of this.nodes.keys()) {
            const size =
                (this.node_properties.get(key)?.radius ?? defaultRadius) * 2;
            graph.setNode(`${key}`, { width: size, height: size });
        }

        // Feed transitions into dagre
        for (const { from, to } of this.transitions.values()) {
            graph.setEdge(`${from}`, `${to}`);
        }

        // Calculate positions
        dagre.layout(graph);

        // Calculate Offsets to Center the Graph
        const graphWidth = graph.graph().width ?? 0;
        const graphHeight = graph.graph().height ?? 0;

        const offsetX = (window.innerWidth - graphWidth) / 2;
        const offsetY = (window.innerHeight - graphHeight) / 2;

        const positions = new Map<number, { x: number; y: number }>();
        for (const key of this.nodes.keys()) {
            const laidOut = graph.node(`${key}`);
            positions.set(key, {
                x: laidOut.x + offsetX,
                y: laidOut.y + offsetY,
            });
        }
        return positions;
    }

    /** Smoothly slides every node from where it is now to its target position */
    private animateNodesTo(targets: Map<number, { x: number; y: number }>) {
        const starts = new Map<number, { x: number; y: number }>();
        for (const key of targets.keys()) {
            const currentProps = this.node_properties.get(key)!;
            starts.set(key, { x: currentProps.x ?? 0, y: currentProps.y ?? 0 });
        }

        const duration = 600; // ms
        const startTime = performance.now();

        const animate = (now: number) => {
            const timeFraction = Math.min((now - startTime) / duration, 1);
            // Cubic ease-out function for smooth decelertion
            const progress = 1 - Math.pow(1 - timeFraction, 3);

            for (const [key, end] of targets) {
                const start = starts.get(key)!;
                this.node_properties.set(key, {
                    ...this.node_properties.get(key)!,
                    x: start.x + (end.x - start.x) * progress,
                    y: start.y + (end.y - start.y) * progress,
                });
            }

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Replaces the machine by the smallest one that accepts the same language.
     * The minimized machine has brand new states, so their look is rebuilt and
     * the layout is calculated again.
     */
    minimizeMachine() {
        if (!("minimize" in this.engine)) return;

        try {
            this.engine.minimize(true);
        } catch (error) {
            secondary_stores.openAlert(
                "info",
                error instanceof Error
                    ? error.message
                    : "Could not minimize the machine."
            );
            return;
        }

        // The old states are gone, so everything keyed by their ids is out of date
        secondary_stores.deleted_state_names = [];
        secondary_stores.current_select = null;
        secondary_stores.current_tr = null;
        secondary_stores.from_node = null;

        // Start every new state in the middle of the screen, the layout then spreads them out
        this.node_properties.clear();
        for (const id of this.nodes.keys()) {
            this.node_properties.set(id, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
        }

        this.transition_properties.clear();
        for (const id of this.transitions.keys()) {
            this.transition_properties.set(id, this.createTransitionProps());
        }

        this.autoLayout();
    }

    /**
     * Creates a new project, and initializes all necessary variables to empty state
     */
    newProject() {
        // Clear all states and transitions from Svelte stores
        this.nodes.clear();
        this.transitions.clear();
        this.node_properties.clear();
        this.transition_properties.clear();

        // Let the engine clear its own inner state mechanisms safely
        this.engine.newProject();

        // Reset project details, keeping the old machine type
        this.project_details = createDefaultDetails(this.project_details.type);

        // Make sure engine name matches the reset name
        this.engine.name = this.project_details.name;

        // Reset memory on secondary stores
        secondary_stores.deleted_state_names = [];
        secondary_stores.current_select = null;
        secondary_stores.current_tr = null;
        secondary_stores.from_node = null;
    }

    /**
     * Change the type of State Machines
     * @param projType Type of State Machine
     */
    changeProjectType(projType: EngineTypes) {
        this.newProject(); // Create a new Project

        this.project_details.type = projType;
        this.engine = new DFA(this.project_details.name);
        this.bindEngineStores();

        // Open Machine Settings Window if not in FREE mode
        if (projType !== EngineTypes.FREE) {
            secondary_stores.show_lang_settings = true;
        }
    }

    /************** KONVA AND FRONTEND RELATED METHODS  **************/
}

// One instance to manage it all
const ProjectClass = new Project();
export default ProjectClass;
