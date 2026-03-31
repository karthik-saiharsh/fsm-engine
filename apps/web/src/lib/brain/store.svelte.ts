/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/********* Library Imports *********/
import { EngineTypes } from "@fsm/engine";
/********* Library Imports *********/

/********* Type Imports *********/
import { DockModes, type NodeProps, type PartialNodeProps, type TransitionProps } from "./types";
import { FSMEngine, type State, type Transition } from "@fsm/engine";
import type { KonvaMouseEvent, KonvaDragTransformEvent } from "svelte-konva";
import { SvelteMap } from "svelte/reactivity";
import secondary_stores from "./extras.svelte";
import dagre from "@dagrejs/dagre";
/********* Type Imports *********/

/** Stuff */
const date = new Date();
/** Stuff */

/**
 * This monolithic beast of a class has every detail of the current project.
 */
class Project {
    project_details = $state({
        name: "", // Project name
        author: "", // Project Author
        created: "", // Project Created At Date
        type: EngineTypes.FREE, // Type of the State Machine
    });

    theme: "dark" | "light" = "dark"; // UI Theme

    current_mode: DockModes = $state(DockModes.NIL); // Current chosen Dock Mode

    /****** TOGGLER VARIABLES ******/
    togglers = $state({
        show_proj_details: false,
        show_node_customizer: false,
        show_tr_customizer: false,
    });
    /****** TOGGLER VARIABLES ******/


    /****** STATE MACHINE VARIABLES ******/
    nodes = new SvelteMap<number, State>(); // This stores the actual nodes
    transitions = new SvelteMap<number, Transition>(); // This stores the actual nodes

    // This stores the look and feel of the nodes for the frontend
    defaultNodeLook: Partial<NodeProps> = {
        color: "#ffffff80",
        stroke: "#ffffff90",
        radius: 40
    }
    node_properties = new SvelteMap<number, PartialNodeProps>();
    transition_properties = new SvelteMap<number, TransitionProps>();
    /****** STATE MACHINE VARIABLES ******/

    /****** BACKEND CLASSES ******/
    engine: FSMEngine; // The backend FSM Engine Class
    /****** BACKEND CLASSES ******/

    /**
     * Create a new project
     */
    constructor() {
        this.project_details = {
            ...this.project_details,
            name: `FSM_Project_${date.toDateString()}`,
            author: "Unnamed Author",
            created: date.toDateString(),
        };

        this.engine = new FSMEngine(this.project_details.name);

        // Set nodes Map to be used instead as node store
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

        if (this.project_details.name != project_details.name) {
            // Update the name of the project if it has changed in the engine
            this.engine.name = project_details.name
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
                this.node_properties.delete(key)
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


    /************** KONVA AND FRONTEND RELATED METHODS  **************/


    /** What should be done when the Konva Stage is Clicked ? */
    onStageClick(e: KonvaMouseEvent) {

        /**
         * If the editor is in add mode, then add a new state
         */
        if (this.current_mode === DockModes.ADD) {
            // Add New Node to Store
            const id = this.engine.addState(`q${secondary_stores.deleted_state_names.shift() ?? this.nodes.size}`);

            // get the mouse click position
            const mouse = e.target.getStage()?.getPointerPosition();

            // Add an entry to keep track of the node's look and feel
            const nodeProps: PartialNodeProps = {
                x: mouse?.x!,
                y: mouse?.y!,
            }
            this.node_properties.set(id, nodeProps)
        }
    }

    /** What should be done when a Node is Clicked ? */
    onNodeClick(e: KonvaMouseEvent, id: number) {

        if (this.current_mode === DockModes.REMOVE && e.evt.button === 0) {
            // Handle Node Deletion
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
            return;
        }

        if (this.current_mode === DockModes.CONNECT && e.evt.button === 0) {
            // new transition ? keep the first clicked node in memory
            if (secondary_stores.from_node === null) {
                secondary_stores.from_node = id;
                return;

            } else {
                // Add a new transition
                const from = secondary_stores.from_node
                const to = id;
                const tr_id = this.engine.addTransition(from, to, "...");

                // Add Details of this pransition to Transition Props
                const fromNodeProps = this.node_properties.get(from)!;
                const toNodeProps = this.node_properties.get(to)!;

                const start = [fromNodeProps.x!, fromNodeProps.y!];
                const end = [toNodeProps.x!, toNodeProps.y!];
                const control = [(start[0]! + end[0]!) / 2, (start[1]! + end[1]! / 2)];

                this.transition_properties.set(tr_id, {
                    curvature: 0.5,
                    strokeWidth: 2,
                    stroke: "#ffffff80",
                })

                // Clear memory
                secondary_stores.from_node = null;
                return;
            }
        }

        // Keep track of current selected State
        if (e.evt.button === 0 /* Left click select */) {
            if (secondary_stores.current_select === id) {
                secondary_stores.current_select = null;
            } else {
                secondary_stores.current_select = id;
            }
        }

        if (e.evt.button === 2 /* Right click option menu */) {
            // Set current selected to this node
            secondary_stores.current_select = id;

            ProjectClass.togglers.show_node_customizer =
                !ProjectClass.togglers.show_node_customizer;
        }
    }

    /** What should be done when a Node is Dragged ? */
    onNodeDrag(e: KonvaDragTransformEvent, id: number) {
        // Position of the node would have changed, this has to be updated in it's properties
        const currentProps = this.node_properties.get(id);

        this.node_properties.set(id, {
            ...currentProps,
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y,
        } as PartialNodeProps);

        // Update any linked Transition Positions
    }

    /** What should be done when a Transition is Clicked ? */
    onTransitionClick(e: KonvaMouseEvent, id: number) {

        if (ProjectClass.current_mode === DockModes.REMOVE && e.evt.button === 0) {
            // Delete this transition
            this.engine.deleteTransition(id);

            // Sync Transition and Properties Stores
            this.syncTrPropStore();

            return;
        }

        if (e.evt.button === 0) {
            secondary_stores.current_tr = id;
            ProjectClass.togglers.show_tr_customizer = true;
        }
    }

    /** Automatically calculate a good layout for the FSM on screen */
    autoLayout() {
        const graph = new dagre.graphlib.Graph();

        // Set an object for the graph label
        graph.setGraph({
            rankdir: 'LR',     // L-to-R flow (use 'TB' for Top-to-Bottom)
            nodesep: 80,       // Vertical spacing between nodes
            ranksep: 150,      // Horizontal spacing between layers
            marginx: 50,       // Graph margins
            marginy: 50
        });

        // Default configuration for edges
        graph.setDefaultEdgeLabel(() => ({}));

        //Feed States into Dagre
        // Dagre uses width and height. For Konva circles, this is radius * 2.
        for (const key of this.nodes.keys()) {
            const NodeProp = this.node_properties.get(key);
            const defaultprops = this.defaultNodeLook;

            graph.setNode(`${key}`, {
                width: (NodeProp?.radius ?? defaultprops.radius ?? 0) * 2,
                height: (NodeProp?.radius ?? defaultprops.radius ?? 0) * 2
            });
        }

        // Feed transitions into dagre
        for (const key of this.transitions.keys()) {
            const Transition = this.transitions.get(key);

            graph.setEdge(`${Transition?.from}`, `${Transition?.to}`)
        }


        // Calculate positions
        dagre.layout(graph);

        // Calculate Offsets to Center the Graph
        const graphWidth = graph.graph().width ?? 0;
        const graphHeight = graph.graph().height ?? 0;

        // Adjust `window.innerWidth`
        const offsetX = (window.innerWidth - graphWidth) / 2;
        // Adjust for TopBar height
        const offsetY = (window.innerHeight - graphHeight) / 2;

        const animations = new Map<number, { startX: number, startY: number, endX: number, endY: number }>()


        for (const key of this.nodes.keys()) {
            const currentProps = this.node_properties.get(key)!;
            const targetPos = graph.node(`${key}`);

            animations.set(key, {
                startX: currentProps.x ?? 0,
                startY: currentProps.y ?? 0,
                endX: targetPos.x + offsetX,
                endY: targetPos.y + offsetY
            });
        }

        // Animation Loop
        const duration = 600; // ms
        const startTime = performance.now();

        const animate = (now: number) => {
            const timeFraction = Math.min((now - startTime) / duration, 1);
            // Cubic ease-out function for smooth decelertion
            const progress = 1 - Math.pow(1 - timeFraction, 3);

            for (const [key, vectors] of animations.entries()) {
                const NodeProp = this.node_properties.get(key)!;
                this.node_properties.set(key, {
                    ...NodeProp,
                    x: vectors.startX + (vectors.endX - vectors.startX) * progress,
                    y: vectors.startY + (vectors.endY - vectors.startY) * progress,
                } as PartialNodeProps);
            }

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }


    /************** KONVA AND FRONTEND RELATED METHODS  **************/
}

// One instance to manage it all
const ProjectClass = new Project();
export default ProjectClass;
