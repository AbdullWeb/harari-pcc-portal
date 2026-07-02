import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

async function generateRefNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const counter = await prisma.sequenceCounter.upsert({
    where: { id: 'certificate_counter' },
    update: { sequence: { increment: 1 } },
    create: { id: 'certificate_counter', year, sequence: 2 }
  })
  return `HRS-APP-${year}-${String(counter.sequence).padStart(4, '0')}`
}

// GET — list applications for logged-in user (or all for reviewer/admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const where =
      session.role === 'APPLICANT'
        ? { userId: session.userId }
        : session.role === 'REVIEWER'
        ? { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] as any } }
        : {}  // ADMIN sees all

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        certificate: { select: { certificateNumber: true, issuedAt: true } },
        reviewer:    { select: { firstName: true, lastName: true } },
      }
    })
    return NextResponse.json({ applications })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

// POST — create a new application (applicant only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    // Fall back to demo applicant if no session (dev convenience)
    let userId = session?.userId

    if (!userId) {
      const demo = await prisma.user.findUnique({ where: { email: 'applicant@demo.com' } })
      if (!demo) return NextResponse.json({ error: 'Please login first.' }, { status: 401 })
      userId = demo.id
    }

    const body = await request.json()
    const {
      firstName, lastName, email, phone, nationalId,
      dateOfBirth, gender, region, woreda, kebele, houseNumber,
      businessName, businessSector, businessDescription,
      capitalAmount, employeeCount, assessmentScore, assessmentPassed,
    } = body

    if (!firstName || !lastName || !businessName)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const referenceNumber = await generateRefNumber()

    const application = await prisma.application.create({
      data: {
        userId,
        status: 'SUBMITTED',
        referenceNumber,
        firstName, lastName, email, phone, nationalId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender, region, woreda, kebele, houseNumber,
        businessName,
        businessSector: businessSector as any,
        businessDescription,
        capitalAmount: capitalAmount ? parseFloat(String(capitalAmount)) : null,
        employeeCount: employeeCount ? parseInt(String(employeeCount)) : null,
        assessmentScore: assessmentScore ?? null,
        assessmentPassed: assessmentPassed ?? false,
        assessmentAttempts: 1,
        submittedAt: new Date(),
      }
    })

    await prisma.auditLog.create({
      data: {
        userId,
        applicationId: application.id,
        action: 'APPLICATION_SUBMITTED',
        details: `Application ${referenceNumber} submitted for ${businessName}`,
      }
    })

    return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
