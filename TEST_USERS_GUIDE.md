# Test Users Guide

## 🎯 Overview

This guide explains how to use the test user system to test real workflows in StratusConnect.

## 👤 Admin Account

- **Email**: `stratuscharters@gmail.com`
- **Access**: Staff Portal (`/staff-portal`)

## 🧪 Test Users

### Option 1: Admin Console Impersonation (Recommended)

1. Login to Admin Console via `/staff-portal`
2. Navigate to the **Test Users** tab
3. Click on any test user card to impersonate them
4. You'll be instantly logged in as that user with a clean terminal

### Option 2: Direct Login

You can also login directly with these credentials:

#### 🔵 Broker Account
- **Email**: `broker@test.com`
- **Password**: `TestBroker123!`
- **Name**: Alex Broker
- **Company**: Elite Aviation Brokers
- **Terminal**: `/broker-terminal`

#### 🟢 Operator Account
- **Email**: `operator@test.com`
- **Password**: `TestOperator123!`
- **Name**: Sarah Operator
- **Company**: SkyHigh Operations
- **Fleet**: 12 aircraft
- **Terminal**: `/operator-terminal`

#### 🟣 Pilot Account
- **Email**: `pilot@test.com`
- **Password**: `TestPilot123!`
- **Name**: Mike Pilot
- **License**: ATP
- **Hours**: 8,500
- **Ratings**: Gulfstream G650, Bombardier Global 7500, Cessna Citation X
- **Terminal**: `/pilot-terminal`

#### 🟠 Crew Account
- **Email**: `crew@test.com`
- **Password**: `TestCrew123!`
- **Name**: Emma Crew
- **Certifications**: Senior Flight Attendant, Safety & Emergency Procedures, Culinary Service
- **Languages**: English, French, Spanish
- **Terminal**: `/crew-terminal`

## 🔄 Testing Workflows

### Example Workflow 1: Aircraft Charter Request

1. **Login as Operator** (Sarah)
   - Post available aircraft for charter
   - Set pricing and availability

2. **Switch to Broker** (Alex)
   - Create RFQ for client
   - Search for available aircraft
   - Submit quote request to operator

3. **Switch back to Operator**
   - Review RFQ
   - Send quote to broker

4. **Switch to Broker**
   - Review quotes
   - Accept best quote
   - Process booking

### Example Workflow 2: Crew Hiring

1. **Login as Operator** (Sarah)
   - Post crew hiring request
   - Specify requirements (certifications, experience, languages)

2. **Switch to Crew** (Emma)
   - Browse job board
   - Apply for position
   - Upload certifications

3. **Switch back to Operator**
   - Review applications
   - Hire crew member
   - Process payment

### Example Workflow 3: Pilot Recruitment

1. **Login as Operator** (Sarah)
   - Post pilot position
   - Specify aircraft type and requirements

2. **Switch to Pilot** (Mike)
   - View available positions
   - Apply with qualifications
   - Submit resume and licenses

3. **Switch back to Operator**
   - Review pilot applications
   - Schedule interviews
   - Make hiring decision

## 🗄️ Database Setup

Run the SQL script to create real test users in your database:

```bash
# In Supabase SQL Editor, run:
create_real_test_users.sql
```

This will:
- Create 4 verified users in `auth.users`
- Create corresponding profiles in `public.profiles`
- Set verification status to "approved"
- Link all verifications to your admin account (`stratuscharters@gmail.com`)

## ✨ Key Features

### Clean Terminals
- **No dummy data** - All terminals start empty
- **Real interactions** - Create actual data that persists
- **Full functionality** - All features work as intended

### Admin Impersonation
- **Instant switching** - Click a card to become that user
- **Seamless experience** - No login required when using admin impersonation
- **Return to admin** - Logout to return to admin console

### Real Database Integration
- **Persistent data** - All actions save to the database
- **Cross-user visibility** - Actions by one user are visible to others
- **Complete workflows** - Test end-to-end processes

## 🔐 Security

- Test users are **only accessible from Admin Console**
- Admin impersonation requires **admin login first**
- All test users are marked as **verified and approved**
- Verified by your admin account for tracking

## 🚀 Quick Start

1. **Run SQL Script** → Create test users in Supabase
2. **Login as Admin** → Go to `/staff-portal`
3. **Access Test Users Tab** → Click "Test Users"
4. **Start Testing** → Click any user card and explore

## 📊 What to Test

- ✅ RFQ Creation & Quote Management
- ✅ Aircraft Posting & Booking
- ✅ Job Posting & Applications
- ✅ Crew Hiring & Assignments
- ✅ Payment Processing
- ✅ Document Management
- ✅ Messaging Between Users
- ✅ Reputation & Reviews
- ✅ Analytics & Reporting

## 💡 Tips

1. **Keep track of which user you're testing as** - Look at the top right for user name
2. **Use multiple browser tabs** - Have different users open simultaneously
3. **Document issues** - Note any bugs or workflow problems
4. **Test edge cases** - Try invalid data, cancellations, disputes
5. **Check notifications** - Ensure users receive proper alerts

---

**Need Help?** Contact admin support or check the documentation at `/help`


