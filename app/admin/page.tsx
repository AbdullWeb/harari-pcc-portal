'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Users, FileText, Award, Activity, TrendingUp, Settings, Database, BarChart3, RefreshCw, Plus, X } from 'lucide-react'

interface Stats { users:number; applications:number; certificates:number; pending:number; approved:number; rejected:number; recentActivity:any[] }
interface UserRow { id:string; firstName:string; lastName:string; email:string; role:string; phone:string; createdAt:string }

export default function AdminPage() {
  const router = useRouter()
  const [me,     setMe]     = useState<any>(null)
  const [stats,  setStats]  = useState<Stats|null>(null)
  const [users,  setUsers]  = useState<UserRow[]>([])
  const [tab,    setTab]    = useState<'overview'|'users'>('overview')
  const [loading,setLoading] = useState(true)
  const [toast,  setToast]  = useState('')
  const [newUserModal, setNewUserModal] = useState(false)
  const [newUser, setNewUser] = useState({ firstName:'', lastName:'', email:'', password:'', role:'APPLICANT', phone:'' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => { init() }, [])
  useEffect(() => { if (toast) setTimeout(()=>setToast(''), 3000) }, [toast])

  const init = async () => {
    setLoading(true)
    const meRes = await fetch('/api/auth/me')
    if (meRes.status === 401) { router.push('/login'); return }
    const meData = await meRes.json()
    setMe(meData.user)
    await Promise.all([loadStats(), loadUsers()])
    setLoading(false)
  }

  const loadStats = async () => {
    const res  = await fetch('/api/admin/stats')
    const data = await res.json()
    setStats(data)
  }

  const loadUsers = async () => {
    const res  = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users || [])
  }

  const createUser = async () => {
    setFormError('')
    if (!newUser.firstName||!newUser.lastName||!newUser.email||!newUser.password) { setFormError('All fields are required'); return }
    setSaving(true)
    const res  = await fetch('/api/admin/users', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newUser) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setFormError(data.error || 'Failed'); return }
    setNewUserModal(false)
    setNewUser({ firstName:'', lastName:'', email:'', password:'', role:'APPLICANT', phone:'' })
    loadUsers()
    setToast('✅ User created successfully')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="text-center"><div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/><p style={{color:'#64748b'}}>Loading…</p></div>
    </div>
  )

  const roleColor: Record<string,string> = { ADMIN:'badge-gold', REVIEWER:'badge-submitted', APPLICANT:'badge-draft' }

  return (
    <DashboardLayout userName={me ? `${me.firstName} ${me.lastName}` : '…'} role="ADMIN">
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-xl animate-fadein"
          style={{background:'#0f1729', color:'#e4c97a', border:'1px solid rgba(201,168,76,0.3)'}}>
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{color:'#0f1729'}}>Admin Dashboard</h2>
          <p className="text-sm mt-1" style={{color:'#64748b'}}>System-wide overview and management</p>
        </div>
        <div className="flex gap-2">
          {['overview','users'].map(t=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className="text-sm px-4 py-2 rounded-lg font-medium transition capitalize"
              style={tab===t ? {background:'#0f1729',color:'#c9a84c'} : {background:'#f1f5f9',color:'#64748b',border:'1px solid #e2e8f0'}}>
              {t}
            </button>
          ))}
          <button onClick={init} className="btn btn-ghost text-xs flex items-center gap-1" style={{color:'#64748b'}}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && stats && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label:'Total Users',       value: stats.users,        color:'#c9a84c', bg:'rgba(201,168,76,0.1)',  icon:Users },
              { label:'Applications',      value: stats.applications, color:'#3b82f6', bg:'rgba(59,130,246,0.1)', icon:FileText },
              { label:'Certificates',      value: stats.certificates, color:'#10b981', bg:'rgba(16,185,129,0.1)', icon:Award },
              { label:'Pending Review',    value: stats.pending,      color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:Activity },
            ].map(k=>(
              <div key={k.label} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:k.bg}}>
                    <k.icon className="w-5 h-5" style={{color:k.color}} />
                  </div>
                  <TrendingUp className="w-4 h-4" style={{color:'#10b981'}} />
                </div>
                <p className="text-3xl font-bold mb-1" style={{color:k.color}}>{k.value}</p>
                <p className="text-sm font-medium" style={{color:'#0f1729'}}>{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="md:col-span-2 card">
              <h3 className="font-bold text-lg mb-4" style={{color:'#0f1729'}}>Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon:Users,    label:'User Management',      desc:'Create and manage users',     color:'#3b82f6', bg:'rgba(59,130,246,0.1)',  action:()=>setTab('users') },
                  { icon:FileText, label:'Application Overview', desc:'View all applications',        color:'#c9a84c', bg:'rgba(201,168,76,0.1)',  action:()=>router.push('/reviewer') },
                  { icon:Award,    label:'Certificates',         desc:'View issued certificates',     color:'#10b981', bg:'rgba(16,185,129,0.1)', action:()=>{} },
                  { icon:BarChart3,label:'Analytics',            desc:'System statistics',            color:'#f59e0b', bg:'rgba(245,158,11,0.1)', action:()=>{} },
                  { icon:Database, label:'Audit Logs',           desc:'Complete activity trail',      color:'#ef4444', bg:'rgba(239,68,68,0.1)', action:()=>{} },
                  { icon:Settings, label:'Settings',             desc:'Configure system parameters',  color:'#8b5cf6', bg:'rgba(139,92,246,0.1)', action:()=>{} },
                ].map(a=>(
                  <button key={a.label} onClick={a.action}
                    className="flex items-start gap-3 p-4 rounded-xl text-left transition group hover:shadow-md"
                    style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition" style={{background:a.bg}}>
                      <a.icon className="w-4 h-4" style={{color:a.color}} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{color:'#0f1729'}}>{a.label}</p>
                      <p className="text-xs mt-0.5" style={{color:'#94a3b8'}}>{a.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-bold text-lg mb-4" style={{color:'#0f1729'}}>Recent Activity</h3>
              {stats.recentActivity.length === 0
                ? <p className="text-sm text-center py-8" style={{color:'#94a3b8'}}>No recent activity</p>
                : (
                  <div className="space-y-4">
                    {stats.recentActivity.map((a:any,i:number)=>(
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background:'#c9a84c'}} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{color:'#0f1729'}}>{a.action.replace(/_/g,' ')}</p>
                          <p className="text-xs mt-0.5" style={{color:'#94a3b8'}}>
                            {a.user ? `${a.user.firstName} ${a.user.lastName}` : 'System'} · {new Date(a.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* App breakdown */}
          <div className="card" style={{background:'#0f1729', border:'1px solid rgba(201,168,76,0.2)'}}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">Application Breakdown</h3>
                <p className="text-sm" style={{color:'rgba(255,255,255,0.45)'}}>Total: {stats.applications}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-semibold" style={{color:'#6ee7b7'}}>Live</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[['Pending / In Review', stats.pending,'#f59e0b'],['Approved / Issued', stats.approved,'#10b981'],['Rejected', stats.rejected,'#ef4444']].map(([lbl,val,col])=>(
                <div key={String(lbl)} className="rounded-xl p-4 text-center" style={{background:'rgba(255,255,255,0.05)'}}>
                  <p className="text-2xl font-bold mb-1" style={{color:String(col)}}>{String(val)}</p>
                  <p className="text-xs" style={{color:'rgba(255,255,255,0.45)'}}>{String(lbl)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg" style={{color:'#0f1729'}}>User Management</h3>
            <button onClick={()=>setNewUserModal(true)} className="btn btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="tbl">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Joined</th></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.id}>
                    <td><span className="font-medium text-sm" style={{color:'#0f1729'}}>{u.firstName} {u.lastName}</span></td>
                    <td><span className="text-sm" style={{color:'#64748b'}}>{u.email}</span></td>
                    <td><span className={`badge ${roleColor[u.role]||'badge-draft'}`}>{u.role}</span></td>
                    <td><span className="text-sm" style={{color:'#64748b'}}>{u.phone || '—'}</span></td>
                    <td><span className="text-xs" style={{color:'#94a3b8'}}>{new Date(u.createdAt).toLocaleDateString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {newUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{background:'#1a2540', border:'1px solid rgba(201,168,76,0.2)'}}>
            <div className="flex items-center justify-between px-6 py-4" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <h3 className="font-bold text-white">Create New User</h3>
              <button onClick={()=>setNewUserModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
                <X className="w-4 h-4" style={{color:'rgba(255,255,255,0.5)'}} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && <p className="text-sm" style={{color:'#fca5a5'}}>⚠ {formError}</p>}
              <div className="grid grid-cols-2 gap-3">
                {[['firstName','First Name'],['lastName','Last Name']].map(([k,l])=>(
                  <div key={k}>
                    <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>{l} *</label>
                    <input className="input text-sm" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white'}}
                      value={(newUser as any)[k]} onChange={e=>setNewUser({...newUser,[k]:e.target.value})} />
                  </div>
                ))}
              </div>
              {[['email','Email *','email'],['password','Password *','password'],['phone','Phone','tel']].map(([k,l,t])=>(
                <div key={k}>
                  <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>{l}</label>
                  <input type={t} className="input text-sm" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white'}}
                    value={(newUser as any)[k]} onChange={e=>setNewUser({...newUser,[k]:e.target.value})} />
                </div>
              ))}
              <div>
                <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Role *</label>
                <select className="input text-sm" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white'}}
                  value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
                  <option value="APPLICANT">Applicant</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <button onClick={()=>setNewUserModal(false)} className="btn btn-outline flex-1" style={{borderColor:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)'}}>Cancel</button>
              <button onClick={createUser} disabled={saving} className="btn btn-gold flex-1">{saving ? 'Creating…' : 'Create User'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
