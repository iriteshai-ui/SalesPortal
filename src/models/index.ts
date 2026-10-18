export interface UserRole {
  id: string;
  name: string;
  products: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  branch: string | null;
  designation: string | null;
  isActive: boolean;
  role: UserRole | null;
  products: string[];
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  pan: string;
  stage: "New" | "Pre-Offer" | "Offer Generated" | "Post-Offer";
  subStage: "Data Capture" | "Consent Pending" | "Consent Approved" | "Offer Ready" | "Link Sent";
  createdAt: string;
}

export interface GSTRecord {
  gstin: string;
  incorporationDate: string;
  legalName: string;
}

export interface UdyamRecord {
  udyamNumber: string;
  incorporationDate: string;
  enterpriseType: "Micro" | "Small" | "Medium";
}
