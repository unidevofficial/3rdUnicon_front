"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

type UpdateBody = {
  title?: string
  description?: string | null
  team_type?: string
  team_name?: string | null
  genres?: string[] | null
  platform?: string | null
  video_url?: string | null
  banner_image?: string | null
  gallery_images?: string[] | null
  download_url?: string | null
}

type ProjectDetail = {
  id: string
  title: string
  description?: string | null
  team_type?: string | null
  team_name?: string | null
  genres?: string[] | null
  genre_ids?: string[] | null
  platform?: string | null
  video_url?: string | null
  banner_image?: string | null
  gallery_images?: string[] | null
  download_url?: string | null
  created_at: string
}

const DEFAULT_GENRES = ["RPG", "FPS", "퍼즐", "시뮬", "기타"] as const
const PLATFORMS = ["pc", "mobile"] as const
const TEAM_TYPES = ["challenger", "rookie"] as const

export default function AdminProjectDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [checking, setChecking] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<ProjectDetail | null>(null)

  const [title, setTitle] = useState("")
  const [teamName, setTeamName] = useState("")
  const [description, setDescription] = useState("")
  const [teamType, setTeamType] = useState<(typeof TEAM_TYPES)[number] | "">("")
  const [genreInput, setGenreInput] = useState("")
  const [genres, setGenres] = useState<string[]>([])
  const [genreSuggest, setGenreSuggest] = useState<{ id: string; name: string }[]>([])
  const [genreLoading, setGenreLoading] = useState(false)
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number] | "">("")
  const [videoUrl, setVideoUrl] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [bannerImage, setBannerImage] = useState("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [editing, setEditing] = useState(false)

  const bannerInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

  const canSave = useMemo(() => {
    return Boolean(title.trim() && teamType)
  }, [title, teamType])

  const embedUrl = useMemo(() => {
    try {
      const raw = videoUrl.trim()
      if (!raw) return ""
      const u = new URL(raw)
      const host = u.hostname.replace(/^www\./, "")
      let ytId = ""
      if (host === "youtu.be") {
        ytId = u.pathname.split("/").filter(Boolean)[0] || ""
      } else if (host.endsWith("youtube.com")) {
        if (u.pathname.startsWith("/watch")) {
          ytId = u.searchParams.get("v") || ""
        } else if (u.pathname.startsWith("/shorts/")) {
          ytId = u.pathname.split("/")[2] || ""
        } else if (u.pathname.startsWith("/embed/")) {
          ytId = u.pathname.split("/")[2] || ""
        }
      }
      if (!ytId) return ""
      return `https://www.youtube.com/embed/${ytId}`
    } catch {
      return ""
    }
  }, [videoUrl])
///

///
////
///////
  const embedUrlView = useMemo(() => {
    try {
      const raw = (project?.video_url || "").trim()
      if (!raw) return ""
      const u = new URL(raw)
      const host = u.hostname.replace(/^www\./, "")
      let ytId = ""
      if (host === "youtu.be") {
        ytId = u.pathname.split("/").filter(Boolean)[0] || ""
      } else if (host.endsWith("youtube.com")) {
        if (u.pathname.startsWith("/watch")) {
          ytId = u.searchParams.get("v") || ""
        } else if (u.pathname.startsWith("/shorts/")) {
          ytId = u.pathname.split("/")[2] || ""
        } else if (u.pathname.startsWith("/embed/")) {
          ytId = u.pathname.split("/")[2] || ""
        }
      }
      if (!ytId) return ""
      return `https://www.youtube.com/embed/${ytId}`
    } catch {
      return ""
    }
  }, [project?.video_url])

  // 관리자 토큰 확인
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
        if (!stored) {
          router.replace("/admin/login")
          return
        }
        const res = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${stored}` },
          cache: "no-store",
        })
        if (!res.ok) {
          router.replace("/admin/login")
          return
        }
        if (!cancelled) setToken(stored)
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  // 상세 조회
  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/project/${id}`, { cache: "no-store" })
        if (!res.ok) {
          const msg = await res.json().catch(() => ({ message: "Not found" }))
          throw new Error(msg?.message || "Not found")
        }
        const data: ProjectDetail = await res.json()
        if (!cancelled) {
          setProject(data)
          setTitle(data.title || "")
          setDescription(data.description || "")
          setTeamType((data.team_type as any) || "")
          setTeamName((data.team_name as any) || "")
          setGenres(
            Array.isArray((data as any).genres)
              ? ((data as any).genres as string[]).filter((g) => typeof g === "string" && g.trim().length > 0)
              : []
          )
          setPlatform((data.platform as any) || "")
          setVideoUrl(data.video_url || "")
          setDownloadUrl((data as any).download_url || "")
          setBannerImage(data.banner_image || "")
          setGalleryImages(data.gallery_images || [])
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Unexpected error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  async function uploadFileToStorage(file: File, folder: string): Promise<string> {
    if (!token) throw new Error("Unauthorized")
    const form = new FormData()
    form.append("file", file)
    form.append("folder", folder)
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) {
      const msg = await res.json().catch(() => ({ message: "업로드 실패" }))
      throw new Error(msg?.message || "업로드 실패")
    }
    const data = (await res.json()) as { url: string }
    return data.url
  }

  async function onPickBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingBanner(true)
      const url = await uploadFileToStorage(file, "banner")
      setBannerImage(url)
    } catch (e: any) {
      setError(e.message ?? "배너 업로드 실패")
    } finally {
      setUploadingBanner(false)
      if (bannerInputRef.current) bannerInputRef.current.value = ""
    }
  }

  async function onPickGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    try {
      setUploadingGallery(true)
      const uploaded = [] as string[]
      for (const f of files) {
        const url = await uploadFileToStorage(f, "gallery")
        uploaded.push(url)
      }
      setGalleryImages((prev) => Array.from(new Set([...(prev || []), ...uploaded])))
    } catch (e: any) {
      setError(e.message ?? "갤러리 업로드 실패")
    } finally {
      setUploadingGallery(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ""
    }
  }

  function moveItem<T>(arr: T[], from: number, to: number): T[] {
    const result = arr.slice()
    const [item] = result.splice(from, 1)
    result.splice(to, 0, item)
    return result
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !id) return
    if (!canSave) {
      setError("필수 값을 확인해주세요.")
      return
    }
    setError(null)
    setSaving(true)
    try {
      const galleryCombined = Array.from(new Set([...(galleryImages || [])]))
      const body: UpdateBody = {
        title: title.trim(),
        team_type: teamType,
        team_name: teamName.trim() ? teamName.trim() : null,
        description: description.trim() ? description.trim() : null,
        genres: genres.length ? genres : null,
        platform: platform || null,
        video_url: videoUrl.trim() || null,
        banner_image: bannerImage.trim() || null,
        gallery_images: galleryCombined.length ? galleryCombined : null,
        download_url: downloadUrl.trim() || null,
      }

      const res = await fetch(`/api/project/${id}` , {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ message: "수정 실패" }))
        throw new Error(msg?.message || "수정 실패")
      }
      router.replace("/admin/project")
    } catch (e: any) {
      setError(e.message ?? "Unexpected error")
    } finally {
      setSaving(false)
    }
  }

  // 장르 자동완성 검색
  useEffect(() => {
    let cancelled = false
    const q = genreInput.trim()
    if (!q) {
      setGenreSuggest([])
      return
    }
    setGenreLoading(true)
    ;(async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
        const res = await fetch(`/api/genre?query=${encodeURIComponent(q)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = await res.json().catch(() => ({ items: [] }))
        if (!cancelled) setGenreSuggest(Array.isArray(data.items) ? data.items : [])
      } finally {
        if (!cancelled) setGenreLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [genreInput])

  function addGenre(name: string) {
    const n = name.trim()
    if (!n) return
    setGenres((prev) => Array.from(new Set([...(prev || []), n])))
    setGenreInput("")
  }

  function removeGenre(name: string) {
    setGenres((prev) => (prev || []).filter((g) => g !== name))
  }

  async function onDelete() {
    if (!token || !id) return
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/project/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("삭제 실패")
      router.replace("/admin/project")
    } catch (e) {
      alert("삭제에 실패했습니다.")
    } finally {
      setDeleting(false)
    }
  }

  if (checking) {
    return (
      <div className="flex h-dvh">
        <AdminSidebar />
        <div className="flex-1 p-6">관리자 확인 중…</div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">출품작 상세/수정</h1>
          <div className="flex items-center gap-2">
            {!loading && project ? (
              <button
                className="rounded-md border border-brand-main bg-brand-main px-3 py-1.5 text-sm text-white shadow-sm hover:brightness-95"
                onClick={() => setEditing((v) => !v)}
                type="button"
              >
                {editing ? "수정 취소" : "수정"}
              </button>
            ) : null}
            <button
              className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-neutral-50"
              onClick={() => router.back()}
            >
              뒤로
            </button>
            <button
              className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700 shadow-sm hover:bg-red-100"
              onClick={onDelete}
              disabled={deleting}
            >
              삭제
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-3">{error}</div>
        ) : null}

        {loading ? (
          <div className="text-sm text-neutral-600">불러오는 중…</div>
        ) : project ? (
          editing ? (
          <form onSubmit={onSave} className="max-w-6xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">제목 *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">팀 종류 *</label>
                <select
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value as any)}
                  className="rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                >
                  <option value="">선택</option>
                  {TEAM_TYPES.map((t) => (
                    <option key={t} value={t}>{t === "challenger" ? "챌린저" : "루키"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">팀 이름</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="팀 이름"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">장르</label>
                <div className="rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-sm">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {genres.filter((g) => typeof g === "string" && g.trim().length > 0).map((g) => (
                      <span key={g} className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs">
                        {g}
                        <button type="button" onClick={() => removeGenre(g)} aria-label="remove" className="ml-1 text-neutral-500 hover:text-neutral-700">×</button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addGenre(genreInput)
                      }
                    }}
                    placeholder="장르를 입력해 검색/추가 (Enter로 추가)"
                    className="w-full outline-none"
                  />
                  {genreLoading ? (
                    <div className="mt-2 text-xs text-neutral-500">검색 중…</div>
                  ) : genreSuggest.length > 0 ? (
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      {genreSuggest.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => addGenre(s.name)}
                          className="block w-full text-left px-2 py-1 rounded hover:bg-neutral-100"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">플랫폼</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                >
                  <option value="">선택</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p === "pc" ? "PC" : "모바일"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">설명</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="프로젝트 설명"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">영상 URL</label>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                />
                {embedUrl ? (
                  <div className="mt-2">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 bg-black/90">
                      <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        title={title || "YouTube Preview"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">다운로드 URL</label>
                <input
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">배너 이미지</label>
                <div className="flex items-center gap-2">
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={onPickBanner} />
                  <button
                    type="button"
                    disabled={uploadingBanner}
                    onClick={() => bannerInputRef.current?.click()}
                    className={
                      "rounded-md border px-3 py-2 text-sm shadow-sm " +
                      (uploadingBanner
                        ? "border-neutral-300 bg-neutral-100 text-neutral-500"
                        : "border-brand-main bg-brand-main text-white hover:brightness-95")
                    }
                  >
                    {uploadingBanner ? "업로드 중…" : "파일 업로드"}
                  </button>
                </div>
                {bannerImage ? (
                  <div className="mt-2">
                    <div className="relative w-full aspect-[3/1] rounded border overflow-hidden">
                      <img src={bannerImage} alt="배너 미리보기" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">갤러리 이미지</label>
              <div className="flex items-center gap-2">
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickGallery} />
                <button
                  type="button"
                  disabled={uploadingGallery}
                  onClick={() => galleryInputRef.current?.click()}
                  className={
                    "rounded-md border px-3 py-2 text-sm shadow-sm " +
                    (uploadingGallery
                      ? "border-neutral-300 bg-neutral-100 text-neutral-500"
                      : "border-brand-main bg-brand-main text-white hover:brightness-95")
                  }
                >
                  {uploadingGallery ? "업로드 중…" : "파일 업로드"}
                </button>
              </div>
              {galleryImages && galleryImages.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {galleryImages.map((url, idx) => (
                    <div
                      key={url + idx}
                      className={
                        "relative group rounded border " +
                        (dragIndex === idx ? "ring-2 ring-brand-main" : "")
                      }
                      draggable
                      onDragStart={() => setDragIndex(idx)}
                      onDragOver={(e) => {
                        e.preventDefault()
                      }}
                      onDrop={() => {
                        if (dragIndex !== null && dragIndex !== idx) {
                          setGalleryImages((prev) => moveItem(prev, dragIndex!, idx))
                        }
                        setDragIndex(null)
                      }}
                      onDragEnd={() => setDragIndex(null)}
                      title="드래그해서 순서를 변경할 수 있습니다"
                    >
                      <img src={url} alt="갤러리" className="h-28 w-full object-cover rounded" />
                      <div className="absolute top-1 left-1 rounded bg-black/60 text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 select-none cursor-move">
                        드래그
                      </div>
                      <button
                        type="button"
                        className="absolute top-1 right-1 rounded bg-black/60 text-white text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100"
                        onClick={() => setGalleryImages((prev) => (prev || []).filter((_, i) => i !== idx))}
                      >
                        제거
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!canSave || saving}
                className={
                  "rounded-md border px-3 py-2 text-sm shadow-sm " +
                  (canSave && !saving
                    ? "border-brand-main bg-brand-main text-white hover:brightness-95"
                    : "border-neutral-300 bg-neutral-100 text-neutral-500 cursor-not-allowed")
                }
              >
                {saving ? "저장 중…" : "저장"}
              </button>
              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50"
                onClick={() => router.back()}
              >
                취소
              </button>
            </div>
          </form>
          ) : (
            <div className="max-w-4xl space-y-6 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">제목</div>
                <div className="mt-1 text-base font-medium text-neutral-900">{project.title}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">팀 이름</div>
                  <div className="mt-1 text-neutral-800">{(project as any).team_name || "-"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">팀 종류</div>
                  <div className="mt-1 text-neutral-800">{project.team_type || "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">장르</div>
                  <div className="mt-1 text-neutral-800">{Array.isArray((project as any).genres) && (project as any).genres.length ? ((project as any).genres as string[]).join(", ") : "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">플랫폼</div>
                  <div className="mt-1 text-neutral-800">{project.platform || "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">작성일</div>
                  <div className="mt-1 text-neutral-800">{new Date(project.created_at).toLocaleString()}</div>
                </div>
              </div>
              {project.description ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">설명</div>
                  <div className="mt-1 whitespace-pre-line leading-relaxed text-neutral-800">{project.description}</div>
                </div>
              ) : null}
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">영상 URL</div>
                {project.video_url ? (
                  <>
                    <a className="mt-1 inline-block text-brand-main underline" href={project.video_url} target="_blank" rel="noreferrer">
                      {project.video_url}
                    </a>
                    {embedUrlView ? (
                      <div className="mt-3">
                        <div className="aspect-video w-full max-w-3xl rounded-lg overflow-hidden border border-neutral-200 bg-black/90">
                          <iframe
                            className="w-full h-full"
                            src={embedUrlView}
                            title={project.title || "YouTube Preview"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="mt-1 text-neutral-800">없음</div>
                )}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">다운로드 URL</div>
                {project.download_url ? (
                  <a className="mt-1 inline-block text-brand-main underline" href={project.download_url} target="_blank" rel="noreferrer">
                    {project.download_url}
                  </a>
                ) : (
                  <div className="mt-1 text-neutral-800">없음</div>
                )}
              </div>
              {project.banner_image ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">배너 이미지</div>
                  <div className="mt-2">
                    <div className="relative w-full max-w-xl aspect-[3/1] rounded border overflow-hidden">
                      <img src={project.banner_image} alt="배너" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ) : null}
              {project.gallery_images && project.gallery_images.length > 0 ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">갤러리 이미지</div>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {project.gallery_images.map((url, idx) => (
                      <img key={url + idx} src={url} alt="갤러리" className="h-28 w-full object-cover rounded border" />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )
        ) : (
          <div className="text-sm text-neutral-600">데이터가 없습니다.</div>
        )}
      </div>
    </div>
  )
}
