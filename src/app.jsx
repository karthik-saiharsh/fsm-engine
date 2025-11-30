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
import { useAtomValue } from "jotai";
import { handleShortCuts } from "./lib/editor";
import { editor_state } from "./lib/stores";

export function App() {
	// Disable right click context menu
	// Got this useEffect code from StackOverflow
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
