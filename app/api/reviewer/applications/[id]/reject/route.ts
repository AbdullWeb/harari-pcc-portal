import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || (session.role !== 'REVIEWER' && session.role !== 'ADMIN'))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const reason = body.reason || 'Application does not meet requirements.'

  await prisma.application.update({
    where: { id },
    data: { status: 'REJECTED', reviewerId: session.userId, reviewNotes: reason, reviewedAt: new Date() }
  })
  await prisma.auditLog.create({ data: { userId: session.userId, applicationId: id, action: 'APPLICATION_REJECTED', details: `Rejected by ${session.email}. Reason: ${reason}` } })
  return NextResponse.json({ message: 'Application rejected.' })
}
