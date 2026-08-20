const { Resend } = require("resend");
const { createClient } = require("@supabase/supabase-js");

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@finbarrconsult.com";
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "finbarrconsultslimited@gmail.com";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

async function saveContactToDatabase(body) {
  if (!supabase) {
    console.warn("Supabase not configured. Contact form saved only by email.");
    return null;
  }

  const payload = {
    full_name: body.fullName || "",
    company: body.company || "",
    email: body.email || "",
    phone: body.phone || "",
    service: body.service || "",
    message: body.message || "",
    source: "website",
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("contact_messages").insert([payload]);

  if (error) {
    console.error("Supabase contact insert error:", error);
    return { error };
  }

  return null;
}

function validateContact(body) {
  const errors = [];
  if (!body.fullName || !body.fullName.trim()) {
    errors.push("Full name is required.");
  }
  if (!body.email || !body.email.trim()) {
    errors.push("Email address is required.");
  }
  if (!body.message || !body.message.trim()) {
    errors.push("Message is required.");
  }
  return errors;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const body = req.body || {};
  const errors = validateContact(body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  try {
    const dbError = await saveContactToDatabase(body);

    if (dbError && dbError.error) {
      console.error("Database save failed for contact form:", dbError.error);
    }

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New contact request from ${body.fullName}`,
        html: `<h1>New contact request</h1>
          <p><strong>Name:</strong> ${body.fullName}</p>
          <p><strong>Company:</strong> ${body.company || "N/A"}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Phone:</strong> ${body.phone || "N/A"}</p>
          <p><strong>Service:</strong> ${body.service || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <p>${body.message}</p>
        `,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.email,
        subject: "Thanks for reaching out to FINBARR CONSULT LIMITED",
        html: `<h1>Thanks for contacting us</h1>
          <p>Hi ${body.fullName},</p>
          <p>Thank you for reaching out. We have received your message and will respond within 24 hours.</p>
          <p><strong>Message received:</strong></p>
          <p>${body.message}</p>
          <p>Best regards,<br/>FINBARR CONSULT LIMITED</p>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY missing. Email notifications skipped.");
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for your message! We will contact you soon.",
    });
  } catch (error) {
    console.error("Resend error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to send email at this time." });
  }
};
