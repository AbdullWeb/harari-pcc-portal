import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || (session.role !== 'REVIEWER' && session.role !== 'ADMIN'))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const app = await prisma.application.update({
    where: { id },
    data: { status: 'UNDER_REVIEW', reviewerId: session.userId }
  })
  await prisma.auditLog.create({ data: { userId: session.userId, applicationId: id, action: 'APPLICATION_CLAIMED', details: `Claimed by ${session.email}` } })
  return NextResponse.json({ application: app })
}
