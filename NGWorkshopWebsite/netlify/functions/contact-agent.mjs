const MODEL = 'gemini-2.5-flash';
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 1200;

const schema = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    complete: { type: 'BOOLEAN' },
    lead: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING' },
        phone: { type: 'STRING' },
        email: { type: 'STRING' },
      },
      required: ['name', 'phone', 'email'],
    },
  },
  required: ['reply', 'complete', 'lead'],
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'Agent is not configured' }, 503);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const locale = payload.locale === 'en' ? 'en' : 'he';
  const history = Array.isArray(payload.messages)
    ? payload.messages.slice(-MAX_MESSAGES).map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(message.text ?? '').slice(0, MAX_MESSAGE_LENGTH) }],
      })).filter((message) => message.parts[0].text)
    : [];

  if (!history.length || history.at(-1).role !== 'user') {
    return json({ error: 'A user message is required' }, 400);
  }

  const language = locale === 'he' ? 'Hebrew' : 'English';
  const systemInstruction = `You are the concise, friendly lead qualification assistant for NG Workshop, a technology consultancy. Reply only in ${language}.

Your main goal is to collect explicit contact details naturally: the person's name (a first name alone is sufficient) AND a preferred contact method. Ask one short question at a time. Never ask for a full name when any name has already been supplied. If they ask about services, answer briefly, then continue collecting the missing detail. Never invent or infer contact data. Preserve contact values exactly as the user supplied them.

Build context before asking for contact details. The initial assistant message already asks about the visitor's topic or need. In your first response to the visitor, acknowledge what they said and ask exactly one relevant follow-up question about the content, process, challenge, or desired outcome. Do not ask for their name or any contact detail in that first response. After they answer that follow-up, begin collecting the missing contact details, starting with their name. If the visitor voluntarily includes contact details earlier, preserve them, but still ask the content follow-up before completing the lead.

Prefer collecting a phone/mobile number before email. Once you know the person's name, ask for their phone number first unless they have already supplied contact details. If they provide an email address but no phone number, ask once whether they are also willing to share a phone number, and clearly say that it is optional. Do not set complete=true in the same turn in which an email is first provided without a phone number. If they then provide a phone number, decline, say they prefer email, or otherwise indicate that they do not want to share a phone number, accept the email and do not ask for the phone again.

Set complete=true when the conversation explicitly contains a name and a phone/mobile number, or when it contains a name and email and the optional phone question has already been answered or declined. When complete=true, do not ask another question: thank the user, tell them their details were received and that NG Workshop will contact them soon, and end the conversation. Otherwise, ask for the next missing detail according to the priority above. Keep phone or email as an empty string when absent.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: history,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error', response.status, await response.text());
      return json({ error: 'Agent is temporarily unavailable' }, 502);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    const agent = JSON.parse(text);
    const lead = {
      name: String(agent.lead?.name ?? '').trim(),
      phone: String(agent.lead?.phone ?? '').trim(),
      email: String(agent.lead?.email ?? '').trim(),
    };
    const complete = Boolean(agent.complete && lead.name && (lead.phone || lead.email));

    return json({ reply: String(agent.reply ?? ''), complete, lead });
  } catch (error) {
    console.error('Contact agent failure', error);
    return json({ error: 'Agent is temporarily unavailable' }, 502);
  }
};

export const config = { path: '/api/contact-agent' };
