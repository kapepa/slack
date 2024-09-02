import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Router } from "@/enums/router";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
  ["flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden"],
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

interface UserItemProps {
  id: Id<"members">,
  label?: string,
  image?: string,
  variant?: VariantProps<typeof userItemVariants>["variant"],
}

const UserItem: FC<UserItemProps> = (props) => {
  const { id, label, image, variant } = props;
  const workspaceId = useWorkspaceId();
  const avatarFallback = label?.charAt(0).toLocaleUpperCase();

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant: variant }))}
      size="sm"
      asChild
    >
      <Link
        href={`${Router.Workspaces}/${workspaceId}${Router.Member}/${id}`}
      >
        <Avatar
          className="size-5 rounded-md mr-1"
        >
          <AvatarImage
            className="rounded-md"
            src={image}
          />
          <AvatarFallback
            className="rounded-md bg-sky-500 text-white text-xs"
          >
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span
          className="text-sm truncate"
        >
          {label}
        </span>
      </Link>
    </Button>
  )
}

export { UserItem };