"use client"

import { FC, ReactNode } from "react";
import { Toolbar } from "./components/toolbar";
import { Sidebar } from "./components/sidebar";

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
        { children }
      </div>
    </div>
  )
}

export default WorkspaceLayout;