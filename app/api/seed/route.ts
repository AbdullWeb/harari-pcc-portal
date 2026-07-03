import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Secret key required to run seed — prevents random people from seeding
const SEED_KEY = process.env.SEED_SECRET || 'harari-seed-2026'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (key !== SEED_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Upsert users
    const admin = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        email: 'admin@demo.com', password: hashedPassword,
        firstName: 'Admin', lastName: 'User', role: 'ADMIN',
        nationalId: 'ADMIN001', phone: '+251-25-666-0001',
        region: 'Harari', woreda: 'Harar', kebele: '01'
      }
    })

    const reviewer = await prisma.user.upsert({
      where: { email: 'reviewer@demo.com' },
      update: {},
      create: {
        email: 'reviewer@demo.com', password: hashedPassword,
        firstName: 'Reviewer', lastName: 'Officer', role: 'REVIEWER',
        nationalId: 'REV001', phone: '+251-25-666-0002',
        region: 'Harari', woreda: 'Harar', kebele: '02'
      }
    })

    const applicant = await prisma.user.upsert({
      where: { email: 'applicant@demo.com' },
      update: {},
      create: {
        email: 'applicant@demo.com', password: hashedPassword,
        firstName: 'John', lastName: 'Doe', role: 'APPLICANT',
        nationalId: 'ETH123456789', phone: '+251-91-123-4567',
        region: 'Harari', woreda: 'Harar', kebele: '05'
      }
    })

    // Sample application
    const application = await prisma.application.upsert({
      where: { id: 'sample-app-1' },
      update: {},
      create: {
        id: 'sample-app-1',
        userId: applicant.id,
        status: 'CERTIFICATE_ISSUED',
        referenceNumber: 'HRS-APP-2026-0001',
        firstName: 'John', lastName: 'Doe',
        email: 'applicant@demo.com', phone: '+251-91-123-4567',
        nationalId: 'ETH123456789',
        dateOfBirth: new Date('1990-01-15'), gender: 'Male',
        region: 'Harari', woreda: 'Harar', kebele: '05', houseNumber: '123',
        businessName: 'Harar Coffee House', businessSector: 'HOSPITALITY',
        businessDescription: 'Traditional Ethiopian coffee house',
        capitalAmount: 500000, employeeCount: 5,
        assessmentScore: 85, assessmentPassed: true, assessmentAttempts: 1,
        reviewerId: reviewer.id,
        reviewNotes: 'All requirements met. Approved.',
        reviewedAt: new Date(), submittedAt: new Date(), completedAt: new Date()
      }
    })

    // Certificate
    await prisma.certificate.upsert({
      where: { applicationId: application.id },
      update: {},
      create: {
        applicationId: application.id,
        certificateNumber: 'HRS-PCC-CERT-2026-0001',
        holderName: 'John Doe', businessName: 'Harar Coffee House',
        businessSector: 'HOSPITALITY', issuedAt: new Date(), isValid: true
      }
    })

    // Sequence counter
    await prisma.sequenceCounter.upsert({
      where: { id: 'certificate_counter' },
      update: {},
      create: { id: 'certificate_counter', year: 2026, sequence: 1 }
    })

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully!',
      accounts: {
        admin:     'admin@demo.com / password123',
        reviewer:  'reviewer@demo.com / password123',
        applicant: 'applicant@demo.com / password123',
      },
      sampleCertificate: 'HRS-PCC-CERT-2026-0001'
    })

  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
