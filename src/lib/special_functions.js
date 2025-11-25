import {
    active_transition,
    alert,
    current_selected,
    deleted_nodes,
    editor_state,
    engine_mode,
    initial_state,
    node_list,
    show_popup,
    stage_ref,
    store,
    transition_list,
    transition_pairs,
} from "./stores";
import { HandleAutoLayout } from "./editor";

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