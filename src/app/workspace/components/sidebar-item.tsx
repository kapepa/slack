import { Button } from "@/components/ui/button";
import { Router } from "@/enums/router";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebaritemVariants = cva(
  ["flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden"],
  {
    variants: {
      variant: {
        default: "text-[#9edffc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface SidebarItemProps {
  id: string,
  icon: LucideIcon | IconType,
  label: string,
  variant?: VariantProps<typeof sidebaritemVariants>["variant"],
}

const SidebarItem: FC<SidebarItemProps> = (props) => {
  const { id, icon: Icon, label, variant } = props;
  const workspaceId = useWorkspaceId();

  return (
    <Button
      size="sm"
      variant="transparent"
      asChild
      className={cn(sidebaritemVariants({ variant }))}
    >
      <Link
        href={`${Router.Workspaces}/${workspaceId}${Router.Channel}/${id}`}
      >
        <Icon
          className="size-3.5 mr-1 shrink-0"
        />
        <span
          className="text-sm truncate"
        >
          {label}
        </span>
      </Link>
    </Button>
  )
}

export { SidebarItem }