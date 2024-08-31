import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader, MessageSquareText } from "lucide-react";
import { FC } from "react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";

const WorkspaceSidebar: FC = () => {
  const workspaceId = useWorkspaceId();
  const { data: dataMember, isLoading: loadingMember } = useCurrentMember({ workspaceId });
  const { data: dataWorkspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId });

  if (loadingMember || loadingWorkspace) {
    return (
      <div
        className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center"
      >
        <Loader
          className="size-5 animate-spin text-white"
        />
      </div>
    )
  }

  if (!dataMember || !dataWorkspace) {
    return (
      <div
        className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center"
      >
        <AlertTriangle
          className="size-5 text-white"
        />
        <p
          className="text-white text-sm"
        >
          Workspace not found
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col bg-[#5E2C5F] h-full"
    >
      <WorkspaceHeader
        workspace={dataWorkspace}
        isAdmin={dataMember.role === "admin"}
      />
      <div
        className="flex flex-col px-2 mt-3"
      >
        <SidebarItem
          id="threads"
          icon={MessageSquareText}
          label="Threads"
        />
      </div>
    </div>
  )
};

export { WorkspaceSidebar }