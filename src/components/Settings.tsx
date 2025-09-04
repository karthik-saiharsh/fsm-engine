//@ts-nocheck
import { CircleX, RefreshCw } from "lucide-react";
import { editorState, currentSelected, Nodes } from "../lib/backend";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import clsx from "clsx";
import type { Atom } from "jotai";

const Settings = () => {
  const [currentEditorState, changeEditorState] = useAtom(editorState);

  const [nodeList, updateNodeList] = useAtom(Nodes);

  const currSelected = useAtomValue(currentSelected);

  const [stateName, setStateName] = useState("");
  const [stateColor, setStateColor] = useState("");
  const [stateType, setStateType] = useState("");

  function setDefaultSettingsValues() {
    if (currSelected != "nil") {
      setStateName(nodeList[currSelected].name);
      setStateColor(nodeList[currSelected].fill.substring(0, 7));
      setStateType(nodeList[currSelected].type);
    }
  }

  function saveSettingsToNode() {
    if (currSelected != "nil") {
      nodeList[currSelected].name = stateName;
      nodeList[currSelected].fill = stateColor + "80";
      nodeList[currSelected].type = stateType;
      updateNodeList(nodeList);
    }
  }

  useEffect(setDefaultSettingsValues, [currSelected]);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 z-20 w-screen h-screen bg-[#1e1e1ebb] flex justify-center items-center transition-all ease-in-out duration-500",
        {
          "hidden pointer-events-none opacity-0":
            currentEditorState != "settings" || currSelected == "nil",
        }
      )}
    >
      {/* Settings Window */}
      <div
        className={clsx(
          "flex flex-col py-8 px-5 gap-5 w-100 h-fit bg-primary-bg border border-border-bg rounded-4xl shadow-[0px_0px_100px_0px_#00000080] transition-all ease-in-out duration-500",
          {
            "hidden pointer-events-none opacity-0 scale-0":
              currentEditorState != "settings" || currSelected == "nil",
          }
        )}
      >
        <span>
          <p className="text-white font-github text-balance mb-3 font-medium select-none">
            State Name
          </p>
          <input
            type="text"
            placeholder="Enter State Name..."
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="text-white font-github text-base px-2 border border-border-bg hover:border-input-active focus:border-2 focus:border-blue-500 transition-all ease-in-out outline-none w-full h-10 rounded-lg"
          />
        </span>

        <span>
          <p className="text-white font-github text-balance mb-3 font-medium select-none">
            State Color
          </p>
          <input
            type="color"
            value={stateColor}
            onChange={(e) => setStateColor(e.target.value)}
            className="rounded-lg border-3 border-border-bg"
          />
        </span>

        <span>
          <p className="text-white font-github text-balance mb-3 font-medium select-none">
            State Type
          </p>
          <label htmlFor="initial" className="font-github text-white">
            <input
              type="radio"
              name="state"
              id="initial"
              className="mr-2"
              checked={stateType == "initial"}
              onChange={(e) => setStateType(e.target.id)}
            />
            Initial State
          </label>

          <br className="my-1" />

          <label htmlFor="final" className="font-github text-white">
            <input
              type="radio"
              name="state"
              id="final"
              className="mr-2"
              checked={stateType == "final"}
              onChange={(e) => setStateType(e.target.id)}
            />
            Final State
          </label>

          <br className="my-1" />

          <label htmlFor="intermediate" className="font-github text-white">
            <input
              type="radio"
              name="state"
              id="intermediate"
              className="mr-2"
              checked={stateType == "intermediate"}
              onChange={(e) => setStateType(e.target.id)}
            />
            Intermediate State
          </label>
        </span>

        <span className="flex justify-center gap-5">
          <button
            onClick={() => {
              changeEditorState("nil");
              setDefaultSettingsValues();
            }}
            className="flex text-sm gap-2 font-github items-center rounded-xl text-black bg-white px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out"
          >
            Cancel
            <CircleX size={20} color="#000000" />
          </button>

          <button
            onClick={() => {
              changeEditorState("nil");
              saveSettingsToNode();
            }}
            className="flex text-sm font-github gap-2 items-center rounded-xl text-white bg-blue-500 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out"
          >
            Save
            <RefreshCw size={20} color="#ffffff" />
          </button>
        </span>
      </div>
    </div>
  );
};

export default Settings;
