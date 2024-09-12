/* eslint-disable @next/next/no-img-element */

import { FC } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined,
}

const Thumbnail: FC<ThumbnailProps> = (props) => {
  const { url } = props;

  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in"
        >
          <img
            src={url}
            alt="Mesage image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-[800px] border-none bg-transparent p-0 shadow-none"
      >
        <img
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  )
}

export { Thumbnail };