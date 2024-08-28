"use client"

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();

  const workspacesId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
      console.log("Redirect to workspace")
    } else {
      console.log("Open createion modal")
    }
  }, [isLoading, workspacesId])

  return (
    <div>
      <UserButton/>
    </div>
  );
}
