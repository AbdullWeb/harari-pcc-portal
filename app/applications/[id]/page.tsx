'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, CheckCircle, Clock, XCircle, Award, FileText } from 'lucide-react'

const statusIcon: Record<string,any> = {
  DRAFT: Clock, SUBMITTED: FileText, UNDER_REVIEW: Clock,
  APPROVED: CheckCircle, REJECTED: XCircle, CERTIFICATE_ISSUED: Award
}
const statusBadge: Record<string,string> = {
  DRAFT:'badge-draft', SUBMITTED:'badge-submitted', UNDER_REVIEW:'badge-review',
  APPROVED:'badge-approved', REJECTED:'badge-rejected', CERTIFICATE_ISSUED:'badge-issued'
}

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [user, setUser]   = useState<any>(null)
  const [app,  setApp]    = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const [meRes, appRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/applications/${id}`)
      ])
      if (meRes.status === 401) { router.push('/login'); return }
      const meData  = await meRes.json()
      const appData = await appRes.json()
      setUser(meData.user)
      setApp(appData.application)
      setLoading(false)
    }
    init()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="text-center"><div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/></div>
    </div>
  )

  if (!app) return (
    <DashboardLayout userName={user?.firstName||'User'} role={user?.role||'APPLICANT'}>
      <div className="text-center py-20">
        <p className="text-xl font-medium" style={{color:'#64748b'}}>Application not found</p>
        <Link href="/dashboard" className="btn btn-primary mt-4">Back to Dashboard</Link>
      </div>
    </DashboardLayout>
  )

  const StatusIcon = statusIcon[app.status] || Clock
  const timeline = app.auditLogs || []

  return (
    <DashboardLayout userName={user ? `${user.firstName} ${user.lastName}` : '…'} role={user?.role||'APPLICANT'}>
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline" style={{color:'#64748b'}}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{color:'#0f1729'}}>{app.businessName}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-sm" style={{color:'#64748b'}}>{app.referenceNumber}</span>
            <span className={`badge ${statusBadge[app.status]||'badge-draft'}`}>{app.status.replace(/_/g,' ')}</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{background:'rgba(201,168,76,0.1)'}}>
          <StatusIcon className="w-7 h-7" style={{color:'#c9a84c'}} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal */}
          <div className="card">
            <h3 className="font-bold mb-4" style={{color:'#c9a84c'}}>Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[['Full Name',`${app.firstName||''} ${app.lastName||''}`],['Email',app.email||'—'],['Phone',app.phone||'—'],['National ID',app.nationalId||'—'],['Gender',app.gender||'—'],['Address',`${app.woreda||'—'}, Kebele ${app.kebele||'—'}, Harari`]].map(([l,v])=>(
                <div key={l}><p className="text-xs mb-0.5" style={{color:'#94a3b8'}}>{l}</p><p className="font-medium" style={{color:'#0f1729'}}>{v}</p></div>
              ))}
            </div>
          </div>

          {/* Business */}
          <div className="card">
            <h3 className="font-bold mb-4" style={{color:'#c9a84c'}}>Business Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              {[['Sector',app.businessSector||'—'],['Capital (ETB)',app.capitalAmount?`ETB ${app.capitalAmount.toLocaleString()}`:'—'],['Employees',app.employeeCount||'—']].map(([l,v])=>(
                <div key={l}><p className="text-xs mb-0.5" style={{color:'#94a3b8'}}>{l}</p><p className="font-medium" style={{color:'#0f1729'}}>{v}</p></div>
              ))}
            </div>
            {app.businessDescription && (
              <div><p className="text-xs mb-1" style={{color:'#94a3b8'}}>Description</p><p className="text-sm" style={{color:'#0f1729'}}>{app.businessDescription}</p></div>
            )}
          </div>

          {/* Assessment */}
          <div className="card">
            <h3 className="font-bold mb-4" style={{color:'#c9a84c'}}>Competence Assessment</h3>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${app.assessmentPassed ? 'grad-gold' : ''}`}
                style={app.assessmentPassed ? {color:'#0f1729'} : {background:'#fee2e2', color:'#ef4444'}}>
                {app.assessmentScore ?? '—'}%
              </div>
              <div>
                <p className="font-bold" style={{color: app.assessmentPassed ? '#10b981' : '#ef4444'}}>
                  {app.assessmentPassed ? '✅ Passed' : '❌ Not Passed'}
                </p>
                <p className="text-xs mt-0.5" style={{color:'#94a3b8'}}>Minimum pass mark: 70%</p>
              </div>
            </div>
          </div>

          {/* Review Notes */}
          {app.reviewNotes && (
            <div className="card">
              <h3 className="font-bold mb-3" style={{color:'#c9a84c'}}>Reviewer Notes</h3>
              <p className="text-sm" style={{color:'#0f1729'}}>{app.reviewNotes}</p>
              {app.reviewer && <p className="text-xs mt-2" style={{color:'#94a3b8'}}>— {app.reviewer.firstName} {app.reviewer.lastName}</p>}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Certificate */}
          {app.certificate && (
            <div className="card" style={{background:'linear-gradient(135deg,#0f1729,#1a2540)', border:'1px solid rgba(201,168,76,0.3)'}}>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5" style={{color:'#c9a84c'}} />
                <h3 className="font-bold text-white">Certificate Issued</h3>
              </div>
              <p className="font-mono text-sm mb-3" style={{color:'#e4c97a'}}>{app.certificate.certificateNumber}</p>
              <p className="text-xs mb-4" style={{color:'rgba(255,255,255,0.5)'}}>
                Issued: {new Date(app.certificate.issuedAt).toLocaleDateString()}
              </p>
              <div className="flex flex-col gap-2">
                <Link href={`/certificate/${app.certificate.certificateNumber}`} className="btn btn-gold w-full text-sm text-center">
                  ⬇ Download Certificate
                </Link>
                <Link href="/verify" className="btn btn-outline w-full text-sm text-center" style={{borderColor:'rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)'}}>
                  🔍 Verify Certificate
                </Link>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <h3 className="font-bold mb-4" style={{color:'#0f1729'}}>Activity Timeline</h3>
            {timeline.length === 0
              ? <p className="text-sm" style={{color:'#94a3b8'}}>No activity yet</p>
              : (
                <div className="space-y-4">
                  {timeline.map((log:any, i:number)=>(
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background:'#c9a84c'}} />
                      <div>
                        <p className="text-xs font-semibold" style={{color:'#0f1729'}}>{log.action.replace(/_/g,' ')}</p>
                        <p className="text-xs" style={{color:'#94a3b8'}}>{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Status dates */}
          <div className="card">
            <h3 className="font-bold mb-4" style={{color:'#0f1729'}}>Dates</h3>
            <div className="space-y-3 text-sm">
              {[['Created', app.createdAt],['Submitted', app.submittedAt],['Reviewed', app.reviewedAt],['Completed', app.completedAt]].map(([l,d])=>d&&(
                <div key={l} className="flex justify-between">
                  <span style={{color:'#94a3b8'}}>{l}</span>
                  <span className="font-medium" style={{color:'#0f1729'}}>{new Date(d).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
