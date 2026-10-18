import { MOCK_LEADS, MOCK_GST_RECORDS, MOCK_UDYAM_RECORDS } from "@/utils/mock-data";
import { Lead, GSTRecord, UdyamRecord } from "@/models";

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    return [...MOCK_LEADS];
  },

  async addElLead(name: string, mobile: string, pan: string): Promise<void> {
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
  },

  async getGSTRecords(gstin: string): Promise<GSTRecord[]> {
    return MOCK_GST_RECORDS.filter(r => r.gstin.includes(gstin));
  },

  async getUdyamRecords(udyamNumber: string): Promise<UdyamRecord[]> {
    return MOCK_UDYAM_RECORDS.filter(r => r.udyamNumber.includes(udyamNumber));
  }
};
