import { Button } from "@/components/ui/button";
import { Router } from "@/enums/router";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { IconType } from "react-icons/lib";

interface SidebarItemProps {
  id: string,
  icon: LucideIcon | IconType,
  label: string,
}

const SidebarItem: FC<SidebarItemProps> = (props) => {
  const { id, icon: Icon, label } = props;
  const workspaceId = useWorkspaceId();

  return (
    <Button
      size="sm"
      variant="transparent"
      asChild
    >
      <Link
        href={`${Router.Workspaces}/${workspaceId}${Router.Channel}/${id}`}
      >
        <Icon/>
        <span>
          {label}
        </span>
      </Link>
    </Button>
  )
}

export { SidebarItem }