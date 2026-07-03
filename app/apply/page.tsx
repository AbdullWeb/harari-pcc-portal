'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, ArrowLeft, ArrowRight, CheckCircle, User, Building2, FileText, Brain, Send, Plus, Trash2 } from 'lucide-react'
import { getRandomQuestions, type AssessmentQuestion } from '@/lib/assessment'

const STEPS = [
  { id:1, title:'Personal Info',     icon:User },
  { id:2, title:'Business Info',     icon:Building2 },
  { id:3, title:'Documents',         icon:FileText },
  { id:4, title:'Assessment',        icon:Brain },
  { id:5, title:'Review & Submit',   icon:Send },
]
const SECTORS = ['TRADE','MANUFACTURING','SERVICE','HOSPITALITY','AGRICULTURE','TECHNOLOGY','CONSTRUCTION','EDUCATION','HEALTHCARE','OTHER']
const DOC_TYPES = ['NATIONAL_ID','GRADE_8','GRADE_10_EGECE','GRADE_12_MATRIC','TVET_CERTIFICATE','DIPLOMA','ADVANCED_DIPLOMA','BACHELOR_DEGREE','MASTER_DEGREE','DOCTORAL_DEGREE','PROFESSIONAL_CERT','BUSINESS_PLAN','LEASE_AGREEMENT','PHOTO','OTHER']

export default function ApplyPage() {
  const router = useRouter()
  const [step,setStep]       = useState(1)
  const [loading,setLoading] = useState(false)
  const [error,setError]     = useState('')
  const [submitted,setSubmitted] = useState(false)
  const [refNumber,setRefNumber] = useState('')

  const [personal,setPersonal] = useState({ firstName:'',lastName:'',email:'',phone:'',nationalId:'', dateOfBirth:'',gender:'',region:'Harari',woreda:'',kebele:'',houseNumber:'' })
  const [business,setBusiness] = useState({ businessName:'',businessSector:'TRADE',businessDescription:'',capitalAmount:'',employeeCount:'' })
  const [documents,setDocuments] = useState<{type:string;file:File|null;name:string}[]>([])
  const [quiz,setQuiz] = useState<{
    questions:AssessmentQuestion[]; answers:Record<string,number>;
    score:number|null; passed:boolean; submitted:boolean; current:number; showExp:boolean;
  }>({ questions:getRandomQuestions(10), answers:{}, score:null, passed:false, submitted:false, current:0, showExp:false })

  const addDoc = () => setDocuments(d=>[...d,{type:'NATIONAL_ID',file:null,name:''}])
  const removeDoc = (i:number) => setDocuments(d=>d.filter((_,idx)=>idx!==i))
  const updateDoc = (i:number,k:string,v:any) => setDocuments(d=>d.map((doc,idx)=>idx===i?{...doc,[k]:v}:doc))
  const handleFile = (i:number,e:React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]||null; updateDoc(i,'file',f); if(f) updateDoc(i,'name',f.name)
  }

  const handleAnswer = (qId:string, idx:number) => {
    const q = quiz.questions[quiz.current]
    const correct = q.correctAnswer === idx
    setQuiz(a=>({...a, answers:{...a.answers,[qId]:idx}, showExp:!correct}))
    if (correct) setTimeout(()=>{
      if (quiz.current < quiz.questions.length-1) setQuiz(a=>({...a,current:a.current+1,showExp:false}))
      else finishQuiz({...quiz.answers,[qId]:idx})
    }, 400)
  }
  const nextAfterExp = () => {
    if (quiz.current < quiz.questions.length-1) setQuiz(a=>({...a,current:a.current+1,showExp:false}))
    else finishQuiz(quiz.answers)
  }
  const finishQuiz = (answers:Record<string,number>) => {
    let c=0; quiz.questions.forEach(q=>{ if(answers[q.id]===q.correctAnswer) c++ })
    const score=Math.round((c/quiz.questions.length)*100)
    setQuiz(a=>({...a,answers,score,passed:score>=70,submitted:true,showExp:false}))
  }
  const retryQuiz = () => setQuiz({questions:getRandomQuestions(10),answers:{},score:null,passed:false,submitted:false,current:0,showExp:false})

  const validate = () => {
    setError('')
    if (step===1 && (!personal.firstName||!personal.lastName||!personal.email||!personal.phone||!personal.nationalId||!personal.woreda))
      return setError('Please fill in all required fields (*).'), false
    if (step===2 && (!business.businessName||!business.businessDescription))
      return setError('Please fill in all required fields (*).'), false
    if (step===3 && documents.length===0) return setError('Add at least one document.'), false
    if (step===4 && !quiz.passed) return setError('You must pass the assessment (70%) to continue.'), false
    return true
  }
  const next = () => { if(validate()) setStep(s=>s+1) }
  const back = () => { setError(''); setStep(s=>s-1) }

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/applications',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...personal,...business,capitalAmount:business.capitalAmount?parseFloat(business.capitalAmount):null,employeeCount:business.employeeCount?parseInt(business.employeeCount):null,assessmentScore:quiz.score,assessmentPassed:quiz.passed}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error||'Submission failed')
      setRefNumber(data.application?.referenceNumber||'HRS-APP-2026-XXXX')
      setSubmitted(true)
    } catch(err:any){ setError(err.message) } finally{ setLoading(false) }
  }

  /* ── Success Screen ── */
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:'#0f1729'}}>
      <div className="rounded-2xl p-10 text-center max-w-md w-full" style={{background:'#1a2540', border:'1px solid rgba(201,168,76,0.2)'}}>
        <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center grad-gold pulse-gold">
          <CheckCircle className="w-10 h-10" style={{color:'#0f1729'}} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
        <p className="mb-5 text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Your application has been received successfully.</p>
        <div className="rounded-xl p-4 mb-6" style={{background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)'}}>
          <p className="text-xs mb-1" style={{color:'rgba(201,168,76,0.7)'}}>REFERENCE NUMBER</p>
          <p className="text-xl font-bold font-mono" style={{color:'#c9a84c'}}>{refNumber}</p>
        </div>
        <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>A Bureau reviewer will process your application within <strong className="text-white">24 hours</strong>.</p>
        <Link href="/dashboard" className="btn btn-gold w-full py-3">Go to Dashboard</Link>
      </div>
    </div>
  )

  const inputStyle = { background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)', color:'white' }
  const labelStyle = { color:'rgba(255,255,255,0.65)' }

  return (
    <div className="min-h-screen" style={{background:'#0f1729'}}>
      {/* Nav */}
      <nav className="px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 glass-dark" style={{borderColor:'rgba(201,168,76,0.15)'}}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)'}}>
            <img src="/harari-logo.svg" alt="Harari Emblem" style={{width:'30px',height:'30px',objectFit:'contain'}} />
          </div>
          <span className="font-bold text-white text-sm">New Application</span>
        </Link>
        <Link href="/dashboard" className="btn btn-ghost text-sm flex items-center gap-1" style={{color:'rgba(255,255,255,0.5)'}}>
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-10">
        {/* Step indicator */}
        <div className="flex items-center mb-10 relative">
          <div className="absolute left-0 right-0 top-5 h-px" style={{background:'rgba(255,255,255,0.08)'}} />
          {STEPS.map(s=>{
            const Icon=s.icon; const done=step>s.id; const active=step===s.id
            return (
              <div key={s.id} className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${done?'step-done':active?'step-active':'step-idle'}`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-2 font-medium ${active?'text-gold':done?'text-green-400':'text-muted'}`}
                  style={{color:active?'#c9a84c':done?'#10b981':'rgba(255,255,255,0.35)'}}>
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="rounded-xl p-3 mb-5 text-sm" style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5'}}>⚠ {error}</div>
        )}

        {/* STEP 1 */}
        {step===1 && (
          <div className="rounded-2xl p-8" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
            <h2 className="text-xl font-bold text-white mb-1">Personal Information</h2>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Tell us about yourself</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[['firstName','First Name *'],['lastName','Last Name *'],['email','Email *'],['phone','Phone *'],['nationalId','National ID *'],['dateOfBirth','Date of Birth'],['woreda','Woreda *'],['kebele','Kebele'],['houseNumber','House Number']].map(([k,lbl])=>(
                <div key={k} className={k==='email'||k==='nationalId'?'md:col-span-2':''}>
                  <label className="label" style={labelStyle}>{lbl}</label>
                  <input type={k==='dateOfBirth'?'date':k==='email'?'email':'text'} className="input" placeholder={lbl.replace(' *','')} style={inputStyle}
                    value={(personal as any)[k]} onChange={e=>setPersonal({...personal,[k]:e.target.value})} />
                </div>
              ))}
              <div>
                <label className="label" style={labelStyle}>Gender</label>
                <select className="input" style={inputStyle} value={personal.gender} onChange={e=>setPersonal({...personal,gender:e.target.value})}>
                  <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="label" style={labelStyle}>Region</label>
                <input readOnly className="input" style={{...inputStyle,opacity:0.5}} value="Harari" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div className="rounded-2xl p-8" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
            <h2 className="text-xl font-bold text-white mb-1">Business Information</h2>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Tell us about your business</p>
            <div className="space-y-4">
              <div>
                <label className="label" style={labelStyle}>Business Name *</label>
                <input className="input" placeholder="Your business name" style={inputStyle} value={business.businessName} onChange={e=>setBusiness({...business,businessName:e.target.value})} />
              </div>
              <div>
                <label className="label" style={labelStyle}>Business Sector *</label>
                <select className="input" style={inputStyle} value={business.businessSector} onChange={e=>setBusiness({...business,businessSector:e.target.value})}>
                  {SECTORS.map(s=><option key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="label" style={labelStyle}>Business Description *</label>
                <textarea rows={4} className="input resize-none" placeholder="Describe your business activities…" style={inputStyle} value={business.businessDescription} onChange={e=>setBusiness({...business,businessDescription:e.target.value})} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[['capitalAmount','Capital Amount (ETB)','number'],['employeeCount','Number of Employees','number']].map(([k,lbl,type])=>(
                  <div key={k}>
                    <label className="label" style={labelStyle}>{lbl}</label>
                    <input type={type} className="input" placeholder="e.g. 500000" style={inputStyle} value={(business as any)[k]} onChange={e=>setBusiness({...business,[k]:e.target.value})} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div className="rounded-2xl p-8" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
            <h2 className="text-xl font-bold text-white mb-1">Upload Documents</h2>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Upload required supporting documents</p>
            <div className="space-y-3">
              {documents.map((doc,i)=>(
                <div key={i} className="rounded-xl p-4 space-y-3" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Document {i+1}</span>
                    <button onClick={()=>removeDoc(i)} className="flex items-center gap-1 text-xs" style={{color:'#ef4444'}}>
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                  <select className="input" style={inputStyle} value={doc.type} onChange={e=>updateDoc(i,'type',e.target.value)}>
                    {DOC_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g,' ').charAt(0)+t.replace(/_/g,' ').slice(1).toLowerCase()}</option>)}
                  </select>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>handleFile(i,e)}
                    className="block w-full text-sm file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold cursor-pointer"
                    style={{color:'rgba(255,255,255,0.5)'}} />
                  {doc.name && <p className="text-xs" style={{color:'#10b981'}}>✓ {doc.name}</p>}
                </div>
              ))}
              <button onClick={addDoc} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition"
                style={{border:'2px dashed rgba(201,168,76,0.3)',color:'#c9a84c',background:'rgba(201,168,76,0.04)'}}>
                <Plus className="w-4 h-4" /> Add Document
              </button>
              {documents.length===0 && <p className="text-center text-sm py-2" style={{color:'rgba(255,255,255,0.3)'}}>National ID, educational certificates, business plan, lease agreement…</p>}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step===4 && (
          <div className="rounded-2xl p-8" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
            <h2 className="text-xl font-bold text-white mb-1">Competence Assessment</h2>
            <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.4)'}}>Answer 10 questions — pass mark 70%</p>
            {quiz.submitted ? (
              <div className="text-center py-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${quiz.passed?'grad-gold pulse-gold':'bg-red-900/30'}`}>
                  <span className={`text-2xl font-bold ${quiz.passed?'':'text-red-400'}`} style={quiz.passed?{color:'#0f1729'}:{}}>{quiz.score}%</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${quiz.passed?'text-gold-light':'text-red-400'}`} style={quiz.passed?{color:'#e4c97a'}:{color:'#f87171'}}>
                  {quiz.passed ? '🎉 Assessment Passed!' : '❌ Not Passed'}
                </h3>
                <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.45)'}}>{quiz.passed?'Excellent! Proceed to submit your application.':'You need 70% or more. Please try again.'}</p>
                {!quiz.passed && <button onClick={retryQuiz} className="btn btn-gold">Retry Assessment</button>}
              </div>
            ) : (
              <div>
                {/* Progress */}
                <div className="flex justify-between text-xs mb-2" style={{color:'rgba(255,255,255,0.45)'}}>
                  <span>Question {quiz.current+1} / {quiz.questions.length}</span>
                  <span>{Object.keys(quiz.answers).length} answered</span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-6" style={{background:'rgba(255,255,255,0.08)'}}>
                  <div className="h-1.5 rounded-full grad-gold transition-all" style={{width:`${(quiz.current/quiz.questions.length)*100}%`}} />
                </div>
                {(() => {
                  const q = quiz.questions[quiz.current]
                  return (
                    <div>
                      <div className="rounded-xl p-4 mb-5" style={{background:'rgba(201,168,76,0.07)',border:'1px solid rgba(201,168,76,0.15)'}}>
                        <span className="text-xs font-bold tracking-wider" style={{color:'rgba(201,168,76,0.6)'}}>{q.category.replace(/_/g,' ').toUpperCase()}</span>
                        <p className="text-white font-semibold mt-1 leading-snug">{q.question}</p>
                      </div>
                      <div className="space-y-3 mb-4">
                        {q.options.map((opt,idx)=>{
                          const selected=quiz.answers[q.id]===idx; const isCorrect=idx===q.correctAnswer; const answered=quiz.answers[q.id]!==undefined
                          return (
                            <button key={idx} onClick={()=>!answered&&handleAnswer(q.id,idx)} disabled={answered}
                              className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition"
                              style={{ border: '2px solid', borderColor: !answered?'rgba(255,255,255,0.1)':isCorrect?'#10b981':selected?'#ef4444':'rgba(255,255,255,0.06)', background: !answered?'rgba(255,255,255,0.04)':isCorrect?'rgba(16,185,129,0.12)':selected?'rgba(239,68,68,0.12)':'transparent', color: !answered?'rgba(255,255,255,0.85)':isCorrect?'#6ee7b7':selected?'#fca5a5':'rgba(255,255,255,0.3)', cursor:answered?'not-allowed':'pointer' }}>
                              <span className="font-bold mr-2 opacity-60">{String.fromCharCode(65+idx)}.</span>{opt}
                            </button>
                          )
                        })}
                      </div>
                      {quiz.showExp && (
                        <div className="rounded-xl p-4 mb-3" style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.25)'}}>
                          <p className="font-bold text-sm mb-1" style={{color:'#fcd34d'}}>Incorrect — Here is the explanation:</p>
                          <p className="text-sm" style={{color:'rgba(255,255,255,0.65)'}}>{q.explanation}</p>
                          <button onClick={nextAfterExp} className="btn btn-gold text-sm mt-3">Next Question →</button>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* STEP 5 */}
        {step===5 && (
          <div className="space-y-4">
            {[
              { title:'Personal Information', editStep:1, rows:[['Full Name',`${personal.firstName} ${personal.lastName}`],['Email',personal.email],['Phone',personal.phone],['National ID',personal.nationalId],['Address',`${personal.woreda}, Kebele ${personal.kebele}, Harari`]] },
              { title:'Business Information', editStep:2, rows:[['Business Name',business.businessName],['Sector',business.businessSector],['Capital (ETB)',business.capitalAmount||'—'],['Employees',business.employeeCount||'—'],['Description',business.businessDescription]] },
            ].map(section=>(
              <div key={section.title} className="rounded-2xl p-6" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{color:'#c9a84c'}}>{section.title}</h3>
                  <button onClick={()=>setStep(section.editStep)} className="text-xs font-medium hover:underline" style={{color:'rgba(255,255,255,0.45)'}}>Edit</button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {section.rows.map(([lbl,val])=>(
                    <div key={lbl}><p className="text-xs" style={{color:'rgba(255,255,255,0.35)'}}>{lbl}</p><p className="text-sm font-medium text-white">{val||'—'}</p></div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-6" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold" style={{color:'#c9a84c'}}>Documents ({documents.length})</h3>
                <button onClick={()=>setStep(3)} className="text-xs font-medium hover:underline" style={{color:'rgba(255,255,255,0.45)'}}>Edit</button>
              </div>
              {documents.map((d,i)=><div key={i} className="flex items-center gap-2 text-sm py-1" style={{color:'rgba(255,255,255,0.6)'}}><CheckCircle className="w-3 h-3" style={{color:'#10b981'}} />{d.type.replace(/_/g,' ')} {d.name&&<span style={{color:'rgba(255,255,255,0.3)'}}>— {d.name}</span>}</div>)}
            </div>

            <div className="rounded-2xl p-6 flex items-center gap-4" style={{background:'#1a2540',border:'1px solid rgba(201,168,76,0.15)'}}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${quiz.passed?'grad-gold':'bg-red-900/30'}`}>
                <span className="text-sm font-bold" style={quiz.passed?{color:'#0f1729'}:{color:'#f87171'}}>{quiz.score}%</span>
              </div>
              <div><p className="font-bold" style={{color:quiz.passed?'#6ee7b7':'#f87171'}}>{quiz.passed?'✅ Assessment Passed':'❌ Not Passed'}</p><p className="text-xs" style={{color:'rgba(255,255,255,0.35)'}}>Pass mark: 70%</p></div>
            </div>

            <div className="rounded-xl p-4 text-sm" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)'}}>
              By submitting, I confirm all information is accurate and complete. Providing false information may result in rejection or cancellation of my certificate.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step>1
            ? <button onClick={back} className="btn btn-outline flex items-center gap-2" style={{borderColor:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)'}}><ArrowLeft className="w-4 h-4" /> Back</button>
            : <Link href="/dashboard" className="btn btn-outline flex items-center gap-2" style={{borderColor:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)'}}><ArrowLeft className="w-4 h-4" /> Cancel</Link>}
          {step<5
            ? <button onClick={next} disabled={step===4&&!quiz.submitted} className="btn btn-gold flex items-center gap-2">Next <ArrowRight className="w-4 h-4" /></button>
            : <button onClick={submit} disabled={loading} className="btn btn-gold flex items-center gap-2 px-8"><Send className="w-4 h-4" />{loading?'Submitting…':'Submit Application'}</button>}
        </div>
        <p className="text-center text-xs mt-4" style={{color:'rgba(255,255,255,0.25)'}}>Step {step} of {STEPS.length}</p>
      </div>
    </div>
  )
}
