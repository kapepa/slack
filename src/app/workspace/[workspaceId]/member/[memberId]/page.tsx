"use client"

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberlId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./components/conversation";

const MemberIdPage: NextPage = () => {
  const membersId = useMemberlId();
  const workspacesId = useWorkspaceId();
  const { data, mutate, isPending } = useCreateOrGetConversation();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    mutate({
        membersId,
        workspacesId,
      },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to create or get conversation");
        }
      }
    );
  }, [membersId, workspacesId, mutate]);

  if (isPending) {
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

  if (!conversationId) {
    return (
      <div
       className="h-full flex flex-col gap-y-2 items-center justify-center"
      >
        <AlertTriangle
          className="size-6 text-muted-foreground"
        />
        <span
          className="text-sm text-muted-foreground"
        >
          Conversation not found
        </span>
      </div>
    )
  }

  return (
    <Conversation
      id={conversationId}
    />
  )
}

export default MemberIdPage;