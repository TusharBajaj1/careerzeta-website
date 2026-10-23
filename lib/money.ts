/** All amounts are stored/transacted in paise (smallest INR unit) — these convert to/from rupees for display and admin input. */

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatPaiseAsInr(paise: number): string {
  return `₹${paiseToRupees(paise).toLocaleString("en-IN")}`;
}

/** "₹1,05,000" -> 105000 (rupees, not paise). Null if no fee is set. */
export function parseFeeStringToRupees(fee: string | null): number | null {
  if (!fee) return null;
  const digits = fee.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}
