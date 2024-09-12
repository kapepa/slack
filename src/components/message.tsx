import { FC } from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";

const Renderer = dynamic(() => import("./renderer").then((m) => m.Renderer), { ssr: false });

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

  if (isCompact) {
    return (
      <div
        className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative"
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
          </div>
        </div>
        {
          !isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPeneding={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={() => {}}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )
        }
      </div>
    )
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div
      className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative"
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
        </div>
      </div>
        {
          !isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPeneding={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={() => {}}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )
        }
    </div>
  )
}

export { Message }