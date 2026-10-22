export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try { if (new URL(origin).host !== request.headers.get('host') && origin !== new URL(request.url).origin) return Response.json({ error: 'Untrusted request origin.' }, { status: 403 }); }
    catch { return Response.json({ error: 'Invalid origin.' }, { status: 403 }); }
  }
  if (Number(request.headers.get('content-length') || 0) > 16000) return Response.json({ error: 'Message too long.' }, { status: 413 });
  let input;
  try { const raw = await request.text(); if (raw.length > 16000) throw new Error(); input = JSON.parse(raw); }
  catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!input || typeof input !== 'object') return Response.json({ error: 'Invalid message.' }, { status: 400 });
  const { name, email, message, vector } = input;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000 || !['collab','hackathon','role','other'].includes(vector)) {
    return Response.json({ error: 'Provide a name, valid email and a message of 10–5,000 characters.' }, { status: 400 });
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM || !process.env.CONTACT_TO) {
    return Response.json({ fallback: true }, { status: 503 });
  }
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_FROM, to: [process.env.CONTACT_TO], reply_to: email, subject: `Portfolio enquiry: ${vector}`, text: `From: ${name}\nReply to: ${email}\n\n${message}` }),
    });
    const data = await result.json();
    if (!result.ok || !data.id) throw new Error('Provider rejected submission');
    return Response.json({ accepted: true });
  } catch { return Response.json({ error: 'The email service is unavailable. Please use the email-client option below.' }, { status: 502 }); }
}
