"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionDivider } from "@/components/section-divider"

export default function EventOverviewPage() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section - unified style */}
      <section className="relative -mt-16 md:-mt-24 h-[420px] md:h-[560px] w-full overflow-hidden">
        <Image
          src="/background.png"
          alt="배경"
          fill
          priority
          className="object-cover object-center opacity-80 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-[#0B1038] pointer-events-none" />
        <div className="absolute top-[100px] md:top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-point drop-shadow-md">행사 개요</h1>
          <div
            aria-hidden
            className="mx-auto w-40 md:w-56 h-6 mt-3"
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>2025.11.01</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>고양꽃전시관 Contents Universe Korea 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>10:00 - 18:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">행사 일정표</h2>
            <SectionDivider />
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-point/60 transform md:-translate-x-px"></div>

            <div className="space-y-8">
              <div className="relative flex items-center">
                {/* 왼쪽 카드용 구분선: <><>------ */}
                <div className="absolute left-8 md:left-0 md:w-1/2 flex items-center">
                  <div className="w-10 h-8 relative flex items-center justify-start">
                    
                  </div>
                  <div className="flex-1 h-px bg-brand-point/60"></div>
                </div>

                <div className="ml-16 w-[calc(100%-5rem)] md:ml-0 md:w-1/2 md:pr-8">
                  <div className="bg-gradient-to-br from-brand-main/60 to-brand-main/40 border-y border-brand-point/30 backdrop-blur-sm hover:from-brand-main/70 hover:to-brand-main/50 transition-all duration-300 hover:scale-105  p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-brand-point" />
                      <span className="text-2xl font-bold text-brand-point">08:30 ~ 09:30</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">부스 준비</h3>
                    <p className="text-brand-highlight text-sm">참가팀들의 부스 설치 및 최종 점검 시간</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center md:justify-end">
                {/* 오른쪽 카드용 구분선: ------<><> */}
                <div className="absolute left-8 md:left-1/2 md:w-1/2 flex items-center">
                  <div className="flex-1 h-px bg-brand-point/60"></div>
                  <div className="w-10 h-8 relative flex items-center justify-end">
                    
                  </div>
                </div>

                <div className="ml-16 w-[calc(100%-5rem)] md:ml-0 md:w-1/2 md:pl-8">
                  <div className="bg-gradient-to-br from-brand-main/60 to-brand-main/40 border-y border-brand-point/30 backdrop-blur-sm hover:from-brand-main/70 hover:to-brand-main/50 transition-all duration-300 hover:scale-105 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-brand-point" />
                      <span className="text-2xl font-bold text-brand-point">09:30 ~ 10:00</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">개회식</h3>
                    <p className="text-brand-highlight text-sm">UNICON 2025 공식 개막 및 환영사</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                {/* 왼쪽 카드용 구분선: <><>------ */}
                <div className="absolute left-8 md:left-0 md:w-1/2 flex items-center">
                  <div className="w-10 h-8 relative flex items-center justify-start">
                    
                  </div>
                  <div className="flex-1 h-px bg-brand-point/60"></div>
                </div>

                <div className="ml-16 w-[calc(100%-5rem)] md:ml-0 md:w-1/2 md:pr-8">
                  <div className="bg-gradient-to-br from-brand-main/60 to-brand-main/40 border-y border-brand-point/30 backdrop-blur-sm hover:from-brand-main/70 hover:to-brand-main/50 transition-all duration-300 hover:scale-105 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-brand-point" />
                      <span className="text-2xl font-bold text-brand-point">11:00 ~ 17:00</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">시연행사</h3>
                    <p className="text-brand-highlight text-sm">참가작품 전시 및 체험, 방문객과의 소통 시간</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center md:justify-end">
                {/* 오른쪽 카드용 구분선: ------<><> */}
                <div className="absolute left-8 md:left-1/2 md:w-1/2 flex items-center">
                  <div className="flex-1 h-px bg-brand-point/60"></div>
                  <div className="w-10 h-8 relative flex items-center justify-end">
                    
                  </div>
                </div>

                <div className="ml-16 w-[calc(100%-5rem)] md:ml-0 md:w-1/2 md:pl-8">
                  <div className="bg-gradient-to-br from-brand-main/60 to-brand-main/40 border-y border-brand-point/30 backdrop-blur-sm hover:from-brand-main/70 hover:to-brand-main/50 transition-all duration-300 hover:scale-105 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-brand-point" />
                      <span className="text-2xl font-bold text-brand-point">17:00 ~ 18:00</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">시상 및 폐회식</h3>
                    <p className="text-brand-highlight text-sm">우수작품 시상식 및 UNICON 2025 폐막</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">행사 위치</h2>
            <SectionDivider />
            <div className="mt-4 text-center text-brand-white text-sm">주소: 경기도 고양시 일산동구 고양꽃전시관</div>
          </div>
          <div className="bg-brand-main border-y border-brand-point/30 p-6 backdrop-blur-sm">
            <div className="w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] mx-auto overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3158.803493282103!2d126.76627807681591!3d37.653823672016046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c854654af619d%3A0x14ddecc7b303eb0!2z6rOg7JaRIOq9g-yghOyLnOq0gA!5e0!3m2!1sko!2skr!4v1758609022728!5m2!1sko!2skr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="고양꽃전시관 위치 지도"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-wider">주최 및 스폰서</h2>
          <SectionDivider />
          <div className="space-y-6 border-y border-brand-point/30">
            <div className="bg-brand-main/30 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-brand-point mb-4">주최</h3>
              <div className="flex justify-center">
                <img src="/logo-white.svg" alt="Contents Universe 2025" className="h-12 w-auto" />
              </div>
            </div>

            <div className="bg-brand-main/30 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-brand-point mb-4">파트너</h3>
              <div className="flex justify-center">
                <a
                  href="https://contentsuniverse.com/kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/concon.png"
                    alt="Contents Universe 2025"
                    className="h-12 w-auto filter brightness-0 invert"
                  />
                </a>
              </div>
            </div>
            <div className="bg-brand-main/30 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold  text-brand-point mb-4">후원</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-items-center">
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/BI_kr.png"
                    alt="BI 로고"
                    className="max-h-10 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/KOG-LOGO_PNG.png"
                    alt="KOG 로고"
                    className="max-h-12 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/KRAFTON_Black.png"
                    alt="KRAFTON 로고"
                    className="max-h-7 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/NEOWIZ_CI_FullColor(Horizontal).png"
                    alt="NEOWIZ 로고"
                    className="max-h-12 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/aigame.png"
                    alt="AI GAME 로고"
                    className="max-h-10 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/EA_Korea.png"
                    alt="EA Korea 로고"
                    className="max-h-10 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="flex items-center justify-center h-12 w-full">
                  <img
                    src="/Devsisters.png"
                    alt="Devsisters 로고"
                    className="max-h-7 max-w-full object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-2 text-center">
        <Button asChild className="bg-brand-sub hover:bg-brand-sub/80 text-white ">
          <Link href="/exhibition" className="inline-flex items-center gap-2 justify-center">
            전시 프로그램 보러가기 <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
