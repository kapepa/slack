"use client"

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { NextPage } from "next";

const WorkspaceIdPage: NextPage = () => {
  const workspaceId = useWorkspaceId();

  return (
    <div>
      WorkspaceIdPage
    </div>
  )
}

export default WorkspaceIdPage;