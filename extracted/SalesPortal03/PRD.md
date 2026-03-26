# SalesAssure: NBFC Sales Portal - Product Requirements Document (PRD)

## 1. Project Overview
SalesAssure is a high-performance, "Bank-Grade" sales portal designed for Non-Banking Financial Companies (NBFCs) to manage loan leads and pre-offer journeys. The portal emphasizes security, speed, and a polished corporate aesthetic.

## 2. Core Design System
- **Primary Color**: Deep Navy Blue (`#004499`) for trust and authority.
- **Accent Colors**: Emerald Green (`#10b981`) for success/completed states, Amber (`#f59e0b`) for warnings/pending.
- **Typography**: `Plus Jakarta Sans` (Headings) and `Inter` (Body/Data) for a modern financial feel.
- **Visual Depth**: Subtle shadows, backdrop blurs, and smooth transitions (0.3s - 0.5s).

## 3. Key Modules & Functionality

### 3.1 Authentication & Security
- **Secure Login**: ADID/Email and Password based login.
- **Management Secure Key**: A visible 23-digit secure key field (`XXXX-XXXX-XXXX-XXXX-XXXX-XXX`) required for demo compliance.
- **Auto-Login Utility**: Optimized for demos; clicking "Sign In" bypasses manual key validation while maintaining visual presence.
- **Security Footer**: Unauthorized access warnings and enterprise compliance labels.

### 3.2 Sales Dashboard
- **Dual-Tab Interface**: 
    - **Lead Dashboard**: Table view of active leads with status badges (e.g., "Details Pending", "Offer Generated").
    - **UTM Link Creation**: Tool for generating trackable marketing links.
- **KPI Cards**: Real-time summary of "Active Leads", "Disbursed MTD", and "Pending Consent".
- **Filtering**: Search by Name, Mobile, or PAN with quick filter toggles.

### 3.3 Lead Creation Journey (The Wizard)
A multi-step guided process with a dynamic, animated progress bar.

#### Step 1: Basic Details & Validation
- **Mobile Validation Flow**: 
    - Initial input for 10-digit mobile number only.
    - 5-second "Bank-Grade" loader simulating backend status check.
    - **Result Selection**: 
        - *New Case*: Unlocks the rest of the form.
        - *WIP Case*: Displays existing Application ID and restricts progress.
        - *Rejected Case*: Displays rejection ID and 90-day cool-off warning.
- **Form Fields**: PAN (with auto-formatting), Full Name, Email, DOB (Date Picker), Gender, and Address (with Pincode-based City/State auto-fill).

#### Step 2: Digital Consent (CIBIL)
- **Simulated SMS Trigger**: Triggers a "Waiting for Customer" state.
- **Debug Actions**: Includes hidden/demo buttons to simulate "Approve" (proceeds) or "Reject" (halts journey).

#### Step 3: GST & Udyam Selection
- **Data Fetch Simulation**: Displays multiple registered businesses associated with the customer profile.
- **Selection**: Radio-based selection of the specific business entity for the loan.

#### Step 4: Offer Selection & Generation
- **Interactive Sliders**: 
    - Loan Amount: ₹1,00,000 to ₹5,00,000 (₹1,000 steps).
    - Tenure: 12 to 60 months (strictly 6-month multiples).
- **Real-time EMI Calculator**: Instant updates showing monthly installments at a mock 12% interest rate.
- **Confetti Celebration**: Triggered upon "Generate Offer" to celebrate the sales milestone.

#### Step 5: BRP Details (Conditional)
- **Trigger**: Only appears if the "BRP Flag" is set to "Yes" during offer selection.
- **Additional Data**: Business Name, Nature of Business (Trader/Manufacturer), Date of Incorporation, and Business Pincode.

## 4. Technical UI Features
- **Dynamic Progress Bar**:
    - Emerald green "Checkmark" for completed steps.
    - Blue "Ring" highlight for active step.
    - Smooth 700ms fill animation for the progress line.
    - Dynamic percentage counter (e.g., "75% Complete").
- **Asset Generation**: Bespoke 3D/abstract financial imagery for the login hero section.
- **Toasts & Notifications**: Success/Error toasts for link copying and email triggers.

## 5. Demo Preparedness
- **Pre-populated Data**: All login and lead forms are pre-filled with high-quality sample data (e.g., Vikram Malhotra) for zero-latency presentations.
- **Interactive Simulations**: All "waiting" or "external" states (Loader, Consent, Email) are fully interactive and provide immediate visual feedback.
