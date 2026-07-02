import Link from 'next/link'
import { CheckCircle, FileText, Shield, Clock, BarChart3, Star, Building2, Award, ArrowRight, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{background:'#0f1729'}}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 glass-dark border-b" style={{borderColor:'rgba(201,168,76,0.15)'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center" style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)'}}>
              <img src="/harari-logo.svg" alt="Harari Emblem" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">Harari PCC Portal</p>
              <p className="text-xs" style={{color:'rgba(201,168,76,0.7)'}}>Trade, Industry & Tourism Bureau</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/verify" className="nav-link">Verify Certificate</Link>
            <Link href="/login" className="nav-link">Login</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost" style={{color:'rgba(255,255,255,0.7)'}}>Sign In</Link>
            <Link href="/register" className="btn btn-gold text-sm px-5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden harari-bg-dark py-28 px-6">
        {/* Logo watermark background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.06] pointer-events-none select-none"
          style={{backgroundImage:'url(/harari-logo.svg)', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center'}} />
        {/* glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{background:'radial-gradient(circle, #c9a84c, transparent)'}} />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
          style={{background:'radial-gradient(circle, #243460, transparent)'}} />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 glass"
              style={{color:'#e4c97a', border:'1px solid rgba(201,168,76,0.3)'}}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              Official Digital Platform — Harari People Regional State, Ethiopia 🇪🇹
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Professional
              <span className="block" style={{
                background:'linear-gradient(135deg, #c9a84c, #e4c97a)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
              }}>
                Competence Certificate
              </span>
              <span className="text-white">Made Digital</span>
            </h1>

            <p className="text-xl mb-10" style={{color:'rgba(255,255,255,0.65)'}}>
              Apply online, track in real-time, and receive your verified PCC within 24 hours.
              No office visits. No paper queues. No delays.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn btn-gold text-base px-8 py-3">
                Apply for PCC <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/verify" className="btn btn-outline text-base px-8 py-3"
                style={{color:'rgba(255,255,255,0.8)', borderColor:'rgba(255,255,255,0.2)'}}>
                Verify a Certificate
              </Link>
            </div>
          </div>

          {/* Logo Display */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{background:'radial-gradient(circle, #c9a84c, transparent)', transform:'scale(1.2)'}} />
              <img src="/harari-logo.svg" alt="Harari Regional State Emblem"
                style={{width:'340px', height:'340px', objectFit:'contain', filter:'drop-shadow(0 0 30px rgba(201,168,76,0.3))', position:'relative', zIndex:1}} />
            </div>
          </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              {value:'< 24h', label:'Processing Time'},
              {value:'100%', label:'Digital Process'},
              {value:'10',   label:'Business Sectors'},
              {value:'24/7', label:'Online Access'},
            ].map(s=>(
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold mb-1" style={{
                  background:'linear-gradient(135deg,#c9a84c,#e4c97a)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
                }}>{s.value}</p>
                <p className="text-sm" style={{color:'rgba(255,255,255,0.55)'}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gold divider ── */}
      <div className="gold-line" />

      {/* ── How It Works ── */}
      <section className="py-24 px-6 harari-bg" style={{background:'#0f1729'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest mb-3" style={{color:'#c9a84c'}}>SIMPLE PROCESS</p>
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
            <p className="mt-3 text-lg" style={{color:'rgba(255,255,255,0.5)'}}>Get your PCC in 5 steps — entirely online</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            {[
              {n:'01', icon:Users,     title:'Register',   desc:'Create your account with national ID'},
              {n:'02', icon:FileText,  title:'Apply',      desc:'Complete the 5-step application wizard'},
              {n:'03', icon:Award,     title:'Assessment', desc:'Pass the competence test (70% required)'},
              {n:'04', icon:Clock,     title:'Review',     desc:'Bureau reviews within 24 hours'},
              {n:'05', icon:CheckCircle,title:'Certificate',desc:'Download your verified certificate'},
            ].map((s,i)=>(
              <div key={i} className="relative">
                <div className="glass rounded-2xl p-6 text-center h-full hover:border-gold transition-all"
                  style={{border:'1px solid rgba(201,168,76,0.15)'}}>
                  <div className="text-xs font-bold mb-3" style={{color:'rgba(201,168,76,0.5)'}}>{s.n}</div>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-4 grad-gold flex items-center justify-center">
                    <s.icon className="w-6 h-6" style={{color:'#0f1729'}} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>{s.desc}</p>
                </div>
                {i < 4 && <div className="hidden md:block absolute top-1/3 -right-3 w-6 h-px" style={{background:'rgba(201,168,76,0.3)'}} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6" style={{background:'#1a2540'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest mb-3" style={{color:'#c9a84c'}}>PLATFORM FEATURES</p>
            <h2 className="text-4xl font-bold text-white">Everything in One Place</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:Clock,     title:'Under 24-Hour Processing', desc:'From submission to certificate issuance in less than one business day — dramatically faster than the traditional 5–14 day process.', color:'#c9a84c'},
              {icon:Shield,    title:'Public Certificate Verification', desc:'Banks, landlords, and partners can instantly verify any certificate using its unique number — zero forgery risk.', color:'#10b981'},
              {icon:BarChart3, title:'Real-Time Status Tracking', desc:'Track your application at every stage: Draft → Submitted → Under Review → Approved → Certificate Issued.', color:'#3b82f6'},
              {icon:FileText,  title:'Document Management', desc:'Upload all 19 supported document types securely. Files are stored encrypted with short-lived signed URLs.', color:'#8b5cf6'},
              {icon:Award,     title:'Competence Assessment', desc:'17-question bank covering Ethiopian business law, taxation, labour law, and Harari regional regulations.', color:'#f59e0b'},
              {icon:Building2, title:'All Business Sectors', desc:'Trade, Manufacturing, Service, Hospitality, Agriculture, Technology, Construction, Education, Healthcare, and more.', color:'#ef4444'},
            ].map((f,i)=>(
              <div key={i} className="rounded-2xl p-6 transition-all"
                style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'}}>
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{background:`${f.color}18`}}>
                  <f.icon className="w-6 h-6" style={{color:f.color}} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 harari-bg-dark" style={{background:'#0f1729'}}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Business?</h2>
          <p className="text-lg mb-8" style={{color:'rgba(255,255,255,0.55)'}}>
            Join hundreds of entrepreneurs in the Harari Region and get your PCC today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn btn-gold text-base px-10 py-3">
              Apply for PCC Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/verify" className="btn btn-outline text-base px-10 py-3"
              style={{color:'rgba(255,255,255,0.75)', borderColor:'rgba(255,255,255,0.2)'}}>
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-6" style={{background:'#080e1a', borderColor:'rgba(201,168,76,0.15)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center" style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)'}}>
                <img src="/harari-logo.svg" alt="Harari Emblem" style={{width:'30px',height:'30px',objectFit:'contain'}} />
              </div>
              <span className="font-bold text-white">Harari PCC</span>
            </div>
              <p className="text-sm" style={{color:'rgba(255,255,255,0.4)'}}>
                Official digital PCC platform for the Harari People Regional State of Ethiopia.
              </p>
            </div>
            {[
              {title:'Quick Links', links:[['Home','/'],['Register','/register'],['Login','/login'],['Verify','/verify']]},
              {title:'Resources',   links:[['User Guide','#'],['FAQs','#'],['Requirements','#'],['Support','#']]},
            ].map(col=>(
              <div key={col.title}>
                <p className="font-semibold text-white mb-3 text-sm">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(([label,href])=>(
                    <li key={label}><Link href={href} className="text-sm hover:text-gold transition" style={{color:'rgba(255,255,255,0.4)'}}>{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="font-semibold text-white mb-3 text-sm">Contact</p>
              <ul className="space-y-1 text-sm" style={{color:'rgba(255,255,255,0.4)'}}>
                <li>Trade, Industry & Tourism Bureau</li>
                <li>Harar, Ethiopia</li>
                <li>info@harariregion.gov.et</li>
              </ul>
            </div>
          </div>
          <div className="gold-line mb-6" />
          <p className="text-center text-xs" style={{color:'rgba(255,255,255,0.3)'}}>
            © 2026 Harari People Regional State. All rights reserved. Built for the entrepreneurs of Harari 🇪🇹
          </p>
        </div>
      </footer>

    </div>
  )
}
