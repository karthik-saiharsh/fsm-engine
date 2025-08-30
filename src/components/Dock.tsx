import { MousePointer2, PlusCircleIcon, MinusCircleIcon } from "lucide-react";

const Dock = () => {

    const DockIconSize = 24;
    const DockIconColor = "#ffffff";

  return (
    <div className="absolute bottom-5 w-screen h-15 flex justify-center items-center">

      <div className="w-100 h-15 z-10 bg-secondary-bg rounded-2xl border border-border-bg flex justify-center items-center gap-5 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.5)]">
        
        {/* Dock Items */}
      
        <div className="p-2 bg-secondary-bg border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300">
            <MousePointer2 size={DockIconSize} color={DockIconColor}/>
        </div>

        <div className="p-2 bg-secondary-bg border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300">
            <PlusCircleIcon size={DockIconSize} color={DockIconColor}/>
        </div>

        <div className="p-2 bg-secondary-bg border border-border-bg rounded-xl hover:scale-130 hover:-translate-y-5 active:scale-100 cursor-pointer transition-all ease-in-out duration-300">
            <MinusCircleIcon size={DockIconSize} color={DockIconColor}/>
        </div>


        {/* Dock Items */}

      </div>
    </div>
  );
};

export default Dock;
