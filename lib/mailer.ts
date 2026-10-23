import nodemailer from "nodemailer";

/** Null when GMAIL_USER/GMAIL_APP_PASSWORD aren't set in the environment yet. */
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("sendMail: GMAIL_USER/GMAIL_APP_PASSWORD not set in this environment");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/** Returns false (rather than throwing) on missing config or a send failure. */
export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `CareerZeta Website <${process.env.GMAIL_USER}>`,
      ...options,
    });
    return true;
  } catch (err) {
    console.error("sendMail failed:", err);
    return false;
  }
}
