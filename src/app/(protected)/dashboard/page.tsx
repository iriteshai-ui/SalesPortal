import { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Sales overview, active leads, and performance tracking.",
};

// Mock Server Fetch
async function getLeadsData() {
  return [
    { id: "1", name: "Ramesh Kumar", mobile: "9820012345", pan: "ABCDE1234F", product: "BL", stage: "New", subStage: "Data Capture", createdAt: new Date().toISOString() },
    { id: "2", name: "Suresh Raina", mobile: "9820054321", pan: "FGHIJ5678K", product: "PL", stage: "Offer Generated", subStage: "Offer Simulation", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "3", name: "Mahesh Bhupati", mobile: "9000011111", pan: "LMNOP9012Q", product: "EL", stage: "New", subStage: "Data Capture", createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: "4", name: "Sunil Gavaskar", mobile: "9111122222", pan: "RS TUV3456W", product: "HL", stage: "Offer Generated", subStage: "Final Timeline", createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: "5", name: "Kapil Dev", mobile: "9222233333", pan: "XYZAB7890C", product: "BL", stage: "Pre-Offer", subStage: "GST/Udyam", createdAt: new Date(Date.now() - 345600000).toISOString() },
  ];
}

export default async function DashboardPage() {
  const initialLeads = await getLeadsData();
  return <DashboardClient initialLeads={initialLeads} />;
}
