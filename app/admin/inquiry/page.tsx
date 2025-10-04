"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

type Inquiry = {
  id: string
  name: string
  email: string
  phone?: string | null
  title: string
  content: string
  created_at: string
  is_checked?: boolean
}

type ApiResponse = {
  items: Inquiry[]
  page: number
  pageSize: number
  total: number
}

function truncateText(text: string, maxLength: number): string {
  if (typeof text !== "string") return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export default function AdminInquiryPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<10 | 50>(10)
  const [items, setItems] = useState<Inquiry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [toggling, setToggling] = useState(false)
  const [checkedFilter, setCheckedFilter] = useState<"all" | "true" | "false">("all")
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", title: "", content: "" })

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

  // 2) 리스트 로드
  useEffect(() => {
    if (!token) return
    let cancelled = false
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) }
        if (checkedFilter !== "all") params.checked = checkedFilter
        const query = new URLSearchParams(params)
        const res = await fetch(`/api/inquiry?${query.toString()}`, {
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
  }, [token, page, pageSize, checkedFilter])

  // 선택 변경 시 편집 폼 초기화
  useEffect(() => {
    if (selected) {
      setEditForm({
        name: selected.name || "",
        email: selected.email || "",
        phone: selected.phone || "",
        title: selected.title || "",
        content: selected.content || "",
      })
      setEditing(false)
    }
  }, [selected])

  function onChangePageSize(nextSize: 10 | 50) {
    setPageSize(nextSize)
    setPage(1)
  }

  function goToPage(target: number) {
    const next = Math.min(totalPages, Math.max(1, target))
    setPage(next)
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
          <h1 className="text-2xl font-bold">문의 목록</h1>
        </div>

        <div className="mb-3 flex items-end justify-between">
          <div className="text-sm text-neutral-600">총 {total.toLocaleString()}건 · {page}/{totalPages}페이지</div>
          <div className="flex items-end gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">확인여부</label>
              <select
                className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                value={checkedFilter}
                onChange={(e) => {
                  setCheckedFilter(e.target.value as any)
                  setPage(1)
                }}
              >
                <option value="all">전체</option>
                <option value="true">확인</option>
                <option value="false">미확인</option>
              </select>
            </div>
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
          </div>
        </div>

        <div className={"overflow-x-auto rounded border " + (pageSize === 50 ? "max-h-[70vh] overflow-y-auto" : "") }>
          <table className="min-w-full text-sm">
            <thead className="bg-brand-main text-white">
              <tr className="text-left">
                <th className="px-3 py-2 w-36 whitespace-nowrap text-xs uppercase tracking-wide">작성일</th>
                <th className="px-3 py-2 w-32 text-xs uppercase tracking-wide">이름</th>
                <th className="px-3 py-2 w-44 text-xs uppercase tracking-wide">이메일</th>
                <th className="px-3 py-2 w-36 text-xs uppercase tracking-wide">휴대폰</th>
                <th className="px-3 py-2 text-xs uppercase tracking-wide">제목</th>
                <th className="px-3 py-2 w-24 text-xs uppercase tracking-wide">확인여부</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-neutral-500">
                    불러오는 중…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-neutral-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((q) => (
                  <tr
                    key={q.id}
                    className="border-t hover:bg-neutral-50/60 cursor-pointer"
                    onClick={() => {
                      setSelected(q)
                      setEditing(false)
                    }}
                  >
                    <td className="px-3 py-2 align-middle whitespace-nowrap">{new Date(q.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 align-middle">{q.name}</td>
                    <td className="px-3 py-2 align-middle text-neutral-700">{q.email}</td>
                    <td className="px-3 py-2 align-middle text-neutral-700">{q.phone || "-"}</td>
                    <td className="px-3 py-2 align-middle">
                      <div className="font-medium text-neutral-900">{q.title}</div>
                      <div className="text-neutral-600 text-xs mt-1">{truncateText(q.content, 40)}</div>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      {q.is_checked ? (
                        <span className="inline-flex items-center rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700">확인</span>
                      ) : (
                        <span className="inline-flex items-center rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-700">미확인</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {pageNumbers[0] > 1 && (
            <>
              <button
                className="rounded border px-2 py-1.5 text-sm"
                onClick={() => goToPage(1)}
                disabled={loading}
              >
                1
              </button>
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
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-1 text-neutral-400">…</span>
              )}
              <button
                className="rounded border px-2 py-1.5 text-sm"
                onClick={() => goToPage(totalPages)}
                disabled={loading}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <div
              className="absolute inset-0 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelected(null)
              }}
            >
              <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b bg-neutral-50 px-4 py-3 rounded-t-xl">
                  <h2 className="text-base font-semibold text-neutral-900">문의 상세</h2>
                <div className="flex items-center gap-2">
                    <button
                      className={
                        "rounded-md border px-2.5 py-1.5 text-sm shadow-sm cursor-pointer " +
                        (selected?.is_checked
                          ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100")
                      }
                      disabled={toggling}
                      onClick={async () => {
                        if (!selected || !token) return
                        try {
                          setToggling(true)
                          const next = !selected.is_checked
                          // optimistic update: modal + list
                          setSelected({ ...selected, is_checked: next })
                          setItems((prev) => prev.map((it) => (it.id === selected.id ? { ...it, is_checked: next } : it)))

                          const res = await fetch(`/api/inquiry/${selected.id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ is_checked: next }),
                          })
                          if (!res.ok) {
                            throw new Error("변경 실패")
                          }
                        } catch (e) {
                          // revert on error
                          setSelected((cur) => (cur ? { ...cur, is_checked: !cur.is_checked } : cur))
                          setItems((prev) =>
                            prev.map((it) => (it.id === selected!.id ? { ...it, is_checked: !it.is_checked } : it))
                          )
                          alert("확인 상태 변경에 실패했습니다.")
                        } finally {
                          setToggling(false)
                        }
                      }}
                    >
                      {selected?.is_checked ? "확인취소" : "확인처리"}
                    </button>
                    <button
                      className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 shadow-sm cursor-pointer"
                      onClick={() => setSelected(null)}
                    >
                      닫기
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
                  {!editing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-neutral-500">이름 *</div>
                          <div className="font-medium text-neutral-900">{selected.name}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-neutral-500">이메일 *</div>
                          <div className="break-all text-neutral-800">{selected.email}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-neutral-500">전화번호 *</div>
                        <div className="text-neutral-800">{selected.phone || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-neutral-500">제목 *</div>
                        <div className="font-medium text-neutral-900">{selected.title}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-neutral-500">내용 *</div>
                        <div className="whitespace-pre-line leading-relaxed text-neutral-800">{selected.content}</div>
                      </div>
                      <div className="pt-2 text-[11px] text-neutral-500">작성일: {new Date(selected.created_at).toLocaleString()}</div>
                    </>
                  ) : (
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">이름 *</label>
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">이메일 *</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">전화번호 *</label>
                        <input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">제목 *</label>
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">내용 *</label>
                        <textarea
                          rows={6}
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-main focus:outline-none focus:ring-2 focus:ring-brand-main/30"
                        />
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
