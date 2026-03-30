/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

/********* Library Imports *********/
import { EngineTypes } from "@fsm/engine";
/********* Library Imports *********/

/********* Type Imports *********/
import { DockModes, type NodeProps } from "./types";
import { FSMEngine, type State } from "@fsm/engine";
import type { KonvaMouseEvent, KonvaDragTransformEvent } from "svelte-konva";
import { SvelteMap } from "svelte/reactivity";
import secondary_stores from "./extras.svelte";
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
    });
    /****** TOGGLER VARIABLES ******/


    /****** STATE MACHINE VARIABLES ******/
    nodes = new SvelteMap<number, State>(); // This stores the actual nodes

    // This stores the look and feel of the nodes for the frontend
    defaultNodeLook: Partial<NodeProps> = {
        color: "#ffffff80",
        stroke: "#ffffff90",
        radius: 40
    }
    node_properties = new SvelteMap<number, Partial<NodeProps>>();
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
            const nodeProps: Partial<NodeProps> = {
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

            // Sync node properties and nodes store
            this.syncNodePropStore();

            // Make this name available for reuse
            secondary_stores.deleted_state_names.push(id);

            // sort so that the smaller number is used before a larger one
            // i could've used a priority que here, but again, 
            // the array isn't going to be that large anyways, so i'll let sort do the job for now :)
            secondary_stores.deleted_state_names.sort();
            return;
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
        } as Partial<NodeProps>);
    }


    /************** KONVA AND FRONTEND RELATED METHODS  **************/
}

// One instance to manage it all
const ProjectClass = new Project();
export default ProjectClass;
