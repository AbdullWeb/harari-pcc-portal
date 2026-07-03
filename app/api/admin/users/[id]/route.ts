import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

// DELETE a user (Admin only)
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Prevent admin from deleting themselves
  if (id === session.userId)
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })

  try {
    // First delete related records to avoid foreign key constraint errors
    await prisma.auditLog.deleteMany({ where: { userId: id } })
    await prisma.notification.deleteMany({ where: { userId: id } })

    // Delete the user (applications stay for audit trail, just unlink reviewer)
    await prisma.application.updateMany({
      where: { reviewerId: id },
      data: { reviewerId: null }
    })

    await prisma.user.delete({ where: { id } })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'USER_DELETED',
        details: `User ${id} deleted by admin ${session.email}`
      }
    })

    return NextResponse.json({ message: 'User deleted successfully.' })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 })
  }
}

// PATCH — update user role (Admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { role } = body

  if (!['APPLICANT', 'REVIEWER', 'ADMIN'].includes(role))
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, firstName: true, lastName: true, email: true, role: true }
  })

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: 'USER_ROLE_CHANGED',
      details: `User ${user.email} role changed to ${role} by ${session.email}`
    }
  })

  return NextResponse.json({ user })
}
