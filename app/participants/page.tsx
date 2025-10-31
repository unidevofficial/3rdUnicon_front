"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { SectionDivider } from "@/components/section-divider"
import ImageModal from "@/components/ui/image-modal"

// metadata는 server 컴포넌트 레이아웃(app/participants/layout.tsx)에 정의됩니다.

type ApiProject = {
  id: string
  title: string
  description?: string | null
  team_type?: string | null
  team_name?: string | null
  genres?: string[] | null
  banner_image?: string | null
  created_at: string
}

type UiProject = {
  id: string
  title: string
  team: string
  summary: string
  genre: "RPG" | "FPS" | "퍼즐" | "시뮬" | "기타"
  genres: string[]
  tier: "챌린저" | "루키"
  bannerImage?: string | null
  createdAtMs: number
}

export default function ParticipantsListPage() {
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState<string>("전체")
  const [tier, setTier] = useState<"전체" | UiProject["tier"]>("전체")
  const [order, setOrder] = useState<"recent" | "title" | "random">("random")
  const [items, setItems] = useState<UiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [shuffledItems, setShuffledItems] = useState<UiProject[]>([])
  const [error, setError] = useState<string | null>(null)
  const [genreOptions, setGenreOptions] = useState<string[]>([])

  const GENRES = useMemo(() => ["전체", ...genreOptions], [genreOptions])
  const TIERS: Array<"전체" | UiProject["tier"]> = ["전체", "챌린저", "루키"]

  const filtered = useMemo(() => {
    // 1. 정렬 방식에 따라 원본 배열 선택
    // 'random'이면 미리 섞어둔 shuffledItems, 아니면 원본 items
    const baseArray = order === "random" ? shuffledItems : items;

    // 2. 검색어(query)로 필터링
    const filteredByQuery = baseArray
      .filter((p) => (query ? (p.title + p.team + p.summary).toLowerCase().includes(query.toLowerCase()) : true));

    // 3. 'random'이 아닐 경우에만 'recent' 또는 'title' 정렬 수행
    if (order === "random") {
      return filteredByQuery; // 이미 셔플 + 필터링된 상태
    }

    // 'recent' 또는 'title' 정렬
    return [...filteredByQuery].sort((a, b) => {
      if (order === "recent") return b.createdAtMs - a.createdAtMs;
      if (order === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [items, shuffledItems, query, order]); // 👈 의존성 배열 변경! (genre, tier 제거)
  // 장르 옵션 로드 (공개 API)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/genre?limit=500`, { cache: "no-store" })
        const data = await res.json().catch(() => ({ items: [] }))
        const names = Array.isArray(data.items) ? data.items.map((g: any) => g?.name).filter(Boolean) : []
        if (!cancelled) setGenreOptions(names)
      } catch {
        if (!cancelled) setGenreOptions(["RPG", "FPS", "퍼즐", "시뮬", "기타"]) // 폴백
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const params: Record<string, string> = { page: "1", pageSize: "100" }
        if (query.trim()) params.title = query.trim()
        if (genre !== "전체") params.genre = genre
        if (tier !== "전체") params.team_type = tier === "챌린저" ? "challenger" : "rookie"
        const qs = new URLSearchParams(params).toString()
        const res = await fetch(`/api/project?${qs}`, { cache: "no-store" })
        if (!res.ok) {
          const msg = await res.json().catch(() => ({}))
          throw new Error(msg?.message || "불러오기에 실패했습니다.")
        }
        const data = (await res.json()) as { items: ApiProject[] }
        const mapped: UiProject[] = (data.items || []).map((p) => {
          const allGenres = Array.isArray(p.genres) ? p.genres.filter((g): g is string => typeof g === "string" && g.trim().length > 0) : []
          const firstGenre = allGenres.length ? allGenres[0] : "기타"
          const mappedGenre: UiProject["genre"] =
            firstGenre === "RPG" || firstGenre === "FPS" || firstGenre === "퍼즐" || firstGenre === "시뮬" ? (firstGenre as any) : "기타"
          const mappedTier: UiProject["tier"] = p.team_type === "challenger" ? "챌린저" : "루키"
          return {
            id: p.id,
            title: p.title,
            team: p.team_name || "-",
            summary: p.description || "",
            genre: mappedGenre,
            genres: allGenres,
            tier: mappedTier,
            badge: undefined,
            bannerImage: (p as any).banner_image || null,
            createdAtMs: new Date(p.created_at).getTime(),
          }
        })
        if (!cancelled) setItems(mapped)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "문제가 발생했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [query, genre, tier])

  useEffect(() => { // 게임 리스트 랜덤 정렬
    const array = [...items];
    let currentIndex = array.length, randomIndex;
    
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    
    setShuffledItems(array);
  }, [items]) 

  return (
    <div className="min-h-screen relative z-10 no-pretendard">
      {/* Hero - unified style */}
      <section className="relative -mt-16 md:-mt-24 h-[420px] md:h-[560px] w-full overflow-hidden no-pretendard">
        <Image
          src="/background.png"
          alt="배경"
          fill
          priority
          className="object-cover object-center opacity-80 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-[#0B1038] pointer-events-none no-pretendard" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 no-pretendard">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-point drop-shadow-md">참가 작품</h1>
          <div
            aria-hidden
            className="mx-auto w-40 md:w-56 h-6 mt-3 no-pretendard"
            style={{
              WebkitMaskImage: "url(/divider.svg)",
              maskImage: "url(/divider.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              backgroundColor: "var(--brand-point)",
            }}
          />
          <p className="text-white mt-6 no-pretendard font-hero">카드형식의 출품작 리스트</p>
        </div>
      </section>

      <section className="py-16 mt-8">
        <div className="text-center mb-10 ">
          <h2 className="text-text-3xl md:text-4xl font-bold text-white tracking-wider">부스 배치도</h2>
          <SectionDivider />
        </div>
          <div className="mx-auto overflow-hidden bg-brand-main/20 border-y border-brand-point/30 flex items-center justify-center">
            <ImageModal src="/booth_updated.jpeg" alt="부스 배치도" className="max-w-full mt-10 mb-10 h-auto object-contain mx-auto" />
          </div>
        </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Filters */}
        <div className="text-center mb-10">
          <h2 className="text-text-3xl md:text-4xl font-bold text-white tracking-wider">참가 작품</h2>
          <SectionDivider />
        </div>
        <div className="mb-8 space-y-4">
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="팀명, 출품작 이름으로 검색..."
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-1">장르</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as any)}
                className="w-full h-11 px-3 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-[#0B1038]">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">참가팀 종류</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as any)}
                className="w-full h-11 px-3 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t} className="bg-[#0B1038]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">정렬</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as any)}
                className="w-full h-11 px-3 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                <option value="random" className="bg-[#0B1038]">
                  랜덤 정렬
                </option>
                <option value="recent" className="bg-[#0B1038]">
                  최근 등록순
                </option>
                <option value="title" className="bg-[#0B1038]">
                  이름순
                </option>
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-300">{error}</div>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-md bg-white/5 border border-white/10 animate-pulse" />
            ))
          ) : filtered.map((p) => (
            <Link key={p.id} href={`/participants/${p.id}`} className="group">
              <Card className="bg-brand-main/40 border-brand-sub/20 backdrop-blur-sm transition-all duration-200 group-hover:scale-[1.02] group-hover:bg-brand-main/60 group-hover:border-brand-highlight/70">
                <CardContent className="p-6 space-y-3">
                  {p.bannerImage ? (
                    <div className="relative w-full aspect-[3/1] rounded-md overflow-hidden border border-white/20">
                      <Image src={p.bannerImage} alt={p.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[3/1] rounded-md bg-gradient-to-br from-brand-sub/20 to-brand-highlight/10 border border-dashed border-white/20 grid place-items-center text-brand-highlight/90 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-brand-point">
                      {p.title}
                    </h3>
                    {/* <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-brand-highlight transition-colors group-hover:border-brand-point group-hover:text-brand-point">
                      {p.badge}
                    </span> */}
                  </div>
                  <div className="flex items-center gap-2 text-brand-highlight text-sm transition-colors group-hover:text-brand-highlight">
                    <Users className="h-4 w-4 text-brand-point" />
                    <span>{p.team}</span>
                  </div>
                  <p className="text-brand-highlight text-sm transition-colors group-hover:text-white overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{p.summary}</p>
                  <div className="flex items-center justify-between text-xs text-brand-highlight/80 transition-colors group-hover:text-brand-highlight">
                    <span>장르: {p.genres && p.genres.length ? p.genres.join(", ") : p.genre}</span>
                    <span>참가 부문: {p.tier}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        
      </div>
    </div>
  )
}
