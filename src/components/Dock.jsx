import { useAtom } from "jotai";
import {
	BookHeart,
	Cable,
	FilePlus,
	ImageDown,
	MinusCircleIcon,
	PlusCircleIcon,
} from "lucide-react";
import { newProject } from "../lib/editor";
import { editor_state, transition_pairs } from "../lib/stores";

// Define the Components of the Dock
// Icon Look Constants
const iconFillColor = "#ffffff";
const iconSize = 18;

const dockItems = [
	{
		name: "New Project",
		icon: <FilePlus stroke={iconFillColor} size={iconSize} />,
		onclick: () => {
			const ans = confirm(
				"Are you sure you want to start a new project? Any unsaved work will be lost!",
			);
			if (ans) newProject();
		},
	},
	{
		name: "Add",
		icon: <PlusCircleIcon stroke={iconFillColor} size={iconSize} />,
	},
	{
		name: "Remove",
		icon: <MinusCircleIcon stroke={iconFillColor} size={iconSize} />,
	},
	{
		name: "Connect",
		icon: <Cable stroke={iconFillColor} size={iconSize} />,
	},
	{
		name: "Save FSM",
		icon: <ImageDown stroke={iconFillColor} size={iconSize} />,
	},
	{
		name: "Guide",
		icon: <BookHeart stroke={iconFillColor} size={iconSize} />,
	},
];
// Define the Components of the Dock
const Dock = () => {
	// Jotai Atoms
	const [editorState, setEditorState] = useAtom(editor_state);
	const [_transitionPairs, setTransitionPairs] = useAtom(transition_pairs);
	// Jotai Atoms

	function default_onclick(item) {
		if (item.name === "Connect") setTransitionPairs(null);
		item.name === editorState
			? setEditorState(null)
			: setEditorState(item.name);
	}

	return (
		<div className="absolute bottom-5 w-screen h-15 flex justify-center items-center">
			<div className="flex justify-center items-center gap-3 w-fit px-2 h-full bg-primary-bg border border-border-bg rounded-2xl shadow-[0px_0px_50px_0px_#00000080] select-none">
				{dockItems.map((item, idx) => (
					<button
						type="button"
						key={idx}
						onClick={item.onclick ? item.onclick : () => default_onclick(item)}
						className={`flex gap-2 justify-center items-center font-github whitespace-nowrap ${
							item.name === editorState ? "bg-blue-500" : "bg-secondary-bg"
						} text-base text-text-primary px-4 py-2 border border-border-bg rounded-xl cursor-pointer hover:-translate-y-2 hover:scale-110 active:scale-90 transition-all ease-in-out`}
					>
						{item.icon}
						{item.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default Dock;
