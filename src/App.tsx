import Dock from "./components/Dock"
import Editor from "./components/Editor"

function App() {

  return (
    <>
      <div id="editorwin" className="w-screen h-screen overflow-hidden bg-primary-bg">
        <Editor />
      </div>

      <Dock />
    </>
  )
}

export default App
