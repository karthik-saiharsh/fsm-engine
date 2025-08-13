import ToolBar from "@/components/design/ToolBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center min-md:hidden">
        <p className="font-github text-2xl font-bold">
          This site works only on a computer or a Laptop
        </p>
      </div>
      {children}
      <span className="z-10 absolute bottom-10 w-full max-md:hidden">
        <ToolBar />
      </span>
    </>
  );
};

export default layout;
