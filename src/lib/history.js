import { atom } from "jotai";
import {
	node_list,
	transition_list,
	store,
	deleted_nodes,
	stage_ref,
} from "./stores";
import Konva from "konva";

// Atoms to hold the history of states
export const past = atom([]);
export const future = atom([]);

// Function to add the current state to history
export function addToHistory() {
	const currentNodes = JSON.parse(JSON.stringify(store.get(node_list)));
	const currentTransitions = JSON.parse(
		JSON.stringify(store.get(transition_list)),
	);
	const currentDeleted = JSON.parse(JSON.stringify(store.get(deleted_nodes)));

	const stage = store.get(stage_ref);
	const stageState = stage
		? {
				x: stage.x(),
				y: stage.y(),
				scale: stage.scaleX(),
			}
		: null;

	store.set(past, (old) => [
		...old,
		{
			nodes: currentNodes,
			transitions: currentTransitions,
			deleted: currentDeleted,
			stageState: stageState,
		},
	]);
	store.set(future, []); // Clear future when a new action is taken
}

// Function to clear history
export function clearHistory() {
	store.set(past, []);
	store.set(future, []);
}

// Helper function to animate restoration
function animateRestore(targetState, getTransitionPoints, callback) {
	const stage = store.get(stage_ref);
	if (!stage) {
		callback();
		return;
	}

	// Animate Stage
	if (targetState.stageState) {
		new Konva.Tween({
			node: stage,
			duration: 0.3,
			easing: Konva.Easings.EaseInOut,
			x: targetState.stageState.x,
			y: targetState.stageState.y,
			scaleX: targetState.stageState.scale,
			scaleY: targetState.stageState.scale,
		}).play();
	}

	// Animate Nodes
	const nodes = store.get(node_list);
	const targetNodes = targetState.nodes;
	let completedTweens = 0;
	let totalTweens = 0;

	// Identify nodes that need to move
	const nodesToMove = [];
	targetNodes.forEach((targetNode, i) => {
		if (targetNode && nodes[i]) {
			nodesToMove.push({ id: i, target: targetNode });
		}
	});

	totalTweens = nodesToMove.length;

	if (totalTweens === 0) {
		callback();
		return;
	}

	nodesToMove.forEach((item) => {
		const nodeShape = stage.findOne(`#state_${item.id}`);
		if (nodeShape) {
			new Konva.Tween({
				node: nodeShape,
				duration: 0.3,
				easing: Konva.Easings.EaseInOut,
				x: item.target.x,
				y: item.target.y,
				onFinish: () => {
					completedTweens++;
					if (completedTweens === totalTweens) {
						callback();
					}
				},
			}).play();
		} else {
			completedTweens++;
			if (completedTweens === totalTweens) {
				callback();
			}
		}
	});

	// Animation Loop for Arrows during transition
	const anim = new Konva.Animation(() => {
		const currentNodes = [...store.get(node_list)];
		let updated = false;

		nodesToMove.forEach((item) => {
			const shape = stage.findOne(`#state_${item.id}`);
			if (shape) {
				currentNodes[item.id] = {
					...currentNodes[item.id],
					x: shape.x(),
					y: shape.y(),
				};
				updated = true;
			}
		});

		if (!updated) return;

		// Update all transitions
		const transitions = store.get(transition_list);
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
	}, 350);
}

// Function to Undo
export function undo(getTransitionPoints) {
	const pastState = store.get(past);
	if (pastState.length === 0) return;

	const previous = pastState[pastState.length - 1];
	const newPast = pastState.slice(0, pastState.length - 1);

	// Save current state to future
	const currentNodes = JSON.parse(JSON.stringify(store.get(node_list)));
	const currentTransitions = JSON.parse(
		JSON.stringify(store.get(transition_list)),
	);
	const currentDeleted = JSON.parse(JSON.stringify(store.get(deleted_nodes)));

	const stage = store.get(stage_ref);
	const currentStageState = stage
		? {
				x: stage.x(),
				y: stage.y(),
				scale: stage.scaleX(),
			}
		: null;

	store.set(future, (old) => [
		{
			nodes: currentNodes,
			transitions: currentTransitions,
			deleted: currentDeleted,
			stageState: currentStageState,
		},
		...old,
	]);

	// Animate to previous state
	animateRestore(previous, getTransitionPoints, () => {
		store.set(node_list, previous.nodes);
		store.set(transition_list, previous.transitions);
		store.set(deleted_nodes, previous.deleted);
		store.set(past, newPast);
	});
}

// Function to Redo
export function redo(getTransitionPoints) {
	const futureState = store.get(future);
	if (futureState.length === 0) return;

	const next = futureState[0];
	const newFuture = futureState.slice(1);

	// Save current state to past
	const currentNodes = JSON.parse(JSON.stringify(store.get(node_list)));
	const currentTransitions = JSON.parse(
		JSON.stringify(store.get(transition_list)),
	);
	const currentDeleted = JSON.parse(JSON.stringify(store.get(deleted_nodes)));

	const stage = store.get(stage_ref);
	const currentStageState = stage
		? {
				x: stage.x(),
				y: stage.y(),
				scale: stage.scaleX(),
			}
		: null;

	store.set(past, (old) => [
		...old,
		{
			nodes: currentNodes,
			transitions: currentTransitions,
			deleted: currentDeleted,
			stageState: currentStageState,
		},
	]);

	// Animate to next state
	animateRestore(next, getTransitionPoints, () => {
		store.set(node_list, next.nodes);
		store.set(transition_list, next.transitions);
		store.set(deleted_nodes, next.deleted);
		store.set(future, newFuture);
	});
}
