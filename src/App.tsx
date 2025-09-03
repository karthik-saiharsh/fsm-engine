import Alert from "./components/Alert";
import Dock from "./components/Dock";
import Editor from "./components/Editor";
import Settings from "./components/Settings";
import { alert } from "./lib/backend";
import { useAtomValue } from "jotai";
import Error from "./components/Error";

// @ts-ignore
import GridLines from "react-gridlines";

function App() {

  const alertMsg = useAtomValue(alert);

  return (
    <>
      <div
        id="editorwin"
        className="w-screen h-screen overflow-hidden bg-primary-bg"
      >
        <GridLines
          className="grid-area"
          cellWidth={100}
          strokeWidth={3}
          cellWidth2={10}
          lineColor="#ffffff33"
          lineColor2="#ffffff1a"
        >
          <Editor />
        </GridLines>
      </div>

      <Dock />

      {/* Settings Menu  */}
      <Settings />

      {/* Alert Box */}
      <Alert message={alertMsg} />

      {/* Error Page */}
      <Error />
    </>
  );
}

export default App;
