import {
	active_transition,
	editor_state,
	node_list,
	show_popup,
	stage_ref,
	store,
	transition_list,
	engine_mode,
	alert,
} from "./stores";
import { addToHistory } from "./history";
import { getGraph, getAlphabetsFor } from "./special_functions";

// Handle a click event on a transition
export function handleTransitionClick(id) {
	if (store.get(editor_state) === "Remove") {
		const from_state = store.get(transition_list)[id].from;
		const to_state = store.get(transition_list)[id].to;

		// Delete the Display arrow
		const transition = store.get(stage_ref).findOne(`#tr_${id}`);
		transition.destroy();

		// Remove this transition in store
		store.set(transition_list, (old) => {
			const newTrList = [...old];
			newTrList[id] = undefined;
			return newTrList;
		});

		// Remove this transition from Node
		store.set(node_list, (old) => {
			const newNodes = [...old];

			newNodes[from_state] = {
				...newNodes[from_state],
				transitions: newNodes[from_state].transitions.filter(
					(tr) => tr.from !== from_state || tr.to !== to_state,
				),
			};

			if (from_state !== to_state) {
				newNodes[to_state] = {
					...newNodes[to_state],
					transitions: newNodes[to_state].transitions.filter(
						(tr) => tr.from !== from_state || tr.to !== to_state,
					),
				};
			}
			return newNodes;
		});
		addToHistory();
		return;
	}
	store.set(show_popup, true);
	store.set(active_transition, () => id);
}

// Handle Save on Changing a Transition's Label
export function handleTransitionSave(labels) {
	const automata_type = store.get(engine_mode).type;
	const active_tr = store.get(active_transition);
	const src_node = store.get(transition_list)[active_tr].from;

	if (automata_type === "DFA") {
		// If Automata is a DFA, don't allow multiple
		// transitions on the same alphabet from a state
		const consumed_letters = getAlphabetsFor(src_node);

		let err_msg = null;

		const new_letters = labels.filter(
			(alph) => !consumed_letters.includes(alph),
		);

		if (new_letters.length == 0) {
			err_msg = `State '${
				store.get(node_list)[src_node].name
			}' already has a transition on the alphabets you picked!`;
		}

		if (
			consumed_letters.filter(Boolean).length ===
			store.get(engine_mode).alphabets.length
		) {
			err_msg = `State '${
				store.get(node_list)[src_node].name
			}' has already consumed all letters in language`;
		}

		if (err_msg) {
			store.set(show_popup, () => false);
			store.set(alert, () => err_msg); // Display the error
			setTimeout(() => store.set(alert, () => ""), 3500);
			return; // dont' add the transition
		}
	}
	addToHistory();
	// Update the New Labels in store
	store.set(show_popup, false);
	store.set(transition_list, (old) => {
		const newTrList = [...old];
		if (newTrList[store.get(active_transition)]) {
			newTrList[store.get(active_transition)] = {
				...newTrList[store.get(active_transition)],
				name: labels.toSorted(), // Sort them before updating labels
			};
		}
		return newTrList;
	});

	// Update the new Labels in UI
	const displayText = store
		.get(stage_ref)
		.findOne(`#trtext_${store.get(active_transition)}`);
	displayText.text(labels.toString());

	// Update Position in UI
	const label = store
		.get(stage_ref)
		.findOne(`#tr_label${store.get(active_transition)}`);

	const points =
		store.get(transition_list)[store.get(active_transition)].points;

	label.x(points[2] - 2 * labels.toString().length);
	store.set(active_transition, () => null);
}
