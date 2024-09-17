import { FC } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface ProfileProps {
  onClose: () => void,
  memberId: Id<"members">,
}

const Profile: FC<ProfileProps> = (props) => {
  const { onClose, memberId } = props;
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId });
  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({ workspaceId });

  const { mutate: updateMember, isPending: isUpdateMember } = useUpdateMember();
  const { mutate: removeMember, isPending: isRemoveMember } = useRemoveMember();

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div
        className="h-full flex flex-col"
      >
        <div
          className="h-[49px] flex justify-between items-center px-4 border-b"
        >
          <p
            className="text-lg font-bold"
          >
            Thread
          </p>
          <Button
            size="iconSm"
            onClick={onClose}
            variant="ghost"
          >
            <XIcon
              className="size-5 stroke-[1.5]"
            />
          </Button>
        </div>
        <div
          className="flex flex-col gap-y-2 h-full items-center justify-center"
        >
          <Loader
            className="size-5 animate-spin text-muted-foreground"
          />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div
        className="h-full flex flex-col"
      >
        <div
          className="h-[49px] flex justify-between items-center px-4 border-b"
        >
          <p
            className="text-lg font-bold"
          >
            Profile
          </p>
          <Button
            size="iconSm"
            onClick={onClose}
            variant="ghost"
          >
            <XIcon
              className="size-5 stroke-[1.5]"
            />
          </Button>
        </div>
        <div
          className="flex flex-col gap-y-2 h-full items-center justify-center"
        >
          <AlertTriangle
            className="size-5 animate-spin text-muted-foreground"
          />
          <p
            className="text-sm text-muted-foreground"
          >
            Profile not found
          </p>
        </div>
      </div>
    )
  };

  const avatarFallback = member.user.name?.[0] ?? "M";

  return (
    <div
      className="h-full flex flex-col"
    >
      <div
        className="h-[49px] flex justify-between items-center px-4 border-b"
      >
        <p
          className="text-lg font-bold"
        >
          Thread
        </p>
        <Button
          size="iconSm"
          onClick={onClose}
          variant="ghost"
        >
          <XIcon
            className="size-5 stroke-[1.5]"
          />
        </Button>
      </div>
      <div
        className="flex flex-col items-center justify-center p-4"
      >
        <Avatar 
          className="max-w-[256px] max-h-[256px] size-full"
        >
          <AvatarImage
            src={member.user.image}
          />
          <AvatarFallback
            className="aspect-square text-6xl"
          >
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div
        className="flex flex-col p-4"
      >
        <p
          className="text-xl font-bold"
        >
          {member.user.name}
        </p>
        {
          currentMember?.role === "admin" && currentMember._id === memberId 
          ? (
            <Button
              variant="outline"
              className="w-full capitalize"
            >
              {member.role} <ChevronDownIcon className="size-4 ml-2"/>
            </Button>
          )
          : null
        }
      </div>
      <Separator/>
      <div
        className="flex flex-col p-4"
      >
        <p
          className="text-sm font-bold mb-4"
        >
          Contacy information
        </p>
        <div
          className="flex items-center gap-2"
        >
          <div
            className="size-9 rounded-md bg-muted flex items-center justify-center"
          >
            <MailIcon
              className="size-4"
            />
          </div>
          <div
            className="flex flex-col"
          >
            <p
              className="text-[13px] font-semibold text-muted-foreground"
            >
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Profile }