import { FC } from "react";
import { Button } from "./ui/button";
import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean,
  isPeneding: boolean,
  handleEdit: () => void,
  handleThread: () => void,
  handleDelete: () => void,
  handleReaction: (value: string) => void,
  hideThreadButton?: boolean,
}

const Toolbar: FC<ToolbarProps> = (props) => {
  const { isAuthor, isPeneding, handleEdit, handleDelete, handleThread, handleReaction, hideThreadButton } = props;

  return (
    <div
      className="absolute top-0 right-5"
    >
      <div
        className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm"
      >
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji)}
        >
          <Button
            variant="ghost"
            size="iconSm"
            disabled={isPeneding}
          >
            <Smile
              className="size-4"
            />
          </Button>
        </EmojiPopover>
        {
          !hideThreadButton && (
            <Hint
              label="Reply in thread"
            >
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPeneding}
                onClick={handleThread}
              >
                <MessageSquareTextIcon
                  className="size-4"
                />
              </Button>
            </Hint>
          )
        }
        {
          isAuthor && (
            <Hint
              label="Edit message"
            >
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPeneding}
                onClick={handleEdit}
              >
                <Pencil
                  className="size-4"
                />
              </Button>
            </Hint>
          )
        }
        {
          isAuthor && (
            <Hint
              label="Delete message"
            >
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPeneding}
                onClick={handleDelete}
              >
                <Trash
                  className="size-4"
                />
              </Button>
            </Hint>
          )
        }
      </div>
    </div>
  )
}

export { Toolbar }