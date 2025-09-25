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
    // Remove State
    store.set(node_list, (prev) => {
      prev[id] = undefined;
      return prev;
    });

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

    return;
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
    radius: 35,
    type: {
      initial: id == 0,
      intermediate: id != 0,
      final: false,
    },
  };
  return circle;
}
