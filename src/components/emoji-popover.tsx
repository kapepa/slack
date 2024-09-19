"use client"

import { FC, ReactNode, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface EmojiPopoverProps {
  children: ReactNode,
  hint?: string,
  onEmojiSelect(value: string): void,
}

const EmojiPopover: FC<EmojiPopoverProps> = (props) => {
  const { children, hint = "Emoji", onEmojiSelect } = props;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const onSelect = (value: EmojiClickData) => {
    onEmojiSelect(value.emoji);
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
          <EmojiPicker
            onEmojiClick={onSelect}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}

export { EmojiPopover }