"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BrandButton } from "@/components/brand-button"
import { Calendar, MapPin, Users, Trophy, Lightbulb } from "lucide-react"
import { SectionDivider, SectionDivider2 } from "@/components/section-divider"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getDesktopOpacity = (sectionIndex: number, cardIndex = 0) => {
    if (typeof window === "undefined") return 1

    const viewportHeight = window.innerHeight
    const fadeStartPoint = viewportHeight * 0.3
    const sectionOffset = sectionIndex * viewportHeight * 0.8
    const cardOffset = cardIndex * viewportHeight * 0.2
    const fadeDistance = viewportHeight * 0.7

    const totalOffset = fadeStartPoint + sectionOffset + cardOffset

    if (scrollY < totalOffset) {
      return 1
    }

    const fadeProgress = (scrollY - totalOffset) / fadeDistance
    const easedProgress = Math.pow(Math.min(1, fadeProgress), 3)
    return Math.max(0.2, 1 - easedProgress)
  }

  const getMobileOpacity = (sectionIndex: number, cardIndex = 0) => {
    if (typeof window === "undefined") return 1

    // 고정 픽셀 값으로 통일하여 모든 모바일 기기에서 일관된 애니메이션 제공
    const fadeStartPoint = 600 // 시작점을 늦춤 (px)
    const sectionOffset = sectionIndex * 800 // 섹션별 간격을 늘림 (px)
    const cardOffset = cardIndex * 250 // 카드별 간격을 늘림 (px)
    const fadeDistance = 800 // fade 거리를 늘려서 더 천천히 사라지게 함 (px)

    const totalOffset = fadeStartPoint + sectionOffset + cardOffset

    if (scrollY < totalOffset) {
      return 1
    }

    const fadeProgress = (scrollY - totalOffset) / fadeDistance
    const easedProgress = Math.pow(Math.min(1, fadeProgress), 3)
    return Math.max(0.2, 1 - easedProgress)
  }

  const getCardOpacity = (sectionIndex: number, cardIndex = 0) => {
    if (typeof window === "undefined") return 1

    const isMobile = window.innerWidth < 768 // md breakpoint 기준

    return isMobile ? getMobileOpacity(sectionIndex, cardIndex) : getDesktopOpacity(sectionIndex, cardIndex)
  }

  const getHeroScale = () => {
    if (typeof window === "undefined") return 1

    const isMobile = window.innerWidth < 768 // md breakpoint 기준

    const maxScale = isMobile ? 1.1 : 1.2 // Larger when at top
    const minScale = isMobile ? 0.9 : 0.85 // Smaller when scrolled down

    // 모바일에서는 고정 픽셀 값 사용, 데스크톱에서는 기존 방식 유지
    const maxScrollForScale = isMobile ? 600 : window.innerHeight * 1.0
    const scrollProgress = Math.min(scrollY / maxScrollForScale, 1)

    // Linear interpolation: start large, get smaller as you scroll down
    const scale = maxScale - scrollProgress * (maxScale - minScale)
    return Math.max(minScale, Math.min(maxScale, scale))
  }

  const getSectionScale = (sectionIndex: number) => {
    if (typeof window === "undefined") return 1

    const viewportHeight = window.innerHeight
    const isMobile = window.innerWidth < 768 // md breakpoint 기준

    // 모바일에서는 고정 픽셀 값 사용, 데스크톱에서는 기존 방식 유지
    const sectionOffset = sectionIndex * (isMobile ? 600 : viewportHeight * 0.8)
    const sectionCenter = sectionOffset + (isMobile ? 300 : viewportHeight * 0.3)
    const currentScrollPosition = scrollY + (isMobile ? 400 : viewportHeight * 0.5)

    const distanceFromCenter = Math.abs(currentScrollPosition - sectionCenter)
    const maxDistance = isMobile ? 400 : viewportHeight * 0.4

    const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
    const minScale = 0.85
    const maxScale = isMobile ? 1.05 : 1.1

    const scale = minScale + (1 - normalizedDistance) * (maxScale - minScale)
    return Math.max(minScale, Math.min(maxScale, scale))
  }

  return (
    <div className="min-h-screen relative z-10" style={{ backgroundColor: "#0B1038" }}>
      {/* Hero Section - 메인 비주얼 */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center px-0 bg-black mt-[-64px] pt-16 transition-all duration-700 ease-out"
        style={{
          opacity: getCardOpacity(0),
          transform: `translateY(${Math.max(0, (1 - getCardOpacity(0)) * 30)}px)`, // Added subtle upward movement
        }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_eT4uKHA0N98IQws3lVUmZgjBRV2O/Dmelt2QjMGi99GoXKHm2bO/public/backgroundVideo.mp4"
          autoPlay
          muted
          playsInline
          aria-hidden="true"
        />

        {/* <img
          className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none no-pretendard"
          src="/background.png"
          alt=""
          aria-hidden="true"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-[#0B1038] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 px-4">
          <div
            className="space-y-4 transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${getHeroScale()})`,
            }}
          >
            <img
              src="/herogo.png"
              alt="UNICON 로고"
              className="mx-auto w-44 sm:w-52 md:w-60 lg:w-72 h-auto opacity-95 no-pretendard mb-16 mt-8 md:mt-0"
            />
            <h1 className="font-bold text-white -mt-8 mb-4 no-pretendard px-4" style={{ textShadow: '0 0 30px rgba(150, 190, 255, 0.5), 0 0 70px rgba(150, 190, 255, 0.3), 0 0 100px rgba(255, 255, 255, 0.2)' }}>
              <div>
              <span className="block leading-none text-[31pt] sm:text-[38pt] md:text-[50pt] lg:text-[66.67pt] tracking-wider">제3회</span>
              <span className="block leading-none text-[44pt] sm:text-[53pt] md:text-[71pt] lg:text-[94.7pt] tracking-wide">UNICON</span>
              </div>
            </h1>
            <SectionDivider2 imgClassName="w-[460px] md:w-[600px] lg:w-[740px]" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-brand-highlight mt-16 md:mt-24">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>2025.11.01</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>고양꽃전시관 Contents Universe Korea 2025 행사장</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center -mt-2 md:-mt-4 border-y border-brand-point/30 py-[12]">
            <BrandButton
              asChild
              tone="primary"
              className="font-pretendard text-lg rounded-none text-white hover:text-brand-point py-2 h-auto"
            >
              <Link href="/event">정보 보기</Link>
            </BrandButton>
            <BrandButton
              asChild
              tone="primary"
              className="font-pretendard text-lg rounded-none text-white hover:text-brand-point py-2 h-auto"
            >
              <Link href="/participants">참가작품 둘러보기</Link>
            </BrandButton>
          </div>
        </div>
      </section>

      {/* Feature Section - 행사 위치/일정/시간 */}
      <section
        className="py-20 px-4 relative z-10 transition-all duration-700 ease-out -mt-1"
        style={{
          opacity: getCardOpacity(1),
          transform: `translateY(${Math.max(0, (1 - getCardOpacity(1)) * 20)}px)`, // Added subtle movement
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="text-center transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${getSectionScale(1)})`,
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-2 tracking-wider">행사 정보</h2>
            <SectionDivider />
          </div>
          <p className="text-brand-highlight text-center mb-12 mx-auto tracking-wide ">
            UNICON은 대학생 개발자들이 한 해 동안 준비한 프로젝트를 선보이는 국내 최대 규모의 대학생 개발 전시회입니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-point/30">
            <div
              className="p-8 text-center space-y-4 hover:bg-brand-main/20 transition-colors duration-300"
              style={{
                opacity: getCardOpacity(1, 0),
                transform: `translateY(${Math.max(0, (1 - getCardOpacity(1, 0)) * 15)}px)`,
              }}
            >
              <div className="mx-auto w-8 h-8 relative flex items-center justify-center">
                <div className="absolute w-6 h-6 border-2 border-brand-point rotate-45 opacity-90"></div>
                <div className="absolute w-3 h-3 border border-brand-point rotate-45 opacity-90"></div>
                <div className="absolute w-0 h-px bg-brand-point border-1 border-brand-point group-hover:w-14 transition-all duration-500 ease-out origin-center"></div>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-brand-point transition-colors">일정</h3>
              <p className="text-brand-highlight">2025년 11월 01일 토요일</p>
              <p className="text-sm text-brand-highlight/80">1일간 진행</p>
            </div>

            <div
              className="p-8 text-center space-y-4 hover:bg-brand-main/20 transition-colors duration-300"
              style={{
                opacity: getCardOpacity(1, 1),
                transform: `translateY(${Math.max(0, (1 - getCardOpacity(1, 1)) * 15)}px)`,
              }}
            >
              <div className="mx-auto w-8 h-8 relative flex items-center justify-center">
                <div className="absolute w-6 h-6 border-2 border-brand-point rotate-45 opacity-90"></div>
                <div className="absolute w-3 h-3 border border-brand-point rotate-45 opacity-90"></div>
                <div className="absolute w-0 h-px bg-brand-point border-1 border-brand-point group-hover:w-14 transition-all duration-500 ease-out origin-center"></div>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-brand-point transition-colors">장소</h3>
              <p className="text-brand-highlight">고양꽃전시관</p>
              <p className="text-sm text-brand-highlight/80"> Contents Universe Korea 2025 행사장</p>
            </div>

            <div
              className="p-8 text-center space-y-4 hover:bg-brand-main/20 transition-colors duration-300"
              style={{
                opacity: getCardOpacity(1, 2),
                transform: `translateY(${Math.max(0, (1 - getCardOpacity(1, 2)) * 15)}px)`,
              }}
            >
              <div className="mx-auto w-8 h-8 relative flex items-center justify-center">
                <div className="absolute w-6 h-6 border-2 border-brand-point rotate-45 opacity-90"></div>
                <div className="absolute w-3 h-3 border border-brand-point rotate-45 opacity-90"></div>
                <div className="absolute w-0 h-px bg-brand-point border-1 border-brand-point group-hover:w-14 transition-all duration-500 ease-out origin-center"></div>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-brand-point transition-colors">시간</h3>
              <p className="text-brand-highlight">오전 10시 - 오후 6시</p>
              <p className="text-sm text-brand-highlight/80">입장료 무료</p>
            </div>
          </div>
          <div className="mt-30 text-center">
            <div className="bg-brand-main/20  rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <a
                  href="https://contentsuniverse.com/kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img src="/concon.png" alt="Contents Universe 2025" className="h-40 w-auto" />
                </a>
              </div>
              <p className="text-2xl font-semibold text-white mb-2">
                제3회 UNICON은 Contents Universe Korea 2025 행사와 진행됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LinkBox Section - 바로가기 */}
      <section
        className="py-20 px-4 transition-all duration-700 ease-out"
        style={{
          opacity: getCardOpacity(2),
          transform: `translateY(${Math.max(0, (1 - getCardOpacity(2)) * 20)}px)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="text-center transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${getSectionScale(2)})`,
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-2 tracking-wider">둘러 보기</h2>
            <SectionDivider />
          </div>
          <p className="text-brand-highlight text-center mb-12 tracking-wide">UNICON의 다양한 정보를 확인해보세요</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-point/30">
            {[
              {
                title: "행사 개요",
                desc: "UNICON 2025의 상세 정보와 타임라인",
                href: "/event",
                icon: Calendar,
              },
              {
                title: "전시회",
                desc: "부스 배치도와 무대 프로그램",
                href: "/exhibition",
                icon: Trophy,
              },
              {
                title: "참가 작품",
                desc: "출품작과 참가팀 포트폴리오",
                href: "/participants",
                icon: Users,
              },
              {
                title: "UNIDEV",
                desc: "주최 단체 소개",
                href: "/about",
                icon: Lightbulb,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 text-center space-y-4 hover:bg-brand-main/20 transition-all duration-300 group cursor-pointer"
                style={{
                  opacity: getCardOpacity(2, index),
                  transform: `translateY(${Math.max(0, (1 - getCardOpacity(2, index)) * 15)}px)`,
                }}
              >
                <Link href={item.href} className="block space-y-4">
                  <div className="mx-auto w-10 h-8 relative flex items-center justify-center">
                    <div className="absolute left-0 w-6 h-6 border-1 border-brand-point rotate-45 opacity-90"></div>
                    <div className="absolute right-0 w-6 h-6 border-1 border-brand-point rotate-45 opacity-90"></div>
                    <div className="absolute w-0 h-px bg-brand-point border-0.5 border-brand-point group-hover:w-16 transition-all duration-500 ease-out origin-center"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-brand-point transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-brand-highlight text-sm">{item.desc}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Section - 주최 및 스폰서 */}
      <section className="pt-20 pb-0 bg-brand-main/30">
        <div className="text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div
              className="text-center transition-transform duration-500 ease-out"
              style={{
                transform: `scale(${getSectionScale(3)})`,
              }}
            >
              <h2 className="text-4xl font-bold text-white mb-2">주최 및 후원</h2>
              <SectionDivider />
            </div>
            <div className="h-4" />
          </div>

          <div className="space-y-12">
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-xl font-semibold text-brand-point mb-4">주최</h3>
              <img src="/logo-white.svg" alt="UNIDEV 로고" className="mx-auto h-16 w-auto mb-4 opacity-90" />
              <p className="text-3xl font-bold text-white mb-2">UNIDEV</p>
              <p className="text-brand-highlight mb-4 tracking-wide">대학생 개발자 커뮤니티</p>
              <p className="text-sm text-brand-highlight/80 max-w-5xl mx-auto tracking-wide">
                2023년부터 대학생 개발자들의 성장과 네트워킹을 지원하며, 매년 혁신적인 프로젝트들을 발굴하고 전시하는
                플랫폼을 제공하고 있습니다.
              </p>
            </div>

            <div>
              <div className="max-w-4xl mx-auto px-4 mb-6">
                <h3 className="text-xl font-semibold text-brand-point">파트너 및 후원</h3>
              </div>
              <div className="w-full bg-brand-main/30 border-y border-brand-point/30 overflow-hidden py-8 sponsor-logos">
                <div className="relative">
                  <div className="flex animate-marquee-seamless space-x-12 items-center">
                    {/* 첫 번째 세트 */}
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/BI_kr.png" alt="BI 로고" className="max-h-12 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/KOG-LOGO_PNG.png" alt="KOG 로고" className="max-h-13 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/KRAFTON_Black.png" alt="KRAFTON 로고" className="max-h-8 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/NEOWIZ_CI_FullColor(Horizontal).png"
                        alt="NEOWIZ 로고"
                        className="max-h-14 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/concon.png"
                        alt="Contents Universe 로고"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/aigame.png" alt="AI GAME 로고" className="max-h-12 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/EA_Korea.png"//  todo : should be modified to Devsisterslogo
                        alt="EA Korea 로고"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/Devsisters.png"  //  todo : should be modified to Devsisters logo
                        alt="Devsisters 로고"
                        className="max-h-8 max-w-full object-contain"
                      />
                    </div>

                    {/* 두 번째 세트 (완전한 복제) */}
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/BI_kr.png" alt="BI 로고" className="max-h-12 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/KOG-LOGO_PNG.png" alt="KOG 로고" className="max-h-13 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/KRAFTON_Black.png" alt="KRAFTON 로고" className="max-h-8 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/NEOWIZ_CI_FullColor(Horizontal).png"
                        alt="NEOWIZ 로고"
                        className="max-h-14 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/concon.png"
                        alt="Contents Universe 로고"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img src="/aigame.png" alt="AI GAME 로고" className="max-h-12 max-w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/EA_Korea.png"//  todo : should be modified to Devsisterslogo
                        alt="EA Korea 로고"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center h-16 min-w-[120px] flex-shrink-0">
                      <img
                        src="/Devsisters.png"  //  todo : should be modified to Devsisters logo
                        alt="Devsisters 로고"
                        className="max-h-8 max-w-full object-contain"
                      />
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 베터그라운드 University 지원 문구 */}
          <div className="mx-auto mt-16">
            <p className="text-base md:text-2xl text-[#8a7a6d] text-center leading-relaxed">
              본 웹페이지는 KRAFTON과 점프가 함께하는 대학 게임 제작 동아리 지원 프로그램 '베터그라운드 University' 지원으로 제작되었습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
