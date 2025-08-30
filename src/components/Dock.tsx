import { MousePointer2, PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import clsx from "clsx";
import { editorState } from "../backend";
import { useAtomValue, useSetAtom } from "jotai";

const Dock = () => {
  const DockIconSize = 24;
  const DockIconColor = "#ffffff";


  const currentState = useAtomValue(editorState);
  const setCurrentState = useSetAtom(editorState);

  return (
    <div className="absolute bottom-5 w-screen h-15 flex justify-center items-center">
      <div className="w-100 h-15 z-10 bg-secondary-bg rounded-2xl border border-border-bg flex justify-center items-center gap-5 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.5)]">
        {/* Dock Items */}

        <div
          onClick={() =>
            currentState == "select"
              ? setCurrentState("nil")
              : setCurrentState("select")
          }
          className={clsx(
            "p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "select",
              "bg-blue-500": currentState == "select",
            }
          )}
        >
          <MousePointer2 size={DockIconSize} color={DockIconColor} className="pointer-events-none"/>
        </div>

        <div
          onClick={() =>
            currentState == "create"
              ? setCurrentState("nil")
              : setCurrentState("create")
          }
          className={clsx(
            "p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "create",
              "bg-blue-500": currentState == "create",
            }
          )}
        >
          <PlusCircleIcon size={DockIconSize} color={DockIconColor} className="pointer-events-none"/>
        </div>

        <div
          onClick={() =>
            currentState == "delete"
              ? setCurrentState("nil")
              : setCurrentState("delete")
          }
          className={clsx(
            "p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "delete",
              "bg-blue-500": currentState == "delete",
            }
          )}
        >
          <MinusCircleIcon size={DockIconSize} color={DockIconColor} className="pointer-events-none"/>
        </div>

        {/* Dock Items */}
      </div>
    </div>
  );
};

export default Dock;
