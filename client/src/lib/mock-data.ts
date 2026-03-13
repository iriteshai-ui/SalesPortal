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

export function addElLead(name: string, mobile: string, pan: string) {
  const id = `EL-${Date.now()}`;
  MOCK_LEADS.unshift({
    id,
    name: name || "Student Applicant",
    mobile,
    pan,
    stage: "New",
    subStage: "Data Capture",
    createdAt: new Date().toISOString().split("T")[0],
  });
}

export const MOCK_LEADS: Lead[] = [
  {
    id: "LD-2023-001",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    pan: "ABCDE1234F",
    stage: "New",
    subStage: "Data Capture",
    createdAt: "2023-10-26"
  },
  {
    id: "LD-2023-002",
    name: "Priya Sharma",
    mobile: "9988776655",
    pan: "FGHIJ5678K",
    stage: "Pre-Offer",
    subStage: "Consent Pending",
    createdAt: "2023-10-25"
  },
  {
    id: "LD-2023-003",
    name: "Amit Patel",
    mobile: "9123456789",
    pan: "KLMNO9012P",
    stage: "Offer Generated",
    subStage: "Link Sent",
    createdAt: "2023-10-24"
  }
];

export const MOCK_GST_RECORDS: GSTRecord[] = [
  {
    gstin: "27ABCDE1234F1Z5",
    incorporationDate: "2018-05-12",
    legalName: "Kumar Enterprises"
  },
  {
    gstin: "27ABCDE1234F2Z4",
    incorporationDate: "2020-01-15",
    legalName: "Kumar Trading Co"
  }
];

export const MOCK_UDYAM_RECORDS: UdyamRecord[] = [
  {
    udyamNumber: "UDYAM-MH-01-0012345",
    incorporationDate: "2019-03-20",
    enterpriseType: "Micro"
  },
  {
    udyamNumber: "UDYAM-MH-01-0098765",
    incorporationDate: "2021-07-10",
    enterpriseType: "Small"
  }
];
