import { node_list, store, transition_list } from "./stores";

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

	if (id1 == id2) {
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
