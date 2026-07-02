import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for demo accounts
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      nationalId: 'ADMIN001',
      phone: '+251-25-666-0001',
      region: 'Harari',
      woreda: 'Harar',
      kebele: '01'
    }
  })

  console.log('✅ Created admin user:', admin.email)

  // Create Reviewer User
  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@demo.com' },
    update: {},
    create: {
      email: 'reviewer@demo.com',
      password: hashedPassword,
      firstName: 'Reviewer',
      lastName: 'Officer',
      role: 'REVIEWER',
      nationalId: 'REV001',
      phone: '+251-25-666-0002',
      region: 'Harari',
      woreda: 'Harar',
      kebele: '02'
    }
  })

  console.log('✅ Created reviewer user:', reviewer.email)

  // Create Applicant User
  const applicant = await prisma.user.upsert({
    where: { email: 'applicant@demo.com' },
    update: {},
    create: {
      email: 'applicant@demo.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'APPLICANT',
      nationalId: 'ETH123456789',
      phone: '+251-91-123-4567',
      region: 'Harari',
      woreda: 'Harar',
      kebele: '05'
    }
  })

  console.log('✅ Created applicant user:', applicant.email)

  // Create a sample approved application with certificate
  const application = await prisma.application.upsert({
    where: { id: 'sample-app-1' },
    update: {},
    create: {
      id: 'sample-app-1',
      userId: applicant.id,
      status: 'CERTIFICATE_ISSUED',
      referenceNumber: 'HRS-APP-2026-0001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'applicant@demo.com',
      phone: '+251-91-123-4567',
      nationalId: 'ETH123456789',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'Male',
      region: 'Harari',
      woreda: 'Harar',
      kebele: '05',
      houseNumber: '123',
      businessName: 'Harar Coffee House',
      businessSector: 'HOSPITALITY',
      businessDescription: 'Traditional Ethiopian coffee house serving authentic Harari coffee',
      capitalAmount: 500000,
      employeeCount: 5,
      assessmentScore: 85,
      assessmentPassed: true,
      assessmentAttempts: 1,
      reviewerId: reviewer.id,
      reviewNotes: 'All requirements met. Approved.',
      reviewedAt: new Date(),
      submittedAt: new Date(),
      completedAt: new Date()
    }
  })

  console.log('✅ Created sample application:', application.referenceNumber)

  // Create certificate for the application
  const certificate = await prisma.certificate.upsert({
    where: { applicationId: application.id },
    update: {},
    create: {
      applicationId: application.id,
      certificateNumber: 'HRS-PCC-CERT-2026-0001',
      holderName: 'John Doe',
      businessName: 'Harar Coffee House',
      businessSector: 'HOSPITALITY',
      issuedAt: new Date(),
      isValid: true
    }
  })

  console.log('✅ Created sample certificate:', certificate.certificateNumber)

  // Initialize sequence counter
  await prisma.sequenceCounter.upsert({
    where: { id: 'certificate_counter' },
    update: {},
    create: {
      id: 'certificate_counter',
      year: 2026,
      sequence: 1
    }
  })

  console.log('✅ Initialized sequence counter')

  console.log('\n🎉 Seeding completed successfully!')
  console.log('\n📝 Demo Accounts:')
  console.log('   Admin:     admin@demo.com / password123')
  console.log('   Reviewer:  reviewer@demo.com / password123')
  console.log('   Applicant: applicant@demo.com / password123')
  console.log('\n🔍 Sample Certificate Number: HRS-PCC-CERT-2026-0001')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
