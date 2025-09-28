/*
 * This file has all the functions that are used in the Editor Component
 */

import {
  node_list,
  editor_state,
  store,
  stage_ref,
  deleted_nodes,
  current_selected,
  initial_state,
  transition_pairs,
  transition_list,
} from "./stores";

// Handler function that is called when the editor is clicked
export function HandleEditorClick(e) {
  const group = e.target.getStage().findOne("Layer");
  if (!group) return;

  if (store.get(editor_state) == "Add") {
    // Add a new State to the editor if it is in Add Mode
    const clickPos = group.getRelativePointerPosition();

    let circle_id = store.get(node_list).length;

    if (store.get(deleted_nodes).length > 0) {
      // Check if a deleted state id is available
      circle_id = store.get(deleted_nodes)[0];
      store.set(deleted_nodes, (prev) => {
        prev.shift();
        return prev;
      });
    }

    const circle = makeCircle(clickPos, circle_id);
    const nodes_copy = store.get(node_list).slice();

    if (circle_id != nodes_copy.length) {
      nodes_copy[circle_id] = circle;
    } else {
      if (circle_id == 0) {
        // This is the first state and so the initial one
        if (store.get(initial_state) == null)
          store.set(initial_state, (_) => 0);
      }
      nodes_copy.push(circle);
    }

    store.set(node_list, (prev) => nodes_copy); // Update Node List
  }
}

// Handler function to update Position of nodes when they are dragged around
export function HandleDragEnd(e, id) {
  const draggedState = store.get(stage_ref).findOne(`#state_${id}`); // Get the Circle
  const position = [draggedState.x(), draggedState.y()]; // Get it's positions
  // Update the State's Position
  store.set(node_list, (prev) => {
    prev[id].x = position[0];
    prev[id].y = position[1];
    return prev;
  });
}

// Handler Function for when a State is clicked
export function HandleStateClick(e, id) {
  const clickType =
    e.evt.button == 0 ? "left" : e.evt.button == 2 ? "right" : "middle";

  if (clickType == "right") {
    // Set Current Selected to the node's id
    store.set(current_selected, (prev) => id);
    // Open the Settings for the State on right Click
    store.set(editor_state, (prev) => "settings");
    return;
  }

  const clickedNode = store.get(stage_ref).findOne(`#state_${id}`);

  if (store.get(editor_state) == "Remove") {
    clickedNode.destroy(); // Remove it from the editor

    // Add the deleted Node to list of delete nodes
    store.set(deleted_nodes, (prev) => {
      prev.push(id);
      prev.sort();
      return prev;
    });

    // If the node was a initial node set the initial_node to null
    if (store.get(initial_state) == id) {
      store.set(initial_state, (_) => null);
    }

    // Remove all transitions this state has
    store.get(node_list)[id].transitions.forEach((tr) => {
      const transition = store.get(stage_ref).findOne(`#tr_${tr.tr_name}`);
      transition.destroy();

      // Update the transition List store
      store.set(transition_list, (prev) => {
        prev[tr.tr_name] = undefined;
        return prev;
      });

      // Also delete the entry of this transition in in the second node involved
      if (tr.from == id && tr.from != tr.to) {
        const end_node_transitions = store.get(node_list)[tr.to].transitions;
        const filtered_transitions = end_node_transitions.filter(
          (val, _) => val.tr_name != tr.tr_name
        );
        // Update the store
        store.set(node_list, (prev) => {
          prev[tr.to].transitions = filtered_transitions;
          return prev;
        });
      }

      // Other Case
      if (tr.to == id && tr.from != tr.to) {
        const end_node_transitions = store.get(node_list)[tr.from].transitions;
        const filtered_transitions = end_node_transitions.filter(
          (val, _) => val.tr_name != tr.tr_name
        );
        // Update the store
        store.set(node_list, (prev) => {
          prev[tr.from].transitions = filtered_transitions;
          return prev;
        });
      }
    });

    // Remove State from the node_list store
    store.set(node_list, (prev) => {
      prev[id] = undefined;
      return prev;
    });

    return;
  }

  if (store.get(editor_state) == "Connect") {
    if (store.get(transition_pairs) == null) {
      // If this is the first state that is clicked, then remember it
      store.set(transition_pairs, (_) => id);
      return;
    } else {
      // Get the two states for drawing a transitions
      const start_node = store.get(transition_pairs);
      const end_node = id;

      const tr_id = store.get(transition_list).length;

      // Define a new Transition
      const newTransition = makeTransition(tr_id, start_node, end_node);

      // Update the transition_list store
      store.set(transition_list, (prev) => [...prev, newTransition]);

      // Reset the transition_pairs store
      store.set(transition_pairs, (_) => null);

      // Also update the corresponding state's transition array
      store.set(node_list, (prev) => {
        const tr = {
          from: start_node,
          to: end_node,
          tr_name: tr_id,
        };
        // Update for start node
        prev[start_node].transitions.push(tr);

        // Update for end node
        prev[end_node].transitions.push(tr);

        return prev;
      });
    }
  }
}

// Handler function for when the editor is scrolled
export function HandleScrollWheel(e) {
  // Zoom in or zoom out

  const stage = store.get(stage_ref);

  // Got this part of the code from Konva Documentation
  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  // how to scale? Zoom in? Or zoom out?
  let direction = e.evt.deltaY > 0 ? 1 : -1;

  // when we zoom on trackpad, e.evt.ctrlKey is true
  // in that case lets revert direction
  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  const scaleBy = 1.01;
  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };

  stage.position(newPos);
}

// Function to update the positions of transition arrows when a node is dragged around
export function HandleStateDrag(e, id) {
  const state = store.get(node_list)[id]; // Get the state

  const group = store.get(stage_ref).findOne("Group");
  let transition;
  let transition_label;

  state.transitions.forEach((tr) => {
    console.log("Moving...");
    transition = group.findOne(`#transition_${tr.tr_name}`);
    transition_label = group.findOne(`#trtext_${tr.tr_name}`);

    const points = getTransitionPoints(tr.from, tr.to);

    // Update it in store
    store.set(transition_list, (prev) => {
      prev[tr.tr_name].points = points;
      return prev;
    });

    transition.points(points); // Update it on display

    // Update transition Label display
    transition_label.x(points[2] - 2 * `tr${tr.tr_name}`.length);
    transition_label.y(points[3] - 30);
  });
}

/************** HELPER FUNCTIONS ***************/
/*
 * This function takes the x,y position of the circle and
 * returns a circle object that can be added to node_list as a state
 */
function makeCircle(position, id) {
  const x = position.x;
  const y = position.y;

  const circle = {
    id: `${id}`,
    x: x,
    y: y,
    name: `q${id}`,
    fill: "#ffffff80",
    radius: `q${id}`.length + 35,
    type: {
      initial: id == 0,
      intermediate: id != 0,
      final: false,
    },
    transitions: [], // This will have the object {from: num,to: num,tr_name: number,}
  };
  return circle;
}

// This function returns the points for the
// state transition arrow between states id1 and id2
export function getTransitionPoints(id1, id2) {
  if (id1 == id2) {
    // Self-loop
    const node = store.get(node_list)[id1];
    const x = node.x;
    const y = node.y;
    const radius = node.radius;
    const offset = 30;

    const points = [
      x - radius / 1.5,
      y - radius, // Start point (left of the node)
      x,
      y - radius - 2 * offset, // Control point (top)
      x + radius / 1.5,
      y - radius, // End point (right of the node)
    ];

    return points;
  }

  const clickedGroup = store.get(node_list)[id2];

  const startNode = store.get(node_list)[id1];

  const dx = clickedGroup.x - startNode.x;
  const dy = clickedGroup.y - startNode.y;
  let angle = Math.atan2(-dy, dx);

  const startRadius = startNode.radius + 10;
  const endRadius = clickedGroup.radius + 10;

  const start = [
    startNode.x + -startRadius * Math.cos(angle + Math.PI),
    startNode.y + startRadius * Math.sin(angle + Math.PI),
  ];

  const end = [
    clickedGroup.x + -endRadius * Math.cos(angle),
    clickedGroup.y + endRadius * Math.sin(angle),
  ];

  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

  const dist = Math.sqrt((start[0] - end[0]) ** 2 + (start[1] - end[1]) ** 2);

  let subpoint2;

  // Adjust the subpoint 2 based on if the states
  // are arranged horizontally or vertically
  const xdiff = Math.abs(start[0] - end[0]);
  const ydiff = Math.abs(start[1] - end[1]);
  if (xdiff > ydiff) {
    // States are arranged horizontally
    subpoint2 =
      start[0] < end[0]
        ? [midpoint[0], midpoint[1] - 0.2 * dist]
        : [midpoint[0], midpoint[1] + 0.2 * dist];

    end[1] = start[0] < end[0] ? end[1] - 20 : end[1] + 20;
  } else {
    // States are arranged vertically
    subpoint2 =
      start[1] < end[1]
        ? [midpoint[0] + 0.2 * dist, midpoint[1]]
        : [midpoint[0] - 0.2 * dist, midpoint[1]];

    end[0] = start[1] < end[1] ? end[0] + 20 : end[0] - 20;
  }

  const points = [
    start[0],
    start[1],
    subpoint2[0],
    subpoint2[1],
    end[0], // Prevent overlapping of arrow heads
    end[1],
  ];

  return points;
}

function makeTransition(id, start_node, end_node) {
  const points = getTransitionPoints(start_node, end_node);

  const newTransition = {
    id: id,
    stroke: "#ffffffdd",
    strokeWidth: 2,
    fill: "#ffffffdd",
    points: points,
    tension: start_node == end_node ? 1 : 0.5,
    name: `tr${id}`,
    fontSize: 20,
    fontStyle: "bold",
    name_fill: "#ffffff",
    name_align: "center",
    from: start_node,
    to: end_node,
  };

  return newTransition;
}
