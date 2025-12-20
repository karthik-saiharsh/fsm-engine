/*
 * This file has all the functions that are used in the Editor Component
 */

import dagre from "dagre";
import Konva from "konva";
import { addToHistory, clearHistory, redo, undo } from "./history";
import {
	active_transition,
	alert,
	confirm_dialog_atom,
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

// Handler function that is called when the editor is clicked
export function HandleEditorClick(e) {
	const group = e.target.getStage().findOne("Layer");
	if (!group) return;

	// Deselect if clicking on background
	if (e.target === e.target.getStage()) {
		store.set(current_selected, null);
	}

	if (store.get(editor_state) === "Add") {
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

		if (circle_id !== nodes_copy.length) {
			nodes_copy[circle_id] = circle;
		} else {
			if (circle_id === 0) {
				// This is the first state and so the initial one
				if (store.get(initial_state) == null)
					store.set(initial_state, (_) => 0);
			}
			nodes_copy.push(circle);
		}

		store.set(node_list, (_prev) => nodes_copy); // Update Node List
		addToHistory();
	}
}

// Handler function to update Position of nodes when they are dragged around
export function HandleDragEnd(_e, id) {
	const draggedState = store.get(stage_ref).findOne(`#state_${id}`); // Get the Circle
	const position = [draggedState.x(), draggedState.y()]; // Get it's positions
	// Update the State's Position in store
	store.set(node_list, (prev) => {
		const newNodes = [...prev];
		newNodes[id] = { ...newNodes[id], x: position[0], y: position[1] };
		return newNodes;
	});
	addToHistory();
}

// Handler Function for when a State is clicked
export function HandleStateClick(e, id) {
	e.cancelBubble = true;
	const clickType =
		e.evt.button === 0 ? "left" : e.evt.button === 2 ? "right" : "middle";

	if (clickType === "right") {
		// Set Current Selected to the node's id
		store.set(current_selected, (_prev) => id);
		// Open the Settings for the State on right Click
		store.set(editor_state, (_prev) => "settings");
		return;
	}

	const clickedNode = store.get(stage_ref).findOne(`#state_${id}`);

	if (store.get(editor_state) === "Remove") {
		// BugFix #49 - If the state is selected, deselect it before deleting
		if (id === store.get(current_selected))
			store.set(current_selected, () => null);

		clickedNode.destroy(); // Remove it from the editor

		// Add the deleted Node to list of delete nodes
		store.set(deleted_nodes, (prev) => {
			prev.push(id);
			prev.sort();
			return prev;
		});

		// If the node was a initial node set the initial_node to null
		if (store.get(initial_state) === id) {
			store.set(initial_state, (_) => null);
		}

		// Remove all transitions this state has
		store.get(node_list)[id].transitions.forEach((tr) => {
			const transition = store.get(stage_ref).findOne(`#tr_${tr.tr_name}`);
			transition.destroy();

			// Update the transition List store
			store.set(transition_list, (prev) => {
				const newTrList = [...prev];
				newTrList[tr.tr_name] = undefined;
				return newTrList;
			});

			// Also delete the entry of this transition in in the second node involved
			if (tr.from === id && tr.from !== tr.to) {
				const end_node_transitions = store.get(node_list)[tr.to].transitions;
				const filtered_transitions = end_node_transitions.filter(
					(val, _) => val.tr_name !== tr.tr_name,
				);
				// Update the store
				store.set(node_list, (prev) => {
					const newNodes = [...prev];
					newNodes[tr.to] = {
						...newNodes[tr.to],
						transitions: filtered_transitions,
					};
					return newNodes;
				});
			}

			// Other Case
			if (tr.to === id && tr.from !== tr.to) {
				const end_node_transitions = store.get(node_list)[tr.from].transitions;
				const filtered_transitions = end_node_transitions.filter(
					(val, _) => val.tr_name !== tr.tr_name,
				);
				// Update the store
				store.set(node_list, (prev) => {
					const newNodes = [...prev];
					newNodes[tr.from] = {
						...newNodes[tr.from],
						transitions: filtered_transitions,
					};
					return newNodes;
				});
			}
		});

		// Remove State from the node_list store
		store.set(node_list, (prev) => {
			const newNodes = [...prev];
			newNodes[id] = undefined;
			return newNodes;
		});

		addToHistory();
		return;
	}

	if (store.get(editor_state) === "Connect") {
		if (store.get(transition_pairs) == null) {
			// If this is the first state that is clicked, then remember it
			store.set(transition_pairs, (_) => id);
			store.set(current_selected, (_) => id); // Highlight the source node
			return;
		} else {
			// Get the two states for drawing a transitions
			const start_node = store.get(transition_pairs);
			const end_node = id;

			// Check if this transition already exists
			for (let i = 0; i < store.get(transition_list).length; i++) {
				if (!store.get(transition_list)[i]) continue; // Skip if transition List had any undefined elements

				if (
					store.get(transition_list)[i].from === start_node &&
					store.get(transition_list)[i].to === id
				) {
					store.set(alert, "This Transition Already Exists!");
					setTimeout(() => {
						store.set(alert, "");
					}, 3000);
					store.set(transition_pairs, () => null);
					store.set(current_selected, null); // Clear highlight if failed
					return;
				}
			}

			const tr_id = store.get(transition_list).length;

			// Define a new Transition
			const newTransition = makeTransition(tr_id, start_node, end_node);

			// Update the transition_list store
			store.set(transition_list, (prev) => [...prev, newTransition]);

			// Reset the transition_pairs store
			store.set(transition_pairs, (_) => null);
			store.set(current_selected, null); // Clear highlight after connection

			// Also update the corresponding state's transition array
			store.set(node_list, (prev) => {
				const newNodes = [...prev];
				const tr = {
					from: start_node,
					to: end_node,
					tr_name: tr_id,
				};
				// Update for start node
				newNodes[start_node] = {
					...newNodes[start_node],
					transitions: [...newNodes[start_node].transitions, tr],
				};

				if (start_node !== end_node) {
					// Update for end node
					newNodes[end_node] = {
						...newNodes[end_node],
						transitions: [...newNodes[end_node].transitions, tr],
					};
				}

				return newNodes;
			});

			addToHistory();

			// Open Popup for labeling
			if (store.get(engine_mode).type !== "Free Style") {
				store.set(active_transition, () => tr_id);
				store.set(show_popup, true);
			}
		}
	}

	// If not in special modes, select the node
	if (!["Remove", "Connect"].includes(store.get(editor_state))) {
		store.set(current_selected, (_prev) => id);
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
export function HandleStateDrag(_e, id) {
	const state = store.get(node_list)[id]; // Get the state

	const group = store.get(stage_ref).findOne("Group");
	let transition;
	let transition_label;

	state.transitions.forEach((tr) => {
		transition = group.findOne(`#transition_${tr.tr_name}`);
		transition_label = group.findOne(`#tr_label${tr.tr_name}`);

		const points = getTransitionPoints(tr.from, tr.to, tr.tr_name);

		// Update it in store
		store.set(transition_list, (prev) => {
			const newTrList = [...prev];
			if (newTrList[tr.tr_name]) {
				newTrList[tr.tr_name] = { ...newTrList[tr.tr_name], points: points };
			}
			return newTrList;
		});

		transition.points(points); // Update it on display

		// Update transition Label display
		transition_label.x(
			points[2] -
				2 * store.get(transition_list)[tr.tr_name].name.toString().length,
		);
		transition_label.y(points[3] - 10);
	});
}

export function handleShortCuts(key) {
	const keyBindings = [
		"New Project",
		"Add",
		"Remove",
		"Connect",
		"Save FSM",
		"Guide",
	];

	/* 
	Key Bindings as follows:
	1 -> Pan,
	2 -> Add,
	3 -> Remove,
	...
  */

	if ((key === "z" || key === "Z") && store.get(editor_state) !== "Controls") {
		undo(getTransitionPoints);
		return;
	}

	if ((key === "y" || key === "Y") && store.get(editor_state) !== "Controls") {
		redo(getTransitionPoints);
		return;
	}

	if (
		!store.get(show_popup) &&
		!["Controls", "Guide", "Save FSM"].includes(store.get(editor_state)) &&
		key - 1 < keyBindings.length
	) {
		if (key === 1) {
			store.set(confirm_dialog_atom, {
				isOpen: true,
				message:
					"Are you sure you want to start a new project? Any unsaved work will be lost!",
				onConfirm: () => {
					newProject();
				},
			});
			return;
		}
		store.set(editor_state, (_) => keyBindings[key - 1]);
	}
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
			initial: id === 0,
			intermediate: id !== 0,
			final: false,
		},
		transitions: [], // This will have the object {from: num,to: num,tr_name: number}
	};
	return circle;
}

// This function returns the points for the
// state transition arrow between states id1 and id2
// Optional: nodesMap can be passed to use custom node positions (for animations)
export function getTransitionPoints(id1, id2, tr_id, nodesMap = null) {
	// Get all transitions between these two nodes
	const allTransitions = store
		.get(transition_list)
		.filter((t) => t && t.from === id1 && t.to === id2);

	// Sort them by ID to ensure consistent ordering
	allTransitions.sort((a, b) => a.id - b.id);

	// Find index of current transition
	const index = allTransitions.findIndex((t) => t.id === tr_id);
	const count = allTransitions.length;

	// If this is a new transition being created (not in list yet), it will be the last one
	const effectiveIndex = index === -1 ? count : index;

	const nodes = nodesMap || store.get(node_list);
	const startNode = nodes[id1];
	const clickedGroup = nodes[id2]; // endNode

	if (id1 === id2) {
		// Self-loop
		const node = startNode;
		const x = node.x;
		const y = node.y;
		const radius = node.radius;
		const baseOffset = 30;
		const step = 30;
		const offset = baseOffset + effectiveIndex * step;

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

	const dx = clickedGroup.x - startNode.x;
	const dy = clickedGroup.y - startNode.y;
	const angle = Math.atan2(-dy, dx);

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

	// Dynamic curvature calculation
	const baseCurvature = 0.2;
	const curvatureStep = 0.15;
	const curvature = baseCurvature + effectiveIndex * curvatureStep;

	let subpoint2;

	// Adjust the subpoint 2 based on if the states
	// are arranged horizontally or vertically
	const xdiff = Math.abs(start[0] - end[0]);
	const ydiff = Math.abs(start[1] - end[1]);

	if (xdiff > ydiff) {
		// States are arranged horizontally
		subpoint2 =
			start[0] < end[0]
				? [midpoint[0], midpoint[1] - curvature * dist]
				: [midpoint[0], midpoint[1] + curvature * dist];

		end[1] = start[0] < end[0] ? end[1] - 20 : end[1] + 20;
	} else {
		// States are arranged vertically
		subpoint2 =
			start[1] < end[1]
				? [midpoint[0] + curvature * dist, midpoint[1]]
				: [midpoint[0] - curvature * dist, midpoint[1]];

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
	const points = getTransitionPoints(start_node, end_node, id);

	const name = store.get(engine_mode).type === "Free Style" ? [`tr${id}`] : [];

	const newTransition = {
		id: id,
		stroke: "#ffffffdd",
		strokeWidth: 2,
		fill: "#ffffffdd",
		points: points,
		tension: start_node === end_node ? 1 : 0.5,
		name: name,
		fontSize: 20,
		fontStyle: "bold",
		name_fill: "#ffffff",
		name_align: "center",
		from: start_node,
		to: end_node,
	};

	return newTransition;
}

export function HandleAutoLayout() {
	const nodes = store.get(node_list);
	const transitions = store.get(transition_list);
	const stage = store.get(stage_ref);

	// Filter out undefined nodes (deleted ones)
	const validNodeIds = nodes
		.map((n, i) => (n ? i : -1))
		.filter((i) => i !== -1);

	if (validNodeIds.length === 0) return;

	// Create a new directed graph
	const g = new dagre.graphlib.Graph();

	// Set an object for the graph label
	g.setGraph({
		rankdir: "LR", // Left-to-Right layout
		// align: "UL", // Align to Upper-Left
		ranksep: 180, // Separation between ranks
		nodesep: 100, // Separation between nodes in the same rank
		marginx: 50,
		marginy: 50,
	});

	// Default to assigning a new object as a label for each new edge.
	g.setDefaultEdgeLabel(() => ({}));

	// Add nodes to the graph.
	validNodeIds.forEach((id) => {
		const node = nodes[id];
		const size = node.radius * 2 + 20;
		g.setNode(`${id}`, { width: size, height: size });
	});

	// Add edges to the graph.
	transitions.forEach((tr) => {
		if (!tr) return;
		g.setEdge(`${tr.from}`, `${tr.to}`);
	});

	// Run the layout
	dagre.layout(g);

	// Calculate final positions
	const finalPositions = {};
	let minX = Infinity,
		minY = Infinity,
		maxX = -Infinity,
		maxY = -Infinity;

	g.nodes().forEach((v) => {
		const nodeData = g.node(v);
		const id = parseInt(v, 10);
		// dagre gives center coordinates
		finalPositions[id] = { x: nodeData.x, y: nodeData.y };

		// Update bounds for auto-fit calculation
		const node = nodes[id];
		const radius = node.radius;
		minX = Math.min(minX, nodeData.x - radius);
		minY = Math.min(minY, nodeData.y - radius);
		maxX = Math.max(maxX, nodeData.x + radius);
		maxY = Math.max(maxY, nodeData.y + radius);
	});

	// Calculate Auto-Fit Scale and Position
	const padding = 100;
	const graphWidth = maxX - minX + 2 * padding;
	const graphHeight = maxY - minY + 2 * padding;

	const stageWidth = stage.width();
	const stageHeight = stage.height();

	const scaleX = stageWidth / graphWidth;
	const scaleY = stageHeight / graphHeight;
	const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in too much (max scale 1)

	// Center the graph
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;

	const targetStageX = stageWidth / 2 - centerX * scale;
	const targetStageY = stageHeight / 2 - centerY * scale;

	// Animate Stage
	new Konva.Tween({
		node: stage,
		duration: 0.5,
		easing: Konva.Easings.EaseInOut,
		x: targetStageX,
		y: targetStageY,
		scaleX: scale,
		scaleY: scale,
	}).play();

	// Animate Nodes
	let completedTweens = 0;
	const totalTweens = validNodeIds.length;

	validNodeIds.forEach((id) => {
		const nodeShape = stage.findOne(`#state_${id}`);
		if (!nodeShape) return;

		const targetPos = finalPositions[id];

		new Konva.Tween({
			node: nodeShape,
			duration: 0.5,
			easing: Konva.Easings.EaseInOut,
			x: targetPos.x,
			y: targetPos.y,
			onFinish: () => {
				completedTweens++;
				if (completedTweens === totalTweens) {
					// All animations done. Sync Store.

					// Update Nodes
					const newNodes = [...nodes];
					validNodeIds.forEach((nid) => {
						if (newNodes[nid]) {
							newNodes[nid].x = finalPositions[nid].x;
							newNodes[nid].y = finalPositions[nid].y;
						}
					});
					store.set(node_list, () => newNodes);

					// Update Transitions (Recalculate points based on new positions)
					const newTransitions = [...transitions];
					newTransitions.forEach((tr, i) => {
						if (!tr) return;
						// Now the store has new node positions, so this works
						const points = getTransitionPoints(tr.from, tr.to, tr.id);
						newTransitions[i].points = points;
					});
					store.set(transition_list, () => newTransitions);
				}
			},
		}).play();
	});

	// Animation Loop for Arrows
	const anim = new Konva.Animation(() => {
		// Build a map of current node positions from the shapes
		const currentNodes = [...nodes];
		let updated = false;

		validNodeIds.forEach((id) => {
			const shape = stage.findOne(`#state_${id}`);
			if (shape) {
				currentNodes[id] = { ...currentNodes[id], x: shape.x(), y: shape.y() };
				updated = true;
			}
		});

		if (!updated) return;

		// Update all transitions
		transitions.forEach((tr) => {
			if (!tr) return;
			const trShape = stage.findOne(`#transition_${tr.id}`);
			const trLabel = stage.findOne(`#tr_label${tr.id}`);

			if (trShape) {
				const points = getTransitionPoints(tr.from, tr.to, tr.id, currentNodes);
				trShape.points(points);

				if (trLabel) {
					trLabel.x(points[2] - 2 * tr.name.toString().length);
					trLabel.y(points[3] - 10);
				}
			}
		});
	}, stage.findOne("Layer"));

	anim.start();

	// Stop animation after tween duration
	setTimeout(() => {
		anim.stop();
		addToHistory();
	}, 550);
}

export function newProject() {
	// Clear all stores and start a new project
	store.set(node_list, () => []);
	store.set(transition_list, () => []);
	store.set(deleted_nodes, () => []);
	store.set(current_selected, () => null);
	store.set(initial_state, () => null);
	store.set(transition_pairs, () => null);
	store.set(show_popup, () => false);
	store.set(active_transition, () => null);
	clearHistory();
}
