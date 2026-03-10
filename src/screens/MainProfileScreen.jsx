// screens/MainProfileScreen.jsx
import { useState, useEffect } from "react";
import SCREENS from "../constants/screens";

const COUPLE_START = new Date("2025-07-07T00:00:00");

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function calcDuration(now) {
  let y  = now.getFullYear() - COUPLE_START.getFullYear();
  let mo = now.getMonth()    - COUPLE_START.getMonth();
  let d  = now.getDate()     - COUPLE_START.getDate();
  if (d  < 0) { mo--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
  if (mo < 0) { y--;  mo += 12; }
  return { y, mo, d };
}

const CSS = `
  .profile-bg {
    min-height: 100%;
    background: radial-gradient(ellipse 110% 48% at 50% -5%, #2c0840, #0d0511 55%);
    display: flex; flex-direction: column;
    padding-bottom: 24px;
  }

  /* Header */
  .pr-header {
    padding: 16px 20px 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pr-header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #fff;
  }
  .pr-header-title em { font-style: italic; color: #f5a8b8; }
  .pr-edit-btn {
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 6px 14px;
    font-size: 12px; font-weight: 500; color: rgba(255,255,255,.5);
    cursor: pointer; transition: all .18s; font-family: 'DM Sans', sans-serif;
  }
  .pr-edit-btn:active { background: rgba(232,116,138,.12); color: #f5a8b8; border-color: rgba(232,116,138,.3); }

  /* Avatar section */
  .pr-avatar-section {
    display: flex; flex-direction: column; align-items: center;
    padding: 20px 20px 0;
  }
  .pr-av-ring {
    width: 76px; height: 76px; border-radius: 50%;
    background: linear-gradient(135deg, #e8748a, #9b3a6e);
    border: 3px solid rgba(232,116,138,.3);
    box-shadow: 0 0 0 5px rgba(232,116,138,.08), 0 8px 32px rgba(232,116,138,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 600; color: #fff;
    margin-bottom: 12px; cursor: pointer; position: relative;
    transition: box-shadow .2s;
  }
  .pr-av-ring:active { box-shadow: 0 0 0 7px rgba(232,116,138,.16), 0 8px 32px rgba(232,116,138,.3); }
  .pr-av-cam {
    position: absolute; bottom: 0; right: 0;
    width: 24px; height: 24px; border-radius: 50%;
    background: #e8748a; border: 2px solid #0d0511;
    display: flex; align-items: center; justify-content: center; font-size: 11px;
  }
  .pr-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #fff; margin-bottom: 2px;
  }
  .pr-boo-id {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; letter-spacing: 4px; font-weight: 300;
    background: linear-gradient(135deg, rgba(255,255,255,.5), #f5a8b8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }

  /* Couple strip */
  .pr-couple-strip {
    margin: 0 16px 16px;
    background: linear-gradient(135deg, rgba(107,58,110,.2), rgba(36,8,52,.4));
    border: 1px solid rgba(232,116,138,.14);
    border-radius: 18px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: border-color .18s;
  }
  .pr-couple-strip:active { border-color: rgba(232,116,138,.28); }
  .pr-cs-avatars { display: flex; align-items: center; }
  .pr-cs-av {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid #0d0511;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: #fff; flex-shrink: 0;
  }
  .pr-cs-av-you  { background: linear-gradient(135deg, #e8748a, #9b3a6e); z-index: 2; }
  .pr-cs-av-them { background: linear-gradient(135deg, #7eb8f5, #3a6eb4); margin-left: -8px; z-index: 1; }
  .pr-cs-info { flex: 1; }
  .pr-cs-together { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; }
  .pr-cs-together em { font-style: italic; color: #f5a8b8; }
  .pr-cs-sub { font-size: 11px; color: rgba(255,255,255,.3); }
  .pr-cs-arrow {
    width: 28px; height: 28px; border-radius: 9px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: rgba(255,255,255,.3);
  }

  /* Section label */
  .pr-section-lbl {
    margin: 0 20px 8px;
    font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,.18);
    display: flex; align-items: center; gap: 8px;
  }
  .pr-section-lbl::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.055); }

  /* Info card */
  .pr-info-card {
    margin: 0 16px 16px;
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
    border-radius: 18px; overflow: hidden;
  }
  .pr-info-row {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; transition: background .15s;
  }
  .pr-info-row + .pr-info-row { border-top: 1px solid rgba(255,255,255,.05); }
  .pr-info-row.tappable { cursor: pointer; }
  .pr-info-row.tappable:active { background: rgba(255,255,255,.03); }
  .pr-info-ico {
    width: 32px; height: 32px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
    background: rgba(255,255,255,.05); flex-shrink: 0;
  }
  .pr-info-label { flex: 1; }
  .pr-info-lbl-top { font-size: 10px; color: rgba(255,255,255,.28); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; }
  .pr-info-lbl-val { font-size: 13px; color: rgba(255,255,255,.75); }
  .pr-info-lbl-val.mono { font-family: 'Cormorant Garamond', serif; letter-spacing: 3px; font-size: 14px; }
  .pr-info-toggle {
    width: 42px; height: 24px; border-radius: 12px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.1);
    position: relative; cursor: pointer; flex-shrink: 0;
    transition: background .22s;
  }
  .pr-info-toggle.on { background: rgba(94,245,160,.28); border-color: rgba(94,245,160,.3); }
  .pr-info-toggle-knob {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: rgba(255,255,255,.5);
    transition: transform .22s cubic-bezier(.4,0,.2,1), background .22s;
  }
  .pr-info-toggle.on .pr-info-toggle-knob { transform: translateX(18px); background: #5ef5a0; }
  .pr-info-arrow { font-size: 13px; color: rgba(255,255,255,.2); }

  /* Danger Zone entry */
  .pr-danger-entry {
    margin: 8px 16px 0;
    background: rgba(255,60,60,.06); border: 1px solid rgba(255,60,60,.14);
    border-radius: 14px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: all .18s;
  }
  .pr-danger-entry:active { background: rgba(255,60,60,.1); }
  .pr-danger-ico { font-size: 20px; flex-shrink: 0; }
  .pr-danger-label { flex: 1; }
  .pr-danger-title { font-size: 13px; font-weight: 500; color: #ff8a8a; }
  .pr-danger-sub { font-size: 11px; color: rgba(255,120,120,.4); margin-top: 1px; }
  .pr-danger-lock { font-size: 13px; color: rgba(255,100,100,.3); }

  /* PIN gate modal */
  .pin-gate-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(0,0,0,.72); backdrop-filter: blur(8px);
    display: flex; align-items: flex-end;
  }
  .pin-gate-sheet {
    width: 100%;
    background: linear-gradient(180deg, #1a0828, #0d0511);
    border-radius: 28px 28px 0 0;
    border-top: 1px solid rgba(255,255,255,.1);
    padding: 20px 28px 44px;
    animation: slideUp .28s cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: none; } }
  .pin-gate-pill {
    width: 36px; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,.16); margin: 0 auto 20px;
    cursor: pointer;
  }
  .pin-gate-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 300; color: #fff;
    text-align: center; margin-bottom: 6px;
  }
  .pin-gate-sub {
    font-size: 12px; color: rgba(255,255,255,.38);
    text-align: center; margin-bottom: 24px; line-height: 1.55;
  }
  .pin-gate-dots { display: flex; gap: 14px; justify-content: center; margin-bottom: 8px; }
  .pin-gate-dot {
    width: 13px; height: 13px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,.22);
    transition: background .14s, border-color .14s;
  }
  .pin-gate-dot.filled { background: #e8748a; border-color: #e8748a; }
  .pin-gate-dot.error  { background: #ff6b6b; border-color: #ff6b6b; animation: gateShake .35s ease; }
  @keyframes gateShake {
    0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)}
    40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
  }
  .pin-gate-error { font-size: 11px; color: #ff8a8a; text-align: center; min-height: 16px; margin-bottom: 20px; }
  .pin-gate-keypad {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    max-width: 280px; margin: 0 auto;
  }
  .pin-gate-key {
    aspect-ratio: 1; border-radius: 50%; border: none;
    background: rgba(255,255,255,.07); color: #fff;
    font-size: 20px; font-weight: 300;
    font-family: 'Cormorant Garamond', serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background .14s, transform .1s;
    -webkit-tap-highlight-color: transparent;
  }
  .pin-gate-key:active { background: rgba(232,116,138,.2); transform: scale(.92); }
  .pin-gate-key.empty { background: transparent; cursor: default; pointer-events: none; }
`;

const GATE_CORRECT = "1234"; // TODO: read from secure storage
const GATE_KEYS = [
  { l:"1" },{ l:"2" },{ l:"3" },
  { l:"4" },{ l:"5" },{ l:"6" },
  { l:"7" },{ l:"8" },{ l:"9" },
  { empty:true },{ l:"0" },{ del:true, l:"⌫" },
];

function PinGate({ onSuccess, onClose }) {
  const [pin,     setPin]     = useState("");
  const [error,   setError]   = useState("");
  const [shaking, setShaking] = useState(false);
  const PIN_LEN = 4;

  const handleKey = (key) => {
    if (key.empty) return;
    setError("");
    if (key.del) { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= PIN_LEN) return;
    const next = pin + key.l;
    setPin(next);
    if (next.length === PIN_LEN) {
      setTimeout(() => {
        if (next === GATE_CORRECT) { onSuccess(); }
        else {
          setShaking(true);
          setError("Incorrect PIN");
          setTimeout(() => { setShaking(false); setPin(""); }, 400);
        }
      }, 100);
    }
  };

  const dotState = (i) => {
    if (shaking) return "error";
    if (i < pin.length) return "filled";
    return "";
  };

  return (
    <div className="pin-gate-overlay">
      <div className="pin-gate-sheet">
        <div className="pin-gate-pill" onClick={onClose} />
        <div className="pin-gate-title">Enter your PIN</div>
        <div className="pin-gate-sub">
          Biometrics not accepted here — type your PIN to access the Danger Zone.
        </div>
        <div className="pin-gate-dots">
          {Array.from({ length: PIN_LEN }).map((_, i) => (
            <div key={i} className={`pin-gate-dot ${dotState(i)}`} />
          ))}
        </div>
        <div className="pin-gate-error">{error}</div>
        <div className="pin-gate-keypad">
          {GATE_KEYS.map((k, i) => (
            <button key={i} className={`pin-gate-key${k.empty ? " empty" : ""}`} onClick={() => handleKey(k)}>
              {k.l}
            </button>
          ))}
        </div>
        <button
          onClick={onSuccess}
          style={{
            marginTop: 16, width: "100%", background: "transparent",
            border: "1px solid rgba(255,255,255,.1)", borderRadius: 12,
            padding: "11px", color: "rgba(255,255,255,.3)",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            cursor: "pointer", letterSpacing: ".3px",
            transition: "border-color .15s, color .15s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,.22)"; e.target.style.color = "rgba(255,255,255,.5)"; }}
          onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.color = "rgba(255,255,255,.3)"; }}
        >
          Skip for now (dev only)
        </button>
      </div>
    </div>
  );
}

export default function MainProfileScreen({ navigate }) {
  const now          = useClock();
  const { y, mo, d } = calcDuration(now);
  const [notifs,  setNotifs]  = useState(true);
  const [pinGate, setPinGate] = useState(false);

  const durationParts = [];
  if (y  > 0) durationParts.push(`${y}yr`);
  if (mo > 0) durationParts.push(`${mo}mo`);
  if (d  > 0 || durationParts.length === 0) durationParts.push(`${d}d`);
  const durationLabel = durationParts.join(" ");

  const INFO_ROWS = [
    { ico:"👤", top:"Full Name",  val:"Alex" },
    { ico:"✉️", top:"Email",      val:"alex@email.com" },
    { ico:"📱", top:"Phone",      val:"+1 555 000 0000" },
    { ico:"🌍", top:"Country",    val:"United States" },
    { ico:"🎂", top:"Birthday",   val:"Jan 15, 2000" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="profile-bg screen-enter">

        {/* Header */}
        <div className="pr-header">
          <div className="pr-header-title">My <em>Profile</em></div>
          <div className="pr-edit-btn">Edit</div>
        </div>

        {/* Avatar + name + Boo ID */}
        <div className="pr-avatar-section">
          <div className="pr-av-ring">
            A
            <div className="pr-av-cam">📷</div>
          </div>
          <div className="pr-name">Alex</div>
          <div className="pr-boo-id">A3K9P2X8Q</div>
        </div>

        {/* Couple strip → links to milestones */}
        <div className="pr-couple-strip">
          <div className="pr-cs-avatars">
            <div className="pr-cs-av pr-cs-av-you">A</div>
            <div className="pr-cs-av pr-cs-av-them">J</div>
          </div>
          <div className="pr-cs-info">
            <div className="pr-cs-together"><em>{durationLabel}</em> together</div>
            <div className="pr-cs-sub">Paired with Jordan · since Jul 7, 2025</div>
          </div>
          <div className="pr-cs-arrow">›</div>
        </div>

        {/* Personal info */}
        <div className="pr-section-lbl">Your Info</div>
        <div className="pr-info-card">
          {INFO_ROWS.map(({ ico, top, val }) => (
            <div key={top} className="pr-info-row tappable">
              <div className="pr-info-ico">{ico}</div>
              <div className="pr-info-label">
                <div className="pr-info-lbl-top">{top}</div>
                <div className="pr-info-lbl-val">{val}</div>
              </div>
              <div className="pr-info-arrow">›</div>
            </div>
          ))}
        </div>

        {/* Boo ID */}
        <div className="pr-section-lbl">Boo ID</div>
        <div className="pr-info-card">
          <div className="pr-info-row">
            <div className="pr-info-ico">🆔</div>
            <div className="pr-info-label">
              <div className="pr-info-lbl-top">Permanent · Cannot be changed</div>
              <div className="pr-info-lbl-val mono">A3K9P2X8Q</div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="pr-section-lbl">App Settings</div>
        <div className="pr-info-card">
          <div className="pr-info-row tappable">
            <div className="pr-info-ico">🔔</div>
            <div className="pr-info-label">
              <div className="pr-info-lbl-top">Setting</div>
              <div className="pr-info-lbl-val">Push Notifications</div>
            </div>
            <div className={`pr-info-toggle${notifs ? " on" : ""}`} onClick={() => setNotifs(v => !v)}>
              <div className="pr-info-toggle-knob" />
            </div>
          </div>
          {[
            { ico:"🎨", top:"Setting", val:"Theme" },
            { ico:"🌐", top:"Setting", val:"Language" },
          ].map(({ ico, top, val }) => (
            <div key={val} className="pr-info-row tappable">
              <div className="pr-info-ico">{ico}</div>
              <div className="pr-info-label">
                <div className="pr-info-lbl-top">{top}</div>
                <div className="pr-info-lbl-val">{val}</div>
              </div>
              <div className="pr-info-arrow">›</div>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="pr-section-lbl">Security</div>
        <div className="pr-info-card">
          {[
            { ico:"🔑", top:"Security",  val:"Change PIN" },
            { ico:"🫆", top:"Security", val:"Biometrics" },
          ].map(({ ico, top, val }) => (
            <div key={val} className="pr-info-row tappable">
              <div className="pr-info-ico">{ico}</div>
              <div className="pr-info-label">
                <div className="pr-info-lbl-top">{top}</div>
                <div className="pr-info-lbl-val">{val}</div>
              </div>
              <div className="pr-info-arrow">›</div>
            </div>
          ))}
        </div>

        {/* Danger Zone entry */}
        <div className="pr-danger-entry" onClick={() => setPinGate(true)}>
          <div className="pr-danger-ico">⚠️</div>
          <div className="pr-danger-label">
            <div className="pr-danger-title">Danger Zone</div>
            <div className="pr-danger-sub">Unpair or delete everything · PIN required</div>
          </div>
          <div className="pr-danger-lock">🔒</div>
        </div>

      </div>

      {/* PIN gate before entering Danger Zone */}
      {pinGate && (
        <PinGate
          onSuccess={() => { setPinGate(false); navigate(SCREENS.DANGER_ZONE); }}
          onClose={() => setPinGate(false)}
        />
      )}
    </>
  );
}
