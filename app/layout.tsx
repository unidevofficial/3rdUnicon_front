import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "UNICON 제3회 - 대학생 개발 전시회",
  description: "UNIDEV가 주최하는 연례 개발 전시회 및 컨퍼런스",
  generator: "v0.app",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="font-sans">
        <Suspense fallback={null}>
          <Navigation />

          <main className="pt-16 min-h-screen relative z-10">{children}</main>

          <div className="relative z-10">
            <Footer />
          </div>
        </Suspense>

        <Analytics />
      </body>
    </html>
  )
}
