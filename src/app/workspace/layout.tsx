"use client"

import { FC, ReactNode } from "react";
import { Toolbar } from "./components/toolbar";
import { Sidebar } from "./components/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./components/workspace-sidebar";

interface WorkspaceLayoutProps {
  children: ReactNode
}

const WorkspaceLayout: FC<WorkspaceLayoutProps> = (props) => {
  const { children } = props;

  return (
    <div
      className="h-full"
    >
      <Toolbar/>
      <div
        className="flex h-[calc(100vh-40px)]"
      >
        <Sidebar/>
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar/>
          </ResizablePanel>
          <ResizableHandle
            withHandle
          />
          <ResizablePanel
            minSize={20}
          >
            { children }
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceLayout;