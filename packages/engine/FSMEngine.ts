/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import type { State, Transition } from "./utils/types";
import { EngineTypes } from "./utils/types";
import { MinHeap } from "min-heap-typed";

/**
 * Finite State Machine Engine
 *
 * A configurable state machine implementation that supports multiple engine types
 * (Free Style, DFA, NFA). This class manages the creation and organization of states
 * and transitions within a state machine.
 *
 *
 * @see {@link EngineTypes} for available state machine types
 * @see {@link State} for state structure
 * @see {@link Transition} for transition structure
 */
export class FSMEngine {
    /** The type of state machine. Defaults to Free Style. */
    private type: EngineTypes;

    /** Name of the project */
    name: string;

    /** HashMap of states (nodes) in the state machine. */
    private nodes: Map<number, State>;
    /** HashMap of transitions between states. */
    private transitions: Map<number, Transition>;

    /** Keep Track of Deleted/free-to-use ID values */
    private freeIds = new MinHeap<number>();

    constructor(type: EngineTypes, name: string) {
        if (name.length < 5) {
            throw new Error(
                "The Project name must atleast be 5 characters long"
            );
        }

        this.type = type;
        this.name = name;
        this.nodes = new Map<number, State>();
        this.transitions = new Map<number, Transition>();
    }

    /**
     * Takes a Hash map as references and uses that as store for nodes
     * @param nodes A Hash Map of type (key, value) = (number, State)
     */
    setNodes(nodes: Map<number, State>) {
        this.nodes = nodes;
    }

    /**
     * Takes a Hash map as references and uses that as store for nodes
     * @param nodes A Hash Map of type (key, value) = (number, State)
     */
    setTransitions(transitions: Map<number, Transition>) {
        this.transitions = transitions;
    }

    /**
     * @returns The nodes Map
     */
    getNodes(): Map<number, State> {
        if (this.nodes) return this.nodes;
        else throw new Error("Nodes is undefined");
    }

    /**
     * @returns The transitions Map
     */
    getTransitions(): Map<number, Transition> {
        if (this.transitions) return this.transitions;
        else throw new Error("Transitions is undefined");
    }

    /**
     * Adds a new State
     * @param value Value of the State
     * @returns The id of the state (reference value to access this state).
     */
    addState(value: string): number {
        let id: number = this.nodes.size;

        // If there is a free-to-use id, use that instead
        if (this.freeIds.size > 0) {
            id = this.freeIds.poll()!;
        }

        const state: State = {
            id: id,
            value: value,
            transitions: {
                incoming: new Set<number>(),
                outgoing: new Set<number>(),
            },
        };
        this.nodes.set(id, state);
        return id;
    }

    /**
     * Adds a new Transition.
     * In Case you are wondering, a reference number of the state
     * is returned when a new state is added @see addState method
     * @param from From State's reference number
     * @param to To State's reference number
     * @param on Upon what must the transition occur ?
     * @returns a reference id of the transition
     */
    addTransition(from: number, to: number, on: string): number {
        // Verify if from and to states exist in the Engine
        if (!this.nodes.has(from)) {
            throw new Error(`State ${from} doesn't exist.`);
            return -1;
        }

        if (!this.nodes.has(to)) {
            throw new Error(`State ${to} doesn't exist.`);
            return -1;
        }

        // Add this new transition to store
        const id: number = this.transitions.size;
        const transition: Transition = {
            id: id,
            from: from,
            to: to,
            on: on,
        };

        this.transitions.set(id, transition);

        // Update this transition in the store for the nodes as well
        this.nodes.get(from)?.transitions.outgoing.add(id);
        this.nodes.get(to)?.transitions.incoming.add(id);

        return id;
    }
}
