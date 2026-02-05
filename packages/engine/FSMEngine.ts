/* Copyright (C) 2026 Illindala Karthik Saiharsh - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the GPL V3 license.
 * I would prefer it if you provide credits, in case you use my code for your projects :)
 */

import { type State, EngineTypes, type Transition } from "./utils/types";



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
  type: EngineTypes;
  /** HashMap of states (nodes) in the state machine. */
  nodes: Map<number, State> = new Map<number, State>();
  /** HashMap of transitions between states. */
  transitions: Map<number, Transition> = new Map<number, Transition>();

  constructor(type: EngineTypes) {
    this.type = type;
  }

  /**
   * Adds a New State To the Machine
   * @param state - Pass in the state you wish to add
   * @throws {Error} If a state with the same ID already exists
   * @returns The id of the new state added
   */
  public addState(state: State): number {
    if (this.nodes.has(state.id)) {
      throw new Error(`A State with ID ${state.id} already exists.`);
    }

    // Add this state to state store
    this.nodes.set(state.id, state);

    return state.id;
  }


  /**
   * Adds a New  To the Machine
   * @param transition - Pass in the transition you wish to add
   * @throws {Error} If the source or destination state does not exist
   * @returns The id of the new transition added
   */
  public addTransition(transition: Transition): number {

    // Verify existance of states
    if (!this.nodes.has(transition.from))
      throw new Error(`State with ID ${transition.from} does not exist.`);
    if (!this.nodes.has(transition.to))
      throw new Error(`State with ID ${transition.to} does not exist.`);

    // Add transition to engine
    this.transitions.set(transition.id, transition);

    // Add this transition to relevant states
    this.nodes.get(transition.from)?.transitions.outgoing.push(transition.id);
    this.nodes.get(transition.to)?.transitions.incoming.push(transition.id);

    return transition.id;
  }
}