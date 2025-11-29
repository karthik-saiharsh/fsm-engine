import { useAtom, useAtomValue } from "jotai";
import { HardDriveDownload, X } from "lucide-react";
import { useState } from "react";
import {
	deleted_nodes,
	editor_state,
	engine_mode,
	layer_ref,
	node_list,
	transition_list,
} from "../lib/stores";

const SaveDialog = () => {
	const [EditorState, setEditorState] = useAtom(editor_state);
	const LayerRef = useAtomValue(layer_ref);

	const [saveDetails, setSaveDetails] = useState({
		name: "",
		type: "png",
		resolution: 2,
	});

	const NodeList = useAtomValue(node_list);
	const TransitionList = useAtomValue(transition_list);
	const DeletedNodes = useAtomValue(deleted_nodes);
	const EngineMode = useAtomValue(engine_mode);

	return (
		<div
			className={`absolute left-0 w-screen h-15 flex justify-center transition-all ease-in-out duration-550 ${
				EditorState === "Save FSM" ? "top-12" : "-top-20 opacity-0"
			}`}
		>
			<div className="h-full w-fit px-2 bg-primary-bg rounded-xl border-1 border-border-bg shadow-[0px_0px_50px_0px_#00000080] flex justify-center items-center gap-3">
				<select
					value={saveDetails.type}
					onChange={(e) =>
						setSaveDetails({ ...saveDetails, type: e.target.value })
					}
					className="text-white font-github text-base px-2 border border-border-bg hover:border-input-active focus:border-2 focus:border-blue-500 transition-all ease-in-out outline-none h-9 rounded-lg mr-2"
				>
					<option value={"png"}>Image</option>
					<option value={"json"}>Project</option>
				</select>

				<input
					value={saveDetails.name}
					className="px-1 py-2 text-sm h-9 w-full font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out"
					type="text"
					placeholder="Enter File Name..."
					onChange={(e) =>
						setSaveDetails({ ...saveDetails, name: e.target.value })
					}
				/>

				{saveDetails.type === "png" && (
					<select
						value={saveDetails.resolution}
						onChange={(e) =>
							setSaveDetails({ ...saveDetails, resolution: e.target.value })
						}
						className="text-white font-github text-base px-2 border border-border-bg hover:border-input-active focus:border-2 focus:border-blue-500 transition-all ease-in-out outline-none h-9 rounded-lg mr-2"
					>
						<option value={1}>1x</option>
						<option value={2}>2x</option>
						<option value={3}>3x</option>
						<option value={4}>4x</option>
						<option value={5}>5x</option>
					</select>
				)}

				<button
					type="button"
					onClick={() => setEditorState(null)}
					className="flex items-center justify-center gap-2 bg-secondary-fg w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out"
				>
					<X size={18} color="#000000" />
					<p className="text-sm font-semibold text-black font-github">Cancel</p>
				</button>

				<button
					type="button"
					onClick={() => {
						// Save the FSM to disk

						if (saveDetails.name.trim() === "") {
							alert("Enter a valid file name");
							return;
						}

						const link = document.createElement("a");
						link.download =
							saveDetails.type === "json"
								? `${saveDetails.name}.fsm`
								: saveDetails.name; // Set File Name

						if (saveDetails.type === "png") {
							const group = LayerRef.findOne("Group");
							const dataUrl = group.toDataURL({
								pixelRatio: saveDetails.resolution, // Resolution
							});

							link.href = dataUrl; // Set href attr
						}

						if (saveDetails.type === "json") {
							const data = {
								nodes: NodeList,
								transitions: TransitionList,
								deleted_nodes: DeletedNodes,
								engine_mode: EngineMode,
							};

							const jsonString = JSON.stringify(data, null, 2); // pretty formatted

							const file = new Blob([jsonString], { type: "text/plain" });
							link.href = URL.createObjectURL(file); // Set href attr
						}

						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);

						setEditorState(null);
						setSaveDetails({ name: "", resolution: 2, type: "png" });
					}}
					className="flex items-center justify-center gap-2 bg-blue-500 w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out"
				>
					<HardDriveDownload size={18} color="#ffffff" />
					<p className="text-sm font-semibold text-white font-github">Save</p>
				</button>
			</div>
		</div>
	);
};

export default SaveDialog;
