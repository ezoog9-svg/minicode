export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { field, topic, style, location, audience, depth } = req.body;

  const system = `ط£ظ†طھ ظ…ط®ط±ط¬ ظˆظ…طµظˆط± ط¹ط§ظ„ظ…ظٹ ط®ط¨ظٹط± 20 ط³ظ†ط©. ط£ط®ط±ط¬ JSON ظپظ‚ط· ط¨ط¯ظˆظ† ط£ظٹ ظ†طµ ط®ط§ط±ط¬ظ‡ ط¨ظ‡ط°ط§ ط§ظ„ط´ظƒظ„ ط¨ط§ظ„ط¶ط¨ط·:
{"ideas":["","","","","",""],"analysis":"","shotList":["","","","",""],"lighting":"","colorPalette":[{"name":"","hex":"#000000","role":""},{"name":"","hex":"#000000","role":""},{"name":"","hex":"#000000","role":""},{"name":"","hex":"#000000","role":""}],"references":[{"name":"","work":"","why":""},{"name":"","work":"","why":""},{"name":"","work":"","why":""}],"moodboardKeywords":["","","","","","","",""],"unsplashTerms":["","",""]}
ظ‚ظˆط§ط¹ط¯: ط£ظپظƒط§ط± ط؛ظٹط± ظ…ط³طھظ‡ظ„ظƒط© ظˆظ…ط¨طھظƒط±ط©طŒ ط§ط±ط¨ط· ط§ظ„ط³ظٹط§ظ‚ ط§ظ„ط³ط¹ظˆط¯ظٹ ط¨ط§ظ„ظ…ط±ط¬ط¹ ط§ظ„ط¯ظˆظ„ظٹطŒ ظƒظ„ ظپظƒط±ط© ظ‚ط§ط¨ظ„ط© ظ„ظ„طھظ†ظپظٹط°طŒ ظ„ط§ ط­ط´ظˆ. unsplashTerms ظƒظ„ظ…ط§طھ ط¥ظ†ط¬ظ„ظٹط²ظٹط© ظ„ظ„ط¨ط­ط« ط¹ظ† طµظˆط±.`;

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
          content: `ط§ظ„ظ…ط¬ط§ظ„:${field}\nط§ظ„ظ…ظˆط¶ظˆط¹:${topic}\nط§ظ„ط³طھط§ظٹظ„:${style}\nط§ظ„ظ…ظˆظ‚ط¹:${location}\nط§ظ„ط¬ظ…ظ‡ظˆط±:${audience || 'ط¹ط§ظ…'}\nط§ظ„ط¹ظ…ظ‚:${depth || 'ط¹ظ…ظٹظ‚'}`
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
