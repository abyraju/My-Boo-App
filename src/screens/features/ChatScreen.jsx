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

// Spread demo messages across the last ~72 minutes so relative times show properly
const _now = Date.now();
const _m = (minsAgo) => _now - minsAgo * 60 * 1000;
const INIT_MESSAGES = [
  { id:1,  from:"them", text:"good morning 🌸",           ts:_m(71), read:true },
  { id:2,  from:"you",  text:"good morning baby 😍",       ts:_m(70), read:true },
  { id:3,  from:"them", text:"i miss you sm today",        ts:_m(69), read:true },
  { id:4,  from:"you",  text:"i was literally thinking about you when i woke up 🥺", ts:_m(68), read:true },
  { id:5,  from:"them", text:"stop you're making me blush", ts:_m(67), read:true },
  { id:6,  from:"you",  text:"good 💕",                   ts:_m(66), read:true },
  { id:7,  from:"them", text:"what are you doing today?",  ts:_m(58), read:true },
  { id:8,  from:"you",  text:"nothing much honestly. wish i could just stay in bed and talk to you all day", ts:_m(57), read:true },
  { id:9,  from:"them", text:"same 😭 ugh i hate the distance", ts:_m(3),  read:true },
  { id:10, from:"them", text:"only 23 more days though 🥰", ts:_m(2),  read:true },
  { id:11, from:"you",  text:"counting down every single one 💌", ts:_m(0), read:true, pinned:true },
];

// ── Relative timestamp helper ─────────────────────────────────────────────────
function relativeTime(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10)  return "now";
  if (secs < 30)  return "10s ago";
  if (secs < 60)  return "30s ago";
  const mins = Math.floor(secs / 60);
  if (mins < 60)  return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 12)   return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  return new Date(ts).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

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
function Bubble({ msg, onReact, onReply, onPin, onDelete, isLastSeen }) {
  const isYou = msg.from === "you";
  const [showMenu, setShowMenu] = useState(false);
  const [, tick]   = useState(0);
  const timerRef   = useRef(null);

  // Re-render every 10 s so relative timestamps stay fresh
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 10_000);
    return () => clearInterval(id);
  }, []);

  const REACTIONS = ["❤️","😂","😮","😢","🔥","💕"];

  const handlePressStart = () => { timerRef.current = setTimeout(() => setShowMenu(true), 400); };
  const handlePressEnd   = () => { clearTimeout(timerRef.current); };

  function close() { setShowMenu(false); }

  return (
    <div style={{ position:"relative" }}>
      {/* Context menu overlay */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div onClick={close} style={{ position:"fixed", inset:0, zIndex:20 }}/>
          {/* Menu */}
          <div className="pop-in" style={{
            position:"absolute", zIndex:21,
            [isYou ? "right" : "left"]: 0,
            bottom:"calc(100% + 8px)",
            background:"rgba(20,6,28,.96)", border:"1px solid rgba(255,255,255,.1)",
            borderRadius:18, backdropFilter:"blur(14px)",
            minWidth:200, overflow:"hidden",
            boxShadow:"0 8px 32px rgba(0,0,0,.6)",
          }}>
            {/* Reactions row */}
            <div style={{ display:"flex", gap:4, padding:"10px 12px 8px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
              {REACTIONS.map(r => (
                <span key={r} className="react-btn" onClick={() => { onReact(msg.id, r); close(); }}>{r}</span>
              ))}
            </div>
            {/* Actions */}
            {[
              { ico:"↩️", label:"Reply",  action:() => { onReply(msg.text); close(); } },
              { ico:"📌", label: msg.pinned ? "Unpin" : "Pin", action:() => { onPin(msg.id); close(); } },
              { ico:"🗑️", label:"Delete", action:() => { onDelete(msg.id); close(); }, danger:true },
            ].map(({ ico, label, action, danger }) => (
              <div key={label} onClick={action} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"11px 16px",
                cursor:"pointer",
                color: danger ? "#ff8a8a" : "rgba(255,255,255,.82)",
                fontSize:13, fontFamily:"'DM Sans',sans-serif",
                transition:"background .12s",
              }}
              onPointerEnter={e => e.currentTarget.style.background="rgba(255,255,255,.05)"}
              onPointerLeave={e => e.currentTarget.style.background="transparent"}
              >
                <span style={{ fontSize:16 }}>{ico}</span>
                {label}
              </div>
            ))}
          </div>
        </>
      )}

      <div
        className="bubble-wrap"
        style={{ display:"flex", flexDirection:"column", alignItems: isYou ? "flex-end" : "flex-start", "--swipe-dir": isYou ? "3px" : "-3px", position:"relative" }}
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressEnd}
      >
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
            outline: msg.pinned ? "1px solid rgba(201,169,110,.35)" : "none",
          }}
        >
          {msg.text}
        </div>

        {/* Reaction badge */}
        {msg.reaction && (
          <div style={{ fontSize:16, marginTop:3, animation:"popIn .18s ease" }}>{msg.reaction}</div>
        )}

        {/* Footer row: [📌 pin icon] [relative time] [· seen] */}
        <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:3 }}>
          {msg.pinned && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.75)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22"/>
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
            </svg>
          )}
          <span style={{ fontSize:10, color:"rgba(255,255,255,.28)" }}>{relativeTime(msg.ts)}</span>
          {isLastSeen && (
            <span style={{ fontSize:10, color:"rgba(232,116,138,.55)", fontStyle:"italic" }}>· seen</span>
          )}
        </div>
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
  const [showAttach,    setShowAttach]    = useState(false);
  const [showEmoji,     setShowEmoji]     = useState(false);
  const [showPinned,    setShowPinned]    = useState(true);
  const [isTyping,      setIsTyping]      = useState(false);
  const [holdRec,       setHoldRec]       = useState(false);
  const [replyTo,       setReplyTo]       = useState(null);
  const [showSettings,  setShowSettings]  = useState(false);
  const [showMenu,      setShowMenu]      = useState(false);
  const [showSearch,    setShowSearch]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [showPinnedPage,setShowPinnedPage]= useState(false);
  const [pinnedIdx,     setPinnedIdx]     = useState(0);   // which pinned msg shown in banner
  const scrollRef  = useRef(null);   // message list scroll container
  const msgRefs    = useRef({});     // id → DOM node for scroll-to
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, isTyping]);

  function simulateTyping() {
    setTimeout(() => setIsTyping(true), 800);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(m => [...m, {
        id: Date.now(), from:"them",
        text: ["🥺💕","i love you sm","aww baby","😭😭😭","stop you're too cute","i can't wait to see you","ugh miss you"][Math.floor(Math.random()*7)],
        ts: Date.now(),
        read:false,
      }]);
    }, 2400);
  }

  function sendMessage() {
    if (!inputText.trim()) return;
    setMessages(m => [...m, {
      id: Date.now(), from:"you", text: inputText.trim(),
      ts: Date.now(),
      read:false, replyTo,
    }]);
    setInputText(""); setReplyTo(null);
    simulateTyping();
  }

  function addReaction(id, emoji) {
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, reaction: emoji } : msg));
  }

  const PIN_LIMIT = 20;
  function pinMessage(id) {
    setMessages(m => {
      const target = m.find(msg => msg.id === id);
      if (!target) return m;
      // Enforce limit: block pinning when already at 20 pinned messages
      const pinnedCount = m.filter(msg => msg.pinned).length;
      if (!target.pinned && pinnedCount >= PIN_LIMIT) return m;
      const updated = m.map(msg => msg.id === id ? { ...msg, pinned: !msg.pinned } : msg);
      // If we just unpinned, clamp pinnedIdx to new length
      const newPinned = updated.filter(msg => msg.pinned);
      setPinnedIdx(i => Math.min(i, Math.max(0, newPinned.length - 1)));
      return updated;
    });
  }

  function deleteMessage(id) {
    setMessages(m => m.filter(msg => msg.id !== id));
  }

  // Last outgoing read message — shows "Seen" beneath it
  const lastSeenId = [...messages].reverse().find(m => m.from === "you" && m.read)?.id;

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
        padding:"14px 16px 12px",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <div onClick={onBack} style={{
          width:36, height:36, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#7eb8f5,#3a6eb4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, color:"#fff" }}>J</div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:400, color:"#fff", lineHeight:1.1 }}>Jordan</div>
              {/* Partner status — synced from partner's device in production */}
              <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5ef5a0" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3.5" fill="#5ef5a0" stroke="none"/>
                </svg>
                <span style={{ fontSize:9, letterSpacing:"1.5px", fontVariant:"small-caps", textTransform:"lowercase", color:"rgba(94,245,160,.75)", fontFamily:"'DM Sans',sans-serif" }}>online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right controls — search + 3-dot menu */}
        <div style={{ display:"flex", alignItems:"center", gap:2, flexShrink:0, position:"relative" }}>
          {/* Search */}
          <div onClick={() => { setShowSearch(s=>!s); setShowMenu(false); }} style={{
            width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", color: showSearch ? "#e8748a" : "#fff",
            transition:"color .15s",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
          </div>

          {/* 3-dot menu button */}
          <div onClick={() => { setShowMenu(s=>!s); setShowSearch(false); }} style={{
            width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", color:"#fff",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <circle cx="12" cy="5"  r="1.6"/>
              <circle cx="12" cy="12" r="1.6"/>
              <circle cx="12" cy="19" r="1.6"/>
            </svg>
          </div>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div onClick={() => setShowMenu(false)} style={{ position:"fixed", inset:0, zIndex:40 }}/>
              <div className="pop-in" style={{
                position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:41,
                background:"rgba(18,5,26,.97)", border:"1px solid rgba(255,255,255,.1)",
                borderRadius:16, backdropFilter:"blur(18px)",
                minWidth:195, overflow:"hidden",
                boxShadow:"0 8px 32px rgba(0,0,0,.65)",
              }}>
                {[
                  { ico: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>, label:"Pinned Messages", action:() => { setShowPinnedPage(true); setShowMenu(false); } },
                  { ico: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label:"Chat Settings", action:() => { setShowSettings(true); setShowMenu(false); } },
                ].map(({ ico, label, action }, i, arr) => (
                  <div key={label} onClick={action} style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"13px 18px",
                    borderBottom: i < arr.length-1 ? "1px solid rgba(255,255,255,.06)" : "none",
                    cursor:"pointer", transition:"background .12s",
                  }}
                  onPointerEnter={e => e.currentTarget.style.background="rgba(255,255,255,.05)"}
                  onPointerLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    {ico}
                    <span style={{ fontSize:13, color:"rgba(255,255,255,.82)", fontFamily:"'DM Sans',sans-serif" }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      {showSearch && (
        <div style={{
          position:"relative", zIndex:8,
          background:"rgba(9,3,14,.92)", backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,.07)",
          padding:"8px 14px 10px",
          animation:"fadeUp .18s ease",
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)",
            borderRadius:14, padding:"8px 12px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="search messages…"
              style={{
                flex:1, background:"transparent", border:"none", outline:"none",
                color:"#fff", caretColor:"#e8748a",
                fontFamily:"'DM Sans',sans-serif", fontSize:13,
              }}
            />
            {searchQuery && (
              <div onClick={() => setSearchQuery("")} style={{ color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:13, lineHeight:1 }}>✕</div>
            )}
          </div>
        </div>
      )}

      {/* ── Pinned message banner (swipeable, scroll-to on click) ── */}
      {showPinned && (() => {
        const pinnedMsgs = messages.filter(m => m.pinned);
        if (!pinnedMsgs.length) return null;
        const current = pinnedMsgs[Math.min(pinnedIdx, pinnedMsgs.length - 1)];
        const total = pinnedMsgs.length;

        function scrollToMessage(id) {
          const el = msgRefs.current[id];
          if (el && scrollRef.current) {
            el.scrollIntoView({ behavior:"smooth", block:"center" });
            // Flash highlight
            el.style.transition = "background .15s";
            el.style.background = "rgba(232,116,138,.1)";
            el.style.borderRadius = "14px";
            setTimeout(() => { el.style.background = ""; el.style.borderRadius = ""; }, 900);
          }
        }

        // Swipe handlers
        const swipeRef = { startX: 0, dragging: false };
        function onBannerPtrDown(e) { swipeRef.startX = e.clientX; swipeRef.dragging = false; }
        function onBannerPtrMove(e) {
          if (Math.abs(e.clientX - swipeRef.startX) > 8) swipeRef.dragging = true;
        }
        function onBannerPtrUp(e) {
          if (!swipeRef.dragging || total < 2) return;
          const dx = e.clientX - swipeRef.startX;
          if (dx < -30) setPinnedIdx(i => (i + 1) % total);       // swipe left → next
          else if (dx > 30) setPinnedIdx(i => (i - 1 + total) % total); // swipe right → prev
        }

        return (
          <div
            onPointerDown={onBannerPtrDown}
            onPointerMove={onBannerPtrMove}
            onPointerUp={onBannerPtrUp}
            style={{
              position:"relative", zIndex:9,
              background:"rgba(232,116,138,.06)", borderBottom:"1px solid rgba(232,116,138,.13)",
              padding:"7px 10px 7px 14px", display:"flex", alignItems:"center", gap:8,
              animation:"fadeUp .2s ease", touchAction:"pan-y", userSelect:"none",
            }}>
            {/* Pin icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
              <line x1="12" y1="17" x2="12" y2="22"/>
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
            </svg>

            {/* Text — click to scroll to the message */}
            <div
              onClick={() => scrollToMessage(current.id)}
              style={{ flex:1, overflow:"hidden", cursor:"pointer", minWidth:0 }}
            >
              <div style={{ fontSize:9, letterSpacing:"1.8px", textTransform:"uppercase", color:"rgba(232,116,138,.5)", marginBottom:2, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <span>PINNED MESSAGE</span>
                {total >= PIN_LIMIT && <span style={{ color:"rgba(255,180,100,.6)" }}>· LIMIT REACHED</span>}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", fontFamily:"'DM Sans',sans-serif" }}>
                {current.text}
              </div>
              {/* Progress dots — only when multiple */}
              {total > 1 && (
                <div style={{ display:"flex", gap:3, marginTop:4 }}>
                  {pinnedMsgs.map((_, di) => (
                    <div key={di} style={{
                      width: di === Math.min(pinnedIdx, total-1) ? 12 : 4,
                      height:4, borderRadius:2,
                      background: di === Math.min(pinnedIdx, total-1)
                        ? "rgba(232,116,138,.8)"
                        : "rgba(255,255,255,.18)",
                      transition:"width .2s, background .2s",
                    }}/>
                  ))}
                </div>
              )}
            </div>

            {/* Chevron nav — only when multiple pinned */}
            {total > 1 && (
              <div style={{ display:"flex", gap:1, flexShrink:0 }}>
                <div
                  onClick={() => setPinnedIdx(i => (i - 1 + total) % total)}
                  style={{ width:26, height:26, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,.4)", transition:"color .15s" }}
                  onPointerEnter={e => e.currentTarget.style.color="#fff"}
                  onPointerLeave={e => e.currentTarget.style.color="rgba(255,255,255,.4)"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </div>
                <div
                  onClick={() => setPinnedIdx(i => (i + 1) % total)}
                  style={{ width:26, height:26, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,.4)", transition:"color .15s" }}
                  onPointerEnter={e => e.currentTarget.style.color="#fff"}
                  onPointerLeave={e => e.currentTarget.style.color="rgba(255,255,255,.4)"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18"/></svg>
                </div>
              </div>
            )}

            {/* Dismiss */}
            <div
              onClick={() => setShowPinned(false)}
              style={{ width:24, height:24, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,.22)", flexShrink:0, transition:"color .15s" }}
              onPointerEnter={e => e.currentTarget.style.color="rgba(255,255,255,.55)"}
              onPointerLeave={e => e.currentTarget.style.color="rgba(255,255,255,.22)"}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>
        );
      })()}

      {/* ── Message list ── */}
      <div ref={scrollRef} className="msg-scroll" style={{ flex:1, overflowY:"auto", padding:"16px 14px 8px", display:"flex", flexDirection:"column", gap:10, position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 8px" }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }}/>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", letterSpacing:"1px" }}>Today</div>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }}/>
        </div>

        {messages.map((msg, i) => (
          <div key={msg.id} ref={el => { if (el) msgRefs.current[msg.id] = el; }}>
            {i > 0 && messages[i-1].from !== msg.from && <div style={{ height:4 }}/>}
            <Bubble
              msg={msg}
              onReact={addReaction}
              onReply={text => setReplyTo(text)}
              onPin={pinMessage}
              onDelete={deleteMessage}
              isLastSeen={msg.id === lastSeenId}
            />
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

      {/* ── Input bar — single unified pill field ── */}
      <div style={{
        position:"relative", zIndex:10,
        background:"rgba(9,3,14,.95)", backdropFilter:"blur(24px)",
        borderTop:"1px solid rgba(255,255,255,.07)",
        padding:"10px 14px 28px",
      }}>
        {/* Outer pill — this IS the field */}
        <div style={{
          display:"flex", alignItems:"center", gap:0,
          background:"rgba(255,255,255,.07)",
          border:"1px solid rgba(255,255,255,.1)",
          borderRadius:20,
          padding:"6px 6px 6px 4px",
          transition:"border-color .2s",
          minHeight:46,
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor="rgba(232,116,138,.38)"}
          onBlurCapture={e => e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}
        >
          {/* ＋ Attach */}
          <div
            onClick={() => { setShowAttach(true); setShowEmoji(false); }}
            style={{
              width:34, height:34, borderRadius:12, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", color:"rgba(255,255,255,.4)",
              transition:"color .15s",
            }}
          >
            {/* Plus outline */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>

          {/* Textarea — grows to fill */}
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); } }}
            placeholder="say something sweet…"
            rows={1}
            style={{
              flex:1,
              background:"transparent", border:"none", outline:"none",
              color:"#fff", caretColor:"#e8748a",
              fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.5,
              resize:"none", overflowY:"hidden",
              padding:"7px 4px",
              alignSelf:"center",
            }}
            onFocus={() => setShowEmoji(false)}
          />

          {/* Emoji face toggle */}
          <div
            onClick={() => { cycleEmoji(); setShowEmoji(v => !v); }}
            style={{
              width:34, height:34, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", color:"rgba(255,255,255,.4)",
              transition:"color .15s, transform .2s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            {/* Smiley face outline */}
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M8.5 14.5s1 2 3.5 2 3.5-2 3.5-2"/>
              <circle cx="9" cy="10" r=".8" fill="currentColor" stroke="none"/>
              <circle cx="15" cy="10" r=".8" fill="currentColor" stroke="none"/>
            </svg>
          </div>

          {/* Send button or Mic/Camera toggle */}
          {hasText ? (
            <div
              style={{
                width:34, height:34, borderRadius:12, flexShrink:0,
                background:"linear-gradient(135deg,#e8748a,#c45578)",
                boxShadow:"0 3px 14px rgba(232,116,138,.45)",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", color:"#fff",
                transition:"transform .12s", animation:"popIn .18s ease",
              }}
              onPointerDown={e => e.currentTarget.style.transform="scale(.88)"}
              onPointerUp={e => { e.currentTarget.style.transform=""; sendMessage(); }}
            >
              {/* Arrow send */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none"/>
              </svg>
            </div>
          ) : (
            <div
              onPointerDown={() => setHoldRec(true)}
              onPointerUp={() => setHoldRec(false)}
              onPointerLeave={() => setHoldRec(false)}
              onClick={() => setVoiceMode(m => m==="voice"?"video":"voice")}
              style={{
                width:34, height:34, borderRadius:12, flexShrink:0,
                background: holdRec ? "rgba(232,116,138,.22)" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", touchAction:"none",
                color: holdRec ? "#e8748a" : "rgba(255,255,255,.4)",
                transition:"background .12s, color .12s",
              }}
            >
              {voiceMode === "voice" ? (
                /* Microphone outline */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="9" y="2" width="6" height="11" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="9" y1="22" x2="15" y2="22"/>
                </svg>
              ) : (
                /* Video camera outline */
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {showAttach   && <AttachSheet onClose={() => setShowAttach(false)} />}
      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}

      {/* ── Pinned Messages full overlay ── */}
      {showPinnedPage && (
        <div style={{ position:"absolute", inset:0, zIndex:60, display:"flex", flexDirection:"column", background:"#0d0511", animation:"fadeUp .22s ease" }}>
          {/* Header */}
          <div style={{
            background:"rgba(9,3,14,.95)", backdropFilter:"blur(24px)",
            borderBottom:"1px solid rgba(255,255,255,.07)",
            padding:"14px 16px 12px",
            display:"flex", alignItems:"center", gap:12,
          }}>
            <div onClick={() => setShowPinnedPage(false)} style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </div>
            <div style={{ flex:1, fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:300, color:"#fff" }}>
              Pinned <em style={{ fontStyle:"italic", color:"#f5a8b8" }}>Messages</em>
            </div>
            <div style={{ fontSize:11, letterSpacing:"1.5px", color:"rgba(255,255,255,.28)", fontVariant:"small-caps" }}>
              {messages.filter(m=>m.pinned).length} pinned
            </div>
          </div>

          {/* List */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px 14px" }}>
            {messages.filter(m=>m.pinned).length === 0 ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60%", gap:12, opacity:.5 }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22"/>
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
                </svg>
                <span style={{ fontSize:13, color:"rgba(255,255,255,.35)", fontFamily:"'DM Sans',sans-serif" }}>No pinned messages yet</span>
              </div>
            ) : (
              messages.filter(m=>m.pinned).map((msg, i) => {
                const isYou = msg.from === "you";
                return (
                  <div key={msg.id} style={{
                    display:"flex", gap:10, padding:"12px 14px",
                    background:"rgba(255,255,255,.03)", border:"1px solid rgba(201,169,110,.14)",
                    borderRadius:16, marginBottom:10,
                    animation:"msgIn .22s ease",
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width:34, height:34, borderRadius:"50%", flexShrink:0,
                      background: isYou ? "linear-gradient(135deg,#e8748a,#9b3a6e)" : "linear-gradient(135deg,#7eb8f5,#3a6eb4)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:13, fontWeight:600, color:"#fff",
                    }}>{isYou ? "A" : "J"}</div>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <span style={{ fontSize:12, fontWeight:500, color: isYou ? "#f5a8b8" : "#7eb8f5" }}>{isYou ? "You" : "Jordan"}</span>
                        <span style={{ fontSize:10, color:"rgba(255,255,255,.28)" }}>{relativeTime(msg.ts)}</span>
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.82)", lineHeight:1.55, wordBreak:"break-word", fontFamily:"'DM Sans',sans-serif" }}>{msg.text}</div>
                    </div>

                    {/* Unpin */}
                    <div
                      onClick={() => pinMessage(msg.id)}
                      style={{ flexShrink:0, width:28, height:28, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"rgba(201,169,110,.1)", border:"1px solid rgba(201,169,110,.2)", transition:"background .15s" }}
                      title="Unpin"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="17" x2="12" y2="22"/>
                        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
                      </svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
