import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string,
  image?: string,
}

const ConversationHero: FC<ConversationHeroProps> = (props) => {
  const { name = "Member", image } = props;
  const avatarFallback = name.charAt(0).toLocaleUpperCase();

  return (
    <div
      className="mt-[88px] mx-5 mb-4"
    >
      <div
        className="flex items-center gap-x-1 mb-2"
      >
        <Avatar
          className="size-14 mr-2"
        >
          <AvatarImage
            src={image}
          />
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <p
        className="text-2xl font-bold flex"
      >
        # {name}
      </p>
      <p
        className="font-normal text-slate-500 mb-4"
      >
        This conversation is just betweem you and <strong>{name}</strong>
      </p>
    </div>
  )
}

export { ConversationHero }