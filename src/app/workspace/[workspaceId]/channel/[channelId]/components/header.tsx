"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Router } from "@/enums/router";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channels";
import { useUpdateChannel } from "@/features/channels/api/use-update-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface HeaderProps {
  title: string,
}

const Header: FC<HeaderProps> = (props) => {
  const { title } = props;
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updateChannelPending } = useUpdateChannel();
  const { mutate: removeChannel, isPending: removeChannelPending } = useRemoveChannel();
  const [ ConfirmDialog, confirm ] = useConfirm({
    title: "Delete this channel?",
    message: "You are about to delete this channel. this action is irreversible",
  });

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(true);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setValue(value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess() {
          toast.success("Channel update");
          setEditOpen(false);
        },
        onError() {
          toast.error("Failed to update channel");
        }
      }
    );
  }

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`${Router.Workspaces}/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        }
      }
    )
  }

  return (
    <div
      className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden"
    >
      <ConfirmDialog/>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span
              className="truncate"
            >
              {title}
            </span>
            <FaChevronDown/>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="p-0 bg-gray-50 overflow-hidden"
        >
          <DialogHeader
            className="p-4 border-b bg-white"
          >
            # {title}
          </DialogHeader>
          <div
            className="px-4 pb-4 flex flex-col gap-y-2"
          >
            <Dialog
              open={editOpen}
              onOpenChange={handleEditOpen}
            >
              <DialogTrigger
                asChild
              >
                <div
                  className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <div
                    className="flex items-center justify-between"
                  >
                    <p
                      className="text-sm font-semibold"
                    >
                      Channel name
                    </p>
                    { 
                      member?.role === "admin" 
                      && (
                        <p
                          className="text-sm text-[#1264a3] hover:underline font-semibold"
                        >
                          Edit
                        </p>
                      )
                    }
                  </div>
                  <p
                    className="text-sm"
                  >
                    # {title}
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Rename this channel
                  </DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit}
                >
                  <Input
                    value={value}
                    disabled={updateChannelPending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose>
                      <Button
                        variant="outline"
                        disabled={updateChannelPending}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={updateChannelPending}
                      type="submit"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            { 
              member?.role === "admin" 
              && (
                <Button
                  disabled={removeChannelPending}
                  onClick={handleDelete}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <TrashIcon
                    className="size-4"
                  />
                  <p
                    className="text-sm font-semibold"
                  >
                    Delete channel
                  </p>
                </Button>
              )
            }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { Header };