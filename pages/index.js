import { useState, useRef } from 'react';
import Head from 'next/head';

const MSGS = ['Thinking...','Analyzing aesthetics...','Building shot list...','Selecting references...','Drawing palette...'];

export default function Home() {
  const [field, setField] = useState('Photography');
  const [style, setStyle] = useState('Cinematic Dark');
  const [location, setLocation] = useState('Riyadh');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [depth, setDepth] = useState('Deep');
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const resultsRef = useRef(null);

  async function generate() {
    if (!topic.trim()) { setError('Please enter a topic first'); return; }
    setError(''); setResult(null); setLoading(true);
    let i = 0; setLoadMsg(MSGS[0]);
    timerRef.current = setInterval(() => { i = (i+1) % MSGS.length; setLoadMsg(MSGS[i]); }, 1500);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, topic, style, location, audience: audience || 'General', depth })
      });
      const data = await res.json();
      if (data.error) { setError('Error: ' + data.error); return; }
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch(e) {
      setError('Error: ' + e.message);
    } finally {
      clearInterval(timerRef.current);
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Creative Visual Tool</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#080B10;--s1:#0F1318;--s2:#161C24;--s3:#1E2530;--border:#ffffff12;--border2:#ffffff20;--gold:#C9A96E;--gold2:#E8C97E;--text:#F0EDE8;--text2:#9AA0B0;--text3:#555D6E}
        body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh}
        .wrap{max-width:820px;margin:0 auto;padding:44px 24px 80px}
        .hdr{margin-bottom:40px;padding-bottom:28px;border-bottom:1px solid var(--border)}
        .hdr-tag{font-size:10px;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:10px}
        .hdr h1{font-size:30px;font-weight:700;margin-bottom:6px}
        .hdr h1 span{color:var(--gold)}
        .hdr p{font-size:13px;color:var(--text3);line-height:1.6}
        .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
        .field label{display:block;font-size:10px;letter-spacing:2px;color:var(--text3);text-transform:uppercase;margin-bottom:6px}
        .field select,.field input{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .2s;appearance:none}
        .field select:focus,.field input:focus{border-color:var(--gold)}
        .field select option{background:var(--s2)}
        .field input::placeholder{color:var(--text3)}
        .depth-row{display:flex;gap:8px;margin-bottom:18px;margin-top:6px}
        .db{flex:1;padding:10px;background:var(--s2);border:1px solid var(--border);border-radius:10px;color:var(--text3);font-size:13px;cursor:pointer;text-align:center;transition:all .2s;font-family:inherit;outline:none}
        .db.on{border-color:var(--gold);color:var(--gold);background:var(--s3)}
        .run{width:100%;padding:15px;background:var(--gold);border:none;border-radius:12px;color:#07090C;font-size:16px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit}
        .run:hover{background:var(--gold2);transform:translateY(-1px)}
        .run:disabled{opacity:.45;cursor:not-allowed;transform:none}
        .err{margin-top:12px;padding:11px 16px;background:#FF6B6B14;border:1px solid #FF6B6B35;border-radius:10px;color:#FF9999;font-size:13px}
        .loader{text-align:center;padding:64px 20px}
        .ring{width:36px;height:36px;border:2px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .85s linear infinite;margin:0 auto 16px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ltxt{font-size:13px;color:var(--text3);letter-spacing:1px}
        .results{margin-top:52px}
        .res-hdr{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:16px;border-bottom:1px solid var(--border);margin-bottom:24px}
        .res-topic{font-size:20px;font-weight:700;color:var(--gold)}
        .res-meta{font-size:11px;color:var(--text3)}
        .card{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:14px}
        .clbl{font-size:9px;letter-spacing:2.5px;color:var(--text3);text-transform:uppercase;margin-bottom:14px}
        .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        .idea{display:flex;gap:11px;padding:11px 13px;background:var(--s2);border-radius:9px;margin-bottom:8px;font-size:14px;line-height:1.75;color:var(--text)}
        .idea-n{color:var(--gold);font-size:10px;min-width:16px;padding-top:3px;flex-shrink:0;font-weight:600}
        .atxt{font-size:14px;line-height:1.95;color:var(--text2)}
        .shot{padding:9px 13px;background:var(--s2);border-radius:8px;margin-bottom:7px;font-size:13px;color:var(--text);line-height:1.6;display:flex;gap:8px}
        .shot-ic{color:var(--gold);flex-shrink:0}
        .ltxt2{font-size:13px;line-height:1.85;color:var(--text2);margin-bottom:16px}
        .swatches{display:flex;gap:12px;flex-wrap:wrap}
        .swatch{display:flex;flex-direction:column;align-items:center;gap:5px}
        .sw-c{width:46px;height:46px;border-radius:9px;border:1px solid var(--border)}
        .sw-n{font-size:9px;color:var(--text3);text-align:center;max-width:54px;line-height:1.4}
        .sw-r{font-size:8px;color:#444;text-align:center;max-width:54px}
        .ref{display:flex;gap:10px;padding:10px 12px;background:var(--s2);border-radius:9px;margin-bottom:7px;align-items:flex-start}
        .ref-ic{width:28px;height:28px;border-radius:7px;background:var(--s3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--gold);flex-shrink:0}
        .ref-name{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
        .ref-work{font-size:11px;color:var(--text3)}
        .ref-why{font-size:12px;color:var(--text2);margin-top:3px;line-height:1.5}
        .tags{display:flex;flex-wrap:wrap;gap:7px}
        .tag{padding:6px 13px;background:var(--s2);border:1px solid var(--border);border-radius:18px;font-size:12px;color:var(--text2)}
        .mb-title{font-size:9px;letter-spacing:2.5px;color:var(--text3);text-transform:uppercase;margin:28px 0 14px}
        .mb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .mb-img{aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:var(--s2);border:1px solid var(--border)}
        .mb-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .mb-img:hover img{transform:scale(1.04)}
        .mb-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--text3);text-align:center;padding:8px}
        @media(max-width:640px){.g3,.two{grid-template-columns:1fr 1fr}.mb-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:420px){.g3,.g2,.two{grid-template-columns:1fr}}
      `}</style>

      <div className="wrap">
        <div className="hdr">
          <div className="hdr-tag">Creative Visual Tool</div>
          <h1>Creative <span>Visual</span> Tool</h1>
          <p>Professional ideas آ· Visual analysis آ· Shot List آ· Color Palette آ· Global References آ· Moodboard</p>
        </div>

        <div className="g3">
          {[
            { label: 'Field', id: 'field', val: field, set: setField, opts: ['Photography','Film Production','Brand Identity','Commercial Ad','Music Video','Documentary'] },
            { label: 'Style', id: 'style', val: style, set: setStyle, opts: ['Cinematic Dark','Luxury Elegant','Bold Modern','Soft Dreamy','Raw Authentic','Futuristic','Heritage Contemporary'] },
            { label: 'Location', id: 'loc', val: location, set: setLocation, opts: ['Riyadh','Jeddah','NEOM','Diriyah','Studio','Desert','Coastal','Mountains'] },
          ].map(({ label, id, val, set, opts }) => (
            <div className="field" key={id}>
              <label>{label}</label>
              <select value={val} onChange={e => set(e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="g2">
          <div className="field">
            <label>Topic / Idea</label>
            <input type="text" placeholder="e.g. Identity of a modern Saudi woman..." value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} />
          </div>
          <div className="field">
            <label>Target Audience</label>
            <input type="text" placeholder="e.g. Youth 18-35, Luxury market..." value={audience} onChange={e => setAudience(e.target.value)} />
          </div>
        </div>

        <div className="field" style={{ marginBottom: '16px' }}>
          <label>Depth Level</label>
          <div className="depth-row">
            {['Basic','Deep','Expert'].map(v => (
              <button key={v} className={`db${depth === v ? ' on' : ''}`} onClick={() => setDepth(v)}>{v}</button>
            ))}
          </div>
        </div>

        <button className="run" disabled={loading} onClick={generate}>
          {loading ? loadMsg : 'âœ¦ Generate Creative Ideas'}
        </button>

        {error && <div className="err">{error}</div>}
        {loading && <div className="loader"><div className="ring"></div><div className="ltxt">{loadMsg}</div></div>}

        {result && (
          <div className="results" ref={resultsRef}>
            <div className="res-hdr">
              <span className="res-topic">{topic}</span>
              <span className="res-meta">{field} / {style}</span>
            </div>
            {result.ideas?.length > 0 && (
              <div className="card">
                <div className="clbl">Creative Ideas</div>
                {result.ideas.map((x, i) => <div className="idea" key={i}><span className="idea-n">0{i+1}</span><span>{x}</span></div>)}
              </div>
            )}
            {result.analysis && <div className="card"><div className="clbl">Visual Analysis</div><div className="atxt">{result.analysis}</div></div>}
            <div className="two">
              {result.shotList?.length > 0 && (
                <div className="card">
                  <div className="clbl">Shot List</div>
                  {result.shotList.map((s, i) => <div className="shot" key={i}><span className="shot-ic">â—ˆ</span><span>{s}</span></div>)}
                </div>
              )}
              {result.references?.length > 0 && (
                <div className="card">
                  <div className="clbl">Global References</div>
                  {result.references.map((r, i) => (
                    <div className="ref" key={i}>
                      <div className="ref-ic">âœ¦</div>
                      <div>
                        <div className="ref-name">{r.name}</div>
                        <div className="ref-work">{r.work}</div>
                        {r.why && <div className="ref-why">{r.why}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(result.lighting || result.colorPalette?.length > 0) && (
              <div className="card">
                <div className="clbl">Lighting & Colors</div>
                {result.lighting && <div className="ltxt2">{result.lighting}</div>}
                {result.colorPalette?.length > 0 && (
                  <div className="swatches">
                    {result.colorPalette.map((c, i) => (
                      <div className="swatch" key={i}>
                        <div className="sw-c" style={{ background: c.hex }}></div>
                        <div className="sw-n">{c.name}</div>
                        <div className="sw-r">{c.role}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {result.moodboardKeywords?.length > 0 && (
              <div className="card">
                <div className="clbl">Moodboard Keywords</div>
                <div className="tags">{result.moodboardKeywords.map((k, i) => <span className="tag" key={i}>{k}</span>)}</div>
              </div>
            )}
            {result.unsplashTerms?.length > 0 && (
              <>
                <div className="mb-title">Visual Moodboard</div>
                <div className="mb-grid">
                  {[...result.unsplashTerms,...result.unsplashTerms,...result.unsplashTerms].slice(0,9).map((t,i) => (
                    <div className="mb-img" key={i}>
                      <img src={`https://source.unsplash.com/600x450/?${encodeURIComponent(t)}&sig=${i}`} alt={t}
                        onError={e => { e.target.parentNode.innerHTML = `<div class="mb-ph">${t}</div>`; }} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
