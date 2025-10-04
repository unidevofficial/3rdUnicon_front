"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navigationItems = [
  { name: "UNICON", href: "/" },
  { name: "행사 개요", href: "/event" },
  { name: "전시회", href: "/exhibition" },
  { name: "참가 작품", href: "/participants" },
  { name: "UNIDEV 소개", href: "/about" },
  { name: "문의", href: "/inquiry" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getNavStyles = () => {
    // 모바일: 항상 배경 표시
    const mobileStyles = "bg-fantasy-deep/80 backdrop-blur-md"

    // 데스크톱: 스크롤 상태에 따라 조건부 배경
    const desktopStyles = isScrolled
      ? "md:bg-fantasy-deep/80 md:backdrop-blur-md"
      : "md:bg-transparent md:backdrop-blur-none md:hover:bg-fantasy-deep/80 md:hover:backdrop-blur-md"

    return `${mobileStyles} ${desktopStyles}`
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 no-pretendard ${getNavStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 ">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image src="/logo-white.svg" alt="UNICON" width={36} height={36} priority />
            <span className="font-bold text-2xl transition-all duration-300 text-white hover:text-fantasy-mystic">
              UNIDEV
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 pretendard-bold">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium transition-all duration-300 text-white hover:text-fantasy-mystic"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="transition-all duration-300 text-white hover:text-fantasy-mystic"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-transparent rounded-lg mt-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 font-medium transition-all duration-300 text-white hover:text-fantasy-mystic"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
