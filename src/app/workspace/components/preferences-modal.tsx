"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Router } from "@/enums/router";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  initialValue: string,
}

const PreferencesModal: FC<PreferencesModalProps> = (props) => {
  const { open, setOpen, initialValue } = props;
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState<string>(initialValue);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const { mutate: updateWorkspace, isPending: isUpdateWorkspace } = useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemoveWorkspace } = useRemoveWorkspace();

  const handleRemove = () => {
    removeWorkspace(
      { 
        id: workspaceId,
      },{
        onSuccess() {
          toast.success("Workspace remove");
          router.replace(Router.Home);
        },
        onError() {
          toast.error("Failed to remove workspace");
        }
      }
    )    
  }

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { 
        id: workspaceId,
        name: value 
      },{
        onSuccess() {
          toast.success("Workspace update");
          setEditOpen(false);
        },
        onError() {
          toast.error("Failed to update workspace");
        }
      }
    )    
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        className="p-0 bg-gray-50 overflow-hidden"
      >
        <DialogHeader
          className="p-4 border-b bg-white"
        >
          <DialogTitle>
            {value}
          </DialogTitle>
        </DialogHeader>
        <div
          className="px-4 pb-4 flex flex-col gap-y-2"
        >
          <Dialog
            open={editOpen}
            onOpenChange={setEditOpen}
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
                    Workspace name
                  </p>
                  <p
                    className="text-sm text-[#1264a3] hover:underline font-semibold"
                  >
                    Edit
                  </p>
                </div>
                <p
                  className="text-sm"
                >
                  {value}
                </p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Rename this workspace
                </DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={handleEdit}
              >
                <Input
                  type="text"
                  name="name"
                  value={value}
                  disabled={isUpdateWorkspace}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                />
                <DialogFooter>
                  <DialogClose
                    asChild
                  >
                    <Button
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isUpdateWorkspace}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            disabled={isRemoveWorkspace}
            onClick={handleRemove}
            className="flex items-center gap-x-2 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
          >
            <TrashIcon
              className="size-4"
            />
            <p
              className="text-sm font-semibold"
            >
              Delete workspace
            </p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { PreferencesModal }