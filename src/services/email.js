const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  }); 
}

async function sendEmails(messages) {
  if (!resend) return;

  for (const message of messages) {
    try {
      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || "no-reply@finbarrconsult.com",
        ...message,
      });
      if (result.error) console.error("Email delivery failed:", result.error);
    } catch (error) {
      console.error("Email delivery failed:", error.message);
    }
  }
}

function contactEmails(contact) {
  const name = escapeHtml(contact.fullName);
  const company = escapeHtml(contact.company || "N/A");
  const email = escapeHtml(contact.email);
  const phone = escapeHtml(contact.phone || "N/A");
  const service = escapeHtml(contact.service || "Not specified");
  const message = escapeHtml(contact.message).replace(/\r?\n/g, "<br>");
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.FROM_EMAIL || "no-reply@finbarrconsult.com";
  const emails = [];

  if (adminEmail) {
    emails.push({
      to: adminEmail,
      subject: `New contact request from ${contact.fullName}`,
      html: `<h1>New contact request</h1><p><strong>Name:</strong> ${name}</p><p><strong>Company:</strong> ${company}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Service:</strong> ${service}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });
  }

  emails.push({
    to: contact.email,
    subject: "Thanks for reaching out to FINBARR CONSULT LIMITED",
    html: `<h1>Thanks for contacting us</h1><p>Hi ${name},</p><p>We have received your message and will respond within 24 hours.</p><p><strong>Message received:</strong></p><p>${message}</p><p>Best regards,<br/>FINBARR CONSULT LIMITED</p>`,
  });
  return emails.map((emailMessage) => ({ ...emailMessage, from }));
}

function consultationEmails(consultation) {
  const name = escapeHtml(consultation.name);
  const company = escapeHtml(consultation.company || "N/A");
  const email = escapeHtml(consultation.email);
  const service = escapeHtml(consultation.service || "Not specified");
  const emails = [];

  if (process.env.ADMIN_EMAIL) {
    emails.push({
      to: process.env.ADMIN_EMAIL,
      subject: `New consultation booking from ${consultation.name}`,
      html: `<h1>Consultation booking</h1><p><strong>Name:</strong> ${name}</p><p><strong>Company:</strong> ${company}</p><p><strong>Email:</strong> ${email}</p><p><strong>Service:</strong> ${service}</p>`,
    });
  }

  emails.push({
    to: consultation.email,
    subject: "Your consultation request has been received",
    html: `<h1>Consultation request received</h1><p>Hi ${name},</p><p>Thank you for requesting a consultation. We will reach out to you soon to confirm your booking.</p><p>Best regards,<br/>FINBARR CONSULT LIMITED</p>`,
  });
  return emails;
}

module.exports = { sendEmails, contactEmails, consultationEmails };
