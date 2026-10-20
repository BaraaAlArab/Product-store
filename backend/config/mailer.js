// Email is sent through Resend's HTTPS API (https://resend.com).
// Gmail SMTP is not usable from Render: Gmail drops TCP connections from
// datacenter IPs (connect ETIMEDOUT), while HTTPS works fine from anywhere.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const CONTACT_TO = () => process.env.CONTACT_TO || process.env.GMAIL_USER;

const state = (v) => (v ? `set (length=${v.length})` : "MISSING");

export const verifyMailer = async () => {
  console.log(
    `[mailer] RESEND_API_KEY=${state(process.env.RESEND_API_KEY)} | ` +
      `CONTACT_TO=${state(CONTACT_TO())}`
  );
  if (!process.env.RESEND_API_KEY) {
    console.error("[mailer] RESEND_API_KEY is missing — contact emails will not be sent.");
    return;
  }
  if (!CONTACT_TO()) {
    console.error("[mailer] CONTACT_TO is missing — nowhere to send notifications.");
    return;
  }
  console.log("[mailer] Email transport ready (Resend HTTPS API).");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const sendOnce = async (msg) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Product Store <onboarding@resend.dev>",
        to: [CONTACT_TO()],
        reply_to: msg.email,
        subject: `[Product Store] New contact message from ${msg.name}`,
        text: `Name: ${msg.name}\nEmail: ${msg.email}\n\n${msg.message}`,
      }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`Resend ${res.status}: ${data.message || res.statusText}`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
};

// Background send with a short retry (network hiccups only — Resend is not IP
// blocked like Gmail, so a couple of quick retries is enough).
export const sendContactNotification = async (msg) => {
  const delays = [0, 5000, 15000];
  for (let attempt = 1; attempt <= delays.length; attempt++) {
    if (delays[attempt - 1]) await sleep(delays[attempt - 1]);
    try {
      const info = await sendOnce(msg);
      console.log(`Email sent OK (attempt ${attempt}/${delays.length}):`, info.id, "->", CONTACT_TO());
      return;
    } catch (error) {
      console.log(`Email attempt ${attempt}/${delays.length} failed:`, error.message);
    }
  }
  console.error("Email notification abandoned — message from", msg.email, "is still in the admin dashboard.");
};
