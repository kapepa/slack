
import { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type SideType = "top" | "right" | "bottom" | "left";
type AlignType = "start" | "center" | "end";

interface HintProps {
  label: string,
  children: ReactNode,
  side?: SideType,
  align?: AlignType,
}

const Hint: FC<HintProps> = (props) => {
  const { label, children, align, side } = props;

  return (
    <TooltipProvider
      delayDuration={50}
    >
      <Tooltip>
        <TooltipTrigger
          asChild
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-black text-white border border-white/5"
        >
          <p
            className="font-medium text-xs"
          >
            {label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Hint }