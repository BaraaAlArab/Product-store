import nodemailer from "nodemailer";

// Port 465 (implicit TLS) works from Render; port 587 times out there.
// Hard timeouts so a stalled Gmail connection can't hang requests forever.
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
});

const state = (v) => (v ? `set (length=${v.length})` : "MISSING");

// Logs mail env presence (never values) and tests SMTP auth from this host.
// Run at startup so Render logs show immediately whether mail can work.
export const verifyMailer = async () => {
  console.log(
    `[mailer] GMAIL_USER=${state(process.env.GMAIL_USER)} | ` +
      `GMAIL_APP_PASSWORD=${state(process.env.GMAIL_APP_PASSWORD)} | ` +
      `CONTACT_TO=${state(process.env.CONTACT_TO)}`
  );
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.CONTACT_TO) {
    console.error("[mailer] One or more mail env vars are missing on this server.");
    return;
  }
  try {
    await transporter.verify();
    console.log("[mailer] SMTP connection OK — email should work on this host.");
  } catch (error) {
    console.error("[mailer] SMTP connection FAILED:", error.message);
  }
};
