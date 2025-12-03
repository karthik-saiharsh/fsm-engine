import { useAtomValue } from "jotai";
import { useEffect } from "react";
import Alert from "./components/Alert";
import Controls from "./components/Controls";
import Dock from "./components/Dock";
import Editor from "./components/Editor";
import Guide from "./components/Guide";
import Popup from "./components/Popup";
import SaveDialog from "./components/SaveDialog";
import Settings from "./components/Settings";
import TopDock from "./components/TopDock";
import TransitionTable from "./components/TransitionTable";
import ConfirmDialog from "./components/ConfirmDialog";
import { handleShortCuts } from "./lib/editor";
import { editor_state } from "./lib/stores";
import { useState } from "react";

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

	const EditorState = useAtomValue(editor_state);

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
		<div id="body" className="w-screen h-screen bg-primary-bg overflow-hidden">
			<Editor />

			<Dock />

			<Settings />

			<Controls />

			<Alert />

			<Popup />

			<Guide />

			<TopDock />

			<SaveDialog />

			<SaveDialog />

			<TransitionTable />

			<ConfirmDialog />
		</div>
	);
}
