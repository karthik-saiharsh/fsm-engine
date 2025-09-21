import {
  Move3d,
  PlusCircleIcon,
  MinusCircleIcon,
  Move,
  Settings,
  Cable,
  HardDriveDownload,
  BookMarked,
} from "lucide-react";
import clsx from "clsx";
import {
  editorState,
  currentSelected,
  alert,
  arrowStates,
  saveFSMAtom,
} from "../lib/backend";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

const Dock = () => {
  const DockIconSize = 24;
  const DockIconColor = "#ffffff";

  // Global editor state store
  const currentState = useAtomValue(editorState);
  const setCurrentState = useSetAtom(editorState);

  const currSelected = useAtomValue(currentSelected);

  const setAlertMsg = useSetAtom(alert);

  const setTransitionTracker = useSetAtom(arrowStates);

  const setSaveFSM = useSetAtom(saveFSMAtom);
  const saveFSM = useAtomValue(saveFSMAtom);

  // Keybind Handling
  useEffect(() => {
    // Setting keybind for saving fsm
    const ctrls = (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key == "s";

    // Prevents browser from doing default command for whatever the keybind above is
    const ignore = (e: KeyboardEvent) => {
      if (ctrls(e)) {
        e.preventDefault();
      }
    }

    // Put this in a different handler because this only works if ignore is on keydown and this command is on keyup, and quite frankly keyup feels terrible to use for the other keybinds
    const handleSave = (e: KeyboardEvent) => {
      if (ctrls(e)) setSaveFSM(true);
    }

    // Assigning keybinds to the tools
    const handleKeybinds = (e: KeyboardEvent) => {
      if (e.key == "1") {
        if (currentState == "grab") setCurrentState("nil");
        else setCurrentState("grab");
      }
      else if (e.key == "2") {
        if (currentState == "select") setCurrentState("nil");
        else setCurrentState("select");
      }
      else if (e.key == "3") {
        if (currentState == "create") setCurrentState("nil");
        else setCurrentState("create");

      }
      else if (e.key == "4") {
        if (currentState == "delete") setCurrentState("nil");
        else setCurrentState("delete");
      }
      else if (e.key == "5" && currSelected != "nil") setCurrentState("settings");
      else if (e.key == "6") {
        if (currentState == "connect") setCurrentState("nil");
        else setCurrentState("connect");
      }
      else if (e.key == "Escape") { // Deselect everything
        setSaveFSM(false);
        setCurrentState("nil");
      }
    }

    window.addEventListener("keydown", handleKeybinds);
    window.addEventListener("keyup", handleSave);
    window.addEventListener("keydown", ignore);
    return () => {
      window.removeEventListener("keydown", handleKeybinds);
      window.removeEventListener("keyup", handleSave);
      window.removeEventListener("keydown", ignore)
    }
  }, [setCurrentState, currSelected, setSaveFSM, currentState]);

  return (
    <div className="absolute bottom-5 w-screen h-15 flex justify-center items-center select-none max-lg:hidden">
      <div className="w-fit px-2 h-15 z-10 bg-secondary-bg rounded-2xl border border-border-bg flex justify-center items-center gap-5 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.5)]">
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
          <Move3d
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">
            Displace
          </p>
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
          <Move
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />

          <p className="text-white font-github font-semibold text-balance">
            Move
          </p>
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
          <p className="text-white font-github font-semibold text-balance">
            Add
          </p>
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
          <p className="text-white font-github font-semibold text-balance">
            Delete
          </p>
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
          <p className="text-white font-github font-semibold text-balance">
            Controls
          </p>
        </div>

        {/* Connect Nodes */}
        <div
          onClick={() => {
            if (currentState == "connect") setCurrentState("nil");
            else {
              setCurrentState("connect");
              setTransitionTracker(undefined);
            }
          }}
          className={clsx(
            "flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "connect",
              "bg-blue-500": currentState == "connect",
            }
          )}
        >
          <Cable
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />

          <p className="text-white font-github font-semibold text-balance">
            Connect
          </p>
        </div>

        {/* Save/Download FSM */}
        <div
          onClick={() => setSaveFSM(!saveFSM)}
          className={clsx(
            "group p-2 border flex gap-2 border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": !saveFSM,
              "bg-blue-500": saveFSM,
            }
          )}
        >
          <HardDriveDownload
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">
            Save FSM
          </p>
        </div>

        {/* Help/Welcome FSM */}
        <div
          onClick={() =>
            currentState == "welcome"
              ? setCurrentState("nil")
              : setCurrentState("welcome")
          }
          className={clsx(
            "flex gap-2 p-2 border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300",
            {
              "bg-secondary-bg": currentState != "welcome",
              "bg-blue-500": currentState == "welcome",
            }
          )}
        >
          <BookMarked
            size={DockIconSize}
            color={DockIconColor}
            className="pointer-events-none"
          />
          <p className="text-white font-github font-semibold text-balance">
            Welcome
          </p>
        </div>

        {/* Dock Items */}
      </div>
    </div>
  );
};

export default Dock;
