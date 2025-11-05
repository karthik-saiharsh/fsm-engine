import Dock from "./components/Dock";
import Editor from "./components/Editor";
import Settings from "./components/Settings";
import Controls from "./components/Controls";
import { useEffect } from "react";
import Alert from "./components/Alert";

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

  return (
    <div id="body" className="w-screen h-screen bg-primary-bg overflow-hidden">
      <Editor />

      <Dock />

      <Settings />

      <Controls />

      <Alert />
    </div>
  );
}
