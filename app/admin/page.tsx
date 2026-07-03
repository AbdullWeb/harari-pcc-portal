'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Users, FileText, Award, Activity, TrendingUp, Settings, Database, BarChart3, RefreshCw, Plus, X } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [me,setMe]       = useState<any>(null)
  const [stats,setStats] = useState<any>(null)
  const [users,setUsers] = useState<any[]>([])
  const [tab,setTab]     = useState<'overview'|'users'>('overview')
  const [loading,setLoading] = useState(true)
  const [toast,setToast] = useState('')
  const [newUserModal,setNewUserModal] = useState(false)
  const [newUser,setNewUser] = useState({firstName:'',lastName:'',email:'',password:'',role:'APPLICANT',phone:''})
  const [saving,setSaving] = useState(false)
  const [formError,setFormError] = useState('')

  useEffect(()=>{init()},[])
  useEffect(()=>{if(toast)setTimeout(()=>setToast(''),3000)},[toast])

  const init = async () => {
    setLoading(true)
    const meRes = await fetch('/api/auth/me')
    if(meRes.status===401){router.push('/login');return}
    setMe((await meRes.json()).user)
    await Promise.all([loadStats(),loadUsers()])
    setLoading(false)
  }
  const loadStats = async () => setStats((await (await fetch('/api/admin/stats')).json()))
  const loadUsers = async () => setUsers((await (await fetch('/api/admin/users')).json()).users||[])

  const createUser = async () => {
    setFormError('')
    if(!newUser.firstName||!newUser.lastName||!newUser.email||!newUser.password){setFormError('All fields required');return}
    setSaving(true)
    const res  = await fetch('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newUser)})
    const data = await res.json()
    setSaving(false)
    if(!res.ok){setFormError(data.error||'Failed');return}
    setNewUserModal(false)
    setNewUser({firstName:'',lastName:'',email:'',password:'',role:'APPLICANT',phone:''})
    loadUsers(); setToast('✅ User created successfully')
  }

  if(loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/>
    </div>
  )

  const roleColor: Record<string,string> = {ADMIN:'badge-gold',REVIEWER:'badge-submitted',APPLICANT:'badge-draft'}

  return (
    <DashboardLayout userName={me?`${me.firstName} ${me.lastName}`:'…'} role="ADMIN">
      {toast && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-xl"
          style={{background:'#0f1729',color:'#e4c97a',border:'1px solid rgba(201,168,76,0.3)'}}>
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{color:'#0f1729'}}>Admin Dashboard</h2>
          <p className="text-sm mt-1" style={{color:'#64748b'}}>System-wide overview</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['overview','users'].map(t=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className="text-sm px-4 py-2 rounded-lg font-medium transition capitalize"
              style={tab===t?{background:'#0f1729',color:'#c9a84c'}:{background:'#f1f5f9',color:'#64748b',border:'1px solid #e2e8f0'}}>
              {t}
            </button>
          ))}
          <button onClick={init} className="text-sm px-3 py-2 rounded-lg flex items-center gap-1" style={{background:'#f1f5f9',color:'#64748b',border:'1px solid #e2e8f0'}}>
            <RefreshCw className="w-3 h-3"/>
          </button>
        </div>
      </div>

      {tab==='overview' && stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {label:'Total Users',  value:stats.users,        color:'#c9a84c',bg:'rgba(201,168,76,0.1)', icon:Users},
              {label:'Applications', value:stats.applications, color:'#3b82f6',bg:'rgba(59,130,246,0.1)',icon:FileText},
              {label:'Certificates', value:stats.certificates, color:'#10b981',bg:'rgba(16,185,129,0.1)',icon:Award},
              {label:'Pending',      value:stats.pending,       color:'#f59e0b',bg:'rgba(245,158,11,0.1)',icon:Activity},
            ].map(k=>(
              <div key={k.label} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:k.bg}}>
                    <k.icon className="w-4 h-4" style={{color:k.color}}/>
                  </div>
                  <TrendingUp className="w-3 h-3" style={{color:'#10b981'}}/>
                </div>
                <p className="text-2xl font-bold" style={{color:k.color}}>{k.value}</p>
                <p className="text-xs font-medium mt-0.5" style={{color:'#64748b'}}>{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 card p-4 md:p-6">
              <h3 className="font-bold text-base mb-4" style={{color:'#0f1729'}}>Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  {icon:Users,   label:'Users',       desc:'Manage users',     color:'#3b82f6',bg:'rgba(59,130,246,0.1)', action:()=>setTab('users')},
                  {icon:FileText,label:'Applications',desc:'View all apps',    color:'#c9a84c',bg:'rgba(201,168,76,0.1)', action:()=>router.push('/reviewer')},
                  {icon:Award,   label:'Certificates',desc:'View certs',       color:'#10b981',bg:'rgba(16,185,129,0.1)',action:()=>{}},
                  {icon:BarChart3,label:'Analytics',  desc:'Statistics',       color:'#f59e0b',bg:'rgba(245,158,11,0.1)',action:()=>{}},
                  {icon:Database,label:'Audit Logs',  desc:'Activity trail',   color:'#ef4444',bg:'rgba(239,68,68,0.1)',action:()=>{}},
                  {icon:Settings,label:'Settings',    desc:'Configuration',    color:'#8b5cf6',bg:'rgba(139,92,246,0.1)',action:()=>{}},
                ].map(a=>(
                  <button key={a.label} onClick={a.action} className="flex items-start gap-2 p-3 rounded-xl text-left transition hover:shadow-md" style={{background:'#f8fafc',border:'1px solid #e2e8f0'}}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:a.bg}}>
                      <a.icon className="w-4 h-4" style={{color:a.color}}/>
                    </div>
                    <div>
                      <p className="font-semibold text-xs" style={{color:'#0f1729'}}>{a.label}</p>
                      <p className="text-xs mt-0.5 hidden sm:block" style={{color:'#94a3b8'}}>{a.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4 md:p-6">
              <h3 className="font-bold text-base mb-4" style={{color:'#0f1729'}}>Recent Activity</h3>
              {!stats.recentActivity?.length
                ? <p className="text-sm text-center py-4" style={{color:'#94a3b8'}}>No activity</p>
                : <div className="space-y-3">
                    {stats.recentActivity.map((a:any,i:number)=>(
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:'#c9a84c'}}/>
                        <div>
                          <p className="text-xs font-medium" style={{color:'#0f1729'}}>{a.action.replace(/_/g,' ')}</p>
                          <p className="text-xs" style={{color:'#94a3b8'}}>{a.user?`${a.user.firstName} ${a.user.lastName}`:'System'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          <div className="card p-4 md:p-6" style={{background:'#0f1729',border:'1px solid rgba(201,168,76,0.2)'}}>
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="font-bold text-white text-sm">Application Breakdown</h3></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/><span className="text-xs font-semibold" style={{color:'#6ee7b7'}}>Live</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['Pending/Review',stats.pending,'#f59e0b'],['Approved/Issued',stats.approved,'#10b981'],['Rejected',stats.rejected,'#ef4444']].map(([l,v,c])=>(
                <div key={String(l)} className="rounded-xl p-3 text-center" style={{background:'rgba(255,255,255,0.05)'}}>
                  <p className="text-xl font-bold mb-0.5" style={{color:String(c)}}>{String(v)}</p>
                  <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{String(l)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab==='users' && (
        <div className="card p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg" style={{color:'#0f1729'}}>User Management</h3>
            <button onClick={()=>setNewUserModal(true)} className="btn btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4"/> Add User
            </button>
          </div>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[500px] px-4 md:px-0">
              <table className="tbl w-full">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td><span className="font-medium text-sm" style={{color:'#0f1729'}}>{u.firstName} {u.lastName}</span></td>
                      <td><span className="text-xs" style={{color:'#64748b'}}>{u.email}</span></td>
                      <td><span className={`badge ${roleColor[u.role]||'badge-draft'}`}>{u.role}</span></td>
                      <td><span className="text-xs" style={{color:'#94a3b8'}}>{new Date(u.createdAt).toLocaleDateString()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {newUserModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{background:'rgba(0,0,0,0.6)'}}>
          <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.2)',maxHeight:'90vh',overflowY:'auto'}}>
            <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{background:'#1a2540',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <h3 className="font-bold text-white">Create New User</h3>
              <button onClick={()=>setNewUserModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">
                <X className="w-4 h-4" style={{color:'rgba(255,255,255,0.5)'}}/>
              </button>
            </div>
            <div className="p-5 space-y-3">
              {formError && <p className="text-sm" style={{color:'#fca5a5'}}>⚠ {formError}</p>}
              <div className="grid grid-cols-2 gap-3">
                {[['firstName','First Name'],['lastName','Last Name']].map(([k,l])=>(
                  <div key={k}>
                    <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>{l} *</label>
                    <input className="input text-sm" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white',fontSize:'16px'}}
                      value={(newUser as any)[k]} onChange={e=>setNewUser({...newUser,[k]:e.target.value})}/>
                  </div>
                ))}
              </div>
              {[['email','Email *','email'],['password','Password *','password'],['phone','Phone','tel']].map(([k,l,t])=>(
                <div key={k}>
                  <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>{l}</label>
                  <input type={t} className="input text-sm" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white',fontSize:'16px'}}
                    value={(newUser as any)[k]} onChange={e=>setNewUser({...newUser,[k]:e.target.value})}/>
                </div>
              ))}
              <div>
                <label className="label text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Role *</label>
                <select className="input text-sm" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',color:'white',fontSize:'16px'}}
                  value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
                  <option value="APPLICANT">Applicant</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4 sticky bottom-0" style={{background:'#1a2540',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <button onClick={()=>setNewUserModal(false)} className="btn btn-outline flex-1 text-sm" style={{borderColor:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)'}}>Cancel</button>
              <button onClick={createUser} disabled={saving} className="btn btn-gold flex-1 text-sm">{saving?'Creating…':'Create User'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
