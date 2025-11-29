import { HandleAutoLayout } from "./editor";
import {
	deleted_nodes,
	engine_mode,
	node_list,
	store,
	transition_list,
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
	const end_nodes = [];
	// Create arrays for each of the alphabets
	const alphabets = store.get(engine_mode).alphabets;

	alphabets.forEach((alpha) => {
		const valid_trs = transitions.filter(
			(tr) =>
				tr.from === id &&
				store.get(transition_list)[tr.tr_name].name.includes(alpha),
		);
		const valid_states = valid_trs.map(
			(tr) => store.get(node_list)[tr.to].name,
		);
		end_nodes.push(valid_states);
	});
	return end_nodes;
}
