"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

type Params = { params: { id: string } }


type ApiDetail = {
  id: string
  title: string
  description?: string | null
  team_type?: "challenger" | "rookie" | null
  team_name?: string | null
  genres?: string[] | null
  platform?: "pc" | "mobile" | null
  video_url?: string | null
  banner_image?: string | null
  gallery_images?: string[] | null
  download_url?: string | null
  created_at: string
}

function teamTypeLabel(v?: string | null) {
  if (v === "challenger") return "챌린저"
  if (v === "rookie") return "루키"
  return "-"
}

function parseYouTubeEmbed(url?: string | null): string | "" {
  try {
    if (!url) return ""
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "")
    let id = ""
    if (host === "youtu.be") id = u.pathname.split("/").filter(Boolean)[0] || ""
    else if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/watch")) id = u.searchParams.get("v") || ""
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2] || ""
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2] || ""
    }
    return id ? `https://www.youtube.com/embed/${id}` : ""
  } catch { return "" }
}

export default function ParticipantDetailPage({ params }: Params) {
  const id = params.id
  const [data, setData] = useState<ApiDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/project/${id}`, { cache: "no-store" })
        if (!res.ok) {
          setLoading(false)
          return
        }
        const result = (await res.json()) as ApiDetail
        if (result?.id) {
          setData(result)
        }
      } catch (error) {
        console.error("Failed to fetch project data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  if (loading) {
    return (
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (!data?.id) {
    return notFound()
  }

  const embedUrl = parseYouTubeEmbed(data.video_url)
  const genres = Array.isArray(data.genres) ? data.genres : []
  const gallery = Array.isArray(data.gallery_images) ? data.gallery_images : []

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero with banner */}
      <section className="relative -mt-16 md:-mt-24 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="relative w-full aspect-[3/1]">
          {data.banner_image ? (
            <Image src={data.banner_image} alt={data.title} fill className="object-cover object-center opacity-70" />
          ) : (
            <div className="absolute inset-0 border border-dashed border-white/20 grid place-items-center text-brand-highlight/90 text-sm">
              배너 이미지 첨부 예정
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B1038]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-10 md:pt-16">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-point drop-shadow">{data.title}</h1>
          <div className="mt-8 md:mt-10 inline-flex items-center gap-2 text-xs md:text-sm text-white/90">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">{teamTypeLabel(data.team_type)}</span>
            {genres.length > 0 ? (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">장르: {genres.join(", ")}</span>
            ) : null}
            {data.platform ? (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">플랫폼: {data.platform}</span>
            ) : null}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description */}
        <Card className="md:col-span-2 bg-brand-main/40 border-brand-sub/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">프로젝트 소개</h2>
            <p className="text-brand-highlight text-sm leading-relaxed">{data.description || ""}</p>
            {embedUrl && (
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black/50">
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick facts */}
        <Card className="bg-brand-main/40 border-brand-sub/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3 text-sm">
            <div className="flex items-center justify-between text-white/90">
              <span>팀 이름</span>
              <span className="text-brand-highlight">{data.team_name || "-"}</span>
            </div>
            <div className="flex items-center justify-between text-white/90">
              <span>참가팀 종류</span>
              <span className="text-brand-highlight">{teamTypeLabel(data.team_type)}</span>
            </div>
            {genres.length > 0 ? (
              <div className="flex items-center justify-between text-white/90">
                <span>장르</span>
                <span className="text-brand-highlight">{genres.join(", ")}</span>
              </div>
            ) : null}
            {data.platform ? (
              <div className="flex items-center justify-between text-white/90">
                <span>플랫폼</span>
                <span className="text-brand-highlight">{data.platform}</span>
              </div>
            ) : null}
            {data.video_url && (
              <div className="pt-2">
                <Button asChild className="w-full bg-brand-sub hover:bg-brand-sub/80 text-white">
                  <a href={data.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    영상 링크 열기 <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                {data.download_url && (
                  <Button asChild className="w-full bg-brand-sub hover:bg-brand-sub/80 text-white mt-5">
                    <a href={data.download_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      다운로드 링크 <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h3 className="text-xl font-semibold text-white mb-4">갤러리</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.length === 0 ? (
            <div className="text-brand-highlight/80 text-sm">이미지가 없습니다.</div>
          ) : (
            gallery.map((src) => (
              <div 
                key={src} 
                className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40 cursor-pointer hover:border-brand-highlight/50 transition-colors"
                onClick={() => setSelectedImage(src)}
              >
                <Image src={src} alt="갤러리" fill className="object-cover" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-brand-highlight transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <Image 
              src={selectedImage} 
              alt="갤러리 확대" 
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
