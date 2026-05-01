export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { field, topic, style, location, audience, depth } = req.body;

  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  const system = `You are a world-class director and photographer with 20 years of experience.
Output ONLY valid JSON, no markdown, no backticks, no extra text. Exactly this structure:
{"ideas":["idea1","idea2","idea3","idea4","idea5","idea6"],"analysis":"deep analysis here","shotList":["shot1","shot2","shot3","shot4","shot5"],"lighting":"lighting description","colorPalette":[{"name":"Color Name","hex":"#C9A96E","role":"Primary"},{"name":"Color Name","hex":"#1A1A2E","role":"Background"},{"name":"Color Name","hex":"#E8E0D5","role":"Highlight"},{"name":"Color Name","hex":"#8B4513","role":"Accent"}],"references":[{"name":"Photographer Name","work":"Work Title","why":"Why relevant"},{"name":"Photographer Name","work":"Work Title","why":"Why relevant"},{"name":"Photographer Name","work":"Work Title","why":"Why relevant"}],"moodboardKeywords":["word1","word2","word3","word4","word5","word6","word7","word8"],"unsplashTerms":["search term 1","search term 2","search term 3"]}`;

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

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).json({ error: `Anthropic error ${r.status}: ${errText}` });
    }

    const data = await r.json();
    const raw = data.content?.[0]?.text || '';

    if (!raw) return res.status(500).json({ error: 'Empty response from AI' });

    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'No JSON found in response', raw });

    const parsed = JSON.parse(match[0]);
    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
