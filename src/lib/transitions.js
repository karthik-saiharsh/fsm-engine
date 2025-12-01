import {
	active_transition,
	editor_state,
	node_list,
	show_popup,
	stage_ref,
	store,
	transition_list,
} from "./stores";
import { addToHistory } from "./history";

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
	addToHistory();
	// Update the New Labels in store
	store.set(show_popup, false);
	store.set(transition_list, (old) => {
		const newTrList = [...old];
		if (newTrList[store.get(active_transition)]) {
			newTrList[store.get(active_transition)] = {
				...newTrList[store.get(active_transition)],
				name: labels,
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
