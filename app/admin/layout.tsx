export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="admin-root" className="min-h-dvh bg-white text-neutral-900 font-pretendard">
      {children}
    </div>
  )
}
