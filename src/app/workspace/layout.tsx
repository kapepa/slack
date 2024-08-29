import { FC, ReactNode } from "react";
import { Toolbar } from "./components/toolbar";

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
      { children }
    </div>
  )
}

export default WorkspaceLayout;