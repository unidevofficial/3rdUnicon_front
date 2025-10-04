import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "참가 작품 | UNICON 2025",
  description: "출품작 리스트와 참가팀 소개",
}

export default function ParticipantsLayout({ children }: { children: React.ReactNode }) {
  return children
}
