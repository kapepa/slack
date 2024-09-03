import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, FC, SetStateAction } from "react";

interface InviteModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  name: string,
  joinCode: string,
}

const InviteModal: FC<InviteModalProps> = (props) => {
  const { open, setOpen, name, joinCode } = props;

  return (
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { InviteModal };