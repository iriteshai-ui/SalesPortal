# Master AI Build Prompt: Pulse Education Loan (EL) Lead Journey

> **Instructions for the AI Developer / Coding Agent:**
> You are tasked with generating the complete, production-ready **Pulse Education Loan (EL) Journey** frontend application. Follow the comprehensive specifications, strict TypeScript types, business rules, financial formulas, and UI/UX design language defined below. Implement every stage completely without placeholder ellipsis (`// ...`).

---

## 1. Project Technology Stack & Setup

- **Framework:** Next.js (App Router, Client Components using `"use client"`)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Vanilla Tailwind CSS with custom colors (`#004499`, `#059669`, `#d97706`) and responsive utilities
- **Icons:** `lucide-react`
- **Animations & Effects:** `framer-motion`, `canvas-confetti`
- **Date Handling:** `date-fns` (for `differenceInYears`, `format`)
- **UI System:** Radix UI / Shadcn UI components under `@/components/ui/` (`Button`, `Input`, `Label`, `Badge`, `Card`, `Select`, `RadioGroup`, `Popover`, `Calendar`, `Progress`)

---

## 2. Directory Layout & File Structure

Create all files under `src/features/el-journey/`:

```text
src/
├── app/(protected)/leads/el/
│   └── page.tsx                              # Next.js route with Suspense boundary wrapping ElLeadJourneyPage
├── features/el-journey/
│   ├── ELJourneyPage.tsx                     # Master journey container, fixed 7-stage stepper, state routing
│   ├── constants/
│   │   └── el-mock-data.ts                   # Complete TypeScript types, demo profiles, courses, PIN maps, dedupe leads
│   └── components/
│       ├── el-dashboard-view.tsx             # Lead lookup dashboard (Mobile dedupe & lead resumption)
│       ├── stage3-basic-details.tsx          # Stage 1: Customer Details (Personal, Address with PIN lookup, Academic)
│       ├── stage4-consent.tsx                # Stage 2: Digital Consent (30s timer & UAT simulation buttons)
│       ├── stage-simulation.tsx              # Intermediate Route Simulator (BRE Underwriting switcher & preview)
│       ├── stage5-employment-verification.tsx# Stage 3: Employment Verification (Gatekeeper + Payslip / EPFO / Email)
│       ├── stage7-banking-verification.tsx   # Stage 4: Banking Verification (Account Aggregator with countdown & states)
│       ├── stage6-initial-offer.tsx          # Stage 5: Bureau Track Final Offer (₹5L cap, static cards, zero duplicates)
│       ├── stage8-final-offer.tsx            # Stage 5: Banking Track Final Offer (₹15L cap, static cards, 2-column layout)
│       ├── stage9-customer-timeline.tsx      # Stage 6: Customer Timeline (DIY link, 7 milestone checklist, "Complete All")
│       └── stage10-disbursement.tsx          # Stage 7: Ledger Disbursement (LAN, UTR copy, confetti, moratorium info)
```

---

## 3. Canonical Data Models & Constants (`constants/el-mock-data.ts`)

```typescript
export interface DemoProfile {
  id: string;
  label: string;
  description: string;
  scenario: "success" | "duplicate" | "unserviceable_pin" | "failed_pan" | "underage";
  fullName: string;
  fatherName: string;
  gender: "Male" | "Female" | "Other" | string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | string;
  pan: string;           // 10 chars uppercase alphanumeric regex: ^[A-Z]{5}[0-9]{4}[A-Z]{1}$
  dob: string;           // YYYY-MM-DD
  mobile: string;        // 10 digits regex: ^[6-9]\d{9}$
  email: string;
  address: string;
  landmark: string;
  pinCode: string;       // 6 digits regex: ^\d{6}$
  city: string;
  state: string;
  courseName: string;
  institutionName?: string;
  admissionStatus?: string;
  salary?: number;       // min 10000
  employerName?: string;
  highestEducation?: string;
  loanAmount: number;    // 100000 to 4999999
  loanTenure: number;    // 24, 36, 48, 60, 72, 84, 96, 120
  employmentType: "Salaried" | "Self-employed";
}

export const MOCK_EDUCATION_LEVELS: string[] = [
  "High School (10th / 12th)",
  "Diploma",
  "Graduate / Bachelor's Degree",
  "Post Graduate / Master's Degree",
  "Doctorate / Ph.D.",
  "Professional Degree (CA / CS / ICWA / MBBS)",
];

export const MOCK_COURSES: string[] = [
  "B.Tech in Computer Science & Engineering",
  "MBA in International Business & Finance",
  "MS in Data Science & Artificial Intelligence",
  "MBBS (Bachelor of Medicine & Surgery)",
  "M.Des in Interaction & UI/UX Design",
  "B.Sc in Biotechnology & Bioinformatics",
  "M.Tech in Robotics & Automation",
  "Master of Architecture (M.Arch)",
  "LL.M in Corporate & Cyber Law",
  "B.Com (Hons) in Fintech & Analytics",
];

export const MOCK_INSTITUTIONS: string[] = [
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Management (IIM) Ahmedabad",
  "Birla Institute of Technology & Science (BITS) Pilani",
  "Manipal Academy of Higher Education",
  "University of Delhi (DU)",
  "Vellore Institute of Technology (VIT)",
  "All India Institute of Medical Sciences (AIIMS) New Delhi",
  "National Institute of Design (NID) Ahmedabad",
  "Indian School of Business (ISB) Hyderabad",
  "National Law School of India University (NLSIU) Bengaluru",
];

export const PIN_LOCATION_MAP: Record<string, { city: string; state: string; serviceable: boolean }> = {
  "400051": { city: "Mumbai", state: "Maharashtra", serviceable: true },
  "400001": { city: "Mumbai", state: "Maharashtra", serviceable: true },
  "110001": { city: "New Delhi", state: "Delhi", serviceable: true },
  "560001": { city: "Bengaluru", state: "Karnataka", serviceable: true },
  "600001": { city: "Chennai", state: "Tamil Nadu", serviceable: true },
  "500001": { city: "Hyderabad", state: "Telangana", serviceable: true },
  "700001": { city: "Kolkata", state: "West Bengal", serviceable: true },
  "411001": { city: "Pune", state: "Maharashtra", serviceable: true },
  "380001": { city: "Ahmedabad", state: "Gujarat", serviceable: true },
  "302001": { city: "Jaipur", state: "Rajasthan", serviceable: true },
  "999999": { city: "Remote Sector", state: "Unassigned", serviceable: false },
};

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "profile_success",
    label: "Demo 1: Success Profile (Standard)",
    description: "Eligible salaried profile with valid PAN, serviceable PIN, and valid age.",
    scenario: "success",
    fullName: "Aarav Sharma",
    fatherName: "Ramesh Sharma",
    gender: "Male",
    maritalStatus: "Single",
    pan: "ABCPS1234F",
    dob: "2001-05-14",
    mobile: "9820012345",
    email: "aarav.sharma@example.com",
    address: "Flat 402, Green Glen Apartments, Bellandur",
    landmark: "Near Central Mall",
    pinCode: "560001",
    city: "Bengaluru",
    state: "Karnataka",
    courseName: "MS in Data Science & Artificial Intelligence",
    institutionName: "Indian Institute of Science (IISc) / BITS Pilani",
    admissionStatus: "Confirmed Admission",
    salary: 85000,
    employerName: "Tata Consultancy Services Ltd",
    highestEducation: "Graduate / Bachelor's Degree",
    loanAmount: 2500000,
    loanTenure: 84,
    employmentType: "Salaried",
  },
  {
    id: "profile_duplicate",
    label: "Demo 2: Duplicate Customer (Active Lead Exists)",
    description: "Simulates an existing active application in progress (#APP-EL-84920).",
    scenario: "duplicate",
    fullName: "Rohan Kulkarni",
    fatherName: "Sanjay Kulkarni",
    gender: "Male",
    maritalStatus: "Single",
    pan: "BKUPK7890L",
    dob: "2000-08-20",
    mobile: "9876543210",
    email: "rohan.k@example.com",
    address: "14 Shivaji Park, Dadar West",
    landmark: "Opposite Mayor Hall",
    pinCode: "400001",
    city: "Mumbai",
    state: "Maharashtra",
    courseName: "MBA in International Business & Finance",
    institutionName: "Indian Institute of Management (IIM) Ahmedabad",
    admissionStatus: "Confirmed Admission",
    salary: 95000,
    employerName: "Infosys Limited",
    highestEducation: "Post Graduate / Master's Degree",
    loanAmount: 2200000,
    loanTenure: 72,
    employmentType: "Salaried",
  },
  {
    id: "profile_unserviceable",
    label: "Demo 3: Unserviceable PIN Code",
    description: "Triggers geographic serviceability rejection on submission.",
    scenario: "unserviceable_pin",
    fullName: "Meera Nair",
    fatherName: "Venkat Nair",
    gender: "Female",
    maritalStatus: "Single",
    pan: "MNAPN4567M",
    dob: "1999-11-10",
    mobile: "9765432190",
    email: "meera.nair@example.com",
    address: "Village Post Office, Border Outpost Road",
    landmark: "Near High Altitude Tower",
    pinCode: "999999",
    city: "Remote Sector",
    state: "Unassigned",
    courseName: "MBBS (Bachelor of Medicine & Surgery)",
    institutionName: "All India Institute of Medical Sciences (AIIMS) New Delhi",
    admissionStatus: "Conditional Offer",
    salary: 60000,
    employerName: "Apollo Hospitals Enterprise",
    highestEducation: "Graduate / Bachelor's Degree",
    loanAmount: 3500000,
    loanTenure: 96,
    employmentType: "Salaried",
  }
];

export const MOCK_EXISTING_EL_LEADS = [
  {
    id: "LEAD-EL-10492",
    appId: "EL-84920",
    name: "Rohan Kulkarni",
    maskedName: "Roh** Kulka***",
    mobile: "9876543210",
    maskedMobile: "98****3210",
    pan: "BKUPK7890L",
    maskedPan: "BK***7890L",
    course: "MBA in International Business",
    institution: "IIM Ahmedabad",
    requestedAmount: 2200000,
    stageId: 3,
    stageName: "Employment Verify",
    status: "Offer Ready",
    createdAt: "2024-10-15T10:30:00Z",
  }
];
```

---

## 4. Stage-by-Stage Implementation Instructions

### Stage 0: Customer Lookup & Dedupe Engine (`el-dashboard-view.tsx`)
1. Create an input with prefix `+91` accepting exactly 10 digits (`maxLength={10}`).
2. On entering 10 digits and clicking **"Check Status"**:
   - Query `MOCK_EXISTING_EL_LEADS`.
   - If mobile matches `9876543210` (Rohan Kulkarni): Display an amber card with `"WIP Case: Application #APP-EL-84920 is already in progress"` and a **"Resume Application"** button redirecting to `/leads/el?resumeStage=3&ref=EL-84920`.
   - If mobile has recent decline: Show red card with 90-day cooldown warning.
   - If no record found: Show green card with `"New Case: No existing record found. Proceed to creation."` and button redirecting to `/leads/el?mobile={mobile}&case=new`.

---

### Stage 1: Customer Details Form (`stage3-basic-details.tsx`)
1. **Top Actions:** Add a button **"Fill Demo Details"** that auto-populates all form fields with `DEMO_PROFILES[0]`, and switches to **"Remove Demo Details"** when filled.
2. **Personal Section:**
   - `fullName`: Text input, mandatory.
   - `fatherName`: Text input, mandatory.
   - `gender`: Select dropdown (`Male`, `Female`, `Other`), mandatory.
   - `maritalStatus`: Select dropdown (`Single`, `Married`, `Divorced`, `Widowed`), mandatory.
   - `pan`: Text input, auto-capitalizes, regex `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`.
   - `dob`: Date picker using `react-day-picker` / Calendar. Calculate age via `differenceInYears(new Date(), dob)`. If age `< 18`, set validation error: `"Customer must be at least 18 years old to apply."`
   - `email`: Text input, mandatory valid email.
3. **Address Section:**
   - `address`: Text input, mandatory.
   - `landmark`: Text input, optional.
   - `pinCode`: Text input, 6 digits. On change, check `PIN_LOCATION_MAP`:
     - Auto-populate `city` and `state`.
     - If `serviceable === false` (e.g. `999999`), display amber notice and set validation error: `"Selected PIN code is unserviceable."`
4. **Academic, Employment & Loan Section:**
   - `courseName`: Select dropdown with 10 approved courses from `MOCK_COURSES`.
   - `highestEducation`: Select dropdown with 6 levels from `MOCK_EDUCATION_LEVELS`.
   - `employerName`: Text input, mandatory.
   - `salary`: Number input, min ₹10,000, format with Indian commas: `₹ {salary.toLocaleString('en-IN')} / mo`.
   - `loanAmount`: Number input, min 100000, max 4999999.
   - `loanTenure`: Select dropdown (`24`, `36`, `48`, `60`, `72`, `84`, `96`, `120` months).
   - `employmentType`: Radio buttons (`Salaried` vs `Self-employed`).
     - **Hard Policy Restriction:** If `"Self-employed"` is selected, show red alert box: *"Education loan is not available for Self-employed applicants online. Please select Salaried to proceed."* and disable the `"Save & Proceed to Consent"` button.
5. On valid submit, trigger `onComplete(formData)` which routes to Stage 2.

---

### Stage 2: Digital Regulatory Consent (`stage4-consent.tsx`)
1. Display target customer mobile: `+91 {customerMobile}`.
2. "Send Consent Link" transitions state from `"idle"` to `"waiting"`.
3. Start a 30-second countdown with `<Progress value={((30 - timeLeft) / 30) * 100} />`.
4. Render UAT simulation box:
   - **"Simulate Approve"** button: sets state to `"approved"` and calls `onComplete()` after 1.2 seconds.
   - **"Simulate Reject"** button: sets state to `"rejected"` with a `"Retry Consent"` button.

---

### Intermediate Route Simulator (`stage-simulation.tsx`)
1. Rendered immediately after Stage 2 Consent is approved (and accessible anytime via the top header badge).
2. Controls two variables:
   - `offerFlow`: `"bureau"` (Bureau Track ₹5L) OR `"banking"` (Banking Track ₹15L).
   - `employmentRequired`: `true` OR `false`.
3. Displays interactive cards for both options with financial comparison previews.
4. Live journey pipeline preview showing active vs. skipped/frozen stages.
5. On clicking **"Proceed"**:
   - If `employmentRequired === true`: Advance to `employment_verify`.
   - If `employmentRequired === false`:
     - If `offerFlow === "bureau"`: Advance to `bureau_offer`.
     - If `offerFlow === "banking"`: Advance to `banking_verify`.

---

### Stage 3: Multi-Modal Employment Verification (`stage5-employment-verification.tsx`)
1. **Gatekeeper Decision Screen:** Agent is asked: *"Do you want to proceed with Employment Verification?"*
   - Clicking `"No"` calls `onSkip()` (bypasses Stage 3 without marking it completed).
   - Clicking `"Yes"` unlocks verification tabs.
2. **Tab 1: Salary Slip Upload:**
   - Multi-file dropzone for PDF and PNG files.
   - Animated progress bar stepping to 100%.
   - Document list showing file name, size, and status badge.
   - Preview modal supporting password unlock for secured payslips.
3. **Tab 2: EPFO UAN Verification:**
   - 12-digit numeric input with a **"Fill Demo UAN"** button (sets `"101234567890"`).
   - Clicking "Verify UAN" simulates API call and renders:
     - Masked UAN: `1012 •••• 7890`
     - Employer Name: `Tata Consultancy Services Ltd`
     - Member ID: `MH/BAN/0012345/000/0006789`
     - Date of Joining: `15-Jul-2021`
4. **Tab 3: Official Corporate Email OTP:**
   - Pre-fills corporate email: `aarav.sharma@tcs.com`.
   - Sends DIY link. Includes UAT outcome switch (`Success` vs `Failure`).
   - On verified status, allows inline editing of applicant name and mobile number.
5. Primary CTA: **"Complete Employment Verification"** triggers `onComplete()` and advances to Offer/Banking.

---

### Stage 4: Account Aggregator Banking Verification (`stage7-banking-verification.tsx`)
1. Only rendered when `offerFlow === "banking"`.
2. Initial selection: **"Send Link to Customer"** (SMS) or **"Agent-Assisted Verification"** (NetBanking sandbox popup).
3. 10-second countdown with progress bar showing transaction analysis steps:
   - Validating bank account credentials with Account Aggregator.
   - Fetching 6 months statement history & salary credits.
   - Generating banking health score & debt-to-income FOIR matrix.
4. UAT simulation outcome buttons:
   - `Success`: Triggers celebratory confetti (`canvas-confetti`) and enables button to proceed to `banking_offer`.
   - `Timeout Error`: Renders `ERR_AA_FETCH_TIMEOUT` error card with retry button.
   - `Reject Criteria`: Displays refusal card showing: Average balance $< ₹35,000$, $>2$ ECS bounces, FOIR $>60\%$.

---

### Stage 5: Final Loan Offer Screens

Implement two distinct, highly polished 2-column offer screens with **zero duplicate cards**:

#### 1. Bureau Track (`stage6-initial-offer.tsx`)
- **Sanction Amount:** Fixed ₹5,00,000 (Non-editable)
- **Tenure:** 24 Months (2.0 Years)
- **Interest Rate:** 10.50% p.a. Fixed
- **Monthly EMI Calculation:**
  ```typescript
  const loanAmount = 500000;
  const tenureMonths = 24;
  const interestRate = 10.5;
  const monthlyRate = interestRate / 12 / 100;
  const currentEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  ); // ₹23,188
  const processingFeeIncGst = Math.round(loanAmount * 0.01 * 1.18); // ₹5,900
  const stampDuty = 50; // Statutory ₹50
  const totalCharges = processingFeeIncGst + stampDuty; // ₹5,950
  const netDisbursement = loanAmount; // Strict: ₹5,00,000 without deductions
  const totalAmount = loanAmount + totalCharges; // ₹5,05,950
  ```
- **Primary CTA:** "Select Offer & Send DIY Journey Link" $\rightarrow$ proceeds to Stage 6 Timeline.

#### 2. Banking Track (`stage8-final-offer.tsx`)
- **Sanction Amount:** Fixed ₹15,00,000 (Non-editable)
- **Tenure:** 60 Months (5.0 Years)
- **Interest Rate:** 9.25% p.a. Discounted Prime Rate
- **Monthly EMI Calculation:**
  ```typescript
  const loanAmount = 1500000;
  const tenureMonths = 60;
  const interestRate = 9.25;
  const monthlyRate = interestRate / 12 / 100;
  const currentEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  ); // ₹31,326
  const processingFeeIncGst = Math.round(loanAmount * 0.01 * 1.18); // ₹17,700
  const stampDuty = 50; // Statutory ₹50
  const totalCharges = processingFeeIncGst + stampDuty; // ₹17,750
  const netDisbursement = loanAmount; // Strict: ₹15,00,000 without deductions
  const totalAmount = loanAmount + totalCharges; // ₹15,17,750
  ```
- Instant 2-second fast-forward loader with "View Final Offer Instantly" bypass.
- **Primary CTA:** "Select Offer & Send DIY Journey Link" $\rightarrow$ proceeds to Stage 6 Timeline.

---

### Stage 6: Customer Timeline (`stage9-customer-timeline.tsx`)
1. Top banner: **"Send Final Offer Link"** button dispatching signing links to mobile.
2. Render 7 milestone tiles connected with a continuous vertical line:
   - `kyc`: Digital KYC and identity verification.
   - `offer`: Final Offer acceptance.
   - `kfs`: Key Fact Statement signed.
   - `pennydrop`: Penny Drop ₹1 test bank credit.
   - `enach`: Electronic NACH mandate registration.
   - `email_verify`: Personal Email ID authentication.
   - `esign`: Aadhaar / digital signature on loan contract.
3. Features:
   - Interactive click on any tile toggles completion.
   - **"Complete All"** one-click shortcut button.
   - Dash pill progress indicators (`0/7` to `7/7`).
4. When all 7 milestones are completed, activate the primary **"Complete Application"** button, fire celebration confetti, and transition to Stage 7.

---

### Stage 7: Disbursement & Core Ledger Booking (`stage10-disbursement.tsx`)
1. 10-second animated loader with countdown and a **"⚡ Fast-Forward Timer (1s)"** bypass button.
2. On completion, trigger celebratory full-screen confetti.
3. Render Disbursed Confirmation Card:
   - Net Disbursed Amount: `₹ 5,00,000` or `₹ 15,00,000` (formatted with Indian currency).
   - Beneficiary Name: `{customerData.fullName}`.
   - Application Ref: `#{appId}`.
   - Loan Account Number (LAN): Generated as `PFL-EL-2024-{random 5 digits}`.
   - Disbursement UTR: Generated as `UTR-SBIN-2024-{random 6 digits}` with a one-click copy button.
4. Compliance Summary Card:
   - First EMI Date: `05 Dec 2026` (Post-course moratorium).
   - Auto-Debit Bank: `SBI (A/C **4821)` with active eNACH mandate badge.
5. Exit Button: **"Return to Sales Dashboard"** redirecting to `/dashboard`.

---

## 5. UI/UX Design System Rules
- **Palette:**
  - Primary Brand Blue: `#004499` (hover `#003377`)
  - Emerald Green: `#059669` / `#10b981` (for approved states and badges)
  - Amber: `#d97706` (for warnings and in-progress states)
  - Neutral Slate: `#64748b`
- **Cards & Stepper:**
  - Rounded corners: `rounded-2xl` or `rounded-3xl`
  - Subtle borders: `border border-slate-200`
  - Subtle drop shadows: `shadow-xs` / `shadow-sm`
  - Micro-animations: `animate-in fade-in duration-300`
- **Financial Precision:**
  - Always format monetary numbers with `new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)` or Indian commas.
  - Net Disbursal Amount must strictly equal the applied loan amount without upfront deductions.
