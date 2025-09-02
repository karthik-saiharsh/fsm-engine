import { CircleX, RefreshCw } from "lucide-react";
import { editorState } from "../lib/backend";
import { useAtomValue, useSetAtom } from "jotai";
import clsx from "clsx";

const Settings = () => {
  let currentEditorState = useAtomValue(editorState);
  let changeEditorState = useSetAtom(editorState);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 z-20 w-screen h-screen bg-[#1e1e1ebb] flex justify-center items-center transition-all ease-in-out",
        { "hidden pointer-events-none opacity-0": currentEditorState != "settings" }
      )}
    >
      {/* Settings Window */}
      <div
        className={clsx(
          "flex flex-col py-8 px-5 gap-5 w-100 h-fit bg-primary-bg border border-border-bg rounded-4xl shadow-[0px_0px_100px_0px_#00000080] transition-all ease-in-out",
          {"hidden pointer-events-none opacity-0 scale-0": currentEditorState != "settings"}
        )}
      >
        <span>
          <p className="text-white font-github text-balance mb-3 font-medium select-none">
            State Name
          </p>
          <input
            type="text"
            className="text-white font-github text-base px-2 border border-border-bg hover:border-input-active focus:border-2 focus:border-blue-500 transition-all ease-in-out outline-none w-full h-10 rounded-lg"
          />
        </span>

        <span>
          <p className="text-white font-github text-balance mb-3 font-medium select-none">
            State Color
          </p>
          <input
            type="color"
            value="#ffffff"
            className="rounded-lg border border-border-bg"
          />
        </span>

        <span>
          <p className="text-white font-github text-balance mb-3 font-medium select-none">
            State Type
          </p>
          <label htmlFor="initial" className="font-github text-white">
            <input type="radio" name="state" id="initial" className="mr-2" />
            Initial State
          </label>

          <br className="my-1" />

          <label htmlFor="final" className="font-github text-white">
            <input type="radio" name="state" id="final" className="mr-2" />
            Final State
          </label>

          <br className="my-1" />

          <label htmlFor="intermediate" className="font-github text-white">
            <input
              type="radio"
              name="state"
              id="intermediate"
              className="mr-2"
            />
            Intermediate State
          </label>
        </span>

        <span className="flex justify-center gap-5">
          <button 
          onClick={() => changeEditorState("nil")}
          className="flex text-sm gap-2 font-github items-center rounded-xl text-black bg-white px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out">
            Cancel
            <CircleX size={20} color="#000000" />
          </button>

          <button className="flex text-sm font-github gap-2 items-center rounded-xl text-white bg-blue-500 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out">
            Save
            <RefreshCw size={20} color="#ffffff" />
          </button>
        </span>
      </div>
    </div>
  );
};

export default Settings;
