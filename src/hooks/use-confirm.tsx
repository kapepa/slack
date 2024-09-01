"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface UseConfirmProps {
  title: string,
  message: string,
}

type UseConfirmReturn = [
  () => JSX.Element, () => Promise<unknown>,
]

interface PromiseState {
  resolve: (value: boolean) => void,
}

export const useConfirm = (props: UseConfirmProps): UseConfirmReturn => {
  const { title, message } = props;
  const [promise, setPromise] = useState<PromiseState | null>(null);

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve })
  })

  const handleClose = () => {
    setPromise(null)
  }

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  }

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  }

  const ConfirmDialog = () => (
    <Dialog
      open={promise !== null}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter
          className="pt-2"
        >
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm]
}