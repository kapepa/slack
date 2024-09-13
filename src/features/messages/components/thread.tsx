import { FC } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface ThreadProps {
  messageId: Id<"messages">,
  onClose: () => void,
}

const Thread: FC<ThreadProps> = (props) => {
  const { onClose, messageId } = props;

  return (
    <div
      className="h-full flex flex-col"
    >
      <div
        className="flex justify-between items-center p-4 border-b"
      >
        <p
          className="text-lg font-bold"
        >
          Thread
        </p>
        <Button
          onClick={onClose}
          size="iconSm"
          variant="ghost"
        >
          <XIcon
            className="size-5 stroke-[1.5]"
          />
        </Button>
      </div>
    </div>
  )
}

export { Thread }