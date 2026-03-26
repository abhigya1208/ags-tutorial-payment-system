// ─────────────────────────────────────────────────────────────
//  utils/generatePDF.js  –  Downloadable PDF receipt via jsPDF
// ─────────────────────────────────────────────────────────────
import jsPDF from "jspdf";

/**
 * Generates and auto-downloads a styled PDF receipt.
 * @param {Object} data – payment details from the API
 */
export const generateReceiptPDF = (data) => {
  const {
    mobileNumber,
    studentClass,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    createdAt,
  } = data;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // ── Helper: centered text ──────────────────────────────
  const centerText = (text, y, size = 12, style = "normal", color = [30, 27, 75]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    doc.text(text, pageW / 2, y, { align: "center" });
  };

  // ── Background header band ─────────────────────────────
  doc.setFillColor(139, 92, 246); // violet-500
  doc.rect(0, 0, pageW, 45, "F");

  // ── Institute name ─────────────────────────────────────
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("AGS Tutorial", pageW / 2, 20, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Quality Education • Strong Academic Support", pageW / 2, 30, { align: "center" });

  // ── "PAYMENT RECEIPT" badge ────────────────────────────
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(pageW / 2 - 35, 37, 70, 14, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("PAYMENT RECEIPT", pageW / 2, 46, { align: "center" });

  // ── Divider ────────────────────────────────────────────
  doc.setDrawColor(200, 191, 253); // violet-200
  doc.setLineWidth(0.5);
  doc.line(15, 58, pageW - 15, 58);

  // ── Receipt rows ───────────────────────────────────────
  const rows = [
    ["Mobile Number",  mobileNumber],
    ["Class",          `Class ${studentClass}`],
    ["Amount Paid",    `₹ ${Number(amount).toLocaleString("en-IN")}`],
    ["Payment ID",     razorpayPaymentId || "—"],
    ["Order ID",       razorpayOrderId],
    ["Date & Time",    new Date(createdAt).toLocaleString("en-IN", {
                          dateStyle: "long", timeStyle: "short"
                       })],
    ["Status",         "✓ PAID"],
  ];

  let y = 70;
  rows.forEach(([label, value], i) => {
    // Alternating row background
    if (i % 2 === 0) {
      doc.setFillColor(245, 243, 255); // violet-50
      doc.rect(15, y - 6, pageW - 30, 12, "F");
    }

    // Label
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(109, 40, 217); // violet-700
    doc.text(label, 20, y);

    // Value
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 27, 75);
    // "Status" row gets green color
    if (label === "Status") doc.setTextColor(5, 150, 105);
    doc.text(String(value), pageW - 20, y, { align: "right" });

    y += 14;
  });

  // ── Footer divider ─────────────────────────────────────
  y += 4;
  doc.setDrawColor(200, 191, 253);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageW - 15, y);
  y += 10;

  // ── Address ────────────────────────────────────────────
  centerText("A353, Gali No. 8, Part 2, Pusta Number 1,", y, 9, "normal", [100, 100, 120]);
  y += 6;
  centerText("Sonia Vihar, Delhi – 110094, India", y, 9, "normal", [100, 100, 120]);
  y += 10;
  centerText("Thank you for choosing AGS Tutorial!", y, 11, "bolditalic", [139, 92, 246]);

  // ── Page border ────────────────────────────────────────
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1);
  doc.rect(5, 5, pageW - 10, doc.internal.pageSize.getHeight() - 10);

  // ── Save ───────────────────────────────────────────────
  const fileName = `AGS_Receipt_${razorpayPaymentId || razorpayOrderId}.pdf`;
  doc.save(fileName);
};
