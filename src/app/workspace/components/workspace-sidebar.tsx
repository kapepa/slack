import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { FC } from "react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

const WorkspaceSidebar: FC = () => {
  const workspaceId = useWorkspaceId();
  const { data: dataMember, isLoading: loadingMember } = useCurrentMember({ workspaceId });
  const { data: dataWorkspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId });
  const { data: dataChannels, isLoading: loadingChannels } = useGetChannels({ workspaceId });
  const { data: dataMembers, isLoading: loadingMembers } = useGetMembers({ workspaceId });

  const [open, setOpen] = useCreateChannelModal();

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
        <SidebarItem
          id="drafts"
          icon={SendHorizonal}
          label="Drafts & Sent"
        />
      </div>  
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={dataMember.role === "admin" ? () => setOpen(true) : undefined}
      >
        {
          !!dataChannels && dataChannels?.map((item) => (
            <SidebarItem
              key={item._id}
              icon={HashIcon}
              label={item.name}
              id={item._id}
            >

            </SidebarItem>
          ))
        }
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {
          dataMembers?.map((item) => (
            <UserItem
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
            />
          ))
        }
      </WorkspaceSection>
    </div>
  )
};

export { WorkspaceSidebar }