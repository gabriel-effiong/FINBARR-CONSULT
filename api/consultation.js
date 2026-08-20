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

async function saveConsultationToDatabase(body) {
  if (!supabase) {
    console.warn(
      "Supabase not configured. Consultation request saved only by email.",
    );
    return null;
  }

  const payload = {
    name: body.name || "",
    email: body.email || "",
    company: body.company || "",
    service: body.service || "",
    source: "website",
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("consultations").insert([payload]);

  if (error) {
    console.error("Supabase consultation insert error:", error);
    return { error };
  }

  return null;
}

function validateConsultation(body) {
  const errors = [];
  if (!body.name || !body.name.trim()) {
    errors.push("Name is required.");
  }
  if (!body.email || !body.email.trim()) {
    errors.push("Email address is required.");
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
  const errors = validateConsultation(body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }

  try {
    const dbError = await saveConsultationToDatabase(body);

    if (dbError && dbError.error) {
      console.error(
        "Database save failed for consultation form:",
        dbError.error,
      );
    }

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New consultation booking from ${body.name}`,
        html: `<h1>Consultation booking</h1>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Company:</strong> ${body.company || "N/A"}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Service:</strong> ${body.service || "Not specified"}</p>
        `,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.email,
        subject: "Your consultation request has been received",
        html: `<h1>Consultation request received</h1>
          <p>Hi ${body.name},</p>
          <p>Thank you for requesting a consultation. We will reach out to you soon to confirm your booking.</p>
          <p>Best regards,<br/>FINBARR CONSULT LIMITED</p>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY missing. Email notifications skipped.");
    }

    return res
      .status(201)
      .json({ success: true, message: "Consultation booked successfully!" });
  } catch (error) {
    console.error("Resend error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to send email at this time." });
  }
};
