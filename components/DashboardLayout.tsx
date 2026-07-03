'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, FilePlus, ShieldCheck, User, LogOut, Bell, Menu, X } from 'lucide-react'

interface Props {
  children: React.ReactNode
  userName?: string
  role?: string
}

const applicantLinks = [
  { href: '/dashboard', label: 'Dashboard',         icon: LayoutDashboard },
  { href: '/apply',     label: 'New Application',   icon: FilePlus },
  { href: '/verify',    label: 'Verify Certificate', icon: ShieldCheck },
  { href: '/profile',   label: 'My Profile',         icon: User },
]
const reviewerLinks = [
  { href: '/reviewer',  label: 'Review Queue',       icon: LayoutDashboard },
  { href: '/verify',    label: 'Verify Certificate', icon: ShieldCheck },
  { href: '/profile',   label: 'My Profile',         icon: User },
]
const adminLinks = [
  { href: '/admin',     label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/reviewer',  label: 'Review Queue',       icon: FilePlus },
  { href: '/verify',    label: 'Verify Certificate', icon: ShieldCheck },
  { href: '/profile',   label: 'My Profile',         icon: User },
]

export default function DashboardLayout({ children, userName = 'User', role = 'APPLICANT' }: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const links = role === 'ADMIN' ? adminLinks : role === 'REVIEWER' ? reviewerLinks : applicantLinks

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const currentLabel = links.find(l => l.href === pathname)?.label || 'Dashboard'

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
        <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <img src="/harari-logo.svg" alt="Harari Emblem" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Harari PCC</p>
            <p className="text-xs" style={{ color: 'rgba(201,168,76,0.6)' }}>Portal</p>
          </div>
        </Link>
        {/* Close button on mobile */}
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition">
          <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>
      </div>

      {/* User */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#a07c2e,#c9a84c)', color: '#0f1729' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <span className="badge badge-gold text-xs">{role}</span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${pathname === l.href ? 'active' : ''}`}>
            <l.icon className="w-4 h-4 flex-shrink-0" />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <button onClick={handleLogout} className="sidebar-link w-full text-left" style={{ color: 'rgba(239,68,68,0.8)' }}>
          <LogOut className="w-4 h-4 flex-shrink-0" /> Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f2f7' }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="fixed lg:static top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: '260px',
          background: '#0f1729',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          // On large screens always visible
        }}>
        {/* Large screen: always show */}
        <style>{`
          @media (min-width: 1024px) {
            aside { transform: translateX(0) !important; position: relative !important; }
          }
        `}</style>
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 w-full">

        {/* Top bar */}
        <header className="bg-white border-b px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30"
          style={{ borderColor: '#e2e8f0' }}>
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-gray-100"
              style={{ border: '1px solid #e2e8f0' }}>
              <Menu className="w-5 h-5" style={{ color: '#0f1729' }} />
            </button>
            <div>
              <h1 className="font-bold text-base md:text-lg leading-tight" style={{ color: '#0f1729' }}>
                {currentLabel}
              </h1>
              <p className="text-xs hidden md:block" style={{ color: '#94a3b8' }}>
                Harari PCC Portal · {role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
              style={{ border: '1px solid #e2e8f0' }}>
              <Bell className="w-4 h-4" style={{ color: '#64748b' }} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#a07c2e,#c9a84c)', color: '#0f1729' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
