export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://models.inference.ai.azure.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "أنت أداة MiniCode لتحليل النصوص بشكل احترافي"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "لا يوجد رد"
    });

  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
}
