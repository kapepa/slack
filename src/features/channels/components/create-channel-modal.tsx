"use client"

import { FC, FormEvent, FormHTMLAttributes, useState } from "react";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateChannel } from "../api/use-create-channels";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { Router } from "@/enums/router";
import { toast } from "sonner";

const CreateChannelModal: FC = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState<string>("");

  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name, workspaceId },
      {
        onSuccess(id) {
          toast.success("Channel created");
          router.push(`${Router.Workspaces}/${workspaceId}${Router.Channel}/${id}`);
          handleClose();
        },
        onError () {
          toast.error("Failed to create a channel");
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a Channel
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            value={name}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            disabled={isPending}
            placeholder="e.g. plan-budget"
            type="text"
            name="plan"
          />
          <div
            className="flex justify-end"
          >
            <Button
              disabled={isPending}
              type="submit"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateChannelModal }