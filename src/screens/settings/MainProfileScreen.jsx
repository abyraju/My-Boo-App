// screens/MainProfileScreen.jsx
import { useState, useEffect } from "react";
import SCREENS from "../../constants/screens";

// ── Clock ─────────────────────────────────────────────────────────────────────
const COUPLE_START = new Date("2025-07-07T00:00:00");

function useDuration() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  let y  = now.getFullYear() - COUPLE_START.getFullYear();
  let mo = now.getMonth()    - COUPLE_START.getMonth();
  let d  = now.getDate()     - COUPLE_START.getDate();
  if (d  < 0) { mo--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (mo < 0) { y--;  mo += 12; }
  const parts = [];
  if (y  > 0) parts.push(`${y}yr`);
  if (mo > 0) parts.push(`${mo}mo`);
  if (d  > 0 || !parts.length) parts.push(`${d}d`);
  return parts.join(" ");
}

// ── PIN gate (modal) ──────────────────────────────────────────────────────────
const CORRECT_PIN = "1234";
const PIN_LEN = 4;
const KEYS = [
  {v:"1"},{v:"2"},{v:"3"},
  {v:"4"},{v:"5"},{v:"6"},
  {v:"7"},{v:"8"},{v:"9"},
  {v:""},{v:"0"},{v:"⌫",del:true},
];

function PinGate({ onSuccess, onClose, title = "Enter your PIN", subtitle = "Type your PIN to continue" }) {
  const [pin, setPin]   = useState("");
  const [err, setErr]   = useState("");
  const [shake, setShk] = useState(false);

  function pressKey(k) {
    if (k.v === "" && !k.del) return;
    setErr("");
    if (k.del) { setPin(p => p.slice(0,-1)); return; }
    if (pin.length >= PIN_LEN) return;
    const next = pin + k.v;
    setPin(next);
    if (next.length === PIN_LEN) {
      setTimeout(() => {
        if (next === CORRECT_PIN) { onSuccess(); }
        else {
          setShk(true); setErr("Incorrect PIN");
          setTimeout(() => { setShk(false); setPin(""); }, 420);
        }
      }, 100);
    }
  }

  // full-screen overlay
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      background:"rgba(0,0,0,.72)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"flex-end",
    }}>
      <div style={{
        width:"100%",
        background:"linear-gradient(180deg,#1a0828,#0d0511)",
        borderRadius:"28px 28px 0 0",
        borderTop:"1px solid rgba(255,255,255,.1)",
        padding:"20px 28px 44px",
        animation:"slideUp .28s cubic-bezier(.4,0,.2,1)",
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:none}}`}</style>
        {/* pill */}
        <div onClick={onClose} style={{display:"flex",justifyContent:"center",marginBottom:20,cursor:"pointer"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,.18)"}}/>
        </div>
        {/* title */}
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:"#fff",textAlign:"center",marginBottom:6}}>
          {title}
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.38)",textAlign:"center",marginBottom:24,lineHeight:1.55}}>
          {subtitle}
        </div>
        {/* dots */}
        <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:8}}>
          {Array.from({length:PIN_LEN}).map((_,i)=>(
            <div key={i} style={{
              width:13,height:13,borderRadius:"50%",
              border:`1.5px solid ${shake?"#ff6b6b":i<pin.length?"#e8748a":"rgba(255,255,255,.22)"}`,
              background: shake?"#ff6b6b":i<pin.length?"#e8748a":"transparent",
              transition:"background .14s, border-color .14s",
              animation: shake?"gateShake .35s ease":"none",
            }}/>
          ))}
        </div>
        <div style={{fontSize:11,color:"#ff8a8a",textAlign:"center",minHeight:16,marginBottom:20}}>{err}</div>
        {/* keypad */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,maxWidth:280,margin:"0 auto"}}>
          {KEYS.map((k,i)=>(
            <button key={i} onClick={()=>pressKey(k)} style={{
              aspectRatio:"1",borderRadius:"50%",border:"none",
              background: k.v===""&&!k.del?"transparent":"rgba(255,255,255,.07)",
              color:"#fff", fontSize:20, fontWeight:300,
              fontFamily:"'Cormorant Garamond',serif",
              cursor: k.v===""&&!k.del?"default":"pointer",
              pointerEvents: k.v===""&&!k.del?"none":"auto",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"background .14s, transform .1s",
            }}>
              {k.v}
            </button>
          ))}
        </div>
        {/* dev bypass */}
        <button onClick={onSuccess} style={{
          marginTop:18,background:"none",border:"none",
          color:"rgba(255,255,255,.2)",fontSize:11,
          fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
          width:"100%",letterSpacing:".5px",
        }}>
          Skip (dev bypass)
        </button>
      </div>
    </div>
  );
}

// ── Reusable row ──────────────────────────────────────────────────────────────
function Row({ ico, top, val, right, onClick, danger, last }) {
  return (
    <div onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:12,
      padding:"13px 16px",
      borderBottom: last?"none":"1px solid rgba(255,255,255,.05)",
      cursor: onClick?"pointer":"default",
      transition:"background .15s",
    }}>
      <div style={{
        width:32,height:32,borderRadius:10,flexShrink:0,
        background: danger?"rgba(255,60,60,.12)":"rgba(255,255,255,.06)",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
      }}>{ico}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{
          fontSize:10,marginBottom:2,letterSpacing:1,textTransform:"uppercase",
          color: danger?"rgba(255,120,120,.5)":"rgba(255,255,255,.3)",
        }}>{top}</div>
        <div style={{
          fontSize:13,
          color: danger?"#ff8a8a":"rgba(255,255,255,.88)",
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
        }}>{val}</div>
      </div>
      {right}
    </div>
  );
}

function Card({ children, danger }) {
  return (
    <div style={{
      margin:"0 16px 16px",
      background: danger?"rgba(255,40,40,.05)":"rgba(255,255,255,.04)",
      border:`1px solid ${danger?"rgba(255,60,60,.18)":"rgba(255,255,255,.08)"}`,
      borderRadius:18,overflow:"hidden",
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{
      margin:"4px 20px 8px",
      fontSize:10,letterSpacing:"2.5px",textTransform:"uppercase",
      color:"rgba(255,255,255,.22)",
      display:"flex",alignItems:"center",gap:8,
    }}>
      {text}
      <div style={{flex:1,height:1,background:"rgba(255,255,255,.07)"}}/>
    </div>
  );
}

function Arrow() {
  return <span style={{fontSize:14,color:"rgba(255,255,255,.2)",flexShrink:0}}>›</span>;
}

function Toggle({ on, toggle }) {
  return (
    <div onClick={e=>{e.stopPropagation();toggle();}} style={{
      width:42,height:24,borderRadius:12,flexShrink:0,cursor:"pointer",
      background: on?"rgba(94,245,160,.28)":"rgba(255,255,255,.1)",
      border:`1px solid ${on?"rgba(94,245,160,.3)":"rgba(255,255,255,.12)"}`,
      position:"relative",transition:"background .22s,border-color .22s",
    }}>
      <div style={{
        position:"absolute",top:3,left:3,
        width:16,height:16,borderRadius:"50%",
        background: on?"#5ef5a0":"rgba(255,255,255,.5)",
        transform: on?"translateX(18px)":"none",
        transition:"transform .22s cubic-bezier(.4,0,.2,1),background .22s",
      }}/>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function MainProfileScreen({ navigate }) {
  const duration = useDuration();
  const [notifs,       setNotifs]       = useState(true);
  const [pinGate,      setPinGate]      = useState(false);   // Danger Zone gate
  const [booIdGate,    setBooIdGate]    = useState(false);   // Boo ID reveal gate
  const [booIdVisible, setBooIdVisible] = useState(false);   // true after PIN confirmed

  return (
    <>
      {/* Scrollable screen */}
      <div style={{
        position:"absolute",inset:0,
        overflowY:"auto",overflowX:"hidden",
        background:"#130818",
        WebkitOverflowScrolling:"touch",
      }}>
        {/* gradient bg */}
        <div style={{
          minHeight:"100%",
          background:"radial-gradient(ellipse 110% 45% at 50% 0%,#2c0840,#0d0511 58%)",
          display:"flex",flexDirection:"column",
          paddingBottom:48,
        }}>

          {/* ── Header ── */}
          <div style={{padding:"52px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,color:"#fff"}}>
              My <em style={{fontStyle:"italic",color:"#f5a8b8"}}>Profile</em>
            </div>
            <div style={{
              background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
              borderRadius:10,padding:"6px 14px",
              fontSize:12,fontWeight:500,color:"rgba(255,255,255,.5)",
              cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
            }}>Edit</div>
          </div>

          {/* ── Avatar ── */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 20px 20px"}}>
            <div style={{
              width:80,height:80,borderRadius:"50%",
              background:"linear-gradient(135deg,#e8748a,#9b3a6e)",
              border:"3px solid rgba(232,116,138,.35)",
              boxShadow:"0 0 0 6px rgba(232,116,138,.08),0 8px 32px rgba(232,116,138,.3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:30,fontWeight:600,color:"#fff",
              position:"relative",cursor:"pointer",marginBottom:12,
            }}>
              A
              <div style={{
                position:"absolute",bottom:0,right:0,
                width:26,height:26,borderRadius:"50%",
                background:"#e8748a",border:"2.5px solid #0d0511",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,
              }}>📷</div>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:300,color:"#fff",marginBottom:4}}>
              Alex
            </div>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:14,letterSpacing:4,fontWeight:300,marginBottom:0,
              background:"linear-gradient(135deg,rgba(255,255,255,.5),#f5a8b8)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>
              A3K9P2X8Q
            </div>
          </div>

          {/* ── Couple strip ── */}
          <div style={{
            margin:"0 16px 22px",
            background:"linear-gradient(135deg,rgba(107,58,110,.2),rgba(36,8,52,.4))",
            border:"1px solid rgba(232,116,138,.15)",
            borderRadius:18,padding:"14px 16px",
            display:"flex",alignItems:"center",gap:12,cursor:"pointer",
          }}>
            <div style={{display:"flex"}}>
              {[{l:"A",bg:"linear-gradient(135deg,#e8748a,#9b3a6e)",z:2},{l:"J",bg:"linear-gradient(135deg,#7eb8f5,#3a6eb4)",z:1,ml:-10}].map(a=>(
                <div key={a.l} style={{
                  width:38,height:38,borderRadius:"50%",background:a.bg,
                  border:"2px solid #0d0511",zIndex:a.z,marginLeft:a.ml,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:14,fontWeight:600,color:"#fff",
                }}>{a.l}</div>
              ))}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500,color:"#fff",marginBottom:3}}>
                <em style={{fontStyle:"italic",color:"#f5a8b8"}}>{duration}</em>{" "}together
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>Paired with Jordan · since Jul 7, 2025</div>
            </div>
            <div style={{width:28,height:28,borderRadius:9,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"rgba(255,255,255,.3)"}}>›</div>
          </div>

          {/* ── Your Info ── */}
          <SectionLabel text="Your Info"/>
          <Card>
            {[
              {ico:"👤",top:"Full Name",   val:"Alex"},
              {ico:"✉️",top:"Email",       val:"alex@email.com"},
              {ico:"📱",top:"Phone",       val:"+1 555 000 0000"},
              {ico:"🌍",top:"Country",     val:"United States"},
              {ico:"🎂",top:"Birthday",    val:"Jan 15, 2000",last:true},
            ].map(r=>(
              <Row key={r.top} {...r} right={<Arrow/>} onClick={()=>{}}/>
            ))}
          </Card>

          {/* ── Boo ID ── */}
          <SectionLabel text="Boo ID"/>
          <Card>
            {/* Tapping reveals a PIN gate; once confirmed the ID is shown */}
            <div
              className="pr-info-row tappable"
              onClick={() => {
                if (!booIdVisible) setBooIdGate(true);
                else setBooIdVisible(false); // tap again to re-hide
              }}
            >
              <div className="pr-info-ico">🆔</div>
              <div className="pr-info-label">
                <div className="pr-info-lbl-top">Permanent · Cannot be changed</div>
                <div
                  className="pr-info-lbl-val mono"
                  style={{
                    filter: booIdVisible ? "none" : "blur(5px)",
                    userSelect: booIdVisible ? "text" : "none",
                    transition: "filter .22s",
                    letterSpacing: "4px",
                    fontSize: 16,
                  }}
                >
                  A3K9BX
                </div>
              </div>
              <div style={{
                fontSize: 11,
                color: booIdVisible ? "rgba(94,245,160,.5)" : "rgba(255,255,255,.2)",
                flexShrink: 0,
                transition: "color .2s",
              }}>
                {booIdVisible ? "🔓" : "🔒"}
              </div>
            </div>
          </Card>

          {/* ── App Settings ── */}
          <SectionLabel text="App Settings"/>
          <Card>
            <Row ico="🔔" top="Setting" val="Push Notifications"
              right={<Toggle on={notifs} toggle={()=>setNotifs(v=>!v)}/>}
            />
            <Row ico="🎨" top="Setting" val="Theme"    right={<Arrow/>} onClick={()=>{}}/>
            <Row ico="🌐" top="Setting" val="Language" right={<Arrow/>} onClick={()=>{}} last/>
          </Card>

          {/* ── Security ── */}
          <SectionLabel text="Security"/>
          <Card>
            <Row ico="🔑" top="Security" val="Change PIN"  right={<Arrow/>} onClick={()=>{}}/>
            <Row ico="🫆" top="Security" val="Biometrics"  right={<Arrow/>} onClick={()=>{}} last/>
          </Card>

          {/* ── Danger Zone (final item) ── */}
          <SectionLabel text="Danger Zone"/>
          <Card danger>
            <Row
              danger last
              ico="⚠️"
              top="Destructive Actions"
              val="Unpair or Delete Everything"
              right={<span style={{fontSize:14,color:"rgba(255,100,100,.35)",flexShrink:0}}>🔒</span>}
              onClick={()=>setPinGate(true)}
            />
          </Card>

        </div>
      </div>

      {/* Danger Zone PIN gate */}
      {pinGate && (
        <PinGate
          title="Enter your PIN"
          subtitle="PIN required to access Danger Zone"
          onSuccess={()=>{ setPinGate(false); navigate(SCREENS.DANGER_ZONE); }}
          onClose={()=>setPinGate(false)}
        />
      )}

      {/* Boo ID reveal PIN gate */}
      {booIdGate && (
        <PinGate
          title={<>Reveal your <em style={{fontStyle:"italic",color:"#f5a8b8"}}>Boo ID</em></>}
          subtitle="Enter your PIN to reveal your 6-character Boo ID"
          onSuccess={()=>{ setBooIdGate(false); setBooIdVisible(true); }}
          onClose={()=>setBooIdGate(false)}
        />
      )}
    </>
  );
}
