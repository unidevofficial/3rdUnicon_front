import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "UNIDEV 소개 | UNICON 2025",
  description: "UNIDEV 소개 및 SNS/외부 링크",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Hero - unified style */}
      <section className="relative -mt-16 md:-mt-24 h-[420px] md:h-[560px] w-full overflow-hidden">
        <Image
          src="/newBackground.jpg"
          alt="배경"
          fill
          priority
          className="object-cover object-center opacity-80 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-[#0B1038] pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-point drop-shadow-md">
            UNIDEV 소개
          </h1>
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
          <p className="text-white max-w-3xl mx-auto mt-6 font-hero">
            성장과 네트워킹을 돕는 대학생 커뮤니티입니다.
          </p>
        </div>
      </section>

      {/* UNIDEV Image Section */}
      {/* <section className="max-w-5xl mx-auto px-4 py-16">
        <Card className="bg-brand-main/40 border-brand-sub/20 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center justify-center">
            <img src="/UNIDEV.png" alt="UNIDEV 로고" className="max-w-full h-auto" />
          </CardContent>
        </Card>
      </section> */}

      {/* UNIDEV Information Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-brand-main/40 border border-brand-main/40 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-brand-point/30">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-brand-point mb-2">
                  UNIDEV
                </h2>
                <p className="text-brand-highlight text-lg">
                  대학생 개발자 커뮤니티
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    설립 목적
                  </h3>
                  <p className="text-brand-highlight leading-relaxed">
                    2023년부터 대학생 개발자들의 성장과 네트워킹을 지원하며,
                    매년 혁신적인 프로젝트들을 발굴하고 전시하는 플랫폼을
                    제공하고 있습니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    주요 활동
                  </h3>
                  <ul className="space-y-2 text-brand-highlight">
                    <li className="flex items-start">
                      <span className="text-brand-point mr-2">•</span>
                      <span>
                        전국 대학생 게임 개발 동아리 연합 전시회 UNICON 개최
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-point mr-2">•</span>
                      <span>
                        전국 대학생 게임 개발 동아리 연합 게임잼 UNIJAM 개최
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-point mr-2">•</span>
                      <span>대학생 게임 개발자 네트워킹 및 커뮤니티 운영</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-point mr-2">•</span>
                      <span>멘토링 프로그램, 스터디 및 세미나 운영</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    비전
                  </h3>
                  <p className="text-brand-highlight leading-relaxed">
                    대학생 개발자들이 자신의 아이디어를 현실로 만들고, 동료들과
                    함께 성장할 수 있는 생태계를 구축합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    성과
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-brand-main/20 rounded-lg">
                      <div className="text-2xl font-bold text-brand-point">
                        150+
                      </div>
                      <div className="text-sm text-brand-highlight">
                        UNICON 출품작 수
                      </div>
                    </div>
                    <div className="text-center p-4 bg-brand-main/20 rounded-lg">
                      <div className="text-2xl font-bold text-brand-point">
                        25+
                      </div>
                      <div className="text-sm text-brand-highlight">
                        UNIJAM 작품 수
                      </div>
                    </div>
                    <div className="text-center p-4 bg-brand-main/20 rounded-lg">
                      <div className="text-2xl font-bold text-brand-point">
                        25
                      </div>
                      <div className="text-sm text-brand-highlight">
                        소속 동아리
                      </div>
                    </div>
                    <div className="text-center p-4 bg-brand-main/20 rounded-lg">
                      <div className="text-2xl font-bold text-brand-point">
                        1300+
                      </div>
                      <div className="text-sm text-brand-highlight">
                        커뮤니티 멤버
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section - 소개 */}

      {/* Link Section - 외부 링크 */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h3 className="text-xl font-semibold text-white mb-4">외부 링크</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-brand-point/30">
          {[
            { label: "공식 사이트", href: "https://unidev.kr" },
            { label: "카카오톡 채널", href: "http://pf.kakao.com/_LxgSvn" },
            {
              label: "Instagram",
              href: "https://www.instagram.com/unidev.official",
            },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center justify-between px-8 py-6 text-brand-highlight hover:bg-brand-main/20 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{l.label}</span>
              <ExternalLink className="h-4 w-4 text-brand-point" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
