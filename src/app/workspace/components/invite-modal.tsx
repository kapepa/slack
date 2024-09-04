import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Router } from "@/enums/router";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  name: string,
  joinCode: string,
}

const InviteModal: FC<InviteModalProps> = (props) => {
  const { open, setOpen, name, joinCode } = props;
  const workspacesId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure",
    message: "This will deactivate the current invite code and generate a new one.",
  })

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({workspacesId}, {
      onSuccess: () => {
        toast.success("Invite code regenerated");
      },
      onError: () => {
        toast.error("Failed to regenerate invite code");
      }
    })
  }

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}${Router.Join}/${workspacesId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  }

  return (
    <>
      <ConfirmDialog/>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite people to {name}
            </DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div
            className="flex flex-col gap-4 items-center justify-center py-10"
          >
            <p
              className="text-4xl font-bold tracking-widest uppercase"
            >
              {joinCode}
            </p>
            <Button
              disabled={isPending}
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              Copy link
              <CopyIcon
                className="size-4 ml-2"
              />
            </Button>
          </div>
          <div
            className="flex items-center justify-between w-full"
          >
            <Button
              disabled={isPending}
              onClick={handleNewCode}
            >
              New code
              <RefreshCcw
                className="size-4 ml-2"
              />
            </Button>
            <DialogClose
              asChild
            >
              <Button
                disabled={isPending}
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { InviteModal };