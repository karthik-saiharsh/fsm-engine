import {
  MousePointer2,
  PlusCircleIcon,
  MinusCircleIcon,
  Hand,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import { editorState, currentSelected, alert } from "../lib/backend";
import { useAtomValue, useSetAtom } from "jotai";

const Dock = () => {
  const DockIconSize = 24;
  const DockIconColor = "#ffffff";

  // Global editor state store
  const currentState = useAtomValue(editorState);
  const setCurrentState = useSetAtom(editorState);

  const currSelected = useAtomValue(currentSelected);

  const setAlertMsg = useSetAtom(alert);

  return (
    <div className="absolute bottom-5 w-screen h-15 flex justify-center items-center">
      <div className="w-fit px-5 h-15 z-10 bg-secondary-bg rounded-2xl border border-border-bg flex justify-center items-center gap-5 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.5)]">
        {/* Dock Items */}

        {/* Grab/Move Editor */}
        <div
          onClick={() =>
            currentState == "grab"
              ? setCurrentState("nil")
              : setCurrentState("grab")
          }
          className={clsx(
            "group p-2 border flex gap-2 border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "grab",
              "bg-blue-500": currentState == "grab",
            }
          )}
        >
          <Hand
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">Grab</p>
        </div>

        {/* Select/Move Nodes */}
        <div
          onClick={() =>
            currentState == "select"
              ? setCurrentState("nil")
              : setCurrentState("select")
          }
          className={clsx(
            "flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "select",
              "bg-blue-500": currentState == "select",
            }
          )}
        >
          <MousePointer2
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />

          <p className="text-white font-github font-semibold text-balance">Select</p>
        </div>

        {/* Create Node */}
        <div
          onClick={() =>
            currentState == "create"
              ? setCurrentState("nil")
              : setCurrentState("create")
          }
          className={clsx(
            "flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "create",
              "bg-blue-500": currentState == "create",
            }
          )}
        >
          <PlusCircleIcon
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">Add</p>
        </div>

        {/* Delete Node */}
        <div
          onClick={() =>
            currentState == "delete"
              ? setCurrentState("nil")
              : setCurrentState("delete")
          }
          className={clsx(
            "flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "delete",
              "bg-blue-500": currentState == "delete",
            }
          )}
        >
          <MinusCircleIcon
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">Delete</p>
        </div>

        {/* Settings of a Node */}
        <div
          onClick={() => {
            if (currSelected != "nil") {
              currentState == "settings"
                ? setCurrentState("nil")
                : setCurrentState("settings");
            } else {
              setAlertMsg("You must select a State to view its Settings!");
              setTimeout(() => setAlertMsg("nil"), 3000);
            }
          }}
          className={clsx(
            "flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "settings",
              "bg-blue-500": currentState == "settings",
            }
          )}
        >
          <Settings
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">Controls</p>
        </div>

        {/* Dock Items */}
      </div>
    </div>
  );
};

export default Dock;
