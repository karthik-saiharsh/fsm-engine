import { useState } from "react";
import {
  CircleDot,
  Layers2,
  CircleX,
  CircleCheck,
  CircleFadingPlus,
  CircleDotDashed,
} from "lucide-react";

const Controls = () => {
  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen z-20 flex justify-center items-center bg-secondary-bg/30`}
    >
      <div className="flex flex-col gap-5 justify-center px-5 py-5 w-fit h-fit bg-primary-bg border border-border-bg rounded-3xl shadow-[0px_0px_50px_0px_#000000]/70 select-none">
        <h2 className="font-github text-2xl text-white font-medium text-center">
          State Machine Controls
        </h2>

        <span>
          <p className="font-github text-white text-base pb-2 font-semibold">
            Enter alphabets in the Language
          </p>
          <input
            placeholder="Enter comma seperated values..."
            className="px-1 py-2 text-sm h-9 w-full font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out"
            type="text"
          />
        </span>

        <span>
          <p className="font-github text-white text-base pb-2">
            State Machine Type
          </p>

          <span className="flex gap-2">
            <span
              className={`flex items-center justify-center gap-2  w-fit px-2 py-2 border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
            >
              <CircleDot color="#ffffff" size={18} />
              <p className="text-white font-github text-sm">DFA</p>
            </span>

            <span
              className={`flex items-center justify-center gap-2 w-fit px-2 py-2 border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
            >
              <CircleDotDashed color="#ffffff" size={18} />
              <p className="text-white font-github text-sm">NFA</p>
            </span>

            <span
              className={`flex items-center justify-center gap-2 w-fit px-2 py-2 border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
            >
              <Layers2 color="#ffffff" size={18} />
              <p className="text-white font-github text-sm">PDA</p>
            </span>

            <span
              className={`flex items-center justify-center gap-2 w-fit px-2 py-2 border border-border-bg rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out`}
            >
              <CircleFadingPlus color="#ffffff" size={18} />
              <p className="text-white font-github text-sm">FreeStyle</p>
            </span>
          </span>
        </span>

        <span className="flex gap-5 items-center justify-center my-2 w-full">
          <span className="flex items-center justify-center gap-2 bg-secondary-fg w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out">
            <CircleX color="#000000" size={18} />
            <p className="text-black font-github text-sm font-semibold">
              Cancel
            </p>
          </span>

          <span className="flex items-center justify-center gap-2 bg-blue-500 w-fit px-2 py-2 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all ease-in-out">
            <CircleCheck color="#ffffff" size={18} />
            <p className="text-white font-github text-sm font-semibold">Save</p>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Controls;
