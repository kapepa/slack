import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { FC } from "react";
import { format, isToday, isYesterday } from "date-fns";

interface MesssageListProps {
  data: GetMessagesReturnType | undefined,
  memberImage?: string,
  memberName?: string,
  channelName?: string,
  channeCreationTime?: number,
  variant?: "channel" | "thread" | "conversation",
  loadMore: () => void,
  isLoadingMore: boolean,
  canLoadMore: boolean,
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

const MesssageList: FC<MesssageListProps> = (props) => {
  const { data, loadMore, channelName, isLoadingMore, canLoadMore, channeCreationTime, variant = "channel", memberName, memberImage } = props;
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const data = new Date(message._creationTime);
      const dateKey = format(data, "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].unshift(message)
      return groups;
    },
    {} as Record<string, typeof data>
  )

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-auto messages-scrollbar">
      {
        Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div
            key={dateKey}
          >
            <div
              className="text-center my-2 relative"
            >
              <hr
                className="absolute top-1/2 left-0 right-0 border-t border-gray-300"
              />
              <span
                className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
              >
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => (
              <div
                key={`${message._id}-${index}`}
              >
                {JSON.stringify(message)}
              </div>
            ))}
          </div>
        ))
      }
    </div>
  )
}

export { MesssageList }