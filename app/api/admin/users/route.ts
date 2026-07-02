import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    select: { id:true, firstName:true, lastName:true, email:true, role:true, phone:true, createdAt:true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { firstName, lastName, email, password, role, phone } = body

  if (!firstName || !lastName || !email || !password)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'Email already exists' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashed, role: role || 'APPLICANT', phone },
    select: { id:true, firstName:true, lastName:true, email:true, role:true }
  })
  return NextResponse.json({ user }, { status: 201 })
}
