"use client"

import { FC, useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/components/editor").then(m => m.Editor), { ssr: false });

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">,
  onClose: () => void,
}

interface HandleSubmitProps {
  body: string,
  image: File | null,
}

interface CreateMessageValues {
  body: string,
  image: Id<"_storage"> | undefined,
  channelsId: Id<"channels">,
  workspacesId: Id<"workspaces">,
  parentMessageId: Id<"messages">,
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

const Thread: FC<ThreadProps> = (props) => {
  const { onClose, messageId } = props;
  const channelsId = useChannelId();
  const workspacesId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
  const { data: currentMember, isLoading: loadingMember } = useCurrentMember({ workspaceId: workspacesId });
  const { results, status, loadMore } = useGetMessages({ channelsId, parentMessageId: messageId });

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handleSubmit = async ({body, image}: HandleSubmitProps) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        image: undefined,
        channelsId,
        workspacesId,
        parentMessageId: messageId,
      }

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, {throwError: true});
  
      setEditorKey(prev => prev + 1);
    } catch (error){
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  }

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const data = new Date(message._creationTime);
      const dateKey = format(data, "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].unshift(message)
      return groups;
    },
    {} as Record<string, typeof results>
  )

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div
        className="h-full flex flex-col"
      >
        <div
          className="h-[49px] flex justify-between items-center px-4 border-b"
        >
          <p
            className="text-lg font-bold"
          >
            Thread
          </p>
          <Button
            size="iconSm"
            onClick={onClose}
            variant="ghost"
          >
            <XIcon
              className="size-5 stroke-[1.5]"
            />
          </Button>
        </div>
        <div
          className="flex flex-col gap-y-2 h-full items-center justify-center"
        >
          <Loader
            className="size-5 animate-spin text-muted-foreground"
          />
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div
        className="h-full flex flex-col"
      >
        <div
          className="h-[49px] flex justify-between items-center px-4 border-b"
        >
          <p
            className="text-lg font-bold"
          >
            Thread
          </p>
          <Button
            size="iconSm"
            onClick={onClose}
            variant="ghost"
          >
            <XIcon
              className="size-5 stroke-[1.5]"
            />
          </Button>
        </div>
        <div
          className="flex flex-col gap-y-2 h-full items-center justify-center"
        >
          <AlertTriangle
            className="size-5 animate-spin text-muted-foreground"
          />
          <p
            className="text-sm text-muted-foreground"
          >
            Message not found
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-full flex flex-col"
    >
      <div
        className="h-[49px] flex justify-between items-center px-4 border-b"
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
      <div
        className="flex-1 flex flex-col-reverse pb-4 overflow-auto messages-scrollbar"
      >
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
              {messages.map((message, index) => {
                const prevMessage = messages[ index -1 ];
                const isCompact = prevMessage && prevMessage.user?._id === message.user?._id && differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;

                return (
                  <Message
                    key={`${message._id}-${index}`}
                    id={message._id}
                    memberId={message.memberId}
                    authorImage={message.user.image}
                    authorName={message.user.name}
                    isAuthor={message.memberId === currentMember?._id}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.image}
                    updateAt={message.updatedAt}
                    createAt={message._creationTime}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                    isCompact={isCompact}
                    hideThreadButton
                    threadName={message.threadName}
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadTimestamp={message.threadtimestamp}
                  />
                )
              })}
            </div>
          ))
        }
        <div
          className="h-1"
          ref={
            (el) => {
              if (el) {
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting && canLoadMore) loadMore();
                  },
                  { threshold: 1.0 }
                );

                observer.observe(el);
                return () => observer.disconnect();
              }
            }
          }
        />
        {
          isLoadingMore && (
            <div
              className="text-center my-2 relative"
            >
              <hr
                className="absolute top-1/2 left-0 right-0 border-t border-gray-300"
              />
              <span
                className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
              >
                <Loader
                  className="size-4 animate-spin"
                />
              </span>
            </div>
          )
        }
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createAt={message._creationTime}
          updateAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div
        className="px-4"
      >
        <Editor
          key={editorKey}
          innerRef={editorRef}
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder="Reply..."
        />
      </div>
    </div>
  )
}

export { Thread }