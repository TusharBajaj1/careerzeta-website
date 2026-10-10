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
