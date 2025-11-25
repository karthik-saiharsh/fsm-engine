import { useAtomValue } from "jotai";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
	active_transition,
	engine_mode,
	show_popup,
	transition_list,
} from "../lib/stores";
import { handleTransitionSave } from "../lib/transitions";

const Popup = () => {
	const showPopup = useAtomValue(show_popup);
	const popups = [
		<ChooseTransitionLabelFreeStyle />,
		<ChooseTransitionLabelDFA />,
	];
	const EngineMode = useAtomValue(engine_mode);

	const engine_mode_popup_map = {
		"Free Style": 0,
		DFA: 1,
		NFA: 1,
	};

	return (
		<div
			className={`absolute left-0 w-screen h-fit flex justify-center transition-all ease-in-out duration-550 ${
				showPopup ? "top-8" : "-top-20 opacity-0"
			}`}
		>
			<div className="h-full w-fit py-5 px-5 flex flex-col justify-center items-center bg-primary-bg rounded-xl border-1 border-border-bg shadow-[0px_0px_50px_0px_#00000080]">
				{popups[engine_mode_popup_map[EngineMode.type]]}
			</div>
		</div>
	);
};

export default Popup;

/******* POPUP COMPONENTS *********/
function ChooseTransitionLabelDFA() {
	const LanguageAlphabets = useAtomValue(engine_mode);
	const ActiveTransition = useAtomValue(active_transition);
	const TransitionList = useAtomValue(transition_list);

	const [labels, setLabels] = useState(TransitionList[ActiveTransition]?.name);

	useEffect(() => {
		setLabels(TransitionList[ActiveTransition]?.name);
	}, [ActiveTransition, TransitionList[ActiveTransition]?.name]);

	// Helper Function for Toggling Alphabets from Transition Name
	function toggleAlphabet(val) {
		if (labels.includes(val)) setLabels(labels.filter((x) => x !== val));
		else setLabels([...labels, val]);
	}

	return (
		<>
			<p className="text-sm font-github text-center text-white mb-5 select-none">
				Choose Input Alphabets for this transition
			</p>
			<div className="grid grid-cols-4 gap-5 justify-center items-center">
				{LanguageAlphabets.alphabets.map((a) => (
					<p
						key={Math.random()}
						onClick={() => toggleAlphabet(a)}
						className={`font-github text-white text-balance ${
							labels?.includes(a) ? "bg-blue-500" : "bg-secondary-bg"
						} px-3 py-1 rounded-md border border-border-bg select-none cursor-pointer hover:scale-120 active:scale-100 transition-all ease-in-out`}
					>
						{a}
					</p>
				))}
			</div>
			<button
				type="button"
				onClick={() => {
					if (labels.length > 0) handleTransitionSave(labels);
				}}
				className="font-github text-sm hover:scale-110 active:scale-100 transition-all ease-in-out text-white mt-5 bg-blue-500 px-8 py-2 rounded-lg border border-border-bg flex gap-2 items-center"
			>
				<CircleCheck size={18} color="#ffffff" />
				Done
			</button>
		</>
	);
}

function ChooseTransitionLabelFreeStyle() {
	const [label, setLabel] = useState("");
	return (
		<>
			<p className="text-sm font-github text-center text-white mb-5 select-none">
				Set Label for this transition
			</p>
			<span className="w-full">
				<input
					value={label}
					className="px-1 py-2 text-sm h-9 w-full font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out"
					type="text"
					onChange={(e) => setLabel(e.target.value)}
					placeholder="Enter Transition Label..."
				/>
			</span>
			<button
				type="button"
				onClick={() => {
					if (label.trim().length > 0) {
						handleTransitionSave([label]);
						setLabel("");
					}
				}}
				className="font-github text-sm hover:scale-110 active:scale-100 transition-all ease-in-out text-white mt-5 bg-blue-500 px-8 py-2 rounded-lg border border-border-bg flex gap-2 items-center"
			>
				<CircleCheck size={18} color="#ffffff" />
				Done
			</button>
		</>
	);
}
