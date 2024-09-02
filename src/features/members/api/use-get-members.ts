import { useQuery } from "convex/react"
import { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"

interface useCurrentMemberProps {
  workspaceId: Id<"workspaces">,
}

export const useGetMembers = ({ workspaceId }: useCurrentMemberProps) => {
  const data = useQuery(api.members.get, { workspacesId: workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
}