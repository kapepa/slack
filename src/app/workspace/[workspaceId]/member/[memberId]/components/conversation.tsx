import { FC } from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useMemberlId } from "@/hooks/use-member-id";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";


interface ConversationProps {
  id: Id<"conversations">,
}

const Conversation: FC<ConversationProps> = (props) => {
  const { id } = props;
  const memberlId = useMemberlId();
  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberlId });

  const { status, results, loadMore } = useGetMessages({ conversationsId: id });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div
       className="h-full flex items-center justify-center"
      >
        <Loader
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-full"
    >
      <Header
        onClick={() => {}}
        memberName={member?.user.name}
        memberIamge={member?.user.image}
      />
      <ChatInput
        conversationsId={id}
        placeholder={`Message ${member?.user.name}`}
      />
    </div>
  )
}

export { Conversation }