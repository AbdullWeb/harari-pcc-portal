'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Mail, Phone, MapPin, Hash, Calendar, Shield, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => { if (res.status === 401) { router.push('/login'); return null } return res.json() })
      .then(data => { if (data) setUser(data.user) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="text-center"><div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/></div>
    </div>
  )

  if (!user) return null

  const info = [
    { icon:User,    label:'Full Name',   value:`${user.firstName} ${user.lastName}` },
    { icon:Mail,    label:'Email',       value:user.email },
    { icon:Phone,   label:'Phone',       value:user.phone || '—' },
    { icon:Hash,    label:'National ID', value:user.nationalId || '—' },
    { icon:MapPin,  label:'Region',      value:user.region || 'Harari' },
    { icon:MapPin,  label:'Woreda',      value:user.woreda || '—' },
    { icon:Shield,  label:'Role',        value:user.role },
    { icon:Calendar,label:'Member Since',value:new Date(user.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) },
  ]

  return (
    <DashboardLayout userName={`${user.firstName} ${user.lastName}`} role={user.role}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{color:'#0f1729'}}>My Profile</h2>
        <p className="text-sm mt-1" style={{color:'#64748b'}}>Your account information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="card text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold"
            style={{background:'linear-gradient(135deg,#a07c2e,#c9a84c)', color:'#0f1729'}}>
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-bold text-xl" style={{color:'#0f1729'}}>{user.firstName} {user.lastName}</h3>
          <p className="text-sm mt-1" style={{color:'#64748b'}}>{user.email}</p>
          <div className="mt-3">
            <span className={`badge ${user.role==='ADMIN'?'badge-gold':user.role==='REVIEWER'?'badge-submitted':'badge-draft'}`}>
              {user.role}
            </span>
          </div>

          <div className="mt-6 pt-6" style={{borderTop:'1px solid #f1f5f9'}}>
            <div className="flex items-center justify-center gap-2 text-sm" style={{color:'#10b981'}}>
              <CheckCircle className="w-4 h-4" />
              <span>Account Verified</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="md:col-span-2 card">
          <h3 className="font-bold text-lg mb-6" style={{color:'#0f1729'}}>Account Details</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {info.map(item=>(
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(201,168,76,0.1)'}}>
                  <item.icon className="w-4 h-4" style={{color:'#c9a84c'}} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{color:'#94a3b8'}}>{item.label}</p>
                  <p className="text-sm font-semibold" style={{color:'#0f1729'}}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6" style={{borderTop:'1px solid #f1f5f9'}}>
            <h4 className="font-semibold mb-3 text-sm" style={{color:'#0f1729'}}>Security</h4>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{background:'#f8fafc', border:'1px solid #e2e8f0'}}>
              <div>
                <p className="text-sm font-medium" style={{color:'#0f1729'}}>Password</p>
                <p className="text-xs mt-0.5" style={{color:'#94a3b8'}}>Last changed: Unknown</p>
              </div>
              <button className="btn btn-outline text-sm">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
