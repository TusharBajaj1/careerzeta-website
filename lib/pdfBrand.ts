import path from "path";

/**
 * Print adaptation of CareerZeta_Brand_Guidelines_v2_Aug_2026 (colour,
 * typography, logo-usage sections) — shared by every pdfkit document
 * (invoice, admission letter) so a brand update only needs to happen here.
 */
export const BRAND_COLORS = {
  /** Type, structure, dark sections. */
  charcoal: "#111827",
  /** The one accent — used sparingly, never as body text. */
  aqua: "#38bdf8",
  /** Accent text, eyebrows, links — the aqua that's safe to read as text. */
  deepAqua: "#0369a1",
  /** Card/table backgrounds. */
  tintBlue: "#e0f2fe",
  /** Muted secondary text — a step lighter than charcoal, not a separate brand colour. */
  muted: "#55606e",
};

const FONT_DIR = path.join(process.cwd(), "lib/pdf-fonts");

export const BRAND_FONTS = {
  heading: "Poppins-SemiBold",
  bodyBold: "Manrope-Bold",
  body: "Manrope-Regular",
};

/** Registers the brand's two typefaces (Poppins 600 for display, Manrope 400/700 for body/eyebrows) so `.font()` can reference them by name below. */
export function registerBrandFonts(doc: PDFKit.PDFDocument): void {
  doc.registerFont(BRAND_FONTS.heading, path.join(FONT_DIR, "Poppins-SemiBold.ttf"));
  doc.registerFont(BRAND_FONTS.bodyBold, path.join(FONT_DIR, "Manrope-Bold.ttf"));
  doc.registerFont(BRAND_FONTS.body, path.join(FONT_DIR, "Manrope-Regular.ttf"));
}

/** The brand's "eyebrow" type role — uppercase, Manrope 700, deep aqua, letter-spaced. Used for section labels and the document kind (e.g. "TAX INVOICE"). */
export function drawEyebrow(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  options?: PDFKit.Mixins.TextOptions,
): void {
  doc
    .font(BRAND_FONTS.bodyBold)
    .fontSize(9)
    .fillColor(BRAND_COLORS.deepAqua)
    .text(text.toUpperCase(), x, y, { characterSpacing: 1, ...options });
}

/**
 * Shared letterhead: brand mark + two-tone "CareerZeta" wordmark (set in
 * the brand typeface rather than stretching the stacked logo PNG
 * sideways — "never recolour, rotate, stretch, outline or redraw" the
 * mark itself, which this avoids touching at all), company address, and
 * a single aqua accent rule — the brand's "one accent per page" budget.
 * Returns the y position content should continue from.
 */
export function drawLetterhead(
  doc: PDFKit.PDFDocument,
  opts: { addressLines: string[]; extraLine?: string; contentLeft: number; contentRight: number },
): number {
  const { contentLeft, contentRight } = opts;
  const top = doc.y;
  const markHeight = 28;
  const markPath = path.join(process.cwd(), "public/brand/careerzeta-mark.png");

  doc.image(markPath, contentLeft, top, { height: markHeight });

  const wordmarkX = contentLeft + markHeight + 10;
  doc
    .font(BRAND_FONTS.heading)
    .fontSize(17)
    .fillColor(BRAND_COLORS.charcoal)
    .text("Career", wordmarkX, top + 5, { continued: true })
    .fillColor(BRAND_COLORS.aqua)
    .text("Zeta");

  let y = top + markHeight + 8;
  doc.font(BRAND_FONTS.body).fontSize(8.5).fillColor(BRAND_COLORS.muted);
  for (const line of opts.addressLines) {
    doc.text(line, contentLeft, y, { width: contentRight - contentLeft });
    y = doc.y;
  }
  if (opts.extraLine) {
    doc.text(opts.extraLine, contentLeft, y, { width: contentRight - contentLeft });
    y = doc.y;
  }

  y += 10;
  doc.moveTo(contentLeft, y).lineTo(contentRight, y).lineWidth(2).strokeColor(BRAND_COLORS.aqua).stroke();

  return y + 16;
}

/** The brand's rounded-card treatment (14px radius, tint background) for a block of key-value details. */
export function drawTintCard(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  doc.roundedRect(x, y, width, height, 14).fill(BRAND_COLORS.tintBlue);
}
