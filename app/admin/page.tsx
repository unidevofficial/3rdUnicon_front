"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import Image from "next/image"

export default function AdminIndexPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
        if (!token) {
          router.replace("/admin/login")
          return
        }
        const res = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        if (!res.ok) {
          router.replace("/admin/login")
          return
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  if (checking) {
    return (
      <div className="flex min-h-dvh">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center rounded-full ring-2 ring-brand-main/30 p-4">
              <Image src="/logo.svg" alt="UNIDEV Logo" width={240} height={240} priority />
            </div>
            <hr className="mx-auto my-2 w-40 border-brand-main/30 mt-10 mb-10 " />
            <p className="text-brand-main font-bold text-5xl">관리자 확인중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center rounded-full ring-2 ring-brand-main/30 p-4">
            <Image src="/logo.svg" alt="UNIDEV Logo" width={240} height={240} priority />
          </div>
          <hr className="mx-auto my-2 w-40 border-brand-main/30 mt-10 mb-10 " />
          <p className="text-brand-main text-5xl font-bold">UNIDEV ADMIN</p>
        </div>
      </div>
    </div>
  )
}
