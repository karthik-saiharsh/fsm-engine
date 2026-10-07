import { FSMEngine } from "./FSMEngine";
import { EngineTypes } from "./utils/types";

/**
 * Everything a DFA needs to be saved and restored.
 * `languageAlphabet` and `startState` are optional so that projects saved
 * before they were stored can still be loaded.
 */
export type DFAProjectData = ReturnType<FSMEngine["saveProject"]> & {
    languageAlphabet?: string[];
    startState?: number | undefined;
};

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

        // Only the start state being demoted leaves the DFA without one
        if (id === this.startState) {
            this.startState = undefined;
        }
    }

    /**
     * Delete a State. If it was the start state, the DFA is left without one.
     * @param id Reference id of the state to be deleted
     */
    override deleteState(id: number): void {
        super.deleteState(id);

        if (id === this.startState) {
            this.startState = undefined;
        }
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
    addAutoTransition(
        from: number,
        to: number
    ): { success: boolean; error: null | string; tr_id?: number } {
        /**
         * This method does not have much utility on its own.
         * It's main aim is to aid in developing the web interface.
         * This method therefore does not throw errors, but rather returns a
         * success boolean or a string error in case of a failure for the frontend to parse.
         * I would not recommend using this if you are using fsm-engine progrmatically.
         * But hey if you want to use, who am I to stop you XD!
         */

        // Verify existance of from and to
        this.verifyStateExistance(from);
        this.verifyStateExistance(to);

        // Get the list of alphabets `from` already has a transition from
        const dfaGraph = this.makeTransitionTable().table;
        const usedAlphabets = new Set(dfaGraph.get(from)?.keys());
        const availableAlphabets =
            this.languageAlphabet.difference(usedAlphabets);

        if (availableAlphabets.size) {
            // Get the next available alphabet to make a transition
            const on = availableAlphabets.values().next().value ?? "";
            const id = this.addTransition(from, to, on);
            return {
                success: true,
                error: null,
                tr_id: id,
            };
        } else {
            return {
                success: false,
                error: `The State ${this.nodes.get(from)?.value} already has a transition for every alphabet in the language`,
            };
        }
    }

    /**
     * Check if a String is accepted by the DFA
     * @param str String to parse
     * @returns an object consisting path of states taken to reach the end and a boolean
     * indicating whether string is accepted or not
     */
    validateString(str: string): {
        path: number[];
        str: null | string;
        accepted: boolean;
    } {
        // Validate DFA
        this.validateDFA();

        let current: number = this.startState!;
        const path: number[] = [];

        // get dfa
        const dfa = this.makeTransitionTable().table;

        // make a copy of the inputString
        const res_string = str;

        while (str.length > 0) {
            const letter = str.charAt(0); // Get the first letter

            // Check if the current alphabet is part of language alphabet
            this.verifyAlphExistance(letter);

            // Add current state to path
            path.push(current);

            // Go to the next state
            const next = dfa.get(current)?.get(letter)?.[0];
            if (next === undefined) {
                // validateDFA already guarantees this can't happen for a valid DFA
                throw new Error(
                    `No transition from state ${current} on alphabet ${letter}`
                );
            }
            current = next;

            // Remove the first letter
            str = str.slice(1);
        }

        // Add the current state of exit to path
        path.push(current);

        return {
            path: path,
            str: res_string,
            accepted: this.getState(current).isEnd,
        };
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
        const trs = this.getState(tr.from).transitions.outgoing.union(
            this.getState(tr.from).transitions.self
        );

        let isUnique: { status: boolean; by: null | number } = {
            status: true,
            by: null,
        };

        // Check if `newLabel` is used by any other transition
        for (const tr_ of trs) {
            const tr__ = this.getTransition(tr_);
            if (tr__.on === newLabel) {
                if (!swap)
                    throw new Error(
                        `The Label ${newLabel} is set to the transition with id ${tr__.id}. Assign a Label that's free`
                    );
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
            this.transitions.set(isUnique.by as number, {
                ...this.getTransition(isUnique.by as number),
                on: old,
            });
            this.transitions.set(id, { ...tr, on: newLabel });
        }
    }

    /**
     * Saves Project working state, including the language alphabet and start state
     */
    override saveProject() {
        return {
            ...super.saveProject(),
            languageAlphabet: this.getAlphabets(),
            startState: this.startState,
        };
    }

    /**
     * Restore the DFA from a previously saved project data object.
     * Data saved without an alphabet or start state is repaired from the
     * transitions and the states' start flags.
     * @param projectData The data object generated by saveProject()
     */
    override loadProject(projectData: DFAProjectData): void {
        super.loadProject(projectData);

        const alphabets =
            projectData.languageAlphabet ??
            projectData.transitions.map(({ transition }) => transition.on);
        this.languageAlphabet.clear();
        this.addAlphabets(...alphabets);

        this.startState =
            projectData.startState ??
            Array.from(this.nodes.values()).find((state) => state.isStart)?.id;
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

    /********* MINIMIZATION AND REGEX *********/

    /**
     * Builds the smallest DFA that accepts the same language as this one.
     * Unreachable states are dropped and equivalent states are merged.
     * The states of the result are renamed q0, q1, ... with q0 being the start state,
     * and they get fresh ids, so any visual data keyed by id has to be rebuilt.
     *
     * The DFA must be valid, just like for `validateString`.
     * @param inPlace If true this DFA is replaced by the minimized one, instead of
     * leaving it untouched and returning a new DFA
     * @returns The minimized DFA (this DFA, when `inPlace` is true)
     */
    minimize(inPlace: boolean = false): DFA {
        this.validateDFA();

        const alphabet = this.getAlphabets();
        const table = this.makeTransitionTable().table;
        const stepFrom = (state: number, symbol: string): number =>
            table.get(state)!.get(symbol)![0]!;

        // Only states that can be reached from the start state matter.
        // Walking the graph breadth first also gives the states a stable order.
        const reachable: number[] = [this.startState!];
        for (let i = 0; i < reachable.length; i++) {
            for (const symbol of alphabet) {
                const next = stepFrom(reachable[i]!, symbol);
                if (!reachable.includes(next)) reachable.push(next);
            }
        }

        // Groups states that share the same key, numbering the groups by first appearance.
        const groupBy = (
            keyOf: (state: number) => string
        ): Map<number, number> => {
            const groupOfKey = new Map<string, number>();
            const groupOfState = new Map<number, number>();

            for (const state of reachable) {
                const key = keyOf(state);
                if (!groupOfKey.has(key)) groupOfKey.set(key, groupOfKey.size);
                groupOfState.set(state, groupOfKey.get(key)!);
            }
            return groupOfState;
        };

        // Start with accepting and non-accepting states in separate groups, then keep
        // splitting groups whose states disagree on which group an alphabet leads to.
        // Splitting can only increase the group count, so the groups are final
        // once the count stops growing.
        let groupOf = groupBy((state) => String(this.getState(state).isEnd));
        let groupCount = new Set(groupOf.values()).size;

        while (true) {
            const current = groupOf;
            const refined = groupBy(
                (state) =>
                    `${current.get(state)}|` +
                    alphabet
                        .map((symbol) => current.get(stepFrom(state, symbol)))
                        .join(",")
            );
            const refinedCount = new Set(refined.values()).size;

            groupOf = refined;
            if (refinedCount === groupCount) break;
            groupCount = refinedCount;
        }

        // One state per group, taking its transitions from any member.
        // The start state is the first reachable state, so its group is always 0.
        const delta: number[][] = Array.from({ length: groupCount }, () => []);
        const accepting = new Set<number>();
        const seenGroups = new Set<number>();

        for (const state of reachable) {
            const group = groupOf.get(state)!;
            if (seenGroups.has(group)) continue;
            seenGroups.add(group);

            delta[group] = alphabet.map(
                (symbol) => groupOf.get(stepFrom(state, symbol))!
            );
            if (this.getState(state).isEnd) accepting.add(group);
        }

        const minimized = this.buildDFA(alphabet, delta, 0, accepting);
        return inPlace ? this.replaceWith(minimized) : minimized;
    }

    /**
     * Writes the language of this DFA as a regular expression, using state elimination.
     * Uses `+` for union, `*` for repetition and `()` for grouping. Symbols that are
     * special in this syntax are escaped with a backslash, so the result can be read
     * back by `fromRegex`. Alphabet symbols are expected to be a single character each.
     *
     * The DFA only needs a start state, it doesn't have to be a complete DFA.
     * @throws if the DFA accepts no string at all, or if it accepts the empty string in
     * a way that can't be written without an `ε` symbol (`ε` is not part of the syntax)
     */
    toRegex(): string {
        this.verifyStartState();
        const start = this.startState!;

        // The language is the union of what leads from the start state to each end state
        const alternatives: RegexPart[] = [];
        let needsEmptyString = false;

        for (const state of this.nodes.values()) {
            if (!state.isEnd) continue;

            const route = this.regexBetween(start, state.id);

            if (route) {
                alternatives.push(route);
            } else if (state.id === start) {
                // The start state accepts, and no route leads back to it. The empty string
                // is accepted, but there is no star around to write it with.
                needsEmptyString = true;
            }
        }

        if (needsEmptyString) {
            throw new Error(
                "This DFA accepts the empty string in a way that can't be written without ε."
            );
        }
        if (alternatives.length === 0) {
            throw new Error(
                "This DFA accepts no strings, so there is no regex to write."
            );
        }

        return alternatives.reduce<RegexPart | undefined>(
            unionParts,
            undefined
        )!.text;
    }

    /**
     * Builds a DFA that accepts exactly the language of a regular expression.
     *
     * Supported syntax: `+` union, `*` repetition, `()` grouping, and `\` to use a
     * special character as a plain symbol. Every other character must be a symbol of
     * this DFA's language alphabet.
     *
     * The result uses this DFA's language alphabet, is minimized, and its states are
     * named q0, q1, ... with q0 as start state.
     * @param regex The regular expression
     * @param inPlace If true this DFA is replaced by the new one, instead of
     * leaving it untouched and returning a new DFA
     * @returns The DFA for the regex (this DFA, when `inPlace` is true)
     */
    fromRegex(regex: string, inPlace: boolean = false): DFA {
        const syntaxTree = parseRegex(regex);

        // Only symbols of the language alphabet can be used
        for (const symbol of collectSymbols(syntaxTree)) {
            this.verifyAlphExistance(symbol);
        }
        const alphabet = this.getAlphabets();

        // Regex -> NFA with ε moves (Thompson's construction)
        const nfa = buildNfa(syntaxTree);

        // NFA -> DFA (subset construction). Every DFA state stands for a set of NFA states.
        // The set can be empty, which becomes the dead state that makes the DFA complete.
        const keyOf = (set: Set<number>) =>
            Array.from(set)
                .sort((a, b) => a - b)
                .join(",");

        const subsets: Set<number>[] = [
            epsilonClosure(new Set([nfa.start]), nfa.edges),
        ];
        const indexOfSubset = new Map<string, number>([
            [keyOf(subsets[0]!), 0],
        ]);
        const delta: number[][] = [];

        // `subsets` grows while we loop, as new subsets are found
        for (let i = 0; i < subsets.length; i++) {
            const row: number[] = [];

            for (const symbol of alphabet) {
                const target = epsilonClosure(
                    moveOn(subsets[i]!, symbol, nfa.edges),
                    nfa.edges
                );
                const key = keyOf(target);

                if (!indexOfSubset.has(key)) {
                    indexOfSubset.set(key, subsets.length);
                    subsets.push(target);
                }
                row.push(indexOfSubset.get(key)!);
            }
            delta.push(row);
        }

        const accepting = new Set<number>();
        subsets.forEach((subset, index) => {
            if (subset.has(nfa.accept)) accepting.add(index);
        });

        const minimized = this.buildDFA(
            alphabet,
            delta,
            0,
            accepting
        ).minimize();
        return inPlace ? this.replaceWith(minimized) : minimized;
    }

    /********* HELPER FUNCTIONS *********/

    /**
     * Builds a new DFA from a plain transition table.
     * The states get the ids 0, 1, 2, ... and are named q0, q1, q2, ...
     * @param alphabet Language alphabet of the new DFA
     * @param delta `delta[state][i]` is the state reached from `state` on `alphabet[i]`
     * @param start The start state
     * @param accepting The end states
     */
    private buildDFA(
        alphabet: string[],
        delta: number[][],
        start: number,
        accepting: Set<number>
    ): DFA {
        const dfa = new DFA(this.name);
        dfa.addAlphabets(...alphabet);

        for (let state = 0; state < delta.length; state++) {
            dfa.addState(`q${state}`);
        }

        dfa.setStart(start);
        for (const state of accepting) dfa.setEnd(state);

        delta.forEach((row, from) => {
            row.forEach((to, i) => dfa.addTransition(from, to, alphabet[i]!));
        });

        return dfa;
    }

    /**
     * Regex for every way to get from one state to another, found by eliminating
     * all the other states. A transition from `a` to `b` is a labelled edge, and removing a
     * state `k` replaces every `a -> k -> b` path with a direct edge labelled `a k* b`.
     * @returns The regex, or undefined when there is no route. When `from` and `to`
     * are the same state and no route leads back to it, the only "route" is to stay
     * put, which is the empty string. That is also reported as undefined.
     */
    private regexBetween(from: number, to: number): RegexPart | undefined {
        const edges = new Map<number, Map<number, RegexPart>>();

        const addEdge = (source: number, target: number, label: RegexPart) => {
            const outgoing = edges.get(source) ?? new Map<number, RegexPart>();
            edges.set(source, outgoing);
            outgoing.set(target, unionParts(outgoing.get(target), label));
        };

        for (const transition of this.transitions.values()) {
            addEdge(transition.from, transition.to, symbolPart(transition.on));
        }

        for (const removed of this.nodes.keys()) {
            if (removed === from || removed === to) continue;

            const loop = edges.get(removed)?.get(removed);
            const repeatLoop = loop && starPart(loop);

            const entering: [number, RegexPart][] = [];
            for (const [source, outgoing] of edges) {
                if (source !== removed && outgoing.has(removed)) {
                    entering.push([source, outgoing.get(removed)!]);
                }
            }
            const leaving = Array.from(edges.get(removed) ?? []).filter(
                ([target]) => target !== removed
            );

            for (const [source, enterLabel] of entering) {
                for (const [target, leaveLabel] of leaving) {
                    addEdge(
                        source,
                        target,
                        concatAll([enterLabel, repeatLoop, leaveLabel])!
                    );
                }
            }

            edges.delete(removed);
            for (const outgoing of edges.values()) outgoing.delete(removed);
        }

        // Only `from` and `to` are left
        const loopAtFrom = edges.get(from)?.get(from);
        const repeatFromLoop = loopAtFrom && starPart(loopAtFrom);

        if (from === to) return repeatFromLoop;

        const forward = edges.get(from)?.get(to);
        if (!forward) return undefined;

        // Once at `to`, it can loop on itself or go back through `from` and return
        const backward = edges.get(to)?.get(from);
        const loopAtTo = edges.get(to)?.get(to);
        const roundTrip =
            backward && concatAll([backward, repeatFromLoop, forward]);
        const toLoops = roundTrip ? unionParts(loopAtTo, roundTrip) : loopAtTo;

        return concatAll([
            repeatFromLoop,
            forward,
            toLoops && starPart(toLoops),
        ]);
    }

    /**
     * Makes this DFA a copy of another one, reusing this DFA's own maps.
     * Keeping the same maps matters because the web app shares them with its stores.
     * @param other The DFA to copy
     * @returns This DFA
     */
    private replaceWith(other: DFA): DFA {
        this.loadProject(other.saveProject());
        return this;
    }

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
                    throw new Error(
                        `State ${this.getState(state).value} must have exactly one transition on alphabet ${alph}`
                    );
                }
            }
        }
    }
}

/********* REGEX HELPERS *********/

/**
 * A piece of regex text. `kind` records the outermost operator, so that
 * parentheses are only added where they are needed.
 */
interface RegexPart {
    text: string;
    kind: "atom" | "star" | "concat" | "union";
}

/** Characters that have a meaning in the regex syntax and must be escaped to be used as symbols */
const SPECIAL_CHARACTERS = new Set(["*", "+", "(", ")", "\\"]);

function symbolPart(symbol: string): RegexPart {
    const text = SPECIAL_CHARACTERS.has(symbol) ? `\\${symbol}` : symbol;
    return { text, kind: "atom" };
}

/** `a+b`. A missing `a` is the empty language, so only `b` is left. */
function unionParts(a: RegexPart | undefined, b: RegexPart): RegexPart {
    if (a === undefined || a.text === b.text) return b;
    return { text: `${a.text}+${b.text}`, kind: "union" };
}

/** `ab` */
function concatParts(a: RegexPart, b: RegexPart): RegexPart {
    const left = a.kind === "union" ? `(${a.text})` : a.text;
    const right = b.kind === "union" ? `(${b.text})` : b.text;
    return { text: left + right, kind: "concat" };
}

/** `a*` */
function starPart(a: RegexPart): RegexPart {
    if (a.kind === "star") return a;

    const inner = a.kind === "atom" ? a.text : `(${a.text})`;
    return { text: `${inner}*`, kind: "star" };
}

/**
 * Joins parts one after another. Missing parts are skipped, as a missing part
 * stands for "nothing to write" (the empty string) here.
 * @returns undefined if every part is missing
 */
function concatAll(parts: (RegexPart | undefined)[]): RegexPart | undefined {
    return parts.reduce<RegexPart | undefined>(
        (joined, part) =>
            joined && part ? concatParts(joined, part) : (joined ?? part),
        undefined
    );
}

/** The structure of a parsed regex */
type RegexNode =
    | { type: "symbol"; symbol: string }
    | { type: "union"; left: RegexNode; right: RegexNode }
    | { type: "concat"; left: RegexNode; right: RegexNode }
    | { type: "star"; operand: RegexNode };

/**
 * Reads a regex into a tree.
 * Grammar, from loosest to tightest binding:
 *   union  := concat ("+" concat)*
 *   concat := repeat repeat*
 *   repeat := atom "*"*
 *   atom   := "(" union ")" | "\" symbol | symbol
 * @throws if the regex is malformed
 */
function parseRegex(regex: string): RegexNode {
    let pos = 0;

    const parseUnion = (): RegexNode => {
        let node = parseConcat();
        while (regex.charAt(pos) === "+") {
            pos++;
            node = { type: "union", left: node, right: parseConcat() };
        }
        return node;
    };

    const parseConcat = (): RegexNode => {
        let node = parseRepeat();
        while (
            pos < regex.length &&
            regex.charAt(pos) !== "+" &&
            regex.charAt(pos) !== ")"
        ) {
            node = { type: "concat", left: node, right: parseRepeat() };
        }
        return node;
    };

    const parseRepeat = (): RegexNode => {
        let node = parseAtom();
        while (regex.charAt(pos) === "*") {
            pos++;
            node = { type: "star", operand: node };
        }
        return node;
    };

    const parseAtom = (): RegexNode => {
        const start = pos;
        const char = regex.charAt(pos++);

        switch (char) {
            case "(": {
                const inner = parseUnion();
                if (regex.charAt(pos) !== ")") {
                    throw new Error(
                        `Missing ")" to close the "(" at position ${start} of the regex.`
                    );
                }
                pos++;
                return inner;
            }
            case "*":
                throw new Error(
                    `Nothing to repeat before "*" at position ${start} of the regex.`
                );
            case "":
            case "+":
            case ")":
                throw new Error(
                    `Expected a symbol or "(" at position ${start} of the regex.`
                );
            case "\\":
                if (pos >= regex.length) {
                    throw new Error(
                        `The regex ends with a "\\" that escapes nothing.`
                    );
                }
                return { type: "symbol", symbol: regex.charAt(pos++) };
            default:
                return { type: "symbol", symbol: char };
        }
    };

    const tree = parseUnion();
    if (pos < regex.length) {
        throw new Error(`Unexpected ")" at position ${pos} of the regex.`);
    }
    return tree;
}

/** All the symbols that appear in a parsed regex */
function collectSymbols(
    node: RegexNode,
    symbols = new Set<string>()
): Set<string> {
    switch (node.type) {
        case "symbol":
            symbols.add(node.symbol);
            break;
        case "union":
        case "concat":
            collectSymbols(node.left, symbols);
            collectSymbols(node.right, symbols);
            break;
        case "star":
            collectSymbols(node.operand, symbols);
            break;
    }
    return symbols;
}

/********* NFA HELPERS *********/

/** A move of an NFA. `on` is null for an ε move, which consumes no input. */
interface NfaEdge {
    on: string | null;
    to: number;
}

/** An NFA with ε moves. `edges[state]` lists the moves out of `state`. */
interface Nfa {
    edges: NfaEdge[][];
    start: number;
    accept: number;
}

/**
 * Thompson's construction: builds an NFA with a single start and a single accept state
 * out of small pieces, one for each part of the regex.
 */
function buildNfa(tree: RegexNode): Nfa {
    const edges: NfaEdge[][] = [];

    const newState = (): number => edges.push([]) - 1;
    const connect = (from: number, to: number, on: string | null = null) => {
        edges[from]!.push({ on, to });
    };

    const build = (node: RegexNode): { start: number; accept: number } => {
        const start = newState();
        const accept = newState();

        switch (node.type) {
            case "symbol":
                connect(start, accept, node.symbol);
                break;
            case "concat": {
                const left = build(node.left);
                const right = build(node.right);
                connect(start, left.start);
                connect(left.accept, right.start);
                connect(right.accept, accept);
                break;
            }
            case "union": {
                const left = build(node.left);
                const right = build(node.right);
                connect(start, left.start);
                connect(start, right.start);
                connect(left.accept, accept);
                connect(right.accept, accept);
                break;
            }
            case "star": {
                const inner = build(node.operand);
                connect(start, inner.start);
                connect(start, accept);
                connect(inner.accept, inner.start);
                connect(inner.accept, accept);
                break;
            }
        }
        return { start, accept };
    };

    return { edges, ...build(tree) };
}

/** Every NFA state reachable from `states` using only ε moves (including `states` themselves) */
function epsilonClosure(states: Set<number>, edges: NfaEdge[][]): Set<number> {
    const closure = new Set(states);
    const pending = Array.from(states);

    while (pending.length > 0) {
        const state = pending.pop()!;
        for (const edge of edges[state]!) {
            if (edge.on === null && !closure.has(edge.to)) {
                closure.add(edge.to);
                pending.push(edge.to);
            }
        }
    }
    return closure;
}

/** The NFA states reached from `states` by consuming `symbol` (before following ε moves) */
function moveOn(
    states: Set<number>,
    symbol: string,
    edges: NfaEdge[][]
): Set<number> {
    const reached = new Set<number>();

    for (const state of states) {
        for (const edge of edges[state]!) {
            if (edge.on === symbol) reached.add(edge.to);
        }
    }
    return reached;
}
