# 🚀 Quick Start Guide - Harari PCC Portal

## You're Almost There!

The Harari PCC Portal is **running right now** on your computer. Follow these simple steps to see it in action.

---

## 🌐 Step 1: Open the Website

1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Type this in the address bar:
   ```
   http://localhost:3000
   ```
3. Press Enter

**You should see**: A beautiful purple and green homepage with the Harari PCC Portal branding!

---

## 🎯 Step 2: Explore the Homepage

On the homepage you'll find:
- Hero section with Harari cultural design
- "Start Application" and "Verify Certificate" buttons
- Statistics (24h processing, 100% digital)
- How It Works (5-step guide)
- Platform features
- Supported business sectors
- Professional footer

**Try clicking**: The "Register" button in the top-right corner

---

## ✍️ Step 3: Create an Account

1. Click **"Register"** on the homepage
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +251-91-123-4567
   - National ID: ETH987654321
   - Woreda: Harar
   - Kebele: 03
   - Password: password123
   - Confirm Password: password123
3. Click **"Create Account"**
4. Wait for "Registration Successful!" message
5. You'll be redirected to the login page

---

## 🔐 Step 4: Login

### Option A: Use Your New Account
- Email: john.doe@example.com
- Password: password123

### Option B: Use Demo Accounts (Already Created)

**Applicant Account:**
- Email: applicant@demo.com
- Password: password123

**Reviewer Account:**
- Email: reviewer@demo.com
- Password: password123

**Admin Account:**
- Email: admin@demo.com
- Password: password123

**Try this:**
1. Go to http://localhost:3000/login
2. Enter email: `applicant@demo.com`
3. Enter password: `password123`
4. Click "Sign In"
5. You'll be taken to the Applicant Dashboard!

---

## 🏠 Step 5: See the Dashboard

After logging in as an applicant, you'll see:
- Welcome message with your name
- Quick action cards (New Application, Verify Certificate, My Profile)
- Applications list (currently empty)
- Help section
- Logout button

---

## ✅ Step 6: Verify a Certificate

Let's test the public certificate verification:

1. **From the homepage or dashboard**, click "Verify Certificate"
2. You'll see the verification page
3. Enter this certificate number:
   ```
   HRS-PCC-CERT-2026-0001
   ```
4. Click "Verify Certificate"
5. **You'll see**: A green success card with certificate details!
   - Certificate Number
   - Holder Name: John Doe
   - Business Name: Harar Coffee House
   - Business Sector: HOSPITALITY
   - Issue Date
   - Status: Active

**This proves**: The certificate verification system works! Anyone can verify certificates without logging in.

---

## 🎨 Step 7: Admire the Design

Notice these design elements:
- **Colors**: Royal purple (#7e22ce) and Islamic green (#10b981)
- **Logo**: Eight-pointed star (Harar Jugol heritage)
- **Patterns**: Subtle diagonal patterns in the background
- **Gradients**: Beautiful purple-to-green gradients
- **Icons**: Professional Lucide icons throughout
- **Responsiveness**: Resize your browser - it adapts!

---

## 📱 Step 8: Test on Mobile

1. Open the browser's developer tools (F12)
2. Click the device toolbar icon (or press Ctrl+Shift+M)
3. Select a mobile device (iPhone, Android)
4. See how the site adapts perfectly to mobile screens!

---

## 🗄️ Step 9: Explore the Database (Optional)

Want to see what's in the database?

1. Open a new terminal/command prompt
2. Navigate to the project folder:
   ```bash
   cd harari-pcc-portal
   ```
3. Run Prisma Studio:
   ```bash
   npm run db:studio
   ```
4. A new browser tab will open at http://localhost:5555
5. You'll see all database tables:
   - User (3 demo accounts)
   - Application (1 sample application)
   - Certificate (1 sample certificate)
   - And more!

**Try this:**
- Click on "User" table
- See the 3 demo accounts
- Click on "Certificate" table
- See the sample certificate

---

## 🎯 What You Can Do Right Now

### ✅ Working Features
- [x] Browse the beautiful homepage
- [x] Register new accounts
- [x] Login with any role (applicant/reviewer/admin)
- [x] View applicant dashboard
- [x] Verify certificates publicly
- [x] Explore the database with Prisma Studio
- [x] Test responsive design
- [x] See Harari cultural theme

### 🔨 Features Being Built
- [ ] 5-step application wizard
- [ ] Document upload interface
- [ ] Competence assessment quiz
- [ ] Reviewer console
- [ ] Admin dashboard
- [ ] PDF certificate generation
- [ ] Email notifications

---

## 💡 Pro Tips

### Tip 1: Quick Navigation
- Homepage: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Verify: http://localhost:3000/verify
- Dashboard: http://localhost:3000/dashboard (after login)

### Tip 2: Reset Everything
If you want to start fresh:
```bash
npm run db:reset
```
This will:
- Delete all data
- Recreate the database
- Add demo accounts back

### Tip 3: Stop the Server
To stop the development server:
- Press `Ctrl+C` in the terminal where it's running
- Or close the terminal

### Tip 4: Start Again
To start the server again:
```bash
cd harari-pcc-portal
npm run dev
```
Wait for "Ready in X.Xs" message, then open http://localhost:3000

---

## 🆘 Troubleshooting

### Problem: Page won't load
**Solution**: 
- Check if the server is running (look for "Ready" message)
- Try http://localhost:3000 (not https)
- Clear browser cache (Ctrl+Shift+R)

### Problem: Login doesn't work
**Solution**:
- Double-check the email and password
- Make sure you've seeded the database: `npm run db:seed`
- Try the demo account: applicant@demo.com / password123

### Problem: "Module not found" error
**Solution**:
- Run `npm install` in the harari-pcc-portal folder
- Wait for installation to complete
- Restart the server

### Problem: Database error
**Solution**:
```bash
npm run db:push
npm run db:seed
```

---

## 📚 Learn More

### Want to understand the code?
- **README.md** - Complete setup and deployment guide
- **FEATURES.md** - All 300+ features documented
- **PROJECT_SUMMARY.md** - What's built and what's next
- **Code comments** - Every file has explanatory comments

### Want to customize?
- **Colors**: Edit `app/globals.css`
- **Homepage**: Edit `app/page.tsx`
- **Database**: Edit `prisma/schema.prisma`
- **Questions**: Edit `lib/assessment.ts`

---

## 🎉 Success Checklist

Check off what you've done:

- [ ] Opened http://localhost:3000 and saw the homepage
- [ ] Clicked around and explored the design
- [ ] Registered a new account or used a demo account
- [ ] Logged in successfully
- [ ] Saw the applicant dashboard
- [ ] Verified a certificate (HRS-PCC-CERT-2026-0001)
- [ ] Tested on mobile view (developer tools)
- [ ] Opened Prisma Studio and explored the database
- [ ] Understood what features are working
- [ ] Ready to customize or build more features!

---

## 🚀 You're Ready!

Congratulations! You now have a working, professional-quality PCC portal running on your machine.

**What's Next?**
1. Show it to stakeholders
2. Customize the content
3. Add the remaining features
4. Deploy to production
5. Launch for the Harari Region!

---

## 📞 Need Help?

- **Setup Issues**: Check README.md
- **Feature Questions**: Check FEATURES.md
- **Understanding Architecture**: Check PROJECT_SUMMARY.md
- **Code Questions**: Read the code comments

---

**Happy exploring! 🎊**

The Harari PCC Portal is ready to transform business licensing in the Harari Region.

Built with ❤️ for the entrepreneurs of Harari 🇪🇹

---

**Last Updated**: July 1, 2026  
**Status**: Running & Ready ✅
