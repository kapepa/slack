"use client"

import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Router } from "@/enums/router";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

const Toolbar: FC = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: members } = useGetMembers({ workspaceId })
  const { data: channels } = useGetChannels({ workspaceId });
  const [open, setOpen] = useState<boolean>(false);

  const onChannelClick = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`${Router.Workspaces}/${workspaceId}${Router.Channel}/${channelId}`)
  }

  const onMembersClick = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`${Router.Workspaces}/${workspaceId}${Router.Member}/${memberId}`)
  }

  return (
    <nav
      className="bg-[#481349] flex items-center justify-between h-10 p-1.5"
    >
      <div
        className="flex-1"
      />
      <div
        className="min-w-[280px] max-[642px] grow-[2] shrink"
      >
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search
            className="size-4 text-white mr-2"
          />
          <span
            className="text-white text-xs"
          >
            Search {data?.name}
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {
                channels?.map((channel) => (
                  <CommandItem
                    key={`${channel._id}`}
                    asChild
                    onClick={() => onChannelClick(channel._id)}
                  >
                    {channel.name}
                  </CommandItem>
                ))
              }
            </CommandGroup>
            <CommandSeparator/>
            <CommandGroup heading="Members">
              {
                members?.map((member) => (
                  <CommandItem
                    key={`${member._id}`}
                    asChild
                    onClick={() => onMembersClick(member._id)}
                  >
                    {member.user.name}
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div
        className="ml-auto flex-1 flex items-center justify-end"
      >
        <Button
          variant="transparent"
          size="iconSm"
        >
          <Info
            className="size-5 text-white"
          />
        </Button>
      </div>
    </nav>
  )
}

export { Toolbar }