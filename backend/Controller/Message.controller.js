import { transporter } from "../config/mailer.js";
import Message from "../models/Message.model.js";

export const createMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (
    name.trim().length < 2 ||
    name.trim().length > 100 ||
    email.length > 100 ||
    message.trim().length < 10 ||
    message.trim().length > 1000
  ) {
    return res.status(400).json({
      message: "Name 2-100 chars, message 10-1000 chars.",
    });
  }

  const saved = await Message.create({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  });

  try {
    // Gmail can drop connections from datacenter IPs; retry once after a pause.
    const sendOnce = () => {
      const send = transporter.sendMail({
        from: `"Product Store" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_TO,
        replyTo: saved.email,
        subject: `[Product Store] New contact message from ${saved.name}`,
        text: `Name: ${saved.name}\nEmail: ${saved.email}\n\n${saved.message}`,
      });
      send.catch(() => {}); // avoid unhandled rejection if the race times out first
      return Promise.race([
        send,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SMTP send timed out after 40s")), 40000)
        ),
      ]);
    };

    let info;
    try {
      info = await sendOnce();
    } catch (firstError) {
      console.log("Email attempt 1 failed, retrying in 20s:", firstError.message);
      await new Promise((r) => setTimeout(r, 20000));
      info = await sendOnce();
    }
    console.log("Email sent OK:", info.messageId, "->", process.env.CONTACT_TO);
  } catch (error) {
    console.error("Email send failed:", {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      response: error.response,
      to: process.env.CONTACT_TO,
      from: process.env.GMAIL_USER,
    });
    return res.status(502).json({
      message: "Message stored, but the email could not be sent. Try again later.",
    });
  }

  res.status(201).json({ message: "Message sent successfully." });
};

export const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};

export const toggleMessageRead = async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ message: "Message not found" });
  msg.read = !msg.read;
  await msg.save();
  res.json(msg);
};

export const deleteMessage = async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Message deleted" });
};
