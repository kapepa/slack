import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useParentMessage } from "@/features/messages/store/use-parent-message"

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessage();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  }

  return {
    onClose,
    onOpenMessage,
    onOpenProfile,
    parentMessageId,
    profileMemberId,
  }
}