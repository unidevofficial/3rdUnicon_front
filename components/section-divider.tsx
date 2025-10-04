import { cn } from "@/lib/utils"

type SectionDividerProps = {
  className?: string
  imgClassName?: string
  alt?: string
}

export function SectionDivider({ className, imgClassName, alt = "" }: SectionDividerProps) {
  return (
    <div className={cn("mt-1 mb-6", className)}>
      <img
        src="/new-divider.png"
        alt={alt}
        aria-hidden={alt === ""}
        className={cn(
          "mx-auto w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80  opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]",
          imgClassName,
        )}
      />
    </div>
  )
}


export function SectionDivider2({ className, imgClassName, alt = "" }: SectionDividerProps) {
  return (
    <div className={cn("mt-1 mb-6", className)}>
      <img src="/frame.png" alt={alt} aria-hidden={alt === ""} className={cn(
          "mx-auto",
          imgClassName,
        )} />
    </div>
  )
}
