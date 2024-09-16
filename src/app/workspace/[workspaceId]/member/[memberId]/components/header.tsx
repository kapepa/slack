"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React, { FC } from "react";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string,
  memberIamge?: string,
  onClick?: () => void,
}

const Header: FC<HeaderProps> = (props) => {
  const { memberIamge, memberName = "Member", onClick } = props;
  const avatarFallback = memberName?.charAt(0).toUpperCase();

  return (
    <div
      className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden"
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={onClick}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
      >
        <Avatar>
          <AvatarImage
            src={memberIamge}
          />
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span
          className="truncate ml-4"
        >
          {memberName}
        </span>
        <FaChevronDown
          className="size-2.5 ml-2"
        />
      </Button>
    </div>
  )
}

export { Header };