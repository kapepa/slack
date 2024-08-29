import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FC } from "react";

const Toolbar: FC = () => {
  return (
    <nav
      className="bg-[#481349] items-center justify-between h-10 p-1.5"
    >
      <div
        className="flex-1"
      />
      <div
        className="min-w-[280px] max-[642px] grow-[2] shrink"
      >
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
        >
          <Search
            className="size-4 text-white mr-2"
          />
          <span
            className="text-white text-xs"
          >
            Search workspace
          </span>
        </Button>
      </div>
    </nav>
  )
}

export { Toolbar }