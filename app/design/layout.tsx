import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/design/AppSidebar";
import ToolBar from "@/components/design/ToolBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <div className="w-screen h-screen flex justify-center items-center min-md:hidden">
        <p className="font-github text-2xl font-bold">This site works only on a computer or a Laptop</p>
    </div>
      <div className="w-screen h-screen overflow-hidden max-md:hidden">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar/>
          <main>
            <SidebarTrigger/>
            {children}
          </main>
        </SidebarProvider>
        <span className="z-10 absolute bottom-10 w-full">
          <ToolBar />
        </span>
      </div>
    </>
  );
};

export default layout;
