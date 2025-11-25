import { useAtom } from "jotai";
import {
	Activity,
	CircleCheck,
	CircleCheckBig,
	CirclePower,
	CircleX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HandleSaveSettings } from "../lib/settings";
import { current_selected, editor_state, node_list } from "../lib/stores";

const Settings = () => {
	const [editorState, setEditorState] = useAtom(editor_state);
	const [currentSelected, _setCurrentSelected] = useAtom(current_selected);
	const [nodeList, _setNodeList] = useAtom(node_list);

	// State Hooks for input fields
	const [stateName, setStateName] = useState("");
	const [stateColor, setStateColor] = useState("");
	const [stateType, setStateType] = useState({
		initial: false,
		intermediate: false,
		final: false,
	});
	// State Hooks for input fields

	// Get the existing values of the State properties
	function setDefaultValues() {
		const name = nodeList[currentSelected].name;
		const color = nodeList[currentSelected].fill.substr(0, 7);
		const type = nodeList[currentSelected].type;

		setStateName(name);
		setStateColor(color);
		setStateType(type);
	}

	// State Type Change Function
	function HandleStateTypeChange(type) {
		if (type === "initial") {
			setStateType({
				...stateType,
				initial: !stateType.initial,
				intermediate: false,
			});
			return;
		}

		if (type === "final") {
			setStateType({
				...stateType,
				final: !stateType.final,
				intermediate: false,
			});
			return;
		}

		if (type === "intermediate") {
			setStateType({
				final: false,
				initial: false,
				intermediate: !stateType.intermediate,
			});
			return;
		}
	}

	function handleCancel() {
		setEditorState(null);
	}

	// Validate the Statetype Change
	useEffect(() => {
		// Make sure that the user does not uncheck everything
		// A state cannot be neither initial, intermeditate, or final
		if (
			stateType.initial === false &&
			stateType.intermediate === false &&
			stateType.final === false
		) {
			setStateType({ initial: false, intermediate: true, final: false });
		}
	}, [stateType]);

	useEffect(() => {
		if (currentSelected) setDefaultValues();
	}, [currentSelected, setDefaultValues]);

	return (
		<div
			className={`absolute top-0 left-0 w-screen h-screen z-20 flex justify-center items-center bg-secondary-bg/30 ${
				editorState !== "settings" && "hidden"
			}`}
		>
			<div className="flex flex-col gap-5 justify-center px-5 py-5 w-fit h-fit bg-primary-bg border border-border-bg rounded-3xl shadow-[0px_0px_50px_0px_#000000]/70 select-none">
				<h2 className="font-github text-2xl text-white font-medium text-center">
					State Options
				</h2>

				<span>
					<p className="font-github text-white text-base pb-2 font-semibold">
						State Name
					</p>
					<input
						value={stateName}
						className="px-1 py-2 text-sm h-9 w-full font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out"
						type="text"
						onChange={(e) => setStateName(e.target.value)}
					/>
				</span>

				<span>
					<p className="font-github text-white text-base pb-2">State Color</p>
					<input
						type="color"
						className="rounded-lg border-3 border-border-bg"
						value={stateColor}
						onChange={(e) => setStateColor(e.target.value)}
					/>
				</span>

				<span>
					<p className="font-github text-white text-base pb-2">State Type</p>

					<span className="flex gap-2">
						<span
							onClick={() => HandleStateTypeChange("initial")}
							className={`flex items-center justify-center gap-2  w-fit px-2 py-2 border ${
								stateType.initial ? "bg-blue-500" : "bg-secondary-bg"
							} border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
						>
							<CirclePower color="#ffffff" size={18} />
							<p className="text-white font-github text-sm">Initial State</p>
						</span>

						<span
							onClick={() => HandleStateTypeChange("intermediate")}
							className={`flex items-center justify-center gap-2 ${
								stateType.intermediate ? "bg-blue-500" : "bg-secondary-bg"
							} w-fit px-2 py-2 border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
						>
							<Activity color="#ffffff" size={18} />
							<p className="text-white font-github text-sm">
								Intermediate State
							</p>
						</span>

						<span
							onClick={() => HandleStateTypeChange("final")}
							className={`flex items-center justify-center gap-2 ${
								stateType.final ? "bg-blue-500" : "bg-secondary-bg"
							} w-fit px-2 py-2 border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
						>
							<CircleCheckBig color="#ffffff" size={18} />
							<p className="text-white font-github text-sm">Final State</p>
						</span>
					</span>
				</span>

				<span className="flex gap-5 items-center justify-center my-2 w-full">
					<span
						onClick={handleCancel}
						className="flex items-center justify-center gap-2 bg-secondary-fg w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out"
					>
						<CircleX color="#000000" size={18} />
						<p className="text-black font-github text-sm font-semibold">
							Cancel
						</p>
					</span>

					<span
						onClick={() => HandleSaveSettings(stateName, stateColor, stateType)}
						className="flex items-center justify-center gap-2 bg-blue-500 w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out"
					>
						<CircleCheck color="#ffffff" size={18} />
						<p className="text-white font-github text-sm font-semibold">Save</p>
					</span>
				</span>
			</div>
		</div>
	);
};

export default Settings;
