import { FC } from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReactions } from "@/features/reactions/api/use-toggle-reactions";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";

const Renderer = dynamic(() => import("./renderer").then((m) => m.Renderer), { ssr: false });
const Editor = dynamic(() => import("./editor").then( m => m.Editor), { ssr: false });

interface MessageProps {
  id: Id<"messages">,
  memberId: Id<"members">,
  authorImage?: string,
  authorName?: string,
  isAuthor: boolean,
  reactions: Array<
    Omit<Doc<"reactions">, "membersId"> & {
      count: number, 
      memberIds: Id<"members">[]
    }
  >,
  body: Doc<"messages">["body"],
  image: string | null | undefined,
  updateAt: Doc<"messages">["updatedAt"],
  createAt: Doc<"messages">["_creationTime"],
  isEditing: boolean,
  isCompact?: boolean,
  setEditingId: (id: Id<"messages"> | null) => void,
  hideThreadButton?: boolean,
  threadCount?: number,
  threadImage?: string,
  threadTimestamp?: number,
}

const formatFullTime = (data: Date) => {
  return `${isToday(data) ? "Today" : isYesterday(data) ? "Yesterday" : format(data, "MMM d, yyyy")} at ${format(data, "h:mm:ss a")}`;
}

const Message: FC<MessageProps> = (props) => {
  const { id, body, image, createAt, isAuthor, updateAt, memberId, isCompact, isEditing, reactions, authorName = "Member", threadImage, threadCount, authorImage, setEditingId, threadTimestamp, hideThreadButton } = props;
  const { mutate: updateMessage, isPending: isUpdateMessage } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemoveMessage } = useRemoveMessage();
  const { mutate: toggleReactions, isPending: isToggleReactions } = useToggleReactions();

  const { parentMessageId, onOpenMessage, onClose } = usePanel();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete message",
    message: "Are you sure you want to delete this message? This cannot be undone.",
  })

  const isPending = isUpdateMessage;

  const handleReactions = (value: string) => {
    toggleReactions(
      { messagesId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction")
        }
      }
    );
  }

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeMessage({ id }, {
      onSuccess: () => {
        toast.success("Message deleted");
        if (parentMessageId === id) onClose();
      },
      onError: () => {
        toast.error("Failed to delete message")
      }
    })
  }

  const handleUpdate = ({body}: {body: string}) => {
    updateMessage({id, body}, {
      onSuccess: () => {
        toast.success("Message update");
        setEditingId(null);
      },
      onError: () => {
        toast.error("Failed to update message")
      }
    })
  }

  if (isCompact) {
    return (
      <>
        <ConfirmDialog/>
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemoveMessage && "bg-rose-500/50 transform transition-all scale-0 origin-bottom duration-200",
          )}
        >
          <div
            className="flex items-start gap-2"
          >
            <Hint
              label={formatFullTime(new Date(createAt))}
            >
              <button
                className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline"
              >
                { format(new Date(createAt), "hh:mm") }
              </button>
            </Hint>
            {
              isEditing ? (
                <div
                  className="w-full h-full"
                >
                  <Editor
                    onSubmit={handleUpdate}
                    disabled={isUpdateMessage}
                    defaultValue={JSON.parse(body)}
                    onCancel={() => setEditingId(null)}
                    variant="update"
                  />
                </div> 
              )
              : (
                <div 
                  className="flex flex-col w-full"
                >
                  <Renderer 
                    value={body} 
                  />
                  <Thumbnail
                    url={image}
                  />
                  {
                    updateAt
                    ? (
                      <span
                        className="text-xs text-muted-foreground"
                      >
                        (edited)
                      </span>
                    )
                    : null
                  }
                  <Reactions
                    data={reactions}
                    onChange={handleReactions}
                  />
                </div>
              )
            }
          </div>
          {
            !isEditing && (
              <Toolbar
                isAuthor={isAuthor}
                isPeneding={isPending}
                handleEdit={() => setEditingId(id)}
                handleThread={() => onOpenMessage(id)}
                handleDelete={handleDelete}
                handleReaction={handleReactions}
                hideThreadButton={hideThreadButton}
              />
            )
          }
        </div>
      </>
    )
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog/>
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemoveMessage && "bg-rose-500/50 transform transition-all scale-0 origin-bottom duration-200",
        )}
      >
        <div
          className="flex items-start gap-2"
        >
          <button>
            <Avatar>
              <AvatarImage
                src={authorImage}
                className="bg-slate-500 text-white text-sm"
              />
              <AvatarFallback>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {
            isEditing 
            ? (
              <div
                className="w-full h-full"
              >
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isUpdateMessage}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div> 
            )
            : (
              <div
                className="flex flex-col w-full overflow-hidden"
              >
                <div
                  className="text-sm"
                >
                  <button
                    onClick={() => {}}
                    className="font-bold text-primary hover:underline"
                  >
                    {authorName}
                  </button>
                  <span>&nbsp;&nbsp;</span>
                  <Hint
                    label={formatFullTime(new Date(createAt))}
                  >
                    <button
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      {format(new Date(createAt), "h:mm a")}
                    </button>
                  </Hint>

                </div>
                <Renderer 
                  value={body} 
                />
                <Thumbnail
                  url={image}
                />
                {
                  updateAt 
                  ? (
                    <span
                      className="text-xs text-muted-foreground"
                    >
                      (edited)
                    </span>
                  )
                  : null
                }
                <Reactions
                  data={reactions}
                  onChange={handleReactions}
                />
              </div>
            )
          }
        </div>
          {
            !isEditing && (
              <Toolbar
                isAuthor={isAuthor}
                isPeneding={isPending}
                handleEdit={() => setEditingId(id)}
                handleThread={() => onOpenMessage(id)}
                handleDelete={handleDelete}
                handleReaction={handleReactions}
                hideThreadButton={hideThreadButton}
              />
            )
          }
      </div>
    </>
  )
}

export { Message }