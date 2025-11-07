import { editor_state } from "../lib/stores";
import { useAtom } from "jotai";

const Guide = () => {
  // Jotai Stores
  const [editorState, setEditorState] = useAtom(editor_state);

  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen z-20 flex justify-center items-center bg-secondary-bg/30 ${
        editorState != "Guide" && "hidden"
      }`}
    >
      <div className="flex flex-col gap-5 justify-center px-5 py-5 w-110 h-fit bg-primary-bg border border-border-bg rounded-3xl shadow-[0px_0px_50px_0px_#000000]/70 select-none">
        <h1 className="font-github text-white font-bold text-3xl text-center">Welcome!</h1>
      </div>
    </div>
  );
};

export default Guide;
