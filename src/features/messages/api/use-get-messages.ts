import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
  channelsId?: Id<"channels">,
  parentMessageId?: Id<"messages">,
  conversationsId?: Id<"conversations">,
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = (props: UseGetMessagesProps) => {
  const { channelsId, conversationsId, parentMessageId } = props;
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelsId, conversationsId, parentMessageId },
    { initialNumItems: BATCH_SIZE },
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  }
}