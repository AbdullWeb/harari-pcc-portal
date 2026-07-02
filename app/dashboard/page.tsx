'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { FilePlus, ShieldCheck, Clock, CheckCircle, FileText, ArrowRight, RefreshCw } from 'lucide-react'

const statusBadge: Record<string,string> = {
  DRAFT:'badge-draft', SUBMITTED:'badge-submitted', UNDER_REVIEW:'badge-review',
  APPROVED:'badge-approved', REJECTED:'badge-rejected', CERTIFICATE_ISSUED:'badge-issued'
}

interface User { id:string; firstName:string; lastName:string; email:string; role:string }
interface App  { id:string; businessName:string; businessSector:string; status:string; referenceNumber:string; submittedAt:string; certificate?:{ certificateNumber:string } }

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]   = useState<User|null>(null)
  const [apps, setApps]   = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => { init() }, [])

  const init = async () => {
    setLoading(true)
    try {
      const [meRes, appsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/applications'),
      ])
      if (meRes.status === 401) { router.push('/login'); return }
      const meData   = await meRes.json()
      const appsData = await appsRes.json()
      setUser(meData.user)
      setApps(appsData.applications || [])
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="text-center"><div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}} /><p style={{color:'#64748b'}}>Loading…</p></div>
    </div>
  )

  const stats = [
    { label:'Total',        value: apps.length,                                                           color:'#c9a84c', bg:'rgba(201,168,76,0.1)' },
    { label:'Under Review', value: apps.filter(a=>a.status==='UNDER_REVIEW').length,                      color:'#f59e0b', bg:'rgba(245,158,11,0.1)' },
    { label:'Approved',     value: apps.filter(a=>['APPROVED','CERTIFICATE_ISSUED'].includes(a.status)).length, color:'#10b981', bg:'rgba(16,185,129,0.1)' },
    { label:'Rejected',     value: apps.filter(a=>a.status==='REJECTED').length,                          color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  ]

  const firstName = user?.firstName || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardLayout userName={user ? `${user.firstName} ${user.lastName}` : '…'} role={user?.role || 'APPLICANT'}>
      {error && (
        <div className="rounded-xl p-3 mb-4 text-sm flex items-center gap-2" style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444'}}>
          ⚠ {error}
          <button onClick={init} className="ml-auto flex items-center gap-1 underline text-xs"><RefreshCw className="w-3 h-3" /> Retry</button>
        </div>
      )}

      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{color:'#0f1729'}}>{greeting}, {firstName} 👋</h2>
          <p className="text-sm mt-1" style={{color:'#64748b'}}>Here's an overview of your PCC applications</p>
        </div>
        <Link href="/apply" className="btn btn-primary flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> New Application
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s=>(
          <div key={s.label} className="card">
            <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center" style={{background:s.bg}}>
              <span className="text-2xl font-bold" style={{color:s.color}}>{s.value}</span>
            </div>
            <p className="text-sm font-medium" style={{color:'#0f1729'}}>{s.label} Applications</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { href:'/apply',   icon:FilePlus,    label:'New Application',    desc:'Start a new PCC application',    color:'#c9a84c', bg:'rgba(201,168,76,0.1)' },
          { href:'/verify',  icon:ShieldCheck, label:'Verify Certificate', desc:'Check any certificate number',   color:'#10b981', bg:'rgba(16,185,129,0.1)' },
          { href:'#',        icon:Clock,       label:'Track Status',       desc:'Check your application status',  color:'#3b82f6', bg:'rgba(59,130,246,0.1)' },
        ].map(a=>(
          <Link key={a.label} href={a.href} className="card group flex items-start gap-4 hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition" style={{background:a.bg}}>
              <a.icon className="w-5 h-5" style={{color:a.color}} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm" style={{color:'#0f1729'}}>{a.label}</h3>
              <p className="text-xs mt-0.5" style={{color:'#64748b'}}>{a.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition mt-0.5 flex-shrink-0" style={{color:'#94a3b8'}} />
          </Link>
        ))}
      </div>

      {/* Applications table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg" style={{color:'#0f1729'}}>My Applications</h3>
          <div className="flex items-center gap-2">
            <button onClick={init} className="btn btn-ghost text-xs flex items-center gap-1" style={{color:'#64748b'}}><RefreshCw className="w-3 h-3" /> Refresh</button>
            <Link href="/apply" className="btn btn-outline text-sm">+ New</Link>
          </div>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-14">
            <FileText className="w-14 h-14 mx-auto mb-3" style={{color:'#e2e8f0'}} />
            <h4 className="font-semibold mb-1" style={{color:'#64748b'}}>No applications yet</h4>
            <p className="text-sm mb-6" style={{color:'#94a3b8'}}>Create your first PCC application to get started</p>
            <Link href="/apply" className="btn btn-primary">Create Application</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Reference</th><th>Business Name</th><th>Sector</th><th>Status</th><th>Submitted</th><th>Action</th></tr></thead>
              <tbody>
                {apps.map(app=>(
                  <tr key={app.id}>
                    <td><span className="font-mono text-xs font-bold" style={{color:'#0f1729'}}>{app.referenceNumber}</span></td>
                    <td><span className="font-medium text-sm" style={{color:'#0f1729'}}>{app.businessName}</span></td>
                    <td><span className="text-xs" style={{color:'#64748b'}}>{app.businessSector}</span></td>
                    <td><span className={`badge ${statusBadge[app.status]||'badge-draft'}`}>{app.status.replace(/_/g,' ')}</span></td>
                    <td><span className="text-xs" style={{color:'#94a3b8'}}>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</span></td>
                    <td>
                      {app.certificate
                        ? <Link href="/verify" className="btn btn-outline text-xs py-1 px-3" style={{color:'#10b981', borderColor:'#10b981'}}>View Cert</Link>
                        : <Link href={`/applications/${app.id}`} className="btn btn-outline text-xs py-1 px-3">View</Link>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
