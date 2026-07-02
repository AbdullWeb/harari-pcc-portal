import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session || (session.role !== 'REVIEWER' && session.role !== 'ADMIN'))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('status') || 'all'

  const where = filter === 'all'
    ? { status: { in: ['SUBMITTED','UNDER_REVIEW'] as any } }
    : { status: filter as any }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { submittedAt: 'asc' },
    include: {
      user: { select: { firstName:true, lastName:true, email:true } },
      reviewer: { select: { firstName:true, lastName:true } },
    }
  })
  return NextResponse.json({ applications })
}
