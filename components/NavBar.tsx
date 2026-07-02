'use client'
import Link from 'next/link'

export default function NavBar({ subtitle = 'Trade, Industry & Tourism Bureau' }: { subtitle?: string }) {
  return (
    <nav className="sticky top-0 z-50 glass-dark" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <img src="/harari-logo.svg" alt="Harari Emblem" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Harari PCC Portal</p>
            <p className="text-xs" style={{ color: 'rgba(201,168,76,0.7)' }}>{subtitle}</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/verify" className="nav-link">Verify</Link>
          <Link href="/login" className="nav-link">Login</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Sign In</Link>
          <Link href="/register" className="btn btn-gold text-sm px-5">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}
