'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, FilePlus, ShieldCheck, User, LogOut, Bell } from 'lucide-react'

interface Props {
  children: React.ReactNode
  userName?: string
  role?: string
}

const applicantLinks = [
  { href: '/dashboard', label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/apply',     label: 'New Application', icon: FilePlus },
  { href: '/verify',    label: 'Verify Certificate', icon: ShieldCheck },
  { href: '/profile',   label: 'My Profile',      icon: User },
]
const reviewerLinks = [
  { href: '/reviewer',  label: 'Review Queue',       icon: LayoutDashboard },
  { href: '/verify',    label: 'Verify Certificate', icon: ShieldCheck },
  { href: '/profile',   label: 'My Profile',         icon: User },
]
const adminLinks = [
  { href: '/admin',     label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/reviewer',  label: 'Review Queue',        icon: FilePlus },
  { href: '/verify',    label: 'Verify Certificate',  icon: ShieldCheck },
  { href: '/profile',   label: 'My Profile',          icon: User },
]

export default function DashboardLayout({ children, userName = 'User', role = 'APPLICANT' }: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  const links = role === 'ADMIN' ? adminLinks : role === 'REVIEWER' ? reviewerLinks : applicantLinks

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f2f7' }}>
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: '#0f1729', minHeight: '100vh' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.15)' }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <img src="/harari-logo.svg" alt="Harari Emblem" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Harari PCC</p>
              <p className="text-xs" style={{ color: 'rgba(201,168,76,0.6)' }}>Portal</p>
            </div>
          </Link>
        </div>

        {/* User */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full grad-gold flex items-center justify-center font-bold text-sm" style={{ color: '#0f1729' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[120px]">{userName}</p>
              <span className="badge badge-gold text-xs">{role}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`sidebar-link ${pathname === l.href ? 'active' : ''}`}>
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <button onClick={handleLogout} className="sidebar-link w-full text-left" style={{ color: 'rgba(239,68,68,0.8)' }}>
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10" style={{ borderColor: '#e2e8f0' }}>
          <div>
            <h1 className="font-bold text-lg" style={{ color: '#0f1729' }}>
              {links.find(l => l.href === pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Harari PCC Portal · {role}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition" style={{ border: '1px solid #e2e8f0' }}>
              <Bell className="w-4 h-4" style={{ color: '#64748b' }} />
            </button>
            <div className="w-9 h-9 rounded-full grad-gold flex items-center justify-center font-bold text-sm" style={{ color: '#0f1729' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
