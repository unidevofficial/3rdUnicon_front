"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type ImageModalProps = {
  src: string
  alt: string
  className?: string
}

export default function ImageModal({ src, alt, className }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={(className ? className + " " : "") + "cursor-zoom-in"}
        onClick={() => setIsOpen(true)}
      />

      {mounted && isOpen
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4 sm:p-6"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative max-w-[1200px] w-full" aria-label={alt}>
                <button
                  type="button"
                  aria-label="닫기"
                  className="absolute top-0 right-0 -mt-2 -mr-2 sm:mt-0 sm:mr-0 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                  </svg>
                </button>

                <div className="max-h-[85vh] overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                  <img src={src} alt={alt} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}


