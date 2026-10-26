export interface CoApplicantDetails {
  fullName: string;
  fatherName: string;
  gender: "Male" | "Female" | "Other" | "";
  mobile?: string;
  isMobileVerified?: boolean;
  financialDecision?: "yes" | "no";
  relationWithApplicant: "Father" | "Mother" | "Spouse" | "Guardian" | "Other" | "";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "";
  pan: string;
  dob: string; // YYYY-MM-DD
  email: string;
  highestEducation: string;
  employmentType?: "Salaried" | "Self-employed" | "";
  employerName: string;
  salary: number;
  sameAsMainApplicantAddress: boolean;
  address: string;
  landmark?: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface DemoProfile {
  id: string;
  label: string;
  description: string;
  scenario: "success" | "duplicate" | "unserviceable_pin" | "failed_pan" | "underage";
  fullName: string;
  fatherName: string;
  gender: string;
  maritalStatus: string;
  pan: string;
  dob: string; // YYYY-MM-DD
  mobile: string;
  email: string;
  address: string;
  landmark: string;
  pinCode: string;
  city: string;
  state: string;
  courseName: string;
  institutionName?: string;
  admissionStatus?: string;
  salary?: number;
  employerName?: string;
  highestEducation?: string;
  loanAmount: number;
  loanTenure: number;
  employmentType: "Salaried" | "Self-employed";
  financialDecision?: "yes" | "no";
  isCoApplicantRequired?: boolean;
  coApplicant?: CoApplicantDetails;
}

export const MOCK_EDUCATION_LEVELS = [
  "High School (10th / 12th)",
  "Diploma",
  "Graduate / Bachelor's Degree",
  "Post Graduate / Master's Degree",
  "Doctorate / Ph.D.",
  "Professional Degree (CA / CS / ICWA / MBBS)",
];

export const MOCK_RELATIONS = [
  "Father",
  "Mother",
  "Spouse",
  "Guardian",
  "Other",
];

export const MOCK_MARITAL_STATUSES = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
];

export const MOCK_CO_APPLICANT_PROFILE: CoApplicantDetails = {
  fullName: "Aarav Sharma",
  fatherName: "Ramesh Sharma",
  gender: "Male",
  mobile: "9811223344",
  isMobileVerified: true,
  financialDecision: "yes",
  relationWithApplicant: "Father",
  maritalStatus: "Married",
  pan: "ABCPS1234F",
  dob: "1978-06-15",
  email: "aarav.sharma@example.com",
  highestEducation: "Graduate / Bachelor's Degree",
  employmentType: "Salaried",
  employerName: "Tata Consultancy Services Ltd.",
  salary: 85000,
  sameAsMainApplicantAddress: false,
  address: "Flat 402, Green Glen Apartments, Bellandur",
  landmark: "Near Central Mall",
  pinCode: "560103",
  city: "Bengaluru",
  state: "Karnataka",
};

export const EMPTY_CO_APPLICANT_PROFILE: CoApplicantDetails = {
  fullName: "",
  fatherName: "",
  gender: "",
  mobile: "",
  isMobileVerified: false,
  financialDecision: "no",
  relationWithApplicant: "",
  maritalStatus: "",
  pan: "",
  dob: "",
  email: "",
  highestEducation: "",
  employmentType: "",
  employerName: "",
  salary: 0,
  sameAsMainApplicantAddress: false,
  address: "",
  landmark: "",
  pinCode: "",
  city: "",
  state: "",
};

export const MOCK_COURSES = [
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

export const MOCK_INSTITUTIONS = [
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
  "560103": { city: "Bengaluru", state: "Karnataka", serviceable: true },
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
    dob: "2001-05-14", // Age ~25
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
  },
  {
    id: "profile_failed_pan",
    label: "Demo 4: Failed PAN Validation",
    description: "Simulates NSDL / ITD database mismatch error on PAN validation.",
    scenario: "failed_pan",
    fullName: "Kabir Mehta",
    fatherName: "Dinesh Mehta",
    gender: "Male",
    maritalStatus: "Single",
    pan: "XX00000000",
    dob: "2002-03-25",
    mobile: "9911223344",
    email: "kabir.mehta@example.com",
    address: "B-204, Vasant Kunj",
    landmark: "Near DDA Community Center",
    pinCode: "110001",
    city: "New Delhi",
    state: "Delhi",
    courseName: "B.Tech in Computer Science & Engineering",
    institutionName: "Indian Institute of Technology (IIT) Bombay",
    admissionStatus: "Confirmed Admission",
    salary: 70000,
    employerName: "Wipro Technologies",
    highestEducation: "Graduate / Bachelor's Degree",
    loanAmount: 1800000,
    loanTenure: 60,
    employmentType: "Salaried",
  },
  {
    id: "profile_underage",
    label: "Demo 5: Underage Customer (Age < 18)",
    description: "Applicant is under 18 years old, violating minimum age requirements.",
    scenario: "underage",
    fullName: "Ishaan Verma",
    fatherName: "Anil Verma",
    gender: "Male",
    maritalStatus: "Single",
    pan: "IVPVI9876P",
    dob: "2010-01-01", // Age ~16
    mobile: "9833445566",
    email: "ishaan.verma@example.com",
    address: "Flat 12B, Bandra Kurla Complex",
    landmark: "Opposite Trade Centre",
    pinCode: "400051",
    city: "Mumbai",
    state: "Maharashtra",
    courseName: "B.Sc in Biotechnology & Bioinformatics",
    institutionName: "Vellore Institute of Technology (VIT)",
    admissionStatus: "Applied / Awaiting Merit List",
    salary: 35000,
    employerName: "Reliance Retail Ltd",
    highestEducation: "High School (10th / 12th)",
    loanAmount: 1200000,
    loanTenure: 48,
    employmentType: "Salaried",
  },
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
    stageId: 3, // Employment Verify
    stageName: "Employment Verify",
    status: "Offer Ready",
    createdAt: "2024-10-15T10:30:00Z",
  },
  {
    id: "LEAD-EL-10501",
    appId: "EL-92811",
    name: "Ananya Iyer",
    maskedName: "Ana*** Iy**",
    mobile: "9988776655",
    maskedMobile: "99****6655",
    pan: "AIYPI5432K",
    maskedPan: "AI***5432K",
    course: "B.Tech Computer Science",
    institution: "IIT Bombay",
    requestedAmount: 3000000,
    stageId: 2, // Digital Consent
    stageName: "Consent Pending",
    status: "Awaiting Consent",
    createdAt: "2024-10-16T14:15:00Z",
  },
  {
    id: "LEAD-EL-10512",
    appId: "EL-77312",
    name: "Vikrant Deshmukh",
    maskedName: "Vik**** Desh****",
    mobile: "9820012345",
    maskedMobile: "98****2345",
    pan: "VDMPD1122Q",
    maskedPan: "VD***1122Q",
    course: "MS in Data Science",
    institution: "BITS Pilani",
    requestedAmount: 2500000,
    stageId: 7, // Customer Timeline
    stageName: "Customer Timeline",
    status: "Verification In Progress",
    createdAt: "2024-10-14T09:00:00Z",
  },
];
