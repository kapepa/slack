"use client"

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { NextPage } from "next";
import { Header } from "./components/header";
import { ChatInput } from "./components/chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MesssageList } from "@/components/messsage-list";

const ChannelIdPage: NextPage = () => {
  const channelsId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelsId });
  const { data: channe, isLoading: channeLoading } = useGetChannel({ id: channelsId });

  if (channeLoading || status === "LoadingFirstPage") {
    return (
      <div
         className="h-full flex-1 flex items-center justify-center gap-2"
      >
        <Loader
          className="size-5 animate-spin text-muted-foreground"
        />
      </div>
    )
  }

  if (!channe) {
    return (
      <div
         className="h-full flex-1 flex items-center justify-center flex-col gap-y-2"
      >
        <TriangleAlert
          className="size-6 text-muted-foreground"
        />
        <span
          className="text-sm text-muted-foreground"
        >
          Channel not found
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-full"
    >
      <Header
        title={channe.name}
      />
      <MesssageList
        channelName={channe.name}
        channeCreationTime={channe._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message # ${channe.name}`}
      />
    </div>
  )
}

export default ChannelIdPage;