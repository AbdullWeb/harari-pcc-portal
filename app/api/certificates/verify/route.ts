import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const number = searchParams.get('number')

    if (!number) {
      return NextResponse.json(
        { error: 'Certificate number is required' },
        { status: 400 }
      )
    }

    // Find certificate
    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: number },
      include: {
        application: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found', valid: false },
        { status: 404 }
      )
    }

    // Check if certificate is still valid
    const isExpired = certificate.expiresAt && new Date(certificate.expiresAt) < new Date()

    if (!certificate.isValid || isExpired) {
      return NextResponse.json({
        valid: false,
        error: 'Certificate is no longer valid',
        certificate: {
          certificateNumber: certificate.certificateNumber,
          holderName: certificate.holderName,
          status: 'EXPIRED'
        }
      })
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        holderName: certificate.holderName,
        businessName: certificate.businessName,
        businessSector: certificate.businessSector,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt
      }
    })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
