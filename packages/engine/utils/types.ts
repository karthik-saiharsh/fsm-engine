/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */


/**
 * @fileoverview This file houses all the type declarations for the FSM Engine.
 */


/**
 * Types of State Machines Supported.
 */
export enum EngineTypes {
    /** No restriction on language grammar. */
    FREE,
    /** Deterministic Finite Automaton. */
    DFA,
    /** Non-deterministic Finite Automaton. */
    NFA
}

/**
 * Represents a single state (node) in the state machine.
 */
export interface State {
    id: number;
    value: string;
    transitions: { incoming: Set<number>, outgoing: Set<number> };
}

/**
 * Represents a single transition between states.
 */
export interface Transition {
    id: number;
    from: number;
    to: number;
    on: string;
}