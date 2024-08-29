"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"
import { FC, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { Router } from "@/enums/router";
import { toast } from "sonner"

const CreateWorkspaceModal: FC = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState<string>("");

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutate(
        { name },
        {
          onSuccess(id) {
            toast.success("Workspace created")
            router.push(`${Router.Workspaces}/${id}`);
            handleClose();
          },
          onError(error) {

          }
        }
      )
    } catch (error) {

    }
  }
  
  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent
        aria-describedby="workspace"
      >
        <DialogHeader>
          <DialogTitle>
            Add a workspace
          </DialogTitle>
          <DialogDescription>

          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            name="name"
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
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

export { CreateWorkspaceModal }