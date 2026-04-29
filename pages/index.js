import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  async function send() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    setResult(data.result || "فيه خطأ");
  }

  return (
    <div style={{ direction: "rtl", fontFamily: "sans-serif", padding: 20 }}>
      <h1>MiniCode</h1>

      <textarea
        style={{ width: "100%", height: 120 }}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="اكتب طلبك هنا..."
      />

      <br />

      <button onClick={send} style={{ padding: 10, marginTop: 10 }}>
        تحليل
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {result}
      </pre>
    </div>
  );
}