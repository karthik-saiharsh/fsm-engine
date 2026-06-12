/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import type { State, Transition, TransitionTable } from "./utils/types";
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
    protected type: EngineTypes;

    /** Name of the project */
    name: string;

    /** HashMap of states (nodes) in the state machine. */
    protected nodes: Map<number, State>;
    /** HashMap of transitions between states. */
    protected transitions: Map<number, Transition>;

    /** Keep Track of Deleted/free-to-use ID values */
    protected freeIds = new MinHeap<number>();

    /** Keep Track of Deleted/free-to-use Transition ID values */
    protected freeTrIds = new MinHeap<number>();

    constructor(name: string) {
        if (name.length < 5) {
            throw new Error(
                "The Project name must atleast be 5 characters long"
            );
        }

        this.type = EngineTypes.FREE; // This Class defaults to a FREE Mode
        this.name = name;
        this.nodes = new Map<number, State>();
        this.transitions = new Map<number, Transition>();
    }

    /**
     * @returns Current type of the Engine
     */
    getType(): EngineTypes {
        return this.type;
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
     * @returns The States Map
     */
    getStates(): Map<number, State> {
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
     * Returns a State with the given reference id
     * @param id Reference id of the State
     * @returns The State with reference id provided
     */
    getState(id: number): State {
        this.verifyStateExistance(id);

        return this.nodes.get(id)!;
    }

    /**
     * Returns a Transition with the given reference id
     * @param id Reference id of the Transition
     * @returns The Transition with reference id provided
     */
    getTransition(id: number): Transition {
        this.verifyTransitionExistance(id);

        return this.transitions.get(id)!;
    }

    /**
     * Return reference IDs of all States that have matching value
     * @param value value of state
     */
    searchStates(value: string): number[] {
        const matching_states: number[] = [];

        for (const [id, state] of this.nodes) {
            if (state.value === value) {
                matching_states.push(id);
            }
        }

        return matching_states;
    }

    /**
     * Returns a list of all transition id between 2 states
     * @param from Statr State
     * @param to End State
     * @returns List of all transition ids that go from start state to end state
     */
    searchTransition(from: number, to: number): number[] {
        this.verifyStateExistance(from);

        this.verifyStateExistance(to);

        const from_state = this.nodes.get(from)!;
        const to_state = this.nodes.get(to)!;

        // All transitions of state from
        const from_trs = from_state.transitions.incoming.union(
            from_state.transitions.outgoing.union(from_state.transitions.self)
        );

        // All transitions of state to
        const to_trs = to_state.transitions.incoming.union(
            to_state.transitions.outgoing.union(to_state.transitions.self)
        );

        // Return the transitions that exsit for both nodes
        const common_trs = from_trs.intersection(to_trs);

        return Array.from(common_trs);
    }

    /**
     * Get list of all transition ids that consume a said alphabet
     * @param on String value that the transition consumes
     * @returns list of transition id consuming `on`
     */
    getTransitionsOn(on: string): number[] {
        const trs = [];

        for (const [key, tr] of this.transitions) {
            // If on matches collect it
            if (tr.on === on) {
                trs.push(key);
            }
        }

        return trs;
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
            // A state is intermediate when both flags are false.
            isStart: false,
            isEnd: false,
            transitions: {
                incoming: new Set<number>(),
                outgoing: new Set<number>(),
                self: new Set<number>(),
            },
        };
        this.nodes.set(id, state);
        return id;
    }

    /**
     * Mark the provided state as START.
     * Only one start state can exist at a time.
     * @param id Reference id of the State
     */
    setStart(id: number) {
        this.verifyStateExistance(id);
        // Remove START status from any existing start state.
        for (const state of this.nodes.values()) {
            if (state.isStart) {
                state.isStart = false;
            }
        }

        this.nodes.get(id)!.isStart = true;
    }

    /**
     * Mark the provided state as END.
     * Multiple end states are allowed.
     * @param id Reference id of the State
     */
    setEnd(id: number) {
        this.verifyStateExistance(id);

        this.nodes.get(id)!.isEnd = true;
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
        this.verifyStateExistance(from);

        this.verifyStateExistance(to);

        // Add this new transition to store
        let id: number = this.transitions.size;

        // If there is a free-to-use transition id, use that instead
        if (this.freeTrIds.size > 0) {
            id = this.freeTrIds.poll()!;
        }

        const transition: Transition = {
            id: id,
            from: from,
            to: to,
            on: on,
        };

        this.transitions.set(id, transition);

        // Update this transition in the store for the nodes as well
        if (from === to) {
            // If self loop ?
            this.nodes.get(from)?.transitions.self.add(id);
        } else {
            this.nodes.get(from)?.transitions.outgoing.add(id);
            this.nodes.get(to)?.transitions.incoming.add(id);
        }

        return id;
    }

    /**
     * Delete a State
     * @param id Reference id of the state to be deleted
     */
    deleteState(id: number) {
        this.verifyStateExistance(id);

        // Before deleting a node, delete all assiciated transitions as well
        const state = this.nodes.get(id)!;

        // Get all transitions on this State
        const transitions = state.transitions.incoming.union(
            state.transitions.outgoing.union(state.transitions.self)
        );

        // Delete all related transitions
        for (const tr of transitions) {
            this.transitions.delete(tr);
            // Add this id value to freeTrIds
            this.freeTrIds.add(tr);
        }

        // Add id to free ids
        this.freeIds.add(state.id);
        // Delete the node itself
        this.nodes.delete(state.id);
    }

    /**
     * Deletes a Transition with given id
     * @param id Reference id of the Transition
     */
    deleteTransition(id: number) {
        this.verifyTransitionExistance(id);

        // get transition
        const transition = this.transitions.get(id)!;

        // Delete all references of this transition from associated states
        if (transition.from === transition.to) {
            // if self loop
            this.nodes
                .get(transition.from)
                ?.transitions.self.delete(transition.id);
        } else {
            // remove reference from from state
            this.nodes
                .get(transition.from)
                ?.transitions.outgoing.delete(transition.id);
            // remove reference from to state
            this.nodes
                .get(transition.to)
                ?.transitions.incoming.delete(transition.id);
        }

        // Add id of transition to freeTrIds
        this.freeTrIds.add(transition.id);
        // Delete the Transition
        this.transitions.delete(transition.id);
    }


    /**
     * Saves Project working state
     * @returns an object that has all working variables of the project
     */
    saveProject() {
        const freeIds = [];
        for (const num of this.freeIds) {
            freeIds.push(num);
        }

        const freeTrIds = [];
        for (const num of this.freeTrIds) {
            freeTrIds.push(num);
        }

        const projectData = {
            type: this.type,
            name: this.name,
            freeIds: freeIds,
            freeTrIds: freeTrIds,
            nodes: Array.from(this.nodes.entries()).map(([key, value]) => ({
                key: key,
                state: {
                    id: value.id,
                    value: value.value,
                    isStart: value.isStart,
                    isEnd: value.isEnd,
                    transitions: {
                        incoming: Array.from(value.transitions.incoming),
                        outgoing: Array.from(value.transitions.outgoing),
                        self: Array.from(value.transitions.self),
                    }
                }
            })),
            transitions: Array.from(this.transitions.entries()).map(([key, value]) => ({
                key: key,
                transition: value
            }))
        };

        return projectData;
    }

    /**
     * Restore the state of the engine from a previously saved project data object
     * @param projectData The data object generated by saveProject()
     */
    loadProject(projectData: ReturnType<typeof this.saveProject>) {
        this.type = projectData.type;
        this.name = projectData.name;

        // Restore free IDs min heaps
        while (this.freeIds.size > 0) this.freeIds.poll();
        for (const id of projectData.freeIds) {
            this.freeIds.add(id);
        }

        while (this.freeTrIds.size > 0) this.freeTrIds.poll();
        for (const id of projectData.freeTrIds) {
            this.freeTrIds.add(id);
        }

        // Restore Map of nodes and convert Arrays back to Sets
        this.nodes.clear();
        for (const nodeData of projectData.nodes) {

            this.nodes.set(nodeData.key, {
                id: nodeData.state.id,
                value: nodeData.state.value,
                isStart: nodeData.state.isStart,
                isEnd: nodeData.state.isEnd,
                transitions: {
                    incoming: new Set(nodeData.state.transitions.incoming),
                    outgoing: new Set(nodeData.state.transitions.outgoing),
                    self: new Set(nodeData.state.transitions.self),
                }
            });
        }

        // Restore Map of transitions
        this.transitions.clear();
        for (const transitionData of projectData.transitions) {
            this.transitions.set(transitionData.key, transitionData.transition);
        }
    }

    /**
     * Creates a new project, and initializes all necessary variables to empty state
     */
    newProject() {
        // clear nodes and transitions array
        this.nodes.clear();
        this.transitions.clear();

        // clear track of deleted state and transition ids
        while (this.freeIds.size > 0) this.freeIds.poll();
        while (this.freeTrIds.size > 0) this.freeTrIds.poll();
    }


    /**
     * Returns the transition table of the FSM
     */
    makeTransitionTable(): TransitionTable {
        /**
         * The idea is to have a object with node/states and each of the language alphabets mapped out.
         * We'll be using the Transition map to build this
         */

        let transitionTable = new Map<number, Map<string, number[]>>();

        let alphabets = new Set<string>(); // keep track of all alphabets

        for (const [key, value] of this.transitions) {
            const from = value.from;
            const alphabet = value.on;
            const to = value.to;

            // Push alphabet to set of alphabets
            alphabets.add(alphabet);

            if (transitionTable.has(from)) {
                const nodeCell = transitionTable.get(from);

                if (nodeCell?.has(alphabet)) {
                    nodeCell.get(alphabet)?.push(to);
                } else {
                    nodeCell?.set(alphabet, [to]);
                }
            } else {
                let res = new Map<string, number[]>();
                res.set(alphabet, [to]);
                transitionTable.set(from, res);
            }
        }

        for (const [key, _] of this.nodes) {
            if (!transitionTable.has(key)) {
                transitionTable.set(key, new Map<string, number[]>())
            }
        }

        return {
            table: transitionTable,
            alphabets: alphabets
        }

    }

    /**
     * Returns the transition table of the state machine as a string (csv format)
     */
    getTransitionTableCSV(): string {
        let result: string[] = [];

        const { table, alphabets } = this.makeTransitionTable();

        // The first row is just all the alphabets
        result.push(["State \\ Alphabets", ...alphabets].join(","));

        // Subsequent rows start with a state(from) and go have other states on an alphabet
        // Check which state a transition goes to from each state
        for (const [key, value] of table) {
            let row: string[] = [];

            const fromState = this.nodes.get(key);

            if (fromState?.isStart) {
                row.push((fromState.value) + "(S)"); // Indicate if start state
            } else if (fromState?.isEnd) {
                row.push((fromState.value) + "(E)"); // Indicate if end state
            } else {
                row.push(fromState?.value ?? "");
            }

            // Check every alphabet from each state
            for (const alph of alphabets) {

                if (value.has(alph)) {

                    for (const toState of value.get(alph)!) {

                        const state = this.nodes.get(toState);

                        if (state?.isStart) {
                            row.push((state.value) + "(S)"); // Indicate if start state
                        } else if (state?.isEnd) {
                            row.push((state.value) + "(E)"); // Indicate if end state
                        } else {
                            row.push(state?.value ?? "");
                        }

                    }

                } else {
                    row.push(" ");
                }
            }

            row.push(" ");
            result.push(row.join(","))
        }


        return result.join("\n");

    }

    /********* HELPER FUNCTIONS *********/

    /**
     * Check the existance of a State
     * @param id Reference ID of a State
     * @returns True if state is present in store
     */
    protected verifyStateExistance(id: number) {
        if (!this.nodes.has(id)) {
            throw new Error(`State with id ${id} does not exist.`);
        }
    }

    /**
     * Check the existance of a Transitions
     * @param id Reference ID of a Transitions
     * @returns True if Transitions is present in store
     */
    protected verifyTransitionExistance(id: number) {
        if (!this.transitions.has(id)) {
            throw new Error(`Transition with id ${id} does not exist.`);
        }
    }
}
