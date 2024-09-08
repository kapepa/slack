"use client"

import { FC, ReactNode, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojiPopoverProps {
  children: ReactNode,
  hint?: string,
  onEmojiSelect(emoji: any): void,
}

const EmojiPopover: FC<EmojiPopoverProps> = (props) => {
  const { children, hint = "Emoji", onEmojiSelect } = props;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);
    
    setTimeout(() => {
      setTooltipOpen(false);
    }, 500)
  }

  return (
    <TooltipProvider>
      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
      >
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger
            asChild
          >
            <TooltipTrigger
              asChild
            >
              {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent
            className="bg-black text-white border border-white/5"
          >
            <p
              className="font-medium text-xs"
            >
              {hint}
            </p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker
            data={data}
            onEmojiSelect={onSelect}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}

export { EmojiPopover }