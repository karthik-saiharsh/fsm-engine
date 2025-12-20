import { useAtom, useAtomValue } from "jotai";
import { Download, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getTransitionPoints } from "../lib/editor";
import { getTransitionDetails } from "../lib/special_functions";
import {
	editor_state,
	engine_mode,
	node_list,
	show_transition_table,
	stage_ref,
	transition_list,
} from "../lib/stores";
import PopupWindow from "./PopupWindow";

const TransitionTable = () => {
	const [_EditorState, _setEditorState] = useAtom(editor_state);
	const EngineMode = useAtomValue(engine_mode);
	const [NodeList, setNodeList] = useAtom(node_list);
	const [TransitionList, setTransitionList] = useAtom(transition_list);
	const StageRef = useAtomValue(stage_ref);
	const [ShowTable, setShowTable] = useAtom(show_transition_table);

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(ShowTable);
	}, [ShowTable]);

	const handleClose = () => {
		setShowTable(false);
	};

	const handleAddTransition = (fromId, alphabet, newToId) => {
		const newToIdInt = parseInt(newToId, 10);
		if (Number.isNaN(newToIdInt)) return;

		const fromNode = NodeList[fromId];
		const newTransitionList = [...TransitionList];
		const newNodeList = [...NodeList];

		// Check if transition already exists
		let targetTrIndex = -1;
		for (const tr of fromNode.transitions) {
			const trObj = newTransitionList[tr.tr_name];
			if (trObj && trObj.to === newToIdInt) {
				targetTrIndex = tr.tr_name;
				break;
			}
		}

		if (targetTrIndex !== -1) {
			// Transition exists, add alphabet to it
			const targetTr = newTransitionList[targetTrIndex];
			if (!targetTr.name.includes(alphabet)) {
				const newName = [...targetTr.name, alphabet].sort();
				newTransitionList[targetTrIndex] = { ...targetTr, name: newName };
				const trLabel = StageRef.findOne(`#tr_label${targetTrIndex}`);
				if (trLabel) trLabel.text(newName.toString());
			}
		} else {
			// Create new transition
			const newTrId = newTransitionList.length;
			const points = getTransitionPoints(fromId, newToIdInt, newTrId);

			const newTransition = {
				id: newTrId,
				stroke: "#ffffffdd",
				strokeWidth: 2,
				fill: "#ffffffdd",
				points: points,
				tension: fromId === newToIdInt ? 1 : 0.5,
				name: [alphabet],
				fontSize: 20,
				fontStyle: "bold",
				name_fill: "#ffffff",
				name_align: "center",
				from: fromId,
				to: newToIdInt,
			};

			newTransitionList[newTrId] = newTransition;

			const trRef = {
				from: fromId,
				to: newToIdInt,
				tr_name: newTrId,
			};

			newNodeList[fromId].transitions.push(trRef);
			if (fromId !== newToIdInt) {
				newNodeList[newToIdInt].transitions.push(trRef);
			}
		}

		setTransitionList(newTransitionList);
		setNodeList(newNodeList);
	};

	const handleRemoveTransition = (fromId, alphabet, toId) => {
		const fromNode = NodeList[fromId];
		let targetTrIndex = -1;
		let targetTr = null;

		for (const tr of fromNode.transitions) {
			const trObj = TransitionList[tr.tr_name];
			if (trObj && trObj.to === toId && trObj.name.includes(alphabet)) {
				targetTrIndex = tr.tr_name;
				targetTr = trObj;
				break;
			}
		}

		if (!targetTr) return;

		const newTransitionList = [...TransitionList];
		const newNodeList = [...NodeList];

		const newName = targetTr.name.filter((a) => a !== alphabet);

		if (newName.length === 0) {
			// Remove transition entirely
			newTransitionList[targetTrIndex] = undefined;
			newNodeList[fromId].transitions = newNodeList[fromId].transitions.filter(
				(t) => t.tr_name !== targetTrIndex,
			);
			if (fromId !== toId) {
				newNodeList[toId].transitions = newNodeList[toId].transitions.filter(
					(t) => t.tr_name !== targetTrIndex,
				);
			}
			const trShape = StageRef.findOne(`#transition_${targetTrIndex}`);
			if (trShape) trShape.destroy();
			const trLabel = StageRef.findOne(`#tr_label${targetTrIndex}`);
			if (trLabel) trLabel.destroy();
		} else {
			// Update transition name
			newTransitionList[targetTrIndex] = { ...targetTr, name: newName };
			const trLabel = StageRef.findOne(`#tr_label${targetTrIndex}`);
			if (trLabel) trLabel.text(newName.toString());
		}

		setTransitionList(newTransitionList);
		setNodeList(newNodeList);
	};

	if (!isVisible) return null;

	return (
		<PopupWindow
			title="Transition Table"
			classNames="z-50 max-h-[80vh] max-w-[80vw]"
			onClose={handleClose}
			initialPosition={{ x: window.innerWidth - 450, y: 100 }}
			resizable={true}
			minWidth={300}
			minHeight={200}
		>
			<div className="flex flex-col overflow-hidden">
				{/* Toolbar */}
				<div className="p-2 border-b border-border-bg bg-primary-bg flex-shrink-0">
					<button className="flex items-center gap-2 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-xs font-medium transition-colors w-fit">
						<Download size={14} />
						Export CSV
					</button>
				</div>

				{/* Table Container */}
				<div className="flex-1 overflow-auto">
					<table className="w-full border-collapse text-left text-sm">
						<thead className="sticky top-0 z-20 bg-secondary-bg shadow-sm">
							<tr>
								<th className="sticky left-0 z-30 bg-secondary-bg p-2 border-b border-border-bg font-semibold text-secondary-fg w-24">
									State
								</th>
								{EngineMode.alphabets.map((alpha, idx) => (
									<th
										key={idx}
										className="p-2 border-b border-border-bg font-semibold text-secondary-fg min-w-[80px]"
									>
										{alpha}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{NodeList.map((node, nodeIdx) => (
								<tr
									key={nodeIdx}
									className="border-b border-border-bg hover:bg-secondary-bg/50 transition-colors"
								>
									<td className="sticky left-0 z-10 bg-primary-bg p-2 border-r border-border-bg font-medium">
										<div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-200 text-xs border border-blue-800">
											{node.name}
										</div>
									</td>
									{(() => {
										const rowDetails = getTransitionDetails(
											node.transitions,
											nodeIdx,
										);
										return EngineMode.alphabets.map((alpha, alphaIdx) => {
											const targetStates = rowDetails[alphaIdx] || [];

											return (
												<td
													key={alphaIdx}
													className="p-2 border-r border-border-bg/50 min-w-[120px]"
												>
													<div className="flex flex-wrap gap-1 items-center">
														{targetStates.map((target, tIdx) => (
															<div
																key={tIdx}
																className="flex items-center gap-1 bg-secondary-bg px-1.5 py-0.5 rounded text-xs text-secondary-fg border border-border-bg group"
															>
																<span>{target.name}</span>
																<button
																	onClick={() =>
																		handleRemoveTransition(
																			nodeIdx,
																			alpha,
																			target.id,
																		)
																	}
																	className="hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
																>
																	<X size={10} />
																</button>
															</div>
														))}
														<div className="relative group/add">
															<button className="p-0.5 hover:bg-border-bg rounded text-secondary-fg/50 hover:text-white transition-colors">
																<Plus size={12} />
															</button>
															<select
																onChange={(e) => {
																	handleAddTransition(
																		nodeIdx,
																		alpha,
																		e.target.value,
																	);
																	e.target.value = ""; // Reset
																}}
																className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
																value=""
															>
																<option value="" disabled>
																	Add
																</option>
																{NodeList.map((n, i) => (
																	<option key={i} value={i}>
																		{n.name}
																	</option>
																))}
															</select>
														</div>
													</div>
												</td>
											);
										});
									})()}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</PopupWindow>
	);
};

export default TransitionTable;
