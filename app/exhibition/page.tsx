import Image from "next/image"
import { Megaphone } from "lucide-react"
import { SectionDivider } from "@/components/section-divider"
import ImageModal from "@/components/ui/image-modal"

export const metadata = {
  title: "전시회 | UNICON 2025",
  description: "UNICON 2025 전시회 일정, 부스 배치도, 프로그램",
}

export default function ExhibitionPage() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Hero - unified style */}
      <section className="relative -mt-16 md:-mt-24 h-[420px] md:h-[560px] w-full overflow-hidden">
        <Image
          src="/background.png"
          alt="배경"
          fill
          priority
          className="object-cover object-center opacity-80 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-[#0B1038] pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-point drop-shadow-md">전시회</h1>
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
        </div>
      </section>

      {/* Program Schedule Section - 행사 프로그램 일정표 추가 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">행사 프로그램 일정표</h2>
            <SectionDivider />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-point/30 bg-brand-main/40 backdrop-blur-sm rounded-xl ">
            {[
              { time: "08:30 ~ 09:30", event: "부스 준비" },
              { time: "09:30 ~ 10:00", event: "개회식" },
              { time: "11:00 ~ 17:00", event: "시연행사" },
              { time: "17:00 ~ 18:00", event: "시상 및 폐회식" },
            ].map((schedule, index) => (
              <div key={index} className="p-6 text-center hover:bg-brand-main/20 transition-colors duration-300">
                <div className="mx-auto w-8 h-8 relative flex items-center justify-center">
                  <div className="absolute w-6 h-6 border-2 border-brand-point rotate-45 opacity-90"></div>
                  <div className="absolute w-3 h-3 border border-brand-point rotate-45 opacity-90"></div>
                  <div className="absolute w-0 h-px bg-brand-point border-1 border-brand-point group-hover:w-14 transition-all duration-500 ease-out origin-center"></div>
                </div>
                <div className="text-xl font-bold text-white mb-2 mt-10">{schedule.time}</div>
                <div className="text-brand-highlight">{schedule.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BoothLayout Section - 부스 배치도 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">부스 배치도</h2>
            <SectionDivider />
          </div>
          <div className=" bg-brand-main/40 border-y border-brand-point/30 p-6 backdrop-blur-sm">
            <div className="w-full rounded-lg overflow-hidden bg-brand-main/20 flex items-center justify-center">
              <ImageModal src="/booth_updated.jpeg" alt="부스 배치도" className="w-4/5 h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 tracking-wider">프로그램 안내</h2>
          <div className="bg-brand-main/40  overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-point/30">
              {[
                { title: "게임 시연", desc: "전국 대학생 게임 개발 동아리 팀들의 80여 종 게임 체험" },
                { title: "개회식", desc: "제3회 UNICON 공식 개막 행사" },
                { title: "시상식", desc: "우수 작품 시상 및 폐회식" },
              ].map((p) => (
                <div key={p.title} className="p-6 hover:bg-brand-main/20 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-white mb-2 pretendard-bold">{p.title}</h3>
                  <p className="text-brand-highlight text-sm">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - 참가업체 및 동아리 바로가기 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-3 text-brand-highlight mb-4">
            <Megaphone className="h-5 w-5 text-brand-point" />
            <span>참가팀과 출품작을 만나보세요</span>
          </div>
          <a
            href="/participants"
            className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-brand-sub text-white hover:bg-brand-sub/80 transition-colors mt-4"
          >
            참가작품 보러가기
          </a>
        </div>
      </section>
    </div>
  )
}
