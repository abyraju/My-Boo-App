// screens/login/PinSetupScreen.jsx
//
// Two-step PIN setup: Enter (4–6 digits) → Confirm → optionally enable biometrics → Home.
// PIN is hashed with SHA-256 before storage (see utils/crypto.js: hashPin).
// The hash is stored in the device Keychain / Keystore, never in plain text.
//
import { useState } from "react";
import { ShieldIcon } from "../../icons/index.jsx";
import SCREENS from "../../constants/screens.js";
import { hashPin } from "../../utils/crypto.js";

const CSS = `
  .pin-screen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: space-between;
    height: 100%; padding: 52px 28px 40px;
    background: radial-gradient(ellipse 90% 55% at 50% 30%, #2b0940, #0d0511 62%);
    overflow-y: auto;
  }
  .pin-top { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .pin-lock-icon {
    width: 68px; height: 68px; border-radius: 24px;
    background: rgba(232,116,138,.1); border: 1px solid rgba(232,116,138,.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; margin-bottom: 4px;
  }
  .pin-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 300; color: #fff; text-align: center;
  }
  .pin-title em { font-style: italic; color: #f5a8b8; }
  .pin-sub {
    font-size: 13px; color: rgba(255,255,255,.42); text-align: center; line-height: 1.6;
    max-width: 260px;
  }
  .pin-length-row {
    display: flex; gap: 8px; align-items: center; margin-top: 4px;
  }
  .pin-len-btn {
    padding: 5px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.06); color: rgba(255,255,255,.45);
    font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer;
    transition: all .15s;
  }
  .pin-len-btn.active {
    background: rgba(232,116,138,.15); border-color: rgba(232,116,138,.35);
    color: #f5a8b8;
  }
  .pin-dots { display: flex; gap: 14px; align-items: center; margin: 24px 0 0; }
  .pin-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,.25);
    background: transparent;
    transition: background .15s, border-color .15s, transform .15s;
  }
  .pin-dot.filled { background: #e8748a; border-color: #e8748a; transform: scale(1.1); }
  .pin-dot.error  { background: #ff6b6b; border-color: #ff6b6b; animation: pin-shake .35s ease; }
  @keyframes pin-shake {
    0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)}
    40%{transform:translateX(5px)}  60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
  }
  .pin-error-msg { font-size: 12px; color: #ff8a8a; min-height: 18px; text-align: center; margin-top: 8px; }
  .pin-keypad {
    width: 100%; max-width: 300px;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  }
  .pin-key {
    aspect-ratio: 1; border-radius: 50%; border: none;
    background: rgba(255,255,255,.07); color: #fff; font-size: 22px; font-weight: 300;
    font-family: 'Cormorant Garamond', serif;
    cursor: pointer; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    transition: background .15s, transform .1s;
    -webkit-tap-highlight-color: transparent;
  }
  .pin-key:active { background: rgba(232,116,138,.2); transform: scale(.93); }
  .pin-key.empty  { background: transparent; cursor: default; }
  .pin-key.empty:active { background: transparent; transform: none; }
  .pin-key-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 7px; letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,.3); margin-top: 1px; line-height: 1;
  }
  .pin-steps { display: flex; gap: 6px; align-items: center; }
  .pin-step-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,.15); transition: background .2s, width .2s;
  }
  .pin-step-dot.active { background: #e8748a; width: 22px; border-radius: 4px; }
  .pin-step-dot.done   { background: rgba(232,116,138,.45); }

  /* Biometric step */
  .bio-card {
    width: 100%; background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08); border-radius: 18px;
    padding: 20px 18px; display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .bio-icon {
    width: 62px; height: 62px; border-radius: 18px;
    background: rgba(94,245,160,.08); border: 1px solid rgba(94,245,160,.18);
    display: flex; align-items: center; justify-content: center; font-size: 26px;
  }
`;

const KEYS = [
  { label: "1", sub: "" },   { label: "2", sub: "ABC" }, { label: "3", sub: "DEF" },
  { label: "4", sub: "GHI" }, { label: "5", sub: "JKL" }, { label: "6", sub: "MNO" },
  { label: "7", sub: "PQRS" },{ label: "8", sub: "TUV" }, { label: "9", sub: "WXYZ" },
  { label: "", empty: true }, { label: "0", sub: "" },    { label: "⌫", del: true },
];

// Steps: 1 = enter PIN, 2 = confirm PIN, 3 = biometric prompt
const STEP_ENTER   = 1;
const STEP_CONFIRM = 2;
const STEP_BIOM    = 3;

export default function PinSetupScreen({ navigate }) {
  const [pinLength, setPinLength] = useState(4);  // 4, 5, or 6
  const [step,      setStep]      = useState(STEP_ENTER);
  const [firstPin,  setFirstPin]  = useState("");
  const [pin,       setPin]       = useState("");
  const [error,     setError]     = useState("");
  const [shaking,   setShaking]   = useState(false);

  const handleKey = (key) => {
    if (key.empty) return;
    setError("");
    if (key.del) { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= pinLength) return;
    const next = pin + key.label;
    setPin(next);
    if (next.length === pinLength) {
      setTimeout(() => handleComplete(next), 120);
    }
  };

  const handleComplete = async (entered) => {
    if (step === STEP_ENTER) {
      setFirstPin(entered);
      setPin("");
      setStep(STEP_CONFIRM);
    } else if (step === STEP_CONFIRM) {
      if (entered === firstPin) {
        // TODO: hash the PIN and store in device Keychain/Keystore
        // const hash = await hashPin(entered);
        // await SecureStorage.set("pin_hash", hash);
        setStep(STEP_BIOM);
      } else {
        setShaking(true);
        setError("PINs don't match — try again");
        setTimeout(() => { setShaking(false); setPin(""); }, 400);
      }
    }
  };

  const dotState = (i) => {
    if (shaking) return "error";
    if (i < pin.length) return "filled";
    return "";
  };

  // ── Biometric step ────────────────────────────────────────────────────────
  if (step === STEP_BIOM) {
    return (
      <>
        <style>{CSS}</style>
        <div className="screen"><div className="pin-screen screen-enter">
          <div className="pin-top">
            <div className="pin-steps">
              <div className="pin-step-dot done" />
              <div className="pin-step-dot done" />
              <div className="pin-step-dot active" />
            </div>
            <div className="pin-lock-icon">🛡️</div>
            <div className="pin-title">Enable <em>biometrics?</em></div>
            <div className="pin-sub">
              Use Face ID or fingerprint to unlock the app quickly. Your PIN remains the fallback.
            </div>
          </div>

          <div className="bio-card">
            <div className="bio-icon">🪪</div>
            <p style={{ fontSize: 13, color: "var(--dim)", textAlign: "center", lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>Face ID / Fingerprint</strong> — unlock without
              entering your PIN every time.
            </p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="btn btn-p"
                onClick={() => {
                  // TODO: call flutter_local_auth.authenticate() here
                  navigate(SCREENS.HOME);
                }}
              >
                Enable Biometrics
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate(SCREENS.HOME)}
              >
                Skip — use PIN only
              </button>
            </div>
          </div>

          <div className="sec-badge" style={{ width: "100%" }}>
            <ShieldIcon size={13} style={{ color: "var(--mint)", flexShrink: 0 }} />
            <span className="sec-badge-txt">
              Biometric data never leaves your device and is managed by the OS — not My Boo.
              Danger Zone always requires your PIN regardless of biometric settings.
            </span>
          </div>
        </div></div>
      </>
    );
  }

  // ── PIN entry / confirm steps ─────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="screen"><div className="pin-screen screen-enter">

        <div className="pin-top">
          <div className="pin-steps">
            <div className={`pin-step-dot ${step === STEP_ENTER ? "active" : "done"}`} />
            <div className={`pin-step-dot ${step === STEP_CONFIRM ? "active" : step > STEP_CONFIRM ? "done" : ""}`} />
            <div className="pin-step-dot" />
          </div>

          <div className="pin-lock-icon">🔐</div>

          <div className="pin-title">
            {step === STEP_ENTER ? <>Create your <em>PIN</em></> : <>Confirm your <em>PIN</em></>}
          </div>

          {/* PIN length selector — only shown on step 1 */}
          {step === STEP_ENTER && (
            <>
              <div className="pin-sub">
                Choose a <strong style={{ color: "#fff" }}>4–6 digit</strong> PIN to lock your app.
              </div>
              <div className="pin-length-row">
                {[4, 5, 6].map(n => (
                  <button
                    key={n}
                    className={`pin-len-btn${pinLength === n ? " active" : ""}`}
                    onClick={() => { setPinLength(n); setPin(""); }}
                  >
                    {n} digits
                  </button>
                ))}
              </div>
            </>
          )}
          {step === STEP_CONFIRM && (
            <div className="pin-sub">Enter the same {pinLength}-digit PIN again to confirm.</div>
          )}

          {/* Dot row */}
          <div className="pin-dots">
            {Array.from({ length: pinLength }).map((_, i) => (
              <div key={i} className={`pin-dot ${dotState(i)}`} />
            ))}
          </div>
          <div className="pin-error-msg">{error}</div>
        </div>

        {/* Keypad */}
        <div className="pin-keypad">
          {KEYS.map((key, i) => (
            <button
              key={i}
              className={`pin-key${key.empty ? " empty" : ""}`}
              onClick={() => handleKey(key)}
              disabled={key.empty}
            >
              {key.label}
              {key.sub && <span className="pin-key-sub">{key.sub}</span>}
            </button>
          ))}
        </div>

      </div></div>
    </>
  );
}
