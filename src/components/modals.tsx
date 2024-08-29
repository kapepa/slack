"use client"

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
    </>
  )
}

export { Modals }