// screens/ChatScreen.jsx
import { useState, useRef, useEffect } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const EMOJI_CYCLE = ["😊","🥰","💕","😘","🌹","✨","💫","🫶","💌","😍"];
const STICKERS = ["🥺","🤗","😭","🥳","😤","🫠","😴","🤩","🥲","😇","🫣","🤭"];
const ATTACH_OPTIONS = [
  { e:"🖼️", l:"Image",  s:"Photo library or files" },
  { e:"🎬", l:"Video",  s:"Video library or files" },
  { e:"🔗", l:"Link",   s:"Paste a URL to share" },
];

const INIT_MESSAGES = [
  { id:1,  from:"them", text:"good morning 🌸",           time:"9:41 AM", read:true },
  { id:2,  from:"you",  text:"good morning baby 😍",       time:"9:42 AM", read:true },
  { id:3,  from:"them", text:"i miss you sm today",        time:"9:43 AM", read:true },
  { id:4,  from:"you",  text:"i was literally thinking about you when i woke up 🥺", time:"9:43 AM", read:true },
  { id:5,  from:"them", text:"stop you're making me blush", time:"9:44 AM", read:true },
  { id:6,  from:"you",  text:"good 💕",                   time:"9:44 AM", read:true },
  { id:7,  from:"them", text:"what are you doing today?",  time:"9:50 AM", read:true },
  { id:8,  from:"you",  text:"nothing much honestly. wish i could just stay in bed and talk to you all day", time:"9:51 AM", read:true },
  { id:9,  from:"them", text:"same 😭 ugh i hate the distance", time:"9:52 AM", read:true },
  { id:10, from:"them", text:"only 23 more days though 🥰", time:"9:52 AM", read:true },
  { id:11, from:"you",  text:"counting down every single one 💌", time:"9:53 AM", read:true, pinned:true },
];

const PINNED = INIT_MESSAGES.find(m => m.pinned);

// ── Tiny CSS for animations ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes popIn    { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:none} }
@keyframes slideUp  { from{transform:translateY(100%)} to{transform:none} }
@keyframes msgIn    { from{opacity:0;transform:translateY(8px) scale(.97)} to{opacity:1;transform:none} }
@keyframes pulse    { 0%,100%{opacity:.5} 50%{opacity:1} }
@keyframes dot1     { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
@keyframes dot2     { 0%,70%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
@keyframes dot3     { 0%,80%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

.msg-bubble { animation: msgIn .22s cubic-bezier(.4,0,.2,1) both; }
.panel-up   { animation: slideUp .3s cubic-bezier(.4,0,.2,1); }
.pop-in     { animation: popIn .22s cubic-bezier(.34,1.56,.64,1); }

.msg-scroll::-webkit-scrollbar { display: none; }
.msg-scroll { -ms-overflow-style: none; scrollbar-width: none; }

.bubble-wrap { position: relative; transition: transform .18s cubic-bezier(.4,0,.2,1); }
.bubble-wrap:active { transform: translateX(var(--swipe-dir, -3px)); }

.react-bar { position: absolute; bottom: calc(100% + 6px); background: rgba(20,6,28,.92); border: 1px solid rgba(255,255,255,.1); border-radius: 24px; padding: 6px 10px; display: flex; gap: 6px; backdrop-filter: blur(12px); z-index: 10; white-space: nowrap; animation: popIn .18s ease; }
.react-btn { font-size: 18px; cursor: pointer; transition: transform .12s; }
.react-btn:active { transform: scale(1.3); }
`;

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", padding:"10px 14px", background:"rgba(107,58,110,.18)", border:"1px solid rgba(232,116,138,.12)", borderRadius:"18px 18px 18px 4px", width:"fit-content" }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"rgba(232,116,138,.6)", animation:`dot${i} 1.2s ease infinite` }}/>
      ))}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg, onReact }) {
  const isYou = msg.from === "you";
  const [showReact, setShowReact] = useState(false);
  const timerRef = useRef(null);

  const REACTIONS = ["❤️","😂","😮","😢","🔥","💕"];

  const handlePressStart = () => { timerRef.current = setTimeout(() => setShowReact(true), 420); };
  const handlePressEnd   = () => { clearTimeout(timerRef.current); };

  return (
    <div
      className="bubble-wrap"
      style={{ display:"flex", flexDirection:"column", alignItems: isYou ? "flex-end" : "flex-start", "--swipe-dir": isYou ? "3px" : "-3px", position:"relative" }}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
    >
      {showReact && (
        <div className="react-bar" style={{ [isYou ? "right" : "left"]: 0 }}>
          {REACTIONS.map(r => (
            <span key={r} className="react-btn" onClick={() => { onReact(msg.id, r); setShowReact(false); }}>{r}</span>
          ))}
          <span className="react-btn" onClick={() => setShowReact(false)} style={{ fontSize:14, color:"rgba(255,255,255,.4)", paddingLeft:4 }}>✕</span>
        </div>
      )}

      {/* Reply quote */}
      {msg.replyTo && (
        <div style={{
          maxWidth:"72%", marginBottom:4, padding:"6px 10px",
          background:"rgba(255,255,255,.05)", borderRadius:10,
          borderLeft:"2px solid rgba(232,116,138,.5)",
          fontSize:11, color:"rgba(255,255,255,.45)", lineHeight:1.4,
        }}>
          {msg.replyTo}
        </div>
      )}

      <div
        className="msg-bubble"
        style={{
          maxWidth:"75%", padding:"10px 14px", lineHeight:1.55,
          fontSize:14, fontFamily:"'DM Sans',sans-serif",
          borderRadius: isYou ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isYou
            ? "linear-gradient(135deg, #e8748a, #c45578)"
            : "rgba(107,58,110,.28)",
          border: isYou ? "none" : "1px solid rgba(232,116,138,.14)",
          color:"#fff",
          boxShadow: isYou ? "0 4px 18px rgba(232,116,138,.25)" : "none",
          wordBreak:"break-word",
        }}
      >
        {msg.text}
      </div>

      {/* Reaction badge */}
      {msg.reaction && (
        <div style={{ fontSize:16, marginTop:3, animation:"popIn .18s ease" }}>{msg.reaction}</div>
      )}

      {/* Time + read */}
      <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:3 }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,.28)" }}>{msg.time}</span>
        {isYou && <span style={{ fontSize:10, color: msg.read ? "rgba(232,116,138,.7)" : "rgba(255,255,255,.25)" }}>✓✓</span>}
      </div>
    </div>
  );
}

// ── Attach bottom sheet ───────────────────────────────────────────────────────
function AttachSheet({ onClose }) {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:40, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ flex:1, background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)" }}/>
      <div className="panel-up" style={{
        background:"linear-gradient(180deg,#1a0828,#0d0511)",
        borderRadius:"28px 28px 0 0", borderTop:"1px solid rgba(255,255,255,.1)",
        padding:"20px 24px 44px",
      }}>
        <div onClick={onClose} style={{ display:"flex", justifyContent:"center", marginBottom:20, cursor:"pointer" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,.18)" }}/>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:300, color:"#fff", marginBottom:16 }}>
          Attach <em style={{ fontStyle:"italic", color:"#f5a8b8" }}>something</em>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {ATTACH_OPTIONS.map(o => (
            <div key={o.l} onClick={onClose} style={{
              background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)",
              borderRadius:16, padding:"16px 8px 12px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              cursor:"pointer", transition:"background .16s",
            }}>
              <div style={{ fontSize:28 }}>{o.e}</div>
              <div style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,.7)" }}>{o.l}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", textAlign:"center", lineHeight:1.4 }}>{o.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Emoji / Sticker / GIF panel ───────────────────────────────────────────────
function EmojiPanel({ onEmoji, onClose }) {
  const [tab, setTab] = useState("emoji");
  const EMOJI_ROWS = [
    ["❤️","🥰","😘","💕","💌","🫶","✨","💫"],
    ["😊","😍","🥺","😭","🤗","😤","🥳","😇"],
    ["🌹","🌸","🌺","💐","🍓","🎀","🫧","🕯️"],
    ["😂","🤣","😅","🥲","😔","😴","🫠","🤭"],
  ];

  return (
    <div className="panel-up" style={{
      background:"linear-gradient(180deg,#1a0828,#0d0511)",
      borderTop:"1px solid rgba(255,255,255,.1)",
      height:280, flexShrink:0,
    }}>
      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,.08)", padding:"0 16px" }}>
        {[{k:"emoji",l:"😊"},{ k:"stickers",l:"🎭" },{k:"gif",l:"GIF"}].map(t => (
          <div key={t.k} onClick={() => setTab(t.k)} style={{
            padding:"10px 14px", fontSize:13, cursor:"pointer",
            color: tab===t.k ? "#e8748a" : "rgba(255,255,255,.35)",
            borderBottom: tab===t.k ? "2px solid #e8748a" : "2px solid transparent",
            marginBottom:-1, transition:"color .15s",
            fontFamily:"'DM Sans',sans-serif",
          }}>{t.l}</div>
        ))}
        <div onClick={onClose} style={{ marginLeft:"auto", padding:"10px 8px", fontSize:16, color:"rgba(255,255,255,.3)", cursor:"pointer" }}>✕</div>
      </div>

      {tab === "emoji" && (
        <div style={{ padding:"12px 14px", overflowY:"auto", height:"calc(100% - 44px)" }}>
          {EMOJI_ROWS.map((row,i) => (
            <div key={i} style={{ display:"flex", gap:4, marginBottom:4 }}>
              {row.map(e => (
                <div key={e} onClick={() => onEmoji(e)} style={{
                  fontSize:22, cursor:"pointer", padding:"4px 5px", borderRadius:8,
                  transition:"background .1s",
                }}>{e}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "stickers" && (
        <div style={{ padding:"12px 14px", overflowY:"auto", height:"calc(100% - 44px)" }}>
          <div style={{ fontSize:11, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,.25)", marginBottom:10 }}>Couple Pack</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {STICKERS.map(s => (
              <div key={s} onClick={() => { onEmoji(s); onClose(); }} style={{
                width:52, height:52, background:"rgba(255,255,255,.04)",
                border:"1px solid rgba(255,255,255,.08)", borderRadius:14,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26, cursor:"pointer",
              }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {tab === "gif" && (
        <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"calc(100% - 44px)", gap:8 }}>
          <div style={{ fontSize:32 }}>🔍</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.4)", fontFamily:"'DM Sans',sans-serif" }}>GIF search coming soon</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.2)", fontFamily:"'DM Sans',sans-serif" }}>Tenor & Giphy integration</div>
        </div>
      )}
    </div>
  );
}

// ── Settings sheet ────────────────────────────────────────────────────────────
function SettingsSheet({ onClose }) {
  const OPTIONS = [
    { e:"🎨", l:"Chat Background",     s:"Wallpaper & colors" },
    { e:"🔤", l:"Bubble Style",         s:"Color and shape" },
    { e:"🔔", l:"Notification Tone",    s:"Custom sound for this chat" },
    { e:"🔒", l:"Disappearing Messages",s:"Auto-delete after a set time" },
  ];
  return (
    <div style={{ position:"absolute", inset:0, zIndex:50, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ flex:1, background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)" }}/>
      <div className="panel-up" style={{
        background:"linear-gradient(180deg,#1a0828,#0d0511)",
        borderRadius:"28px 28px 0 0", borderTop:"1px solid rgba(255,255,255,.1)",
        padding:"20px 24px 44px",
      }}>
        <div onClick={onClose} style={{ display:"flex", justifyContent:"center", marginBottom:20, cursor:"pointer" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,.18)" }}/>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:300, color:"#fff", marginBottom:16 }}>
          Chat <em style={{ fontStyle:"italic", color:"#f5a8b8" }}>Settings</em>
        </div>
        <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:16, overflow:"hidden" }}>
          {OPTIONS.map((o,i) => (
            <div key={o.l} style={{
              display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
              borderBottom: i<OPTIONS.length-1 ? "1px solid rgba(255,255,255,.06)" : "none",
              cursor:"pointer",
            }}>
              <div style={{ width:36, height:36, borderRadius:11, background:"rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{o.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.85)", fontWeight:500 }}>{o.l}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:1 }}>{o.s}</div>
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.2)" }}>›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ChatScreen({ onBack }) {
  const [messages,     setMessages]     = useState(INIT_MESSAGES);
  const [inputText,    setInputText]    = useState("");
  const [emojiIdx,     setEmojiIdx]     = useState(0);
  const [voiceMode,    setVoiceMode]    = useState("voice");
  const [showAttach,   setShowAttach]   = useState(false);
  const [showEmoji,    setShowEmoji]    = useState(false);
  const [showPinned,   setShowPinned]   = useState(true);
  const [isTyping,     setIsTyping]     = useState(false);
  const [holdRec,      setHoldRec]      = useState(false);
  const [replyTo,      setReplyTo]      = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, isTyping]);

  function simulateTyping() {
    setTimeout(() => setIsTyping(true), 800);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(m => [...m, {
        id: Date.now(), from:"them",
        text: ["🥺💕","i love you sm","aww baby","😭😭😭","stop you're too cute","i can't wait to see you","ugh miss you"][Math.floor(Math.random()*7)],
        time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
        read:false,
      }]);
    }, 2400);
  }

  function sendMessage() {
    if (!inputText.trim()) return;
    setMessages(m => [...m, {
      id: Date.now(), from:"you", text: inputText.trim(),
      time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      read:false, replyTo,
    }]);
    setInputText(""); setReplyTo(null);
    simulateTyping();
  }

  function addReaction(id, emoji) {
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, reaction: emoji } : msg));
  }

  function cycleEmoji() {
    setEmojiIdx(i => (i + 1) % EMOJI_CYCLE.length);
  }

  const hasText = inputText.trim().length > 0;

  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", background:"#0d0511", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>

      {/* Ambient background */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, left:-60, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(107,58,110,.18), transparent 70%)" }}/>
        <div style={{ position:"absolute", bottom:160, right:-40, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,116,138,.08), transparent 70%)" }}/>
      </div>

      {/* ── Top bar ── */}
      <div style={{
        position:"relative", zIndex:10,
        background:"rgba(9,3,14,.9)", backdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,255,255,.07)",
        padding:"52px 16px 12px",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <div onClick={onBack} style={{
          width:36, height:36, borderRadius:12,
          background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", fontSize:16, flexShrink:0,
        }}>←</div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#7eb8f5,#3a6eb4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, color:"#fff" }}>J</div>
              <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:"#5ef5a0", border:"1.5px solid #0d0511" }}/>
            </div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:400, color:"#fff", lineHeight:1 }}>Jordan</div>
              <div style={{ fontSize:10, color:"rgba(94,245,160,.7)", marginTop:2 }}>online now</div>
            </div>
          </div>
        </div>

        <div onClick={() => setShowSettings(s=>!s)} style={{
          width:36, height:36, borderRadius:12,
          background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", fontSize:16, flexShrink:0,
        }}>⚙️</div>
      </div>

      {/* ── Pinned message banner ── */}
      {showPinned && PINNED && (
        <div style={{
          position:"relative", zIndex:9,
          background:"rgba(232,116,138,.07)", borderBottom:"1px solid rgba(232,116,138,.14)",
          padding:"8px 16px", display:"flex", alignItems:"center", gap:10,
          cursor:"pointer", animation:"fadeUp .2s ease",
        }}>
          <div style={{ fontSize:13, color:"rgba(232,116,138,.6)", flexShrink:0 }}>📌</div>
          <div style={{ flex:1, overflow:"hidden" }}>
            <div style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(232,116,138,.5)", marginBottom:1 }}>Pinned message</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.65)", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{PINNED.text}</div>
          </div>
          <div onClick={e => { e.stopPropagation(); setShowPinned(false); }} style={{ color:"rgba(255,255,255,.25)", fontSize:12, padding:"2px 4px" }}>✕</div>
        </div>
      )}

      {/* ── Message list ── */}
      <div className="msg-scroll" style={{ flex:1, overflowY:"auto", padding:"16px 14px 8px", display:"flex", flexDirection:"column", gap:10, position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 8px" }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }}/>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", letterSpacing:"1px" }}>Today</div>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }}/>
        </div>

        {messages.map((msg, i) => (
          <div key={msg.id}>
            {i > 0 && messages[i-1].from !== msg.from && <div style={{ height:4 }}/>}
            <Bubble msg={msg} onReact={addReaction} />
          </div>
        ))}

        {isTyping && (
          <div style={{ animation:"msgIn .22s ease" }}>
            <TypingDots />
          </div>
        )}

        {holdRec && (
          <div style={{ display:"flex", justifyContent:"center", animation:"fadeUp .15s ease" }}>
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              background:"rgba(232,116,138,.12)", border:"1px solid rgba(232,116,138,.25)",
              borderRadius:20, padding:"8px 16px",
            }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#e8748a", animation:"pulse 1s ease infinite" }}/>
              <span style={{ fontSize:12, color:"rgba(232,116,138,.9)" }}>
                {voiceMode === "voice" ? "Recording voice note…" : "Recording video note…"}
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Reply preview bar ── */}
      {replyTo && (
        <div style={{
          background:"rgba(255,255,255,.04)", borderTop:"1px solid rgba(255,255,255,.07)",
          padding:"8px 14px", display:"flex", alignItems:"center", gap:10,
        }}>
          <div style={{ width:2, height:"100%", minHeight:28, background:"#e8748a", borderRadius:1, flexShrink:0 }}/>
          <div style={{ flex:1, fontSize:12, color:"rgba(255,255,255,.5)", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
            Replying to: {replyTo}
          </div>
          <div onClick={() => setReplyTo(null)} style={{ color:"rgba(255,255,255,.3)", fontSize:14, cursor:"pointer" }}>✕</div>
        </div>
      )}

      {/* ── Emoji / Sticker panel ── */}
      {showEmoji && (
        <EmojiPanel
          onEmoji={e => setInputText(t => t + e)}
          onClose={() => setShowEmoji(false)}
        />
      )}

      {/* ── Input bar ── */}
      <div style={{
        position:"relative", zIndex:10,
        background:"rgba(9,3,14,.95)", backdropFilter:"blur(24px)",
        borderTop:"1px solid rgba(255,255,255,.07)",
        padding:"10px 12px 28px",
        display:"flex", alignItems:"flex-end", gap:8,
      }}>
        <div onClick={() => { setShowAttach(true); setShowEmoji(false); }} style={{
          width:40, height:40, borderRadius:13, flexShrink:0,
          background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", fontSize:20, color:"rgba(255,255,255,.6)",
          transition:"background .15s",
        }}>＋</div>

        <div style={{ flex:1, position:"relative" }}>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={e => { setInputText(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }}
            onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); } }}
            placeholder="say something sweet…"
            rows={1}
            style={{
              width:"100%", background:"rgba(255,255,255,.07)",
              border:"1px solid rgba(255,255,255,.1)", borderRadius:16,
              padding:"10px 44px 10px 14px", color:"#fff",
              fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.45,
              outline:"none", resize:"none", overflowY:"hidden",
              transition:"border-color .2s",
            }}
            onFocus={e => { e.target.style.borderColor="rgba(232,116,138,.4)"; setShowEmoji(false); }}
            onBlur={e => { e.target.style.borderColor="rgba(255,255,255,.1)"; }}
          />
          <div onClick={() => { cycleEmoji(); setShowEmoji(v => !v); }} style={{
            position:"absolute", right:10, bottom:8,
            fontSize:20, cursor:"pointer", lineHeight:1,
            transition:"transform .2s cubic-bezier(.34,1.56,.64,1)",
          }}>
            {EMOJI_CYCLE[emojiIdx]}
          </div>
        </div>

        {hasText ? (
          <div style={{
            width:40, height:40, borderRadius:13, flexShrink:0,
            background:"linear-gradient(135deg,#e8748a,#c45578)",
            boxShadow:"0 4px 18px rgba(232,116,138,.4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", fontSize:17, color:"#fff",
            transition:"transform .12s", animation:"popIn .18s ease",
          }}
          onPointerDown={e => e.currentTarget.style.transform="scale(.9)"}
          onPointerUp={e => { e.currentTarget.style.transform=""; sendMessage(); }}
          >➤</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div onClick={() => setVoiceMode(m => m==="voice"?"video":"voice")} style={{
              fontSize:9, color:"rgba(255,255,255,.3)", cursor:"pointer", letterSpacing:".5px",
              fontFamily:"'DM Sans',sans-serif",
            }}>
              {voiceMode==="voice"?"MIC":"CAM"}
            </div>
            <div
              onPointerDown={() => setHoldRec(true)}
              onPointerUp={() => setHoldRec(false)}
              onPointerLeave={() => setHoldRec(false)}
              style={{
                width:40, height:40, borderRadius:13, flexShrink:0,
                background: holdRec ? "rgba(232,116,138,.3)" : "rgba(255,255,255,.07)",
                border:`1px solid ${holdRec ? "rgba(232,116,138,.5)" : "rgba(255,255,255,.1)"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", fontSize:18, touchAction:"none",
                transition:"background .12s, border-color .12s",
              }}
            >
              {voiceMode==="voice" ? "🎙️" : "📹"}
            </div>
          </div>
        )}
      </div>

      {showAttach   && <AttachSheet onClose={() => setShowAttach(false)} />}
      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}
