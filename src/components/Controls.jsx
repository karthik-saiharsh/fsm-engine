import { useAtom, useSetAtom } from "jotai";
import {
	CircleCheck,
	CircleDot,
	CircleDotDashed,
	CircleFadingPlus,
	CircleX,
} from "lucide-react";
import { useState } from "react";
import { newProject } from "../lib/editor";
import { alert, editor_state, engine_mode } from "../lib/stores";

const FSMTypes = [
	{
		type: "DFA",
		icon: <CircleDot color="#ffffff" size={18} />,
	},
	{
		type: "NFA",
		icon: <CircleDotDashed color="#ffffff" size={18} />,
	},
	// {
	//   type: "PDA",
	//   icon: <Layers2 color="#ffffff" size={18} />,
	// },
	{
		type: "Free Style",
		icon: <CircleFadingPlus color="#ffffff" size={18} />,
	},
];

const Controls = () => {
	// Jotai Stores
	const [editorState, setEditorState] = useAtom(editor_state);
	const [EngineMode, setEngineMode] = useAtom(engine_mode);
	const setAlert = useSetAtom(alert);
	// Jotai Stores

	const [alphabets, setAlphabets] = useState(EngineMode.alphabets.toString());
	const [FSMType, setFSMType] = useState(EngineMode.type);

	function handleStateChange(type) {
		if (type !== FSMType) {
			setFSMType(type);
		}
	}

	function cancelPressed() {
		setEditorState(null);
		setFSMType(EngineMode.type);
		setAlphabets(EngineMode.alphabets.toString());
	}

	function savePressed() {
		const type = FSMType;
		const alp = alphabets;

		const alph_seperated = alp.split(",");
		let alph_trimmed = alph_seperated.map((item) => item.trim());

		if (alp.trim().length === 0) {
			setAlert("Alphabets cannot be empty");
			return;
		}

		if (FSMType !== EngineMode.type) {
			const ans = confirm(
				"Changing Engine Mode will open a new editor meaning, any unsaved work will be lost. Are you sure you want to continue?",
			);

			if (!ans) return;
			else {
				// Start a New Project
				newProject();
				if (type === "NFA" && !alph_trimmed.includes("λ"))
					alph_trimmed.push("λ");
				if (type !== "NFA" && alph_trimmed.includes("λ"))
					alph_trimmed = alph_trimmed.filter((x) => x !== "λ");
			}
		}

		// Write Values to Store
		const new_controls = { type: type, alphabets: alph_trimmed };
		setEngineMode(new_controls);
		setEditorState(null);
		setAlert(`State Machine Type set to ${type}`);
		setTimeout(() => setAlert(""), 3000);
	}

	return (
		<div
			className={`absolute top-0 left-0 w-screen h-screen z-20 flex justify-center items-center bg-secondary-bg/30 ${editorState !== "Controls" && "hidden"
				}`}
		>
			<div className="flex flex-col gap-5 justify-center px-5 py-5 w-110 h-fit bg-primary-bg border border-border-bg rounded-3xl shadow-[0px_0px_50px_0px_#000000]/70 select-none">
				<h2 className="font-github text-2xl text-white font-medium text-center">
					State Machine Controls
				</h2>

				<span>
					<p
						className={`font-github text-white text-base pb-2 ${FSMType === "Free Style" && "hidden"
							}`}
					>
						Enter Alphabets in the Language
					</p>
					<input
						value={alphabets}
						onChange={(e) => setAlphabets(e.target.value)}
						placeholder="Enter comma seperated values..."
						className={`px-1 py-2 text-sm h-9 w-full font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out ${FSMType === "Free Style" && "hidden"
							}`}
						type="text"
					/>
					<p
						className={`font-github text-white text-base py-1 ${FSMType !== "NFA" && "hidden"
							}`}
					>
						Empty transition is automatically added
					</p>
				</span>

				<span>
					<p
						className={`font-github text-white text-base pb-2 font-semibold ${FSMType !== "PDA" && "hidden"
							}`}
					>
						Enter Initial Stack Alphabet
					</p>
					<input
						placeholder="Enter Initial Stack Alphabet..."
						maxLength={1}
						className={`px-1 py-2 text-sm h-9 w-full font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out ${FSMType !== "PDA" && "hidden"
							}`}
						type="text"
					/>
				</span>

				<span>
					<p className="font-github text-white text-base pb-2">
						State Machine Type
					</p>

					<span className="flex gap-2 justify-center">
						{FSMTypes.map((fsm, i) => (
							<span
								key={i}
								onClick={(_e) => handleStateChange(fsm.type)}
								className={`flex items-center justify-center gap-2  w-fit px-2 py-2 ${fsm.type === FSMType ? "bg-blue-500" : "bg-secondary-bg"
									} border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
							>
								{fsm.icon}
								<p className="text-white font-github text-sm">{fsm.type}</p>
							</span>
						))}
					</span>
				</span>

				<span className="flex gap-5 items-center justify-center my-2 w-full">
					<span
						onClick={cancelPressed}
						className="flex items-center justify-center gap-2 bg-secondary-fg w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out"
					>
						<CircleX color="#000000" size={18} />
						<p className="text-black font-github text-sm font-semibold">
							Cancel
						</p>
					</span>

					<span
						onClick={savePressed}
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

export default Controls;
