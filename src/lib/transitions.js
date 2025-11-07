import {
  store,
  show_popup,
  active_transition,
  transition_list,
  stage_ref,
} from "./stores";

// Handle a click event on a transition
export function handleTransitionClick(id) {
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
  const displayText = store.get(stage_ref).findOne(`#trtext_${store.get(active_transition)}`);
  displayText.text(labels.toString());

  // Update Position in UI
  const points = store.get(transition_list)[store.get(active_transition)].points
  displayText.x(points[2] - 2 * labels.toString().length);
  store.set(active_transition, () => null);
}
