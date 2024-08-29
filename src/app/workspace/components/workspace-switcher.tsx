import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Router } from "@/enums/router";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";

const WorkspaceSwitcher: FC = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  )

  const getWorkspace = useMemo(() => workspace, [workspace]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
      >
        <Button
          className="size-9 relative overflow-hidden bg-[#ABABAB] hover:bg-[#ABABAB]/80 text-slate-800 font-semibold text-xl"
        >
          {
            workspaceLoading
            ? (
              <Loader
                className="size-5 animate-spin shrink-0"
              />
            )
            : (
              workspace?.name.charAt(0).toUpperCase()
            )
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-72"
      >
        <DropdownMenuItem
          onClick={() => router.push(`${Router.Workspaces}/${workspaceId}`)}
          className="cursor-pointer flex flex-col justify-start items-start capitalize p-2"
        >
          {getWorkspace?.name}
          <span
            className="text-sm text-muted-foreground"
          >
            Active workspace
          </span>
        </DropdownMenuItem>
        {
          filteredWorkspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace._id}
              className="cursor-pointer capitalize p-2 flex items-center overflow-hidden"
              onClick={() => router.push(`${Router.Workspaces}/${workspace._id}`)}
            >
              <div
                className="size-9 shrink-0 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2"
              >
                {workspace.name.charAt(0).toLocaleUpperCase()}
              </div>
              <p
                className="truncate"
              >
                {workspace.name}
              </p>
            </DropdownMenuItem>
          ))
        }
        <DropdownMenuItem
          className="cursor-pointer flex items-center p-2"
          onClick={() => setOpen(true)}
        >
          <div
            className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2"
          >
            <Plus/>
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { WorkspaceSwitcher };