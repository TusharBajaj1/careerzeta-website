/** From the GST Registration Certificate (GST REG-06) — used on every tax invoice. */
export const COMPANY = {
  legalName: "CareerZeta Learning Private Limited",
  gstin: "09AAOCC1166A1ZV",
  stateCode: "09",
  state: "Uttar Pradesh",
  addressLines: [
    "A-13, Graphix Tower-2, Sector 62",
    "Noida, Gautam Buddha Nagar",
    "Uttar Pradesh - 201301",
  ],
};

/**
 * Commercial training/coaching services — not a degree-granting program, so
 * not covered by the education-services GST exemption. Confirm with your CA
 * before relying on this for actual GST filings.
 */
export const SERVICE_SAC_CODE = "999293";
export const GST_RATE_PERCENT = 18;
