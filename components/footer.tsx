import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-fantasy-deep border-t border-fantasy-shadow mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-fantasy-starlight font-semibold text-sm">바로가기</h3>
            <div className="space-y-2">
              <Link
                href="/event"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                행사 개요
              </Link>
              <Link
                href="/exhibition"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                전시회
              </Link>
              <Link
              href="/participants"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                참가 작품
              </Link>
              <Link
                href="/about"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                UNIDEV 소개
              </Link>
              <Link
                href="/inquiry"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                문의
              </Link>
              <Link
                href="/admin"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                사이트관리자
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-fantasy-starlight font-semibold text-sm">후원사</h3>
            <div className="space-y-2">
              <a
                href="https://com2us.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                Com2uS
              </a>
              <a
                href="https://kog.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                KOG
              </a>
              <a
                href="https://krafton.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                KRAFTON
              </a>
              <a
                href="https://neowiz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                NEOWIZ
              </a>
              <a
                href="https://www.thebackend.io"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                뒤끝
              </a>
              <a
                href="https://k-indiegame.or.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                한국인공지능게임협회
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-fantasy-starlight font-semibold text-sm">파트너</h3>
            <div className="space-y-2">
              <a
                href="https://contentsuniverse.com/kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-fantasy-ethereal hover:text-[#ffeeb5] transition-colors text-sm "
              >
                Contents Universe Korea 2025
              </a>
            </div>
          </div>
          

          <div className="space-y-4">
            <div className="flex flex-col items-end space-y-4">
              <div className="flex justify-end">
                <img src="/logo-white.svg" alt="UNIDEV Logo" className="h-12 w-auto" />
              </div>
              <div className="text-right">
                <div className="text-fantasy-starlight font-bold text-lg no-pretendard mb-2">UNIDEV</div>
                <div className="text-fantasy-ethereal text-sm mb-3">이메일 : officialunidev@gmail.com</div>
                <div className="flex gap-3 justify-end">
                  <a
                    href="http://pf.kakao.com/_LxgSvn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img src="/kakaotalk-logo-svgrepo-com.svg" alt="카카오 채널" className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/unidev.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img src="/instagram-svgrepo-com.svg" alt="인스타그램" className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div> 
        </div>

        <div className="border-t border-fantasy-shadow mt-8 pt-8 flex justify-between items-center text-sm text-fantasy-ethereal">
          <div>Powered by KRAFTON</div>
          <div>© 2025 UNIDEV. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  )
}
