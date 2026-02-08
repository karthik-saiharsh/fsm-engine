import { FSMEngine } from "./FSMEngine";
import { EngineTypes } from "./utils/types";

export class DFA extends FSMEngine {
    /** Set of all language alphabets for this grammar */
    languageAlphabet: Set<string>;

    /**
     * In a DFA, we need to make sure that every state has a transition
     * on every language alphabet. To do that, we keep another hashmap in store
     * to track of which node has what transition on what alphabet.
     * This attribute has key as state id and value as another map
     * with key as language alphabet and value as id of the to state
     */
    dfaGraph: Map<number, Map<string, number>>;

    constructor(name: string) {
        super(name);
        this.type = EngineTypes.DFA;
        this.languageAlphabet = new Set<string>();
        this.dfaGraph = new Map<number, Map<string, number>>();
    }

    /**
     * Add new alphabets to the language grammar
     * @param alphs one or more language alphabets belonging to the language grammar
     */
    addAlphabets(...alphs: string[]) {
        for (const alph of alphs) {
            this.languageAlphabet.add(alph);
        }
    }

    /**
     * Adds a new State
     * @param value Value of the State
     * @returns The id of the state (reference value to access this state).
     */
    override addState(value: string): number {
        // Add State
        const id = super.addState(value);

        // Make a entry for this state in dfaGraph
        this.dfaGraph.set(id, new Map<string, number>());

        return id;
    }

    /**
     * Delete a State
     * @param id Reference id of the state to be deleted
     */
    override deleteState(id: number): void {
        // Delete State
        super.deleteState(id);

        // If deletion worked, then remove any mention of it from dfaGraph
        this.dfaGraph.delete(id);
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
    override addTransition(from: number, to: number, on: string): number {
        // Verify existance of from and to
        this.verifyStateExistance(from);
        this.verifyStateExistance(to);

        // Check that the `on` attribute refers to a valid language alphabet
        this.verifyAlphExistance(on);

        // Then check that a transition on said alphabet doesn't already exist for state `from`
        if (this.dfaGraph.get(from)?.has(on)) {
            throw new Error(
                `A transition for State ${from} on ${on} already exists.`
            );
        }

        // Add this transntion to dfaGraph
        this.dfaGraph.get(from)?.set(on, to);

        // If all is well, add this transition
        return super.addTransition(from, to, on);
    }

    /**
     * Deletes a Transition with given id
     * @param id Reference id of the Transition
     */
    override deleteTransition(id: number): void {
        // Verify existance of transition
        this.verifyTransitionExistance(id);

        // Get from state for this transition
        const from = this.transitions.get(id)?.from!;
        const on = this.transitions.get(id)?.on!;

        // Delete Transition
        super.deleteTransition(id);

        // If deletion worked, then remove any mention of it in dfaGraph as well.
        this.dfaGraph.get(from)?.delete(on);
    }

    /********* HELPER FUNCTIONS *********/
    private verifyAlphExistance(alph: string) {
        if (!this.languageAlphabet.has(alph)) {
            throw new Error(
                `Alphabet ${alph} doesn't exist in grammar of project ${this.name}.`
            );
        }
    }
}
