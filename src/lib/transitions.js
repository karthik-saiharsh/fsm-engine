import {
  store,
  show_popup,
  active_transition,
  transition_list,
  stage_ref,
  editor_state,
  node_list,
} from "./stores";

// Handle a click event on a transition
export function handleTransitionClick(id) {
  if (store.get(editor_state) == "Remove") {
    const from_state = store.get(transition_list)[id].from;
    const to_state = store.get(transition_list)[id].to;

    // Delete the Display arrow
    const transition = store.get(stage_ref).findOne(`#tr_${id}`);
    transition.destroy();

    // Remove this transition in store
    store.set(transition_list, (old) => {
      old[id] = undefined;
      return old;
    });

    // Remove this transition from Node
    store.set(node_list, (old) => {
      old[from_state].transitions = old[from_state].transitions.filter(
        (tr) => tr.from != from_state
      );
      old[to_state].transitions = old[to_state].transitions.filter(
        (tr) => tr.to != to_state
      );
      return old;
    });

    return;
  }
  store.set(show_popup, true);
  store.set(active_transition, () => id);
}

// Handle Save on Changing a Transition's Label
export function handleTransitionSave(labels) {
  // Update the New Labels in store
  store.set(show_popup, false);
  store.set(transition_list, (old) => {
    old[store.get(active_transition)].name = labels;
    return old;
  });

  // Update the new Labels in UI
  const displayText = store
    .get(stage_ref)
    .findOne(`#trtext_${store.get(active_transition)}`);
  displayText.text(labels.toString());

  // Update Position in UI
  const points =
    store.get(transition_list)[store.get(active_transition)].points;
  displayText.x(points[2] - 2 * labels.toString().length);
  store.set(active_transition, () => null);
}
