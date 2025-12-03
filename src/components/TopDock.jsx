import {
	CaseSensitive,
	ChevronDown,
	FolderOpen,
	Settings,
	Shapes,
	Sparkles,
	Table,
} from "lucide-react";
import { useState } from "react";
import {
	engine_mode,
	editor_state,
	show_transition_table,
} from "../lib/stores";
import { useAtomValue, useAtom } from "jotai";
import { HandleAutoLayout } from "../lib/editor";
import { HandleLoadFSM, validateDFA } from "../lib/special_functions";

const TopDock = () => {
	const [isVisible, setIsVisible] = useState(false);
	const EngineMode = useAtomValue(engine_mode);
	const [_EditorState, setEditorState] = useAtom(editor_state);
	const [showTransitionTable, setShowTransitionTable] = useAtom(
		show_transition_table,
	);

	// Constants
	const iconFillColor = "#ffffff";
	const iconSize = 18;

	const dockItems = [
		{
			name: "Load FSM",
			icon: <FolderOpen stroke={iconFillColor} size={iconSize} />,
			condition: true,
			onclick: () => {
				HandleLoadFSM();
				setIsVisible(false);
			},
		},
		{
			name: "Controls",
			icon: <Settings stroke={iconFillColor} size={iconSize} />,
			condition: true,
			onclick: () => {
				setEditorState("Controls");
				setIsVisible(false);
			},
		},
		{
			name: "Auto Layout",
			icon: <Sparkles stroke={iconFillColor} size={iconSize} />,
			condition: true,
			onclick: () => {
				HandleAutoLayout();
				setIsVisible(false);
			},
		},
		{
			name: "Transition Table",
			icon: <Table stroke={iconFillColor} size={iconSize} />,
			condition: ["NFA", "DFA"].includes(EngineMode.type),
			onclick: () => {
				setShowTransitionTable((val) => !val);
				setIsVisible(false);
			},
		},
		{
			name: "String Validator",
			icon: <CaseSensitive stroke={iconFillColor} size={iconSize} />,
			condition: ["NFA", "DFA"].includes(EngineMode.type),
			onclick: () => {
				alert(
					"Feature Not Available yet. We're Working on it. Check back soon!",
				);
			},
		},
		{
			name: "NFA from RE",
			icon: <Shapes stroke={iconFillColor} size={iconSize} />,
			condition: EngineMode.type === "NFA",
			onclick: () => {
				alert(
					"Feature Not Available yet. We're Working on it. Check back soon!",
				);
			},
		},
		{
			name: "DFA from RE",
			icon: <Shapes stroke={iconFillColor} size={iconSize} />,
			condition: EngineMode.type === "DFA",
			onclick: () => {
				alert(
					"Feature Not Available yet. We're Working on it. Check back soon!",
				);
			},
		},
		{
			name: "Convert to DFA",
			icon: <Shapes stroke={iconFillColor} size={iconSize} />,
			condition: EngineMode.type === "NFA",
			onclick: () => {
				alert(
					"Feature Not Available yet. We're Working on it. Check back soon!",
				);
			},
		},
		{
			name: "Minimize DFA",
			icon: <Shapes stroke={iconFillColor} size={iconSize} />,
			condition: EngineMode.type === "DFA",
			onclick: () => {
				alert(
					"Feature Not Available yet. We're Working on it. Check back soon!",
				);
			},
		},
	];

	return (
		<div
			className={`absolute w-screen h-15 ${
				isVisible ? "top-2" : "-top-15"
			} flex justify-center items-center transition-all ease-in-out duration-500`}
		>
			<div className="flex justify-center items-center gap-3 w-fit px-2 h-full bg-primary-bg border border-border-bg rounded-xl shadow-[0px_0px_50px_0px_#00000080] select-none">
				{dockItems.map(
					(item, idx) =>
						item.condition && (
							<button
								key={idx}
								onClick={item.onclick}
								className={`flex gap-2 justify-center items-center font-github whitespace-nowrap bg-secondary-bg
                            } text-base text-text-primary px-4 py-2 border border-border-bg rounded-lg cursor-pointer hover:-translate-y-1 hover:scale-102 active:scale-90 transition-all ease-in-out`}
							>
								{item.icon}
								{item.name}
							</button>
						),
				)}
				<button
					type="button"
					onClick={() => setIsVisible(!isVisible)}
					className={`flex justify-center items-center gap-1 absolute -bottom-10 font-github bg-primary-bg text-white text-sm font-bold px-3 py-2 border border-border-bg rounded-lg cursor-pointer`}
				>
					{EngineMode.type}
					<ChevronDown
						className={`${
							isVisible && "rotate-180"
						} transition-all ease-in-out duration-500`}
						size={24}
						color="#ffffff"
					/>
				</button>
			</div>
		</div>
	);
};

export default TopDock;
