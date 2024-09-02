"use client"

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { FC, useEffect, useState } from "react"

const Modals: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  },[setMounted])

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal/>
      <CreateChannelModal/>
    </>
  )
}

export { Modals }