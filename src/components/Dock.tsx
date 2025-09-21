import {
	Move3d,
	PlusCircleIcon,
	MinusCircleIcon,
	Settings,
	Cable,
	HardDriveDownload,
	BookMarked,
} from "lucide-react";
import clsx from "clsx";
import {
	editorState,
	currentSelected,
	alert,
	arrowStates,
	saveFSMAtom,
} from "../lib/backend";
import { useAtomValue, useSetAtom } from "jotai";

const Dock = () => {
	const DockIconSize = 24;
	const DockIconColor = "#ffffff";

	// Global editor state store
	const currentState = useAtomValue(editorState);
	const setCurrentState = useSetAtom(editorState);

	const currSelected = useAtomValue(currentSelected);

	const setAlertMsg = useSetAtom(alert);

	const setTransitionTracker = useSetAtom(arrowStates);

	const setSaveFSM = useSetAtom(saveFSMAtom);
	const saveFSM = useAtomValue(saveFSMAtom);

	// Dock Items
	// Each item has a name, icon, and onclick function
	// The condition array is used to determine the background color of
	// that item's button when it is not active and active respectively
	const DockItems = [
		{
			name: "Displace",
			condition: [currentState != "grab", currentState == "grab"],
			icon: (
				<Move3d
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),
			onclick: () => {
				currentState == "grab"
					? setCurrentState("nil")
					: setCurrentState("grab");
			},
		},
		{
			name: "Add",
			condition: [currentState != "create", currentState == "create"],
			icon: (
				<PlusCircleIcon
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),
			onclick: () => {
				currentState == "create"
					? setCurrentState("nil")
					: setCurrentState("create");
			},
		},
		{
			name: "Delete",
			condition: [currentState != "delete", currentState == "delete"],
			icon: (
				<MinusCircleIcon
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),
			onclick: () => {
				currentState == "delete"
					? setCurrentState("nil")
					: setCurrentState("delete");
			},
		},
		{
			name: "Controls",
			condition: [currentState != "settings", currentState == "settings"],
			icon: (
				<Settings
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),

			onclick: () => {
				if (currSelected != "nil") {
					currentState == "settings"
						? setCurrentState("nil")
						: setCurrentState("settings");
				} else {
					setAlertMsg("You must select a State to view its Settings!");
					setTimeout(() => setAlertMsg("nil"), 3000);
				}
			},
		},
		{
			name: "Connect",
			condition: [currentState != "connect", currentState == "connect"],
			icon: (
				<Cable
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),
			onclick: () => {
				if (currentState == "connect") setCurrentState("nil");
				else {
					setCurrentState("connect");
					setTransitionTracker(undefined);
				}
			},
		},

		{
			name: "Save FSM",
			condition: [!saveFSM, saveFSM],
			icon: (
				<HardDriveDownload
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),
			onclick: () => setSaveFSM(!saveFSM),
		},

		{
			name: "Welcome",
			condition: [currentState != "welcome", currentState == "welcome"],
			icon: (
				<BookMarked
					size={DockIconSize}
					color={DockIconColor}
					className="pointer-events-none"
				/>
			),
			onclick: () => {
				currentState == "welcome"
					? setCurrentState("nil")
					: setCurrentState("welcome");
			},
		},
	];

	return (
		<div className="absolute bottom-5 w-screen h-15 flex justify-center items-center select-none max-lg:hidden">
			<div className="w-fit px-2 h-15 z-10 bg-secondary-bg rounded-2xl border border-border-bg flex justify-center items-center gap-5 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.5)]">
				{/* Dock Items */}
				{DockItems.map((item) => (
					<div
						key={item.name}
						onClick={item.onclick}
						className={clsx(
							"flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-110 hover:-translate-y-3 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
							{
								"bg-secondary-bg": item.condition[0],
								"bg-blue-500": item.condition[1],
							},
						)}
					>
						{item.icon}
						<p className="text-white font-github font-semibold text-balance">
							{item.name}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Dock;
