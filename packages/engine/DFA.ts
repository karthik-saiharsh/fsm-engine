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
    protected dfaGraph: Map<number, Map<string, number>>;

    startState: number | undefined;
    endState: Set<number>;

    constructor(name: string) {
        super(name);
        this.type = EngineTypes.DFA;
        this.languageAlphabet = new Set<string>();
        this.dfaGraph = new Map<number, Map<string, number>>();
        this.endState = new Set<number>();
    }

    /**
     * Set a state as starting state
     * @param id Reference id of start state
     */
    setStartState(id: number) {
        // Check state exists
        this.verifyStateExistance(id);

        this.startState = id;
    }

    /**
     * Add new alphabets to the language grammar
     * @param alphs one or more language alphabets passed as arguments (not as list)
     */
    addAlphabets(...alphs: string[]) {
        for (const alph of alphs) {
            this.languageAlphabet.add(alph);
        }
    }

    /**
     * Remove said alphabets from language grammar
     *
     * Note: This is a slow operation having O(n^2) in the worst case. So use it carefully
     * @param alphs one or more language alphabets passed as arguments (not as list)
     */
    removeAlphabets(...alphs: string[]) {
        // Remove alphabets
        for (const alph of alphs) {
            // Verify existance of alphabet
            this.verifyAlphExistance(alph);
            // Remove alphabet
            this.languageAlphabet.delete(alph);

            // And remove all the transitions happening on this alphabet
            const badTransitions: number[] = this.getTransitionsOn(alph);

            // Remove them bad transitions
            for (const trId of badTransitions) {
                this.deleteTransition(trId);
            }
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

    /**
     * Check if a String is accepted by the DFA
     * @param str String to parse
     * @returns an object consisting path of states taken to reach the end and a boolean
     * indicating whether string is accepted or not
     */
    validateString(str: string): { path: number[]; accepted: boolean } {
        // Verify start state exists
        this.verifyStartState();

        // Keep track of all states visited
        const path: number[] = [];

        let current: number = this.startState!;

        for (const ch of [...str]) {
            // push current state to path
            path.push(current);
            // verify the alphabet exists
            this.verifyAlphExistance(ch);

            // get next state to move to
            const next = this.dfaGraph.get(current)?.get(ch);

            if (current !== undefined) {
                current = next!;
            } else {
                // Return failure of string acceptance
                return {
                    path: path,
                    accepted: this.endState.has(current),
                };
            }
        }

        // return success
        return {
            path: path,
            accepted: true,
        };
    }

    /********* HELPER FUNCTIONS *********/
    private verifyAlphExistance(alph: string) {
        if (!this.languageAlphabet.has(alph)) {
            throw new Error(
                `Alphabet ${alph} doesn't exist in grammar of project ${this.name}.`
            );
        }
    }

    private verifyStartState() {
        if (this.startState === undefined) {
            throw new Error(`Start State Does not exist`);
        }
    }
}
