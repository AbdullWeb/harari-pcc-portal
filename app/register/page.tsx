'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'', nationalId:'',
    password:'', confirmPassword:'', region:'Harari', woreda:'', kebele:''
  })
  const set = (k:string, v:string) => { setForm(f=>({...f,[k]:v})); setError('') }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setSuccess(true)
      setTimeout(()=>router.push('/login'), 2500)
    } catch (err:any) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:'#0f1729'}}>
      <div className="rounded-2xl p-10 text-center max-w-md w-full" style={{background:'#1a2540', border:'1px solid rgba(201,168,76,0.2)'}}>
        <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{background:'rgba(16,185,129,0.15)'}}>
          <CheckCircle className="w-10 h-10" style={{color:'#10b981'}} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
        <p style={{color:'rgba(255,255,255,0.5)'}}>Redirecting you to the login page…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background:'#0f1729'}}>
      {/* Nav */}
      <nav className="px-6 py-4 border-b flex items-center justify-between" style={{borderColor:'rgba(201,168,76,0.15)'}}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)'}}>
            <img src="/harari-logo.svg" alt="Harari Emblem" style={{width:'34px',height:'34px',objectFit:'contain'}} />
          </div>
          <span className="font-bold text-white text-sm">Harari PCC Portal</span>
        </Link>
        <Link href="/" className="btn btn-ghost text-sm flex items-center gap-1" style={{color:'rgba(255,255,255,0.6)'}}><ArrowLeft className="w-4 h-4" /> Back</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p style={{color:'rgba(255,255,255,0.45)'}}>Register to start your PCC application</p>
        </div>

        {error && (
          <div className="rounded-xl p-3 mb-6 text-sm flex items-center gap-2" style={{background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5'}}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={submit} className="rounded-2xl p-8 space-y-6" style={{background:'#1a2540', border:'1px solid rgba(201,168,76,0.15)'}}>

          {/* Personal */}
          <div>
            <h3 className="font-bold mb-4 text-sm tracking-widest" style={{color:'#c9a84c'}}>PERSONAL INFORMATION</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[['firstName','First Name'],['lastName','Last Name']].map(([k,lbl])=>(
                <div key={k}>
                  <label className="label" style={{color:'rgba(255,255,255,0.6)'}}>{lbl} *</label>
                  <input required className="input" style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white'}} placeholder={lbl} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-sm tracking-widest" style={{color:'#c9a84c'}}>CONTACT & IDENTITY</h3>
            <div className="space-y-4">
              {[['email','Email Address','email'],['phone','Phone Number','tel'],['nationalId','National ID Number','text']].map(([k,lbl,type])=>(
                <div key={k}>
                  <label className="label" style={{color:'rgba(255,255,255,0.6)'}}>{lbl} *</label>
                  <input required type={type} className="input" style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white'}} placeholder={lbl} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-bold mb-4 text-sm tracking-widest" style={{color:'#c9a84c'}}>ADDRESS</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label" style={{color:'rgba(255,255,255,0.6)'}}>Region</label>
                <input readOnly className="input" style={{background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)'}} value="Harari" />
              </div>
              {[['woreda','Woreda *'],['kebele','Kebele']].map(([k,lbl])=>(
                <div key={k}>
                  <label className="label" style={{color:'rgba(255,255,255,0.6)'}}>{lbl}</label>
                  <input className="input" style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white'}} placeholder={lbl.replace(' *','')} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <h3 className="font-bold mb-4 text-sm tracking-widest" style={{color:'#c9a84c'}}>SECURITY</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[['password','Password'],['confirmPassword','Confirm Password']].map(([k,lbl])=>(
                <div key={k}>
                  <label className="label" style={{color:'rgba(255,255,255,0.6)'}}>{lbl} *</label>
                  <input required type="password" minLength={8} className="input" style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white'}} placeholder="Min 8 characters" value={(form as any)[k]} onChange={e=>set(k,e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-gold w-full py-3 text-base">
            {loading ? 'Creating Account…' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>

          <p className="text-center text-sm" style={{color:'rgba(255,255,255,0.4)'}}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{color:'#c9a84c'}}>Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
