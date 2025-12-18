/*
This file contains all the algorithmic implementations
*/
import { HandleAutoLayout } from "./editor";
import {
  deleted_nodes,
  engine_mode,
  node_list,
  store,
  transition_list,
  alert,
  initial_state,
} from "./stores";

export async function HandleLoadFSM() {
  // Create a hidden file input
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".fsm,application/json";

  // Handle file selection
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const data = JSON.parse(text); // assign to global variable
      store.set(node_list, () => data.nodes);
      store.set(transition_list, () => data.transitions);
      store.set(deleted_nodes, () => data.deleted_nodes);
      store.set(engine_mode, () => data.engine_mode);
    } catch (err) {
      console.error("Invalid JSON:", err);
    }

    // Clean up
    document.body.removeChild(input);

    HandleAutoLayout(); // Format the FSM
  };

  document.body.appendChild(input);
  input.click();
}

export function getTransitionDetails(transitions, id) {
  let end_nodes = [];
  // Create arrays for each of the alphabets
  const alphabets = store.get(engine_mode).alphabets;

  alphabets.forEach((alpha) => {
    const valid_trs = transitions.filter((tr) => {
      const transitionObj = store.get(transition_list)[tr.tr_name];
      return (
        transitionObj && tr.from == id && transitionObj.name.includes(alpha)
      );
    });
    const valid_states = valid_trs.map((tr) => ({
      id: tr.to,
      name: store.get(node_list)[tr.to].name,
    }));
    end_nodes.push(valid_states);
  });
  return end_nodes;
}

/************ HELPER FUNCTIONS *************/
export function getGraph() {
  // This functions returns an adjacency list representation of the Automata
  const NodeList = store.get(node_list);
  const TransitionList = store.get(transition_list);
  const Graph = {}; // Graph DS

  NodeList.forEach((node) => {
    if (node) {
      // Make sure node ain't null
      const id = node.id;
      const transitions = [];

      node.transitions.forEach((tr) => {
        if (tr.from == id) {
          transitions.push({
            to: tr.to,
            id: tr.tr_name,
            on: TransitionList[tr.tr_name].name,
          });
        }
      });

      Graph[id] = {
        name: node.name,
        transitions: transitions,
      };
    }
  });

  return Graph;
}

export function getAlphabetsFor(nodeId) {
  // Returns all the alphabets that a node consumes
  const graph = getGraph();
  const node = graph[nodeId];
  const alphabets = node.transitions.map((tr) => tr.on);
  return alphabets.flat();
}

export function validateDFA() {
  // This Function simply checks if every state has transitions upon all letters of the language
  const graph = getGraph();
  const nodes = Object.keys(graph);
  const alphabets_per_node = nodes.map((n) => getAlphabetsFor(n));
  const alphabets = store.get(engine_mode).alphabets;

  // If there is no initial state, alert the user
  if (store.get(initial_state) === null) {
    store.set(alert, () => "The DFA Does not have a Initial State!"); // Display the error
    setTimeout(() => store.set(alert, () => ""), 3500);
    return false;
  }

  for (let i = 0; i < alphabets_per_node.length; i++) {
    // If there exists a state that has not consumed all the alphabets of the language, alert the user
    if (alphabets_per_node[i].filter(Boolean).length != alphabets.length) {
      store.set(
        alert,
        () =>
          `State '${
            graph[nodes[i]].name
          }' does not consume all input alphabets!`
      ); // Display the error
      setTimeout(() => store.set(alert, () => ""), 3500);
      return false;
    }
  }

  return true;
}

export function getDFAGraph() {
  // This functions returns an adjacency list representation of the Automata that is easy to process for a DFA
  // Here the transitions of each node are represented in the POV of the alphabet
  const NodeList = store.get(node_list);
  const TransitionList = store.get(transition_list);
  const nodes = Object.keys(NodeList);
  let graph = {};

  for (let i = 0; i < nodes.length; i++) {
    const node = NodeList[nodes[i]];
    const id = node.id;
    const name = node.name;
    let transitions = {};

    node.transitions.forEach((tr) => {
      if (tr.from === id) {
        // For Each transition going out from this node
        const transition = TransitionList[tr.tr_name];
        const to = transition.to;
        const to_name = NodeList[to].name;
        const tr_alph = transition.name.filter(Boolean);

        tr_alph.forEach((alph) => {
          transitions[alph] = {
            to: to,
            tname: to_name,
          };
        });
      }
    });

    graph[id] = {
      name: name,
      transitions: transitions,
    };
  }
  return graph;
}

export function getNodes() {
  // Returns a list of all the nodes (indices in node_list that ain't null)
  const NodeList = store.get(node_list);
  const return_val = NodeList.map((node, id) => {
    if (node != undefined) return id;
  }).filter((node) => node != undefined);
  return return_val;
}

export function getNFAGraph() {
  // Returns the NFA Graph in adjacency list format

  const nodes = getNodes();
  const NodeList = store.get(node_list);
  const TransitionList = store.get(transition_list);

  // Make this into a JS Object
  const graph = {};

  nodes.forEach((id) => {
    graph[id] = {
      name: NodeList[id].name,
      isStart: NodeList[id].type.initial,
      isFinal: NodeList[id].type.final,
      transitions: {},
    };
  });

  TransitionList.forEach((tr) => {
    tr.name.forEach((alph) => {
      if (graph[tr.from].transitions[alph]) {
        graph[tr.from].transitions[alph].push(tr.to);
      } else {
        graph[tr.from].transitions[alph] = [tr.to];
      }
    });
  });

  return graph;
}

export function epsilonClosure(nfa_graph, state_set) {
  // This function computes the epsilon closure of a set of states in an NFA
  let closure = new Set(state_set);
  let stack = [...state_set];

  while (stack.length > 0) {
    const state = stack.pop();
    const transitions = nfa_graph[state].transitions;

    if (transitions["λ"]) {
      transitions["λ"].forEach((next_state) => {
        if (!closure.has(next_state)) {
          closure.add(next_state);
          stack.push(next_state);
        }
      });
    }
  }

  return Array.from(closure);
}

export function nfa_acceptsString(nfa_graph, input_string) {
  // This function checks if the NFA accepts the given input string
  let current_states = epsilonClosure(
    nfa_graph,
    Object.keys(nfa_graph).filter((state) => nfa_graph[state].isStart)
  );

  const start_state = Object.keys(nfa_graph).find(
    (state) => nfa_graph[state].isStart
  );
  let instantaneous_desc = [[nfa_graph[start_state].name, input_string]];

  while (input_string.length > 0) {
    const symbol = input_string[0];
    let next_states = new Set();

    for (let i = 0; i < current_states.length; i++) {
      const state = current_states[i];
      const transitions = nfa_graph[state].transitions;
      if (transitions[symbol]) {
        transitions[symbol].forEach((next_state) => {
          next_states.add(next_state);
        });
      } else {
        instantaneous_desc.push(false); // If there is no valid transition, the string is rejected
        return instantaneous_desc;
      }

      input_string = input_string.substr(1);
      // Record instantaneous description
      instantaneous_desc.push([
        current_states.map((s) => nfa_graph[s].name).join(", "),
        input_string,
      ]);
    }

    current_states = epsilonClosure(nfa_graph, Array.from(next_states));
  }

  instantaneous_desc.push(
    current_states.some((state) => nfa_graph[state].isFinal)
  ); // The last value is a boolean whether the string is accepted or otherwise
  return instantaneous_desc;
}

export function validateString(str) {
  const engine_type = store.get(engine_mode).type;

  if (str.trim().length == 0) return;

  if (engine_type === "DFA") {
    const isValid = validateDFA();
    if (!isValid) return; // Only proceed if DFA Is Valid

    const graph = getDFAGraph();
    let curr_state = store.get(initial_state);
    let instantaneous_desc = [[graph[curr_state].name, str]];

    while (str.length > 0) {
      const letter = str[0];
      curr_state = graph[curr_state].transitions[letter].to;
      str = str.substr(1);
      instantaneous_desc.push([graph[curr_state].name, str]);
    }

    instantaneous_desc.push(store.get(node_list)[curr_state].type.final); // The last value is a boolean whether the string is accepted or otherwise
    return instantaneous_desc;
  }

  if (engine_type === "NFA") {
    const nfa_graph = getNFAGraph();
    const isAccepted = nfa_acceptsString(nfa_graph, str);
    return isAccepted;
  }
}
