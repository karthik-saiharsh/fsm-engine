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
					`State '${graph[nodes[i]].name
					}' does not consume all input alphabets!`,
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
}
