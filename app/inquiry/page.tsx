"use client"

import type React from "react"

import Image from "next/image"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown, Mail, Phone, Twitter, Facebook, Instagram } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SectionDivider } from "@/components/section-divider"

const faqs: Array<{ q: string; a: string }> = [
  {
    q: "제3회 UNICON은 언제, 어디서 열리나요?",
    a: "2025년 11월 1일, 고양꽃전시관 Contents Universe Korea 2025 행사장에서 개최됩니다.",
  },
  { q: "누구나 관람할 수 있나요?", a: "네. UNIDEV 회원뿐 아니라 일반 관람객도 누구나 자유롭게 참여하실 수 있습니다." },
  {
    q: "입장료가 존재하나요?",
    a: "입장료는 없습니다. 누구나 무료로 자유롭게 관람 가능합니다.",
  },
  {
    q: "행사에서는 무엇을 체험할 수 있나요?",
    a: "전국 대학생 게임 개발 동아리 팀들이 직접 제작한 80여 종의 게임이 전시됩니다. 관람객은 현장에서 게임을 자유롭게 시연하고 플레이 체험을 즐기실 수 있습니다.",
  },
]

export default function InquiryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    type: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.company,
          title: form.subject,
          content: form.message,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || "문의 접수에 실패했습니다.")
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.message || "문제가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero */}
      <section className="relative -mt-16 md:-mt-24 h-[420px] md:h-[560px] w-full overflow-hidden">
        <Image
          src="/background.png"
          alt="문의 배경"
          fill
          priority
          className="object-cover object-center opacity-80 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-60% to-[#0B1038] pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-point drop-shadow-md">문의</h1>
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
          <p className="mt-6 max-w-3xl text-white/90 text-sm md:text-base leading-relaxed font-hero">
            제3회 UNICON에 대한 궁금한 점이나 제안사항이 있으시면 언제든지 연락해 주세요.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">자주 묻는 질문</h2>
            <SectionDivider />
            <p className="mt-2 text-[#A9D7FF] tracking-wide">제3회 UNICON에 대해 궁금한 점들을 확인해보세요.</p>
          </div>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-0">
              <Accordion.Root type="single" collapsible className="divide-y divide-white/10">
                {faqs.map((item, idx) => (
                  <Accordion.Item key={item.q} value={`item-${idx}`} className="group">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-5 text-white hover:bg-white/5 transition-colors">
                        <span className="font-medium">{item.q}</span>
                        <ChevronDown className="h-5 w-5 text-white/80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="px-5 pb-4 md:px-6 md:pb-5 text-[#A9D7FF] text-sm leading-relaxed">
                      {item.a}
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inquiry Form Section - placed after FAQ */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Contact Info */}
          <Card className="bg-brand-main/40 border-brand-sub/20 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-white">연락처 정보</h3>
              <div className="space-y-4 text-brand-highlight">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand-point mt-0.5" />
                  <div>
                    <div className="text-white/90">이메일</div>
                    <a href="mailto:officialunidev@gmail.com" className="text-sm hover:underline">
                    officialunidev@gmail.com
                    </a>
                  </div>
                </div>
                
              </div>
              <div>
                <div className="text-white/90 mb-2">SNS</div>
                <div className="flex items-center gap-3 text-brand-highlight">
                  
                  <a href="https://www.instagram.com/unidev.official" aria-label="Instagram" className="hover:text-brand-point">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Form */}
          <Card className="md:col-span-2 bg-brand-main/40 border-brand-sub/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">문의 남기기</h2>
              {submitted ? (
                <div className="text-brand-highlight">문의가 접수되었습니다. 확인 후 연락드리겠습니다.</div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-300" role="alert">{error}</div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/90 mb-1">이름 *</label>
                      <input
                        type="text"
                        placeholder="성함을 입력해주세요"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-11 px-3 rounded-md bg-white/5 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/90 mb-1">이메일 *</label>
                      <input
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-11 px-3 rounded-md bg-white/5 border border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/90 mb-1">전화번호 *</label>
                    <input
                      type="text"
                      placeholder="010-1234-5678"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full h-11 px-3 rounded-md bg-white/5 border border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/90 mb-1">제목 *</label>
                    <input
                      type="text"
                      placeholder="문의 제목을 입력해주세요"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full h-11 px-3 rounded-md bg-white/5 border border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/90 mb-1">내용 *</label>
                    <textarea
                      placeholder="문의 내용을 자세히 입력해주세요"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-brand-sub hover:bg-brand-sub/80 text-white" disabled={loading}>
                    {loading ? "전송 중..." : "문의 보내기"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
