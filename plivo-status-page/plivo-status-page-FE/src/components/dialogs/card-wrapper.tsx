import * as React from "react"

import { cn } from "@/lib/utils"

function CardWrapper({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-[800px] min-w-[350px]",
        className
      )}
      {...props}
    />
  )
}

export { CardWrapper }
