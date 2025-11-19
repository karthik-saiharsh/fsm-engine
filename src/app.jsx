import Dock from "./components/Dock";
import Editor from "./components/Editor";
import Settings from "./components/Settings";
import Controls from "./components/Controls";
import { useEffect } from "react";
import Alert from "./components/Alert";
import Popup from "./components/Popup";
import Guide from "./components/Guide";
import SaveDialog from "./components/SaveDialog";
import { handleShortCuts } from "./lib/editor";

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

  return (
    <div id="body" className="w-screen h-screen bg-primary-bg overflow-hidden">
      <Editor />

      <Dock />

      <Settings />

      <Controls />

      <Alert />

      <Popup />

      <Guide />

      <SaveDialog />
    </div>
  );
}
