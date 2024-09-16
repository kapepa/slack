import { FC } from "react";

interface ThreadBarProps {
  count?: number,
  image?: string,
  timestamp?: number,
}

const ThreadBar: FC<ThreadBarProps> = (props) => {
  const { count, image, timestamp } = props;

  return (
    <div>
      ThreadBar
    </div>
  )
}

export { ThreadBar }