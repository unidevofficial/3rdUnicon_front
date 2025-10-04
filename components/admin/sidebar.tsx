"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, FolderOpen, type LucideIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: "문의 관리", href: "/admin/inquiry", icon: MessageSquare },
  { label: "출품작 관리", href: "/admin/project", icon: FolderOpen },
]

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(href + "/")
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function onLogout() {
    try {
      localStorage.removeItem("admin_token")
    } catch {}
    router.replace("/admin/login")
  }

  function onGoHome() {
    router.push("/")
  }

  return (
    <aside className="h-dvh w-60 shrink-0 bg-brand-main px-3 py-4 text-white flex flex-col">
      <div className="mb-6 px-2 flex items-center justify-center">
        <Link href="/admin" className="inline-flex items-center justify-center">
          <Image src="/logo-white.svg" alt="UNIDEV" width={40} height={40} priority />
        </Link>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
                (active
                  ? "bg-white/20 text-white font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-4">
        <button
          onClick={onGoHome}
          className="w-full rounded-md border border-white/30 px-3 py-2 text-sm text-white/90 hover:bg-white/10 mb-2"
        >
          홈페이지로 이동
        </button>
        <button
          onClick={onLogout}
          className="w-full rounded-md border border-white/30 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
        >
          로그아웃
        </button>
      </div>
    </aside>
  )
}
