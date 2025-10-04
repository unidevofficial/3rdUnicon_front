"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

type Project = {
  id: string
  title: string
  description?: string | null
  team_type?: string | null
  team_name?: string | null
  genres?: string[] | null
  platform?: string | null
  video_url?: string | null
  banner_image?: string | null
  gallery_images?: string[] | null
  download_url?: string | null
  created_at: string
}

type ApiResponse = {
  items: Project[]
  page: number
  pageSize: number
  total: number
}

export default function AdminProjectPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<10 | 50>(10)
  const [items, setItems] = useState<Project[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 상세 페이지로 이동하도록 변경 (모달 제거)

  // filters (일반 페이지 검색 기능 이식: 제목, 장르, 플랫폼, 팀 타입)
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState<string | "all">("all")
  const [genreOptions, setGenreOptions] = useState<string[]>([])
  const [platform, setPlatform] = useState<string | "all">("all")
  const [teamType, setTeamType] = useState<string | "all">("all")

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])
  const pageNumbers = useMemo(() => {
    const maxButtons = 5
    const last = totalPages
    if (!last) return [1]
    let start = Math.max(1, page - Math.floor(maxButtons / 2))
    let end = Math.min(last, start + maxButtons - 1)
    start = Math.max(1, end - maxButtons + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [page, totalPages])

  // 1) 관리자 토큰 확인
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

  // 장르 옵션 로드 (DB 기준)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (!token) return
        const res = await fetch(`/api/genre?limit=500`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        const data = await res.json().catch(() => ({ items: [] }))
        if (!cancelled) {
          const names = Array.isArray(data.items) ? data.items.map((g: any) => g.name).filter(Boolean) : []
          setGenreOptions(names)
        }
      } catch {
        if (!cancelled) setGenreOptions([])
      }
    })()
    return () => { cancelled = true }
  }, [token])

  // 2) 리스트 로드
  useEffect(() => {
    if (!token) return
    let cancelled = false
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) }
        if (title.trim()) params.title = title.trim()
        if (genre !== "all") params.genre = genre
        if (platform !== "all") params.platform = platform
        if (teamType !== "all") params.team_type = teamType
        const query = new URLSearchParams(params)
        const res = await fetch(`/api/project?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        if (!res.ok) {
          const msg = await res.json().catch(() => ({ message: "Failed to load" }))
          throw new Error(msg?.message || "Failed to load")
        }
        const data: ApiResponse = await res.json()
        if (!cancelled) {
          setItems(data.items ?? [])
          setTotal(data.total ?? 0)
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
  }, [token, page, pageSize, title, genre, platform, teamType])

  function onChangePageSize(nextSize: 10 | 50) {
    setPageSize(nextSize)
    setPage(1)
  }

  function goToPage(target: number) {
    const next = Math.min(totalPages, Math.max(1, target))
    setPage(next)
  }

  function onSubmitFilters(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
  }

  if (checking) {
    return (
      <div className="flex min-h-dvh">
        <AdminSidebar />
        <div className="flex-1 p-6">관리자 확인 중…</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">출품작 관리</h1>
          <button
            className="rounded-md border border-brand-main bg-brand-main text-white px-3 py-1.5 text-sm shadow-sm hover:brightness-95"
            onClick={() => router.push("/admin/project/new")}
          >
            출품작 등록
          </button>
        </div>

        {/* 상단 필터: 문의 관리 스타일에 맞춘 폼 배치 */}
        <form onSubmit={onSubmitFilters} className="mb-3 flex items-end justify-between gap-4">
          <div className="flex-1 flex items-end gap-4">
            <div className="flex flex-col flex-1 min-w-40">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">검색</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목으로 검색"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">장르</label>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">전체</option>
                {genreOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">플랫폼</label>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">전체</option>
                <option value="pc">PC</option>
                <option value="mobile">모바일</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">팀 종류</label>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                value={teamType}
                onChange={(e) => {
                  setTeamType(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">전체</option>
                <option value="challenger">챌린저</option>
                <option value="rookie">루키</option>
              </select>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">페이지 크기</label>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                value={pageSize}
                onChange={(e) => onChangePageSize(Number(e.target.value) as 10 | 50)}
              >
                <option value={10}>10개</option>
                <option value={50}>50개</option>
              </select>
            </div>
            <button
              type="submit"
              className="h-9 mt-6 rounded-md border border-neutral-300 bg-white px-3 text-sm shadow-sm hover:bg-neutral-50"
            >
              적용
            </button>
          </div>
        </form>

        <div className={"overflow-x-auto rounded border " + (pageSize === 50 ? "max-h-[70vh] overflow-y-auto" : "") }>
          <table className="min-w-full text-sm">
            <thead className="bg-brand-main text-white">
              <tr className="text-left">
                <th className="px-3 py-2 w-36 whitespace-nowrap text-xs uppercase tracking-wide">작성일</th>
                <th className="px-3 py-2 w-52 text-xs uppercase tracking-wide">제목</th>
                <th className="px-3 py-2 w-40 text-xs uppercase tracking-wide">팀 이름</th>
                <th className="px-3 py-2 w-28 text-xs uppercase tracking-wide">팀 종류</th>
                <th className="px-3 py-2 w-40 text-xs uppercase tracking-wide">장르</th>
                <th className="px-3 py-2 w-28 text-xs uppercase tracking-wide">플랫폼</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-neutral-500">불러오는 중…</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-red-600">{error}</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-neutral-500">데이터가 없습니다.</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-neutral-50/60 cursor-pointer"
                    onClick={() => router.push(`/admin/project/${p.id}`)}
                  >
                    <td className="px-3 py-2 align-middle whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 align-middle">
                      <div className="font-medium text-neutral-900">{p.title}</div>
                      {p.description ? (
                        <div className="text-neutral-600 text-xs mt-1 line-clamp-1">{p.description}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 align-middle text-neutral-700">{p.team_name || "-"}</td>
                    <td className="px-3 py-2 align-middle text-neutral-700">{p.team_type || "-"}</td>
                    <td className="px-3 py-2 align-middle text-neutral-700">{Array.isArray(p.genres) && p.genres.length ? p.genres.join(", ") : "-"}</td>
                    <td className="px-3 py-2 align-middle text-neutral-700">{p.platform || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {pageNumbers[0] > 1 && (
            <>
              <button className="rounded border px-2 py-1.5 text-sm" onClick={() => goToPage(1)} disabled={loading}>1</button>
              {pageNumbers[0] > 2 && <span className="px-1 text-neutral-400">…</span>}
            </>
          )}
          {pageNumbers.map((n) => {
            const active = n === page
            return (
              <button
                key={n}
                className={
                  "rounded border px-2 py-1.5 text-sm " +
                  (active ? "bg-brand-main text-white border-brand-main" : "hover:bg-neutral-50")
                }
                onClick={() => goToPage(n)}
                disabled={loading}
                aria-current={active ? "page" : undefined}
              >
                {n}
              </button>
            )
          })}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-1 text-neutral-400">…</span>}
              <button className="rounded border px-2 py-1.5 text-sm" onClick={() => goToPage(totalPages)} disabled={loading}>
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* 모달 제거: 상세 페이지에서 처리 */}
      </div>
    </div>
  )
}
