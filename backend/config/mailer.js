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

// Logs mail env presence (never values). No SMTP verify call in production:
// each extra connection risks Gmail rate-limiting this server's IP.
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
  console.log("[mailer] SMTP ready (host=smtp.gmail.com:465).");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Gmail intermittently drops SMTP connections from datacenter IPs (Render),
// so email is sent in the background with spaced retries instead of blocking
// the request. Retries span ~17 minutes to ride out Gmail's throttle windows.
export const sendContactNotification = async (msg) => {
  const delays = [0, 30000, 120000, 300000, 600000];
  for (let attempt = 1; attempt <= delays.length; attempt++) {
    if (delays[attempt - 1]) await sleep(delays[attempt - 1]);
    try {
      const send = transporter.sendMail({
        from: `"Product Store" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_TO,
        replyTo: msg.email,
        subject: `[Product Store] New contact message from ${msg.name}`,
        text: `Name: ${msg.name}\nEmail: ${msg.email}\n\n${msg.message}`,
      });
      send.catch(() => {}); // avoid unhandled rejection if the race times out first
      const info = await Promise.race([
        send,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SMTP send timed out after 40s")), 40000)
        ),
      ]);
      console.log(`Email sent OK (attempt ${attempt}/${delays.length}):`, info.messageId, "->", process.env.CONTACT_TO);
      return;
    } catch (error) {
      console.log(`Email attempt ${attempt}/${delays.length} failed:`, error.message);
    }
  }
  console.error("Email notification abandoned after", delays.length, "attempts — message from", msg.email, "is still in the admin dashboard.");
};
