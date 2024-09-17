import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  name?: string,
  count?: number,
  image?: string,
  onClick?: () => void,
  timestamp?: number,
}

const ThreadBar: FC<ThreadBarProps> = (props) => {
  const { name = "Member", count, image, onClick, timestamp } = props;
  const avatarFallback = name.charAt(0).toUpperCase(); 

  if (!count || !timestamp) return null;

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div
        className="flex items-center gap-2 overflow-hidden"
      >
        <Avatar
          className="size-6 shrink-0"
        >
          <AvatarImage
            src={image}
          />
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span
          className="text-xs text-sky-700 hover: underline font-bold truncate"
        >
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span
          className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block"
        >
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span
          className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden"
        >
          View thread
        </span>
      </div>
      <ChevronRight
        className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0"
      />
    </button>
  )
}

export { ThreadBar }