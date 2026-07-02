import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [users, applications, certificates, auditLogs] = await Promise.all([
    prisma.user.count(),
    prisma.application.count(),
    prisma.certificate.count(),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { user: { select: { firstName:true, lastName:true } } } }),
  ])

  const pending  = await prisma.application.count({ where: { status: { in: ['SUBMITTED','UNDER_REVIEW'] } } })
  const approved = await prisma.application.count({ where: { status: { in: ['APPROVED','CERTIFICATE_ISSUED'] } } })
  const rejected = await prisma.application.count({ where: { status: 'REJECTED' } })

  return NextResponse.json({ users, applications, certificates, pending, approved, rejected, recentActivity: auditLogs })
}
