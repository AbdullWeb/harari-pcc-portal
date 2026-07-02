# Harari PCC Portal

Official digital platform for Professional Competence Certificate (PCC) issuance in the Harari People Regional State, Ethiopia.

## 🌟 Features

### For Applicants
- ✅ Self-service registration with national ID verification
- ✅ 5-step guided application wizard with autosave
- ✅ Document upload (19 document types supported)
- ✅ Randomized competence assessment (10 questions, 70% pass mark)
- ✅ Real-time application status tracking
- ✅ Downloadable PDF certificates

### For Reviewers
- ✅ Application queue with search and filters
- ✅ One-click approve/reject workflow
- ✅ Dashboard with analytics
- ✅ Full audit logging

### For Admins
- ✅ User management
- ✅ System-wide analytics
- ✅ Audit trail viewer
- ✅ Certificate management

### Public Features
- ✅ Certificate verification (no authentication required)
- ✅ Professional Harari-themed design
- ✅ Mobile-responsive interface

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd harari-pcc-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   npm run db:push
   ```

4. **Seed demo data:**
   ```bash
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Accounts

After seeding, use these accounts to test different roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@demo.com | password123 |
| **Reviewer** | reviewer@demo.com | password123 |
| **Applicant** | applicant@demo.com | password123 |

## 🧪 Test Certificate

Use this certificate number to test the verification system:
```
HRS-PCC-CERT-2026-0001
```

## 📋 Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js 20+)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Storage**: Local filesystem (development) / S3-compatible (production)

## 🗂️ Project Structure

```
harari-pcc-portal/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── verify/            # Certificate verification
│   ├── dashboard/         # Applicant dashboard
│   ├── reviewer/          # Reviewer console
│   ├── admin/             # Admin panel
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       ├── applications/  # Application management
│       └── certificates/  # Certificate operations
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication helpers
│   ├── utils.ts          # General utilities
│   └── assessment.ts     # Question bank & scoring
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
```

## 🎨 Design System

The portal uses a custom design inspired by Harari cultural elements:

- **Primary Color**: Royal Purple (`#7e22ce`) - Heritage & Authority
- **Secondary Color**: Islamic Green (`#10b981`) - Growth & Prosperity
- **Accent Color**: Gold (`#f59e0b`) - Excellence & Achievement
- **Patterns**: Eight-pointed star motif (Harar Jugol heritage)

## 📊 Application Workflow

```
1. Register → 2. Login → 3. Create Application → 4. Upload Documents
                                                          ↓
7. Download Certificate ← 6. Review & Approve ← 5. Complete Assessment
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed demo data
npm run db:reset     # Reset database and re-seed
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications` - List user's applications
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]` - Update application
- `POST /api/applications/[id]/submit` - Submit for review

### Certificates
- `GET /api/certificates/verify?number=XXX` - Verify certificate (public)
- `GET /api/certificates/[id]` - Get certificate details
- `GET /api/certificates/[id]/download` - Download PDF

### Reviewer
- `GET /api/reviewer/applications` - Get review queue
- `POST /api/reviewer/applications/[id]/claim` - Claim application
- `POST /api/reviewer/applications/[id]/approve` - Approve & issue certificate
- `POST /api/reviewer/applications/[id]/reject` - Reject application

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication with httpOnly cookies
- ✅ Role-based access control (RBAC)
- ✅ Server-side validation for all endpoints
- ✅ SQL injection prevention via Prisma ORM
- ✅ Full audit logging of all actions
- ✅ CSRF protection via SameSite cookies

## 📦 Database Schema

7 core entities:
- **User**: Applicants, Reviewers, Admins
- **Application**: PCC applications with 5-step workflow
- **Document**: Uploaded files with metadata
- **Certificate**: Issued certificates with unique numbers
- **AuditLog**: Complete activity trail
- **Notification**: User notifications
- **SequenceCounter**: Certificate number generation

## 🚀 Production Deployment

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-strong-random-secret"
NEXT_PUBLIC_APP_URL="https://pcc.harariregion.gov.et"
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
```

### Deployment Steps
1. Set up PostgreSQL database
2. Configure S3-compatible object storage
3. Set environment variables
4. Run migrations: `npx prisma migrate deploy`
5. Build: `npm run build`
6. Start: `npm run start`

### Recommended Stack
- **Hosting**: Vercel, AWS, DigitalOcean
- **Database**: PostgreSQL (AWS RDS, Supabase, Neon)
- **Storage**: AWS S3, MinIO, DigitalOcean Spaces
- **Domain**: pcc.harariregion.gov.et

## 📈 Expected Outcomes

| Metric | Baseline | Target |
|--------|----------|--------|
| Processing Time | 5-14 days | Under 24 hours |
| Citizen Transparency | 0% | 100% |
| Fraud Reduction | No verification | Public verification endpoint |
| Geographic Reach | In-person only | Online access from all woredas |

## 🤝 Contributing

This is an official government project for the Harari Regional State. For contributions or support:

**Contact:**
- Email: info@harariregion.gov.et
- Office: Trade, Industry & Tourism Development Bureau, Harar, Ethiopia

## 📄 License

© 2026 Harari People Regional State. All rights reserved.

Built with ❤️ for the entrepreneurs of Harari

---

## 🎯 Next Steps

After initial setup:

1. **Customize Content**: Update contact information, addresses, and regional specifics
2. **Add Assessment Questions**: Expand the 17-question bank in `lib/assessment.ts`
3. **Configure File Storage**: Set up S3 or MinIO for production file uploads
4. **ERCA Integration**: Implement TIN verification API integration
5. **Localization**: Add Amharic and Arabic translations
6. **Mobile App**: Consider PWA or native mobile app
7. **Analytics**: Integrate with analytics platform for usage tracking
8. **Backup Strategy**: Implement automated database backups

## 📞 Support

For technical support or questions about the platform:
- Documentation: Check this README and code comments
- Issues: Contact the development team
- Training: Request training sessions for Bureau staff

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready ✅
