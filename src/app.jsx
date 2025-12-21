import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import ConfirmDialog from "./components/ConfirmDialog";
import Controls from "./components/Controls";
import Dock from "./components/Dock";
import Editor from "./components/Editor";
import Guide from "./components/Guide";
import Popup from "./components/Popup";
import SaveDialog from "./components/SaveDialog";
import Settings from "./components/Settings";
import StringValidator from "./components/StringValidator";
import TopDock from "./components/TopDock";
import TransitionTable from "./components/TransitionTable";
import { handleShortCuts } from "./lib/editor";
import { show_string_validator } from "./lib/stores";

export function App() {
	// Disable right click context menu
	// Got this useEffect code from StackOverflow
	const [isMobile, SetMobile] = useState(false);

	useEffect(() => {
		const Device =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			);

		SetMobile(Device);
	}, []);

	useEffect(() => {
		const handleContextmenu = (e) => {
			e.preventDefault();
		};
		document.addEventListener("contextmenu", handleContextmenu);
		return function cleanup() {
			document.removeEventListener("contextmenu", handleContextmenu);
		};
	}, []);

	// Add KeyBoard Shortcuts
	function handleKeyPress(event) {
		handleShortCuts(event.key);
	}

	useEffect(() => {
		document.addEventListener("keyup", handleKeyPress);

		return () => {
			document.removeEventListener("keyup", handleKeyPress);
		};
	}, [handleKeyPress]);

	// Jotai Stores
	const showStringValidator = useAtomValue(show_string_validator);

	if (isMobile) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-200 p-6 text-center">
				<p className="text-2xl font-semibold tracking-wide text-gray-100 drop-shadow-[0_0_7px_rgba(255,255,255,0.7)]">
					FSM Engine is Designed for Desktop/Laptop use only..!
					<br />
					Please open this application on a bigger device
				</p>
			</div>
		);
	}

	return (
		<>
			<div
				id="body"
				className="w-screen h-screen bg-primary-bg overflow-hidden max-[1250px]:hidden"
			>
				<Editor />
				<Dock />
				<Settings />
				<Controls />
				<Alert />
				<Popup />
				<Guide />
				<TopDock />
				<SaveDialog />
				<TransitionTable />
				<ConfirmDialog />
				{showStringValidator && <StringValidator />}
				{/* TradeMark */}
				{/* {Liscense Does not allow you to remove this line. Keep this intact!} */}
				<p className="absolute bottom-0 w-full text-center text-[0.7rem] font-github text-white/50 select-none pointer-events-none">
					Copyright &#169; Illindala Karthik Saiharsh All rights reserved.
				</p>
			</div>

			<div className="w-screen h-screen bg-primary-bg overflow-hidden min-[1250px]:hidden flex items-center justify-center">
				<p className="font-github text-white text-2xl font-bold text-center">
					Switch to a bigger Screen
				</p>
			</div>
		</>
	);
}
