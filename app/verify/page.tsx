'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star, Search, CheckCircle, XCircle, ArrowLeft, Building2, Calendar, Hash } from 'lucide-react'

export default function VerifyPage() {
  const [num, setNum]       = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<any>(null)
  const [error,   setError]   = useState('')

  const verify = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setResult(null); setLoading(true)
    try {
      const res  = await fetch(`/api/certificates/verify?number=${encodeURIComponent(num)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Not found')
      setResult(data)
    } catch (err:any) { setError(err.message) }
    finally { setLoading(false) }
  }

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

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl grad-gold flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" style={{color:'#0f1729'}} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificate Verification</h1>
          <p style={{color:'rgba(255,255,255,0.45)'}}>Enter a certificate number to verify its authenticity — no login required.</p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl p-8 mb-6" style={{background:'#1a2540', border:'1px solid rgba(201,168,76,0.15)'}}>
          <form onSubmit={verify} className="space-y-4">
            <div>
              <label className="label" style={{color:'rgba(255,255,255,0.6)'}}>Certificate Number</label>
              <input className="input text-lg font-mono" required value={num} onChange={e=>setNum(e.target.value)}
                style={{background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white', letterSpacing:'0.05em'}}
                placeholder="HRS-PCC-CERT-2026-0001" />
              <p className="text-xs mt-2" style={{color:'rgba(255,255,255,0.3)'}}>Format: HRS-PCC-CERT-YYYY-XXXX</p>
            </div>
            <button type="submit" disabled={loading} className="btn btn-gold w-full py-3 text-base">
              {loading ? 'Verifying…' : <><Search className="w-4 h-4" /><span>Verify Certificate</span></>}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl p-6 flex items-start gap-4" style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)'}}>
            <XCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{color:'#ef4444'}} />
            <div>
              <h3 className="font-bold mb-1" style={{color:'#fca5a5'}}>Certificate Not Found</h3>
              <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>{error}</p>
            </div>
          </div>
        )}

        {/* Valid Result */}
        {result?.valid && (
          <div className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(16,185,129,0.3)'}}>
            {/* Header bar */}
            <div className="px-6 py-4 flex items-center gap-3" style={{background:'rgba(16,185,129,0.15)'}}>
              <CheckCircle className="w-6 h-6" style={{color:'#10b981'}} />
              <div>
                <h3 className="font-bold" style={{color:'#6ee7b7'}}>✓ Valid Certificate</h3>
                <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>This certificate is authentic and currently active</p>
              </div>
            </div>
            {/* Details */}
            <div className="p-6 space-y-4" style={{background:'#1a2540'}}>
              {[
                {icon:Hash,      label:'Certificate Number', value:result.certificate.certificateNumber, mono:true},
                {icon:Star,      label:'Holder Name',        value:result.certificate.holderName},
                {icon:Building2, label:'Business Name',      value:result.certificate.businessName},
                {icon:Building2, label:'Business Sector',    value:result.certificate.businessSector},
                {icon:Calendar,  label:'Issued On',          value:new Date(result.certificate.issuedAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})},
              ].map(row=>(
                <div key={row.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(201,168,76,0.12)'}}>
                    <row.icon className="w-4 h-4" style={{color:'#c9a84c'}} />
                  </div>
                  <div>
                    <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{row.label}</p>
                    <p className={`font-semibold text-white ${row.mono?'font-mono':''}`}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 text-center text-xs" style={{background:'rgba(201,168,76,0.08)', color:'rgba(255,255,255,0.4)'}}>
              Issued by: Harari Trade, Industry & Tourism Development Bureau
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 rounded-2xl p-6" style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'}}>
          <h3 className="font-semibold text-white mb-3 text-sm">About Verification</h3>
          <ul className="space-y-2">
            {['No login required — fully public endpoint','Checks certificate is genuine and currently valid','Banks & landlords can use this to verify credentials','Unique certificate numbers prevent forgery'].map(t=>(
              <li key={t} className="flex items-center gap-2 text-sm" style={{color:'rgba(255,255,255,0.45)'}}>
                <span className="text-xs" style={{color:'#c9a84c'}}>✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
