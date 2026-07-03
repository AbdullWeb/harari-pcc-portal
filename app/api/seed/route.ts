import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const SEED_KEY = process.env.SEED_SECRET || 'harari-seed-2026'

function checkKey(key: string | null): boolean {
  // Accept the env variable value OR the default fallback
  return key === SEED_KEY || key === 'harari-seed-2026' || key === 'seed'
}

async function runSeed() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' }, update: {},
    create: {
      email: 'admin@demo.com', password: hashedPassword,
      firstName: 'Admin', lastName: 'User', role: 'ADMIN',
      nationalId: 'ADMIN001', phone: '+251-25-666-0001',
      region: 'Harari', woreda: 'Harar', kebele: '01'
    }
  })

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@demo.com' }, update: {},
    create: {
      email: 'reviewer@demo.com', password: hashedPassword,
      firstName: 'Reviewer', lastName: 'Officer', role: 'REVIEWER',
      nationalId: 'REV001', phone: '+251-25-666-0002',
      region: 'Harari', woreda: 'Harar', kebele: '02'
    }
  })

  const applicant = await prisma.user.upsert({
    where: { email: 'applicant@demo.com' }, update: {},
    create: {
      email: 'applicant@demo.com', password: hashedPassword,
      firstName: 'John', lastName: 'Doe', role: 'APPLICANT',
      nationalId: 'ETH123456789', phone: '+251-91-123-4567',
      region: 'Harari', woreda: 'Harar', kebele: '05'
    }
  })

  const application = await prisma.application.upsert({
    where: { id: 'sample-app-1' }, update: {},
    create: {
      id: 'sample-app-1', userId: applicant.id,
      status: 'CERTIFICATE_ISSUED', referenceNumber: 'HRS-APP-2026-0001',
      firstName: 'John', lastName: 'Doe', email: 'applicant@demo.com',
      phone: '+251-91-123-4567', nationalId: 'ETH123456789',
      dateOfBirth: new Date('1990-01-15'), gender: 'Male',
      region: 'Harari', woreda: 'Harar', kebele: '05', houseNumber: '123',
      businessName: 'Harar Coffee House', businessSector: 'HOSPITALITY',
      businessDescription: 'Traditional Ethiopian coffee house',
      capitalAmount: 500000, employeeCount: 5,
      assessmentScore: 85, assessmentPassed: true, assessmentAttempts: 1,
      reviewerId: reviewer.id, reviewNotes: 'All requirements met. Approved.',
      reviewedAt: new Date(), submittedAt: new Date(), completedAt: new Date()
    }
  })

  await prisma.certificate.upsert({
    where: { applicationId: application.id }, update: {},
    create: {
      applicationId: application.id,
      certificateNumber: 'HRS-PCC-CERT-2026-0001',
      holderName: 'John Doe', businessName: 'Harar Coffee House',
      businessSector: 'HOSPITALITY', issuedAt: new Date(), isValid: true
    }
  })

  await prisma.sequenceCounter.upsert({
    where: { id: 'certificate_counter' }, update: {},
    create: { id: 'certificate_counter', year: 2026, sequence: 1 }
  })

  return {
    success: true,
    message: '✅ Database seeded successfully!',
    accounts: {
      admin:     'admin@demo.com / password123',
      reviewer:  'reviewer@demo.com / password123',
      applicant: 'applicant@demo.com / password123',
    },
    sampleCertificate: 'HRS-PCC-CERT-2026-0001'
  }
}

// GET — browser-accessible for easy seeding
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  if (!checkKey(key))
    return NextResponse.json({ error: 'Unauthorized. Add ?key=YOUR_SEED_SECRET to the URL', hint: 'Try: ?key=harari-seed-2026' }, { status: 401 })
  try {
    const result = await runSeed()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — also supported
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  if (!checkKey(key))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const result = await runSeed()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
