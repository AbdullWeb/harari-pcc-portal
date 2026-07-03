'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Printer, CheckCircle, Star, Shield } from 'lucide-react'

export default function CertificatePage() {
  const params  = useParams()
  const router  = useRouter()
  const number  = decodeURIComponent(params.number as string)
  const printRef = useRef<HTMLDivElement>(null)

  const [cert,setCert]       = useState<any>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError]     = useState('')

  useEffect(()=>{
    fetch(`/api/certificates/verify?number=${encodeURIComponent(number)}`)
      .then(r=>r.json())
      .then(d=>{
        if(d.valid) setCert(d.certificate)
        else setError(d.error||'Certificate not found')
      })
      .catch(()=>setError('Failed to load certificate'))
      .finally(()=>setLoading(false))
  },[number])

  const handlePrint = () => window.print()

  const handleDownload = () => {
    // Use browser print-to-PDF dialog
    window.print()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f0f2f7'}}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor:'#c9a84c',borderTopColor:'transparent'}}/>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:'#0f1729'}}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background:'rgba(239,68,68,0.1)'}}>
          <Shield className="w-8 h-8" style={{color:'#ef4444'}}/>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Certificate Not Found</h2>
        <p className="mb-6" style={{color:'rgba(255,255,255,0.5)'}}>{error}</p>
        <Link href="/verify" className="btn btn-gold">Try Verification</Link>
      </div>
    </div>
  )

  const issueDate = cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : '—'
  const expiryDate = cert.expiresAt ? new Date(cert.expiresAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : 'No Expiry'

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white !important; }
          .cert-page { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>

      {/* Toolbar - hidden on print */}
      <div className="no-print sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between" style={{background:'#0f1729',borderBottom:'1px solid rgba(201,168,76,0.15)'}}>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm" style={{color:'rgba(255,255,255,0.7)'}}>
          <ArrowLeft className="w-4 h-4"/> Back
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn btn-outline flex items-center gap-2 text-sm"
            style={{borderColor:'rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.8)'}}>
            <Printer className="w-4 h-4"/> Print
          </button>
          <button onClick={handleDownload} className="btn btn-gold flex items-center gap-2 text-sm">
            <Download className="w-4 h-4"/> Download PDF
          </button>
        </div>
      </div>

      {/* Certificate background page */}
      <div className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-8" style={{background:'#1a2540'}}>
        {/* THE CERTIFICATE */}
        <div ref={printRef} className="cert-page w-full max-w-4xl bg-white shadow-2xl relative overflow-hidden" style={{minHeight:'550px', borderRadius:'16px'}}>

          {/* Top gold bar */}
          <div className="h-4 w-full" style={{background:'linear-gradient(90deg,#a07c2e,#c9a84c,#e4c97a,#c9a84c,#a07c2e)'}}/>

          {/* Main content */}
          <div className="p-8 md:p-12 relative">

            {/* Watermark logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{opacity:0.04}}>
              <img src="/harari-logo.svg" alt="" style={{width:'420px',height:'420px',objectFit:'contain'}}/>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 relative">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <img src="/harari-logo.svg" alt="Harari Emblem" style={{width:'72px',height:'72px',objectFit:'contain'}}/>
                <div>
                  <p className="font-bold text-sm" style={{color:'#0f1729',letterSpacing:'0.05em'}}>HARARI PEOPLE REGIONAL STATE</p>
                  <p className="text-xs" style={{color:'#64748b'}}>Trade, Industry & Tourism Development Bureau</p>
                  <p className="text-xs mt-0.5" style={{color:'#64748b'}}>Harar, Ethiopia</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)'}}>
                  <CheckCircle className="w-4 h-4" style={{color:'#10b981'}}/>
                  <span className="text-xs font-bold" style={{color:'#10b981'}}>VERIFIED & VALID</span>
                </div>
                <p className="text-xs font-mono" style={{color:'#64748b'}}>{cert.certificateNumber}</p>
              </div>
            </div>

            {/* Gold divider */}
            <div className="h-px w-full mb-8" style={{background:'linear-gradient(90deg,transparent,#c9a84c,transparent)'}}/>

            {/* Certificate title */}
            <div className="text-center mb-8 relative">
              <p className="text-xs font-bold tracking-widest mb-2" style={{color:'#c9a84c'}}>THIS IS TO CERTIFY THAT</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{color:'#0f1729',fontFamily:'Georgia, serif'}}>{cert.holderName}</h1>
              <p className="text-sm" style={{color:'#64748b'}}>Has successfully met all requirements and is hereby granted the</p>
              <h2 className="text-xl md:text-2xl font-bold mt-3" style={{color:'#7e22ce',fontFamily:'Georgia, serif'}}>Professional Competence Certificate</h2>
              <p className="text-sm mt-1" style={{color:'#64748b'}}>(PCC) for the conduct of business in the Harari People Regional State</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {label:'Business Name',    value:cert.businessName},
                {label:'Business Sector',  value:cert.businessSector},
                {label:'Date of Issue',    value:issueDate},
                {label:'Valid Until',      value:expiryDate},
              ].map(item=>(
                <div key={item.label} className="text-center p-3 rounded-xl" style={{background:'#f8f5ef',border:'1px solid #e8dfc8'}}>
                  <p className="text-xs mb-1" style={{color:'#94a3b8'}}>{item.label}</p>
                  <p className="font-bold text-sm" style={{color:'#0f1729'}}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Gold divider */}
            <div className="h-px w-full mb-8" style={{background:'linear-gradient(90deg,transparent,#c9a84c,transparent)'}}/>

            {/* Footer row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Signature */}
              <div className="text-center">
                <div className="w-32 h-px mb-2 mx-auto" style={{background:'#0f1729'}}/>
                <p className="text-xs font-bold" style={{color:'#0f1729'}}>Bureau Head</p>
                <p className="text-xs" style={{color:'#64748b'}}>Trade, Industry & Tourism Bureau</p>
              </div>

              {/* Seal center */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{background:'linear-gradient(135deg,#a07c2e,#c9a84c)',boxShadow:'0 0 0 3px rgba(201,168,76,0.3), 0 0 0 6px rgba(201,168,76,0.1)'}}>
                  <img src="/harari-logo.svg" alt="Seal" style={{width:'56px',height:'56px',objectFit:'contain',filter:'brightness(10)'}}/>
                </div>
                <p className="text-xs font-bold mt-2" style={{color:'#c9a84c',letterSpacing:'0.1em'}}>OFFICIAL SEAL</p>
              </div>

              {/* Verification info */}
              <div className="text-center">
                <p className="text-xs font-bold mb-1" style={{color:'#0f1729'}}>Verify this Certificate</p>
                <p className="text-xs font-mono" style={{color:'#64748b'}}>{cert.certificateNumber}</p>
                <p className="text-xs mt-1" style={{color:'#94a3b8'}}>harari-pcc-portal-gold.vercel.app/verify</p>
              </div>
            </div>
          </div>

          {/* Bottom gold bar */}
          <div className="h-4 w-full" style={{background:'linear-gradient(90deg,#a07c2e,#c9a84c,#e4c97a,#c9a84c,#a07c2e)'}}/>
        </div>
      </div>

      {/* Instructions - hidden on print */}
      <div className="no-print py-6 px-4 text-center" style={{background:'#1a2540'}}>
        <p className="text-sm" style={{color:'rgba(255,255,255,0.45)'}}>
          To save as PDF: Click <strong className="text-white">"Download PDF"</strong> → In the print dialog, select <strong className="text-white">"Save as PDF"</strong> as the destination → Click Save
        </p>
      </div>
    </>
  )
}
