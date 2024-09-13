import { useParentMessage } from "@/features/messages/store/use-parent-message"

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessage();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };

  const onClose = () => {
    setParentMessageId(null);
  }

  return {
    onClose,
    onOpenMessage,
    parentMessageId,
  }
}