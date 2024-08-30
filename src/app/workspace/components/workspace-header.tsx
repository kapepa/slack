import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { FC } from "react";

const WorkspaceHeader: FC = () => {
  return (
    <div
      className="flex items-center justify-between px-4 h-[49px] gap-0.5"
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
        >
          <Button
            size="sm"
            variant="transparent"
            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
          >
            <span>
              {}
            </span>
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  )
}

export { WorkspaceHeader }