import Dock from "./components/Dock";
import Editor from "./components/Editor";

// @ts-ignore
import GridLines from "react-gridlines";

function App() {
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
    </>
  );
}

export default App;
