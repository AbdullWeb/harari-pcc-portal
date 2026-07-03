'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router  = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      if (data.user.role === 'ADMIN')    router.push('/admin')
      else if (data.user.role === 'REVIEWER') router.push('/reviewer')
      else router.push('/dashboard')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{background:'#0f1729'}}>
      {/* Left panel - hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 harari-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{background:'radial-gradient(ellipse at 30% 50%, #c9a84c22, transparent 70%)'}} />
        <Link href="/" className="flex items-center gap-3 relative">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center" style={{background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)'}}>
            <img src="/harari-logo.svg" alt="Harari Emblem" style={{width:'40px',height:'40px',objectFit:'contain'}} />
          </div>
          <div><p className="font-bold text-white">Harari PCC Portal</p><p className="text-xs" style={{color:'rgba(201,168,76,0.7)'}}>Trade, Industry & Tourism Bureau</p></div>
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Welcome back<br/>to your portal</h2>
          <p className="text-lg mb-8" style={{color:'rgba(255,255,255,0.5)'}}>Manage your PCC applications, track status, and access your certificates all in one place.</p>
          <div className="space-y-3">
            {['Apply digitally, no office visits','Get processed in under 24 hours','Download your certificate instantly'].map(t=>(
              <div key={t} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full grad-gold flex items-center justify-center text-xs font-bold" style={{color:'#0f1729'}}>✓</div><span className="text-sm" style={{color:'rgba(255,255,255,0.65)'}}>{t}</span></div>
            ))}
          </div>
        </div>
        <p className="text-xs relative" style={{color:'rgba(255,255,255,0.3)'}}>© 2026 Harari People Regional State</p>
      </div>

      {/* Right panel - full width on mobile */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center" style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)'}}>
              <img src="/harari-logo.svg" alt="Harari Emblem" style={{width:'34px',height:'34px',objectFit:'contain'}} />
            </div>
            <span className="font-bold text-white">Harari PCC Portal</span>
          </div>

          <div className="rounded-2xl p-8" style={{background:'#1a2540', border:'1px solid rgba(201,168,76,0.15)'}}>
            <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
            <p className="text-sm mb-8" style={{color:'rgba(255,255,255,0.45)'}}>Enter your credentials to access your account</p>

            {error && (
              <div className="rounded-xl p-3 mb-6 text-sm flex items-center gap-2" style={{background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5'}}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" style={{color:'rgba(255,255,255,0.7)'}}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'rgba(201,168,76,0.5)'}} />
                  <input type="email" required value={email} onChange={e=>{setEmail(e.target.value);setError('')}}
                    className="input pl-10" style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white'}}
                    placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="label" style={{color:'rgba(255,255,255,0.7)'}}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'rgba(201,168,76,0.5)'}} />
                  <input type={show?'text':'password'} required value={password} onChange={e=>{setPassword(e.target.value);setError('')}}
                    className="input pl-10 pr-10" style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white'}}
                    placeholder="••••••••" />
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {show ? <EyeOff className="w-4 h-4" style={{color:'rgba(255,255,255,0.4)'}} /> : <Eye className="w-4 h-4" style={{color:'rgba(255,255,255,0.4)'}} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-gold w-full py-3 text-base mt-2">
                {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{color:'rgba(255,255,255,0.4)'}}>
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold hover:underline" style={{color:'#c9a84c'}}>Register here</Link>
            </p>

            {/* Demo accounts */}
            <div className="mt-6 pt-6" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <p className="text-xs text-center mb-3" style={{color:'rgba(255,255,255,0.3)'}}>DEMO ACCOUNTS</p>
              <div className="grid grid-cols-3 gap-2">
                {[['Applicant','applicant@demo.com'],['Reviewer','reviewer@demo.com'],['Admin','admin@demo.com']].map(([role,em])=>(
                  <button key={role} type="button"
                    onClick={()=>{setEmail(em);setPassword('password123');setError('')}}
                    className="rounded-lg py-2 px-2 text-xs font-medium transition text-center"
                    style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', color:'#c9a84c'}}>
                    {role}
                  </button>
                ))}
              </div>
              <p className="text-center text-xs mt-2" style={{color:'rgba(255,255,255,0.25)'}}>Click a role to auto-fill · password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
