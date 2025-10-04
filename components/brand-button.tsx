import type * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BrandButtonProps = React.ComponentProps<typeof Button> & {
  tone?: "primary" | "outline"
}

export function BrandButton({ tone = "primary", className, size = "lg", asChild, ...props }: BrandButtonProps) {
  const toneClass =
    tone === "outline"
      ? cn(
          "text-brand-highlight bg-transparent hover:bg-transparent transition-all duration-300 border-0 ring-0 relative overflow-hidden py-10 rounded-none",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent",
          "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        )
      : cn(
          "text-white bg-transparent hover:bg-transparent transition-all duration-300 border-0 ring-0 relative overflow-hidden py-10 rounded-none",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent",
          "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        )

  return <Button asChild={asChild} size={size} className={cn(toneClass, className)} {...props} />
}
