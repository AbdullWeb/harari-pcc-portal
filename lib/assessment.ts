// Competence Assessment Question Bank (17 questions)
export interface AssessmentQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: 'business_law' | 'taxation' | 'labour_law' | 'consumer_protection' | 'regional_regulations'
}

export const questionBank: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'Under Ethiopian Commercial Code, what is the minimum capital requirement for a share company?',
    options: ['ETB 50,000', 'ETB 100,000', 'ETB 250,000', 'ETB 500,000'],
    correctAnswer: 2,
    explanation: 'According to the Ethiopian Commercial Code, a share company requires a minimum capital of ETB 250,000.',
    category: 'business_law'
  },
  {
    id: 'q2',
    question: 'What is the current VAT rate in Ethiopia?',
    options: ['10%', '15%', '18%', '20%'],
    correctAnswer: 1,
    explanation: 'The standard VAT rate in Ethiopia is 15% as per the VAT Proclamation.',
    category: 'taxation'
  },
  {
    id: 'q3',
    question: 'What is the minimum daily wage for workers in Ethiopia?',
    options: ['No legal minimum', 'ETB 500', 'ETB 1,000', 'ETB 1,500'],
    correctAnswer: 0,
    explanation: 'Ethiopia currently does not have a legally mandated minimum wage for the private sector.',
    category: 'labour_law'
  },
  {
    id: 'q4',
    question: 'A business license must be renewed every:',
    options: ['6 months', '1 year', '2 years', '3 years'],
    correctAnswer: 1,
    explanation: 'Business licenses in Ethiopia must be renewed annually.',
    category: 'business_law'
  },
  {
    id: 'q5',
    question: 'What is the maximum working hours per week under Ethiopian labour law?',
    options: ['40 hours', '44 hours', '48 hours', '52 hours'],
    correctAnswer: 2,
    explanation: 'The Ethiopian Labour Proclamation sets the maximum working hours at 48 hours per week.',
    category: 'labour_law'
  },
  {
    id: 'q6',
    question: 'Which document is NOT required for business registration in Harari Region?',
    options: ['National ID', 'Business plan', 'University degree', 'Lease agreement'],
    correctAnswer: 2,
    explanation: 'While educational certificates may be required depending on the business type, a university degree is not universally mandatory for all businesses.',
    category: 'regional_regulations'
  },
  {
    id: 'q7',
    question: 'What is the TIN (Taxpayer Identification Number) issuing authority in Ethiopia?',
    options: ['Ministry of Trade', 'Ethiopian Revenues and Customs Authority', 'Regional Trade Bureau', 'Commercial Bank of Ethiopia'],
    correctAnswer: 1,
    explanation: 'ERCA (Ethiopian Revenues and Customs Authority) is responsible for issuing TIN numbers.',
    category: 'taxation'
  },
  {
    id: 'q8',
    question: 'Under Ethiopian consumer protection law, defective goods can be returned within:',
    options: ['7 days', '14 days', '30 days', '90 days'],
    correctAnswer: 1,
    explanation: 'Consumers have 14 days to return defective goods under Ethiopian consumer protection regulations.',
    category: 'consumer_protection'
  },
  {
    id: 'q9',
    question: 'What is the mandatory maternity leave period in Ethiopia?',
    options: ['60 days', '90 days', '120 days', '180 days'],
    correctAnswer: 2,
    explanation: 'Female employees are entitled to 120 days of maternity leave under Ethiopian labour law.',
    category: 'labour_law'
  },
  {
    id: 'q10',
    question: 'Business income tax in Ethiopia is calculated on:',
    options: ['Gross revenue', 'Net profit', 'Total assets', 'Employee count'],
    correctAnswer: 1,
    explanation: 'Business income tax is levied on the net taxable profit of the business.',
    category: 'taxation'
  },
  {
    id: 'q11',
    question: 'Harar Jugol UNESCO World Heritage Site regulations require special permits for businesses in:',
    options: ['All sectors', 'Food and beverage only', 'Construction and renovation', 'Retail trade'],
    correctAnswer: 2,
    explanation: 'Construction and renovation activities within Harar Jugol require special heritage preservation permits.',
    category: 'regional_regulations'
  },
  {
    id: 'q12',
    question: 'What is the penalty for operating without a valid business license?',
    options: ['Warning only', 'Fine up to ETB 10,000', 'Fine and business closure', 'Criminal prosecution'],
    correctAnswer: 2,
    explanation: 'Operating without a license can result in fines and mandatory business closure until compliance.',
    category: 'business_law'
  },
  {
    id: 'q13',
    question: 'Overtime pay must be at least what percentage above normal pay?',
    options: ['25%', '50%', '75%', '100%'],
    correctAnswer: 1,
    explanation: 'Ethiopian labour law requires overtime to be paid at 150% (50% above) the normal hourly rate.',
    category: 'labour_law'
  },
  {
    id: 'q14',
    question: 'Who is responsible for collecting withholding tax on employee salaries?',
    options: ['The employee', 'The employer', 'ERCA directly', 'The bank'],
    correctAnswer: 1,
    explanation: 'Employers are legally required to withhold and remit income tax from employee salaries.',
    category: 'taxation'
  },
  {
    id: 'q15',
    question: 'Consumer protection law requires businesses to provide:',
    options: ['Free samples', 'Clear pricing and product information', 'Home delivery', 'Lifetime warranty'],
    correctAnswer: 1,
    explanation: 'Businesses must display clear, accurate pricing and product information to consumers.',
    category: 'consumer_protection'
  },
  {
    id: 'q16',
    question: 'In Harari Region, trade license applications are processed by:',
    options: ['Woreda Administration', 'Trade, Industry & Tourism Bureau', 'Chamber of Commerce', 'Federal Ministry of Trade'],
    correctAnswer: 1,
    explanation: 'The Harari Trade, Industry & Tourism Development Bureau handles all trade licensing.',
    category: 'regional_regulations'
  },
  {
    id: 'q17',
    question: 'What is the probation period allowed under Ethiopian employment law?',
    options: ['30 days', '45 days', '60 days', '90 days'],
    correctAnswer: 1,
    explanation: 'The maximum probation period is 45 days for most employment contracts.',
    category: 'labour_law'
  }
]

export function getRandomQuestions(count: number = 10): AssessmentQuestion[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function calculateScore(answers: Record<string, number>): { score: number; total: number; passed: boolean } {
  let correct = 0
  const total = Object.keys(answers).length
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questionBank.find(q => q.id === questionId)
    if (question && question.correctAnswer === answer) {
      correct++
    }
  })
  
  const score = Math.round((correct / total) * 100)
  const passed = score >= 70
  
  return { score, total, passed }
}
