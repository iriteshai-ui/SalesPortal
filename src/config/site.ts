export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Pulse Agent Assist",
  description: "Enterprise Sales Portal for lead management",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  company: process.env.NEXT_PUBLIC_APP_COMPANY || "Pulse Agent Assist NBFC",
  managementKey: process.env.NEXT_PUBLIC_MANAGEMENT_KEY || "",
};

export type SiteConfig = typeof siteConfig;
