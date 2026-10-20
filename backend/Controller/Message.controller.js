import { sendContactNotification } from "../config/mailer.js";
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

  // Email goes out in the background with spaced retries — Gmail intermittently
  // drops SMTP connections from Render's IP, so blocking the request on it made
  // the form fail. The message is always stored in the admin dashboard either way.
  sendContactNotification(saved).catch((error) =>
    console.error("Email notification crashed:", error.message)
  );

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
