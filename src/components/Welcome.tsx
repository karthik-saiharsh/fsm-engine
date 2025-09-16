//@ts-nocheck
import { ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react";
import { editorState } from "../lib/backend";
import { useAtom } from "jotai";
import clsx from "clsx";

export default function Welcome() {
  const [currentEditorState, setCurrentEditorState] = useAtom(editorState);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 z-20 w-screen h-screen bg-[#1e1e1ebb] flex justify-center items-center transition-all ease-in-out duration-500",
        {
          "hidden pointer-events-none opacity-0":
            currentEditorState != "welcome",
        }
      )}
    >
      {/* Settings Window */}
      <div
        className={clsx(
          "flex flex-col justify-center items-center py-8 px-5 gap-5 w-100 h-fit bg-primary-bg border border-border-bg rounded-4xl shadow-[0px_0px_100px_0px_#00000080] transition-all ease-in-out duration-500",
          {
            "hidden pointer-events-none opacity-0 scale-0":
              currentEditorState != "welcome",
          }
        )}
      >
        <Intro />

        <div className="flex gap-5">
          <button className="flex text-sm gap-2 font-github font-semibold items-center rounded-xl text-black bg-gray-200 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out">
            <ChevronLeft color="#000000" size={15} />
          </button>
          <button className="flex text-sm gap-2 font-github font-semibold items-center rounded-xl text-black bg-gray-200 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out">
            <ChevronRight color="#000000" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Pages for the Welcom Popup
function Intro() {
  const profileImg = "https://avatars.githubusercontent.com/karthik-saiharsh";
  return (
    <div className="w-full flex flex-col justify-center items-center select-none">
      <img
        src={profileImg}
        alt="Karthik Saiharsh"
        className="rounded-full w-60 h-60 border-2 border-blue-500"
      />
      <p className="font-github text-white font-semibold text-center my-5">
        Karthik Saiharsh
      </p>
      <p className="font-github text-white font-normal text-center w-[90%]">
        Hey! I'm Karthik, the creator of FSM Engine. Glad you took time to check
        it out.
      </p>
      <button className="flex text-sm gap-2 font-github font-semibold mt-5 items-center rounded-xl text-white bg-blue-500 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out">
        View Github Repo
        <ArrowUpRight color="#ffffff" size={24} />
      </button>
    </div>
  );
}
