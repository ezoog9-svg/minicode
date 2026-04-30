export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { field, topic, style, location, audience, depth } = req.body;

  const system = `You are a world-class director and photographer with 20 years of experience.
Output ONLY valid JSON with no text outside it, exactly in this format:
{"ideas":["","","","","",""],"analysis":"","shotList":["","","","",""],"lighting":"","colorPalette":[{"name":"","hex":"#000000","role":""},{"name":"","hex":"#000000","role":""},{"name":"","hex":"#000000","role":""},{"name":"","hex":"#000000","role":""}],"references":[{"name":"","work":"","why":""},{"name":"","work":"","why":""},{"name":"","work":"","why":""}],"moodboardKeywords":["","","","","","","",""],"unsplashTerms":["","",""]}
Rules: unique non-cliche ideas, connect Saudi context to global references, every idea must be executable, no filler. unsplashTerms must be English words for image search.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system,
        messages: [{
          role: 'user',
          content: `Field: ${field}\nTopic: ${topic}\nStyle: ${style}\nLocation: ${location}\nAudience: ${audience || 'General'}\nDepth: ${depth || 'Deep'}`
        }]
      })
    });

    const data = await r.json();
    const raw = data.content?.[0]?.text || '';
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : raw);
    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
