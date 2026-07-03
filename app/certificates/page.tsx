'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { Award, Download, RefreshCw, ShieldCheck } from 'lucide-react'

export default function CertificatesPage() {
  const router = useRouter()
  const [user,    setUser]    = useState<any>(null)
  const [apps,    setApps]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { init() }, [])

  const init = async () => {
    setLoading(true)
    const meRes = await fetch('/api/auth/me')
    if (meRes.status === 401) { router.push('/login'); return }
    setUser((await meRes.json()).user)
    const appsRes = await fetch('/api/applications')
    const data = await appsRes.json()
    // Only show apps that have certificates
    const withCerts = (data.applications || []).filter((a: any) => a.certificate)
    setApps(withCerts)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/>
    </div>
  )

  return (
    <DashboardLayout userName={user ? `${user.firstName} ${user.lastName}` : '…'} role={user?.role||'APPLICANT'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{color:'#0f1729'}}>My Certificates</h2>
          <p className="text-sm mt-1" style={{color:'#64748b'}}>Download and manage your issued PCC certificates</p>
        </div>
        <button onClick={init} className="btn btn-outline text-sm flex items-center gap-2 self-start">
          <RefreshCw className="w-3 h-3"/> Refresh
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-16 h-16 mx-auto mb-4" style={{color:'#e2e8f0'}}/>
          <h3 className="font-bold text-lg mb-2" style={{color:'#64748b'}}>No Certificates Yet</h3>
          <p className="text-sm mb-6" style={{color:'#94a3b8'}}>
            Submit an application and get approved to receive your certificate.
          </p>
          <Link href="/apply" className="btn btn-primary">Apply for PCC</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {apps.map((app: any) => (
            <div key={app.id} className="card overflow-hidden group hover:shadow-xl transition-all">
              {/* Gold top strip */}
              <div className="h-2 -mx-6 -mt-6 mb-5" style={{background:'linear-gradient(90deg,#a07c2e,#c9a84c,#e4c97a,#c9a84c,#a07c2e)'}}/>

              {/* Logo + title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)'}}>
                  <img src="/harari-logo.svg" alt="Emblem" style={{width:'44px',height:'44px',objectFit:'contain'}}/>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wide" style={{color:'#64748b'}}>HARARI PCC PORTAL</p>
                  <p className="text-xs" style={{color:'#94a3b8'}}>Professional Competence Certificate</p>
                </div>
              </div>

              {/* Cert details */}
              <div className="mb-4 space-y-2">
                <div>
                  <p className="text-xs" style={{color:'#94a3b8'}}>Certificate Number</p>
                  <p className="font-mono text-sm font-bold" style={{color:'#0f1729'}}>{app.certificate.certificateNumber}</p>
                </div>
                <div>
                  <p className="text-xs" style={{color:'#94a3b8'}}>Business Name</p>
                  <p className="font-semibold text-sm" style={{color:'#0f1729'}}>{app.businessName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs" style={{color:'#94a3b8'}}>Sector</p>
                    <p className="text-sm font-medium" style={{color:'#0f1729'}}>{app.businessSector}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{color:'#94a3b8'}}>Issued</p>
                    <p className="text-sm font-medium" style={{color:'#0f1729'}}>
                      {new Date(app.certificate.issuedAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg" style={{background:'rgba(16,185,129,0.08)'}}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{color:'#10b981'}}/>
                <span className="text-xs font-semibold" style={{color:'#10b981'}}>Valid & Active Certificate</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Link href={`/certificate/${app.certificate.certificateNumber}`}
                  className="btn btn-gold flex-1 text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4"/> Download
                </Link>
                <Link href="/verify" className="btn btn-outline text-sm flex items-center justify-center gap-2 px-3">
                  <ShieldCheck className="w-4 h-4"/>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to download info */}
      {apps.length > 0 && (
        <div className="mt-8 card" style={{background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.2)'}}>
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{color:'#0f1729'}}>
            <Download className="w-4 h-4" style={{color:'#c9a84c'}}/>
            How to Download as PDF
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {n:'1', text:'Click the "Download" button on your certificate'},
              {n:'2', text:'Click the "Download PDF" or "Print" button'},
              {n:'3', text:'In the print dialog, select "Save as PDF" → Save'},
            ].map(s=>(
              <div key={s.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{background:'#c9a84c',color:'#0f1729'}}>{s.n}</div>
                <p className="text-sm" style={{color:'#64748b'}}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
