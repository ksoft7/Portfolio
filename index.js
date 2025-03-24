import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files (e.g. index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

// Check required env variables
if (
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.RECEIVER_EMAIL
) {
  console.error("❌ Missing required environment variables. Check .env file.");
  process.exit(1);
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error(
      "❌ Nodemailer Transporter Error:",
      process.env.EMAIL_USER,
      error
    );
  } else {
    console.log("✅ Nodemailer Transporter Ready");
  }
});

// Email endpoint
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, phoneNumber, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "❌ Name, email, and message are required." });
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return res.status(400).json({ message: "❌ Invalid email format." });
    }

    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL,
      subject: subject || "New Contact Form Submission",
      text: `
New Message from: ${name} (${email})

Message:
${message}

Phone Number: ${phoneNumber || "N/A"}
Subject: ${subject || "N/A"}
`,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone Number:</strong> ${phoneNumber || "N/A"}</p>
<p><strong>Subject:</strong> ${subject || "N/A"}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
<hr />
<p style="font-style: italic; color: gray;">
  This message was sent via the contact form.
</p>
`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending error:", error);
    res
      .status(500)
      .json({ message: "❌ Failed to send email.", error: error.message });
  }
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// <a href="https://session-booking-s16y.onrender.com">Iyaalanuempowerment.com</a>.
