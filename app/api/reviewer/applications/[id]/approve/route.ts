import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

async function genCertNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const counter = await prisma.sequenceCounter.upsert({
    where: { id: 'certificate_counter' },
    update: { sequence: { increment: 1 } },
    create: { id: 'certificate_counter', year, sequence: 1 }
  })
  return `HRS-PCC-CERT-${year}-${String(counter.sequence).padStart(4,'0')}`
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || (session.role !== 'REVIEWER' && session.role !== 'ADMIN'))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const notes = body.notes || ''

  const app = await prisma.application.findUnique({ where: { id } })
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Update application
  await prisma.application.update({
    where: { id },
    data: {
      status: 'CERTIFICATE_ISSUED',
      reviewerId: session.userId,
      reviewNotes: notes,
      reviewedAt: new Date(),
      completedAt: new Date(),
    }
  })

  // Issue certificate
  const certNumber = await genCertNumber()
  const certificate = await prisma.certificate.create({
    data: {
      applicationId: id,
      certificateNumber: certNumber,
      holderName: `${app.firstName || ''} ${app.lastName || ''}`.trim(),
      businessName: app.businessName || 'Unknown',
      businessSector: (app.businessSector as any) || 'OTHER',
      issuedAt: new Date(),
      isValid: true,
    }
  })

  await prisma.auditLog.create({ data: { userId: session.userId, applicationId: id, action: 'APPLICATION_APPROVED', details: `Approved by ${session.email}. Cert: ${certNumber}` } })
  return NextResponse.json({ certificate, message: 'Application approved and certificate issued.' })
}
