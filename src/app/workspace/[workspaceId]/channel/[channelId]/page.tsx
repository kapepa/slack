"use client"

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { NextPage } from "next";
import { Header } from "./components/header";
import { ChatInput } from "./components/chat-input";

const ChannelIdPage: NextPage = () => {
  const channelId = useChannelId();
  const { data: channe, isLoading: channeLoading } = useGetChannel({ id: channelId });

  if (channeLoading) {
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
      <div
        className="flex-1"
      />
      <ChatInput
        placeholder={`Message # ${channe.name}`}
      />
    </div>
  )
}

export default ChannelIdPage;