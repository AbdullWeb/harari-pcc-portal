'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Clock, CheckCircle, XCircle, FileText, TrendingUp, RefreshCw, Eye, ThumbsUp, ThumbsDown, X } from 'lucide-react'

const statusBadge: Record<string,string> = {
  SUBMITTED:'badge-submitted', UNDER_REVIEW:'badge-review',
  APPROVED:'badge-approved', REJECTED:'badge-rejected', CERTIFICATE_ISSUED:'badge-issued'
}

interface App {
  id:string; referenceNumber:string; businessName:string; businessSector:string;
  status:string; submittedAt:string; assessmentScore:number|null; assessmentPassed:boolean;
  user:{ firstName:string; lastName:string; email:string }
}

export default function ReviewerPage() {
  const router = useRouter()
  const [user,setUser]   = useState<any>(null)
  const [apps,setApps]   = useState<App[]>([])
  const [filter,setFilter] = useState('all')
  const [loading,setLoading] = useState(true)
  const [modal,setModal]   = useState<{app:App;mode:'view'|'approve'|'reject'}|null>(null)
  const [notes,setNotes]   = useState('')
  const [actionLoading,setActionLoading] = useState(false)
  const [toast,setToast]   = useState('')

  useEffect(()=>{ init() },[])
  useEffect(()=>{ if(toast) setTimeout(()=>setToast(''),3000) },[toast])

  const init = async () => {
    setLoading(true)
    const meRes = await fetch('/api/auth/me')
    if (meRes.status===401){ router.push('/login'); return }
    setUser((await meRes.json()).user)
    await loadApps()
    setLoading(false)
  }

  const loadApps = async (f=filter) => {
    const res  = await fetch(`/api/reviewer/applications?status=${f}`)
    setApps((await res.json()).applications||[])
  }

  const handleFilter=(f:string)=>{ setFilter(f); loadApps(f) }

  const claim = async (id:string) => {
    await fetch(`/api/reviewer/applications/${id}/claim`,{method:'POST'})
    loadApps(); setToast('Application claimed — you are now the reviewer.')
  }

  const approve = async () => {
    if (!modal) return
    setActionLoading(true)
    const res = await fetch(`/api/reviewer/applications/${modal.app.id}/approve`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes})})
    const data = await res.json()
    setActionLoading(false); setModal(null); setNotes(''); loadApps()
    setToast(`✅ Approved! Certificate: ${data.certificate?.certificateNumber}`)
  }

  const reject = async () => {
    if (!modal||!notes.trim()) return
    setActionLoading(true)
    await fetch(`/api/reviewer/applications/${modal.app.id}/reject`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason:notes})})
    setActionLoading(false); setModal(null); setNotes(''); loadApps()
    setToast('❌ Application rejected.')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/>
    </div>
  )

  const pending = apps.filter(a=>a.status==='SUBMITTED').length
  const inReview = apps.filter(a=>a.status==='UNDER_REVIEW').length

  return (
    <DashboardLayout userName={user?`${user.firstName} ${user.lastName}`:'…'} role="REVIEWER">
      {toast && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-xl animate-fadein"
          style={{background:'#0f1729',color:'#e4c97a',border:'1px solid rgba(201,168,76,0.3)'}}>
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold" style={{color:'#0f1729'}}>Review Queue</h2>
        <p className="text-sm mt-1" style={{color:'#64748b'}}>Review and process PCC applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {label:'Pending',value:pending,color:'#f59e0b',bg:'rgba(245,158,11,0.1)',icon:Clock},
          {label:'Under Review',value:inReview,color:'#3b82f6',bg:'rgba(59,130,246,0.1)',icon:FileText},
          {label:'Total',value:apps.length,color:'#c9a84c',bg:'rgba(201,168,76,0.1)',icon:TrendingUp},
          {label:'Processed',value:'—',color:'#10b981',bg:'rgba(16,185,129,0.1)',icon:CheckCircle},
        ].map(s=>(
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:s.bg}}>
              <s.icon className="w-4 h-4" style={{color:s.color}}/>
            </div>
            <div>
              <p className="text-xl font-bold" style={{color:s.color}}>{s.value}</p>
              <p className="text-xs" style={{color:'#64748b'}}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-lg" style={{color:'#0f1729'}}>Applications</h3>
          <div className="flex flex-wrap gap-2">
            {['all','SUBMITTED','UNDER_REVIEW'].map(f=>(
              <button key={f} onClick={()=>handleFilter(f)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition"
                style={filter===f?{background:'#0f1729',color:'#c9a84c'}:{background:'#f1f5f9',color:'#64748b',border:'1px solid #e2e8f0'}}>
                {f==='all'?'All':f.replace('_',' ')}
              </button>
            ))}
            <button onClick={()=>loadApps()} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{background:'#f1f5f9',color:'#64748b',border:'1px solid #e2e8f0'}}>
              <RefreshCw className="w-3 h-3"/> Refresh
            </button>
          </div>
        </div>

        {apps.length===0 ? (
          <div className="text-center py-10">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{color:'#e2e8f0'}}/>
            <p className="font-medium" style={{color:'#64748b'}}>No applications in queue</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[650px] px-4 md:px-0">
              <table className="tbl w-full">
                <thead><tr><th>Reference</th><th>Applicant</th><th>Business</th><th>Score</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {apps.map(app=>(
                    <tr key={app.id}>
                      <td><span className="font-mono text-xs font-bold" style={{color:'#0f1729'}}>{app.referenceNumber}</span></td>
                      <td>
                        <p className="font-medium text-sm" style={{color:'#0f1729'}}>{app.user?.firstName} {app.user?.lastName}</p>
                        <p className="text-xs" style={{color:'#94a3b8'}}>{app.user?.email}</p>
                      </td>
                      <td>
                        <p className="text-sm" style={{color:'#0f1729'}}>{app.businessName}</p>
                        <p className="text-xs" style={{color:'#94a3b8'}}>{app.businessSector}</p>
                      </td>
                      <td><span className={`badge ${app.assessmentPassed?'badge-approved':'badge-rejected'}`}>{app.assessmentScore??'—'}%</span></td>
                      <td><span className={`badge ${statusBadge[app.status]||'badge-draft'}`}>{app.status.replace('_',' ')}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={()=>setModal({app,mode:'view'})} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition" title="View">
                            <Eye className="w-4 h-4" style={{color:'#64748b'}}/>
                          </button>
                          {app.status==='SUBMITTED' && (
                            <button onClick={()=>claim(app.id)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{background:'rgba(59,130,246,0.1)',color:'#3b82f6'}}>Claim</button>
                          )}
                          {app.status==='UNDER_REVIEW' && (
                            <>
                              <button onClick={()=>{setNotes('');setModal({app,mode:'approve'})}} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-50 transition" title="Approve">
                                <ThumbsUp className="w-4 h-4" style={{color:'#10b981'}}/>
                              </button>
                              <button onClick={()=>{setNotes('');setModal({app,mode:'reject'})}} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition" title="Reject">
                                <ThumbsDown className="w-4 h-4" style={{color:'#ef4444'}}/>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{background:'rgba(0,0,0,0.6)'}}>
          <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.2)',maxHeight:'90vh',overflowY:'auto'}}>
            <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{background:'#1a2540',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <h3 className="font-bold text-white text-sm">
                {modal.mode==='view'?'📋 Application Details':modal.mode==='approve'?'✅ Approve':'❌ Reject'}
              </h3>
              <button onClick={()=>setModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">
                <X className="w-4 h-4" style={{color:'rgba(255,255,255,0.5)'}}/>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Reference',modal.app.referenceNumber],
                  ['Applicant',`${modal.app.user?.firstName} ${modal.app.user?.lastName}`],
                  ['Email',modal.app.user?.email],
                  ['Business',modal.app.businessName],
                  ['Sector',modal.app.businessSector],
                  ['Assessment',`${modal.app.assessmentScore??'—'}% (${modal.app.assessmentPassed?'Passed':'Failed'})`],
                  ['Status',modal.app.status.replace('_',' ')],
                  ['Submitted',modal.app.submittedAt?new Date(modal.app.submittedAt).toLocaleDateString():'—'],
                ].map(([l,v])=>(
                  <div key={l}><p className="text-xs mb-0.5" style={{color:'rgba(255,255,255,0.35)'}}>{l}</p><p className="text-sm font-medium text-white break-all">{v}</p></div>
                ))}
              </div>
              {modal.mode!=='view' && (
                <div>
                  <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>
                    {modal.mode==='approve'?'Approval Notes (optional)':'Rejection Reason *'}
                  </label>
                  <textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)}
                    className="input resize-none"
                    style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white',fontSize:'16px'}}
                    placeholder={modal.mode==='reject'?'State the reason for rejection…':'Add any notes…'}/>
                </div>
              )}
            </div>
            {modal.mode!=='view' && (
              <div className="flex gap-3 px-5 py-4 sticky bottom-0" style={{background:'#1a2540',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                <button onClick={()=>setModal(null)} className="btn btn-outline flex-1 text-sm" style={{borderColor:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)'}}>Cancel</button>
                {modal.mode==='approve'
                  ? <button onClick={approve} disabled={actionLoading} className="btn btn-gold flex-1 text-sm">{actionLoading?'Processing…':'✅ Approve & Issue'}</button>
                  : <button onClick={reject} disabled={actionLoading||!notes.trim()} className="btn btn-danger flex-1 text-sm">{actionLoading?'Processing…':'❌ Reject'}</button>
                }
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
