import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse qui REÇOIT les messages du formulaire
// → à définir dans Vercel : Settings > Environment Variables > CONTACT_EMAIL
const TO_EMAIL = process.env.CONTACT_EMAIL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    await resend.emails.send({
      // "from" doit être un domaine vérifié sur Resend
      // Avant d'avoir ton domaine, utilise : onboarding@resend.dev
      from: 'Tonton Gug Studio <onboarding@resend.dev>',
      to:   TO_EMAIL,
      replyTo: email,
      subject: subject ? `[TGS Contact] ${subject}` : `[TGS Contact] Message de ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:2rem;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#1a2d5a;margin-bottom:0.5rem;">Nouveau message — Tonton Gug Studio</h2>
          <hr style="border:none;border-top:2px solid #f5a623;margin-bottom:1.5rem;" />
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p><strong>Sujet :</strong> ${subject}</p>` : ''}
          <br/>
          <p style="white-space:pre-wrap;background:white;padding:1rem;border-radius:6px;border:1px solid #e2e8f0;">${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Échec de l\'envoi' });
  }
}
