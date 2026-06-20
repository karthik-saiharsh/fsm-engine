import { FSMEngine } from "./FSMEngine";
import { EngineTypes } from "./utils/types";

export class DFA extends FSMEngine {
    /** Set of all language alphabets for this grammar */
    languageAlphabet: Set<string>;

    startState: number | undefined;

    constructor(name: string) {
        super(name);
        this.type = EngineTypes.DFA;
        this.languageAlphabet = new Set<string>();
    }

    /**
     * Set a state as starting state
     * @param id Reference id of start state
     */
    override setStart(id: number): void {
        super.setStart(id);
        this.startState = id;
    }

    /**
     * Set a state as intermediate state
     * @param id Reference id of start state
     */
    override setIntermediate(id: number): void {
        super.setIntermediate(id);
        this.startState = undefined;
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
     * Returns a string array of language alphabets
     */
    getAlphabets(): string[] {
        return Array.from(this.languageAlphabet);
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
     * Adds a new Transition.
     * In Case you are wondering, a reference number of the state
     * is returned when a new state is added @see addState method
     * @param from From State's reference number
     * @param to To State's reference number
     * @param on Upon what must the transition occur ?
     * @returns a reference id of the transition
     */
    override addTransition(from: number, to: number, on: string): number {

        const dfaGraph = this.makeTransitionTable().table;

        // Verify existance of from and to
        this.verifyStateExistance(from);
        this.verifyStateExistance(to);

        // Check that the `on` attribute refers to a valid language alphabet
        this.verifyAlphExistance(on);

        // Then check that a transition on said alphabet doesn't already exist for state `from`
        if (dfaGraph.get(from)?.has(on)) {
            throw new Error(
                `A transition for State ${from} on ${on} already exists.`
            );
        }

        // If all is well, add this transition
        return super.addTransition(from, to, on);
    }


    /**
     * Use this to add a transition between two states 
     * without having to provide an input alphabet.
     * This automatically assigns the next available lanuage alphabet for that transition.
     * @param from Starting State of the Transition
     * @param to Target State of the Transition
     */
    addAutoTransition(from: number, to: number): { success: boolean, error: null | string, tr_id?: number } {

        /**
         * This method does not have much utility on its own.
         * It's main aim is to aid in developing the web interface.
         * This method therefore does not throw errors, but rather returns a 
         * success boolean or a string error in case of a failure for the frontend to parse.
         * I would not recommend using this if you are using fsm-engine progrmatically.
         * But hey if you want to use, who am I to stop you XD!
         */

        const dfaGraph = this.makeTransitionTable().table;


        // Verify existance of from and to
        this.verifyStateExistance(from);
        this.verifyStateExistance(to);

        // Get the list of alphabets `from` already has a transition from
        const usedAlphabets = new Set(dfaGraph.get(from)?.keys());
        const availableAlphabets = this.languageAlphabet.difference(usedAlphabets);

        if (availableAlphabets.size) {
            // Get the next available alphabet to make a transition
            const on = availableAlphabets.values().next().value ?? "";
            const id = this.addTransition(from, to, on);
            return {
                success: true,
                error: null,
                tr_id: id,
            }
        } else {
            return {
                success: false,
                error: `The State ${this.nodes.get(from)?.value} already has a transition for every alphabet in the language`
            }
        }
    }

    /**
     * Check if a String is accepted by the DFA
     * @param str String to parse
     * @returns an object consisting path of states taken to reach the end and a boolean
     * indicating whether string is accepted or not
     */
    validateString(str: string): { path: number[]; str: null | string, accepted: boolean } {

        // Validate DFA
        this.validateDFA();

        let current: number = this.startState!;
        let path = [];

        // get dfa
        const dfa = this.makeTransitionTable().table;

        // make a copy of the inputString
        const res_string = str

        while (str.length > 0) {
            const letter = str.charAt(0); // Get the first letter


            // Check if the current alphabet is part of language alphabet
            this.verifyAlphExistance(letter);

            // Add current state to path
            path.push(current);

            // Go to the next state
            current = dfa.get(current)?.get(letter)![0]!;

            // Remove the first letter
            str = str.slice(1);
        }

        // Add the current state of exit to path
        path.push(current);

        return {
            path: path,
            str: res_string,
            accepted: this.getState(current).isEnd,
        }
    }


    /**
     * Edit the Label of an existing transition.
     * @param id Id of the transitions you wish to edit the label of
     * @param newLabel Updated Label
     * @param [swap=false] If the @param newLabel is already assigned to another transition, should the labels get swapped ?
     */
    editLabel(id: number, newLabel: string, swap: boolean = false) {
        // verify `id` is valid
        this.verifyTransitionExistance(id);

        // Verify alphabet is valid
        this.verifyAlphExistance(newLabel);

        // get the current transition
        const tr = this.getTransition(id);

        // Get list of all Outgoing transitions from `from`
        const trs = this.getState(tr.from).transitions.outgoing.union(this.getState(tr.from).transitions.self);

        let isUnique: { status: boolean, by: null | number } = { status: true, by: null };

        // Check if `newLabel` is used by any other transition
        for (const tr_ of trs) {
            const tr__ = this.getTransition(tr_);
            if (tr__.on === newLabel) {
                if (!swap)
                    throw new Error(`The Label ${newLabel} is set to the transition with id ${tr__.id}. Assign a Label that's free`);
                else {
                    isUnique = { status: false, by: tr__.id };
                    break;
                }
            }
        }

        // Set or swap labels accordingly
        if (isUnique.status) {
            this.transitions.set(id, { ...tr, on: newLabel });
        } else {
            const old = tr.on;
            this.transitions.set(isUnique.by as number, { ...this.getTransition(isUnique.by as number), on: old });
            this.transitions.set(id, { ...tr, on: newLabel });
        }

    }


    /**
     * Create a new Project
     */
    override newProject(): void {
        super.newProject(); // This already clears nodes and transitions

        // Clear the startState and alphabet set as well
        this.languageAlphabet.clear();
        this.startState = undefined;
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
        } else if (!this.getState(this.startState).isStart) {
            this.startState = undefined;
            throw new Error(`Start State Does not exist`);
        }
    }


    /**
     * This function tests if a given dfa is proper.
     * Check that every state has a transition from every alphabet.
     * It'll throw an error if something goes wrong, else nothing is returned
     */
    private validateDFA() {
        // Very that a start state exists
        this.verifyStartState();

        // Get dfa
        const dfa = this.makeTransitionTable().table;

        // Get language alphabets
        const alphabets = this.languageAlphabet;

        // for each state verify transition from every alphabet
        for (const state of this.getStates().keys()) {
            for (const alph of alphabets) {
                // Exactly one transition has to exist
                if (dfa.get(state)?.get(alph)?.length !== 1) {
                    throw new Error(`State ${this.getState(state).value} must have exactly one transition on alphabet ${alph}`);
                }
            }
        }
    }
}
