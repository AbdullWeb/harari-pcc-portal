import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
        certificate: true,
        reviewer: { select: { firstName: true, lastName: true, email: true } },
        auditLogs: { orderBy: { createdAt: 'asc' } }
      }
    })

    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Applicants can only see their own applications
    if (session.role === 'APPLICANT' && application.userId !== session.userId)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    return NextResponse.json({ application })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
