// screens/PinSetupScreen.jsx
// Two-step PIN setup: Enter → Confirm → done
import { useState } from "react";
import SCREENS from "../../constants/screens";

const CSS = `
  .pin-screen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: space-between;
    height: 100%; padding: 52px 28px 40px;
    background: radial-gradient(ellipse 90% 55% at 50% 30%, #2b0940, #0d0511 62%);
    overflow-y: auto;
  }

  /* Top section */
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

  /* Dot indicators */
  .pin-dots { display: flex; gap: 14px; align-items: center; margin: 24px 0 0; }
  .pin-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,.25);
    background: transparent;
    transition: background .15s, border-color .15s, transform .15s;
  }
  .pin-dot.filled {
    background: #e8748a; border-color: #e8748a;
    transform: scale(1.1);
  }
  .pin-dot.error {
    background: #ff6b6b; border-color: #ff6b6b;
    animation: pin-shake .35s ease;
  }
  @keyframes pin-shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-5px)}
    40%{transform:translateX(5px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }

  .pin-error-msg {
    font-size: 12px; color: #ff8a8a; min-height: 18px; text-align: center; margin-top: 8px;
  }

  /* Keypad */
  .pin-keypad {
    width: 100%; max-width: 300px;
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .pin-key {
    aspect-ratio: 1;
    border-radius: 50%; border: none;
    background: rgba(255,255,255,.07);
    color: #fff; font-size: 22px; font-weight: 300;
    font-family: 'Cormorant Garamond', serif;
    cursor: pointer; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    transition: background .15s, transform .1s;
    -webkit-tap-highlight-color: transparent;
    position: relative;
  }
  .pin-key:active { background: rgba(232,116,138,.2); transform: scale(.93); }
  .pin-key.empty { background: transparent; cursor: default; }
  .pin-key.empty:active { background: transparent; transform: none; }
  .pin-key-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 7px; letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,.3); margin-top: 1px; line-height: 1;
  }
  .pin-key-del { font-size: 18px; }

  /* Step indicator */
  .pin-steps { display: flex; gap: 6px; align-items: center; }
  .pin-step-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,.15); transition: background .2s, width .2s;
  }
  .pin-step-dot.active { background: #e8748a; width: 22px; border-radius: 4px; }
  .pin-step-dot.done   { background: rgba(232,116,138,.45); }
`;

const KEYS = [
  { label: "1", sub: "" },
  { label: "2", sub: "ABC" },
  { label: "3", sub: "DEF" },
  { label: "4", sub: "GHI" },
  { label: "5", sub: "JKL" },
  { label: "6", sub: "MNO" },
  { label: "7", sub: "PQRS" },
  { label: "8", sub: "TUV" },
  { label: "9", sub: "WXYZ" },
  { label: "", sub: "", empty: true },
  { label: "0", sub: "" },
  { label: "⌫", sub: "", del: true },
];

const PIN_LENGTH = 4;

export default function PinSetupScreen({ navigate }) {
  const [step,      setStep]      = useState(1); // 1 = enter, 2 = confirm
  const [firstPin,  setFirstPin]  = useState("");
  const [pin,       setPin]       = useState("");
  const [error,     setError]     = useState("");
  const [shaking,   setShaking]   = useState(false);

  const handleKey = (key) => {
    if (key.empty) return;
    setError("");

    if (key.del) {
      setPin(p => p.slice(0, -1));
      return;
    }

    if (pin.length >= PIN_LENGTH) return;
    const next = pin + key.label;
    setPin(next);

    if (next.length === PIN_LENGTH) {
      setTimeout(() => handleComplete(next), 120);
    }
  };

  const handleComplete = (entered) => {
    if (step === 1) {
      setFirstPin(entered);
      setPin("");
      setStep(2);
    } else {
      if (entered === firstPin) {
        // PIN confirmed — go to home
        navigate(SCREENS.HOME);
      } else {
        setShaking(true);
        setError("PINs don't match — try again");
        setTimeout(() => {
          setShaking(false);
          setPin("");
        }, 400);
      }
    }
  };

  const dotState = (i) => {
    if (shaking) return "error";
    if (i < pin.length) return "filled";
    return "";
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="screen"><div className="pin-screen screen-enter">

        {/* Top */}
        <div className="pin-top">
          <div className="pin-steps">
            <div className={`pin-step-dot ${step === 1 ? "active" : "done"}`} />
            <div className={`pin-step-dot ${step === 2 ? "active" : step > 2 ? "done" : ""}`} />
          </div>

          <div className="pin-lock-icon">🔐</div>

          <div className="pin-title">
            {step === 1
              ? <>Create your <em>PIN</em></>
              : <>Confirm your <em>PIN</em></>
            }
          </div>
          <div className="pin-sub">
            {step === 1
              ? "Choose a 4-digit PIN to protect your app. You'll use this every time you open My Boo."
              : "Enter the same PIN again to confirm."
            }
          </div>

          {/* Dot row */}
          <div className="pin-dots">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
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
              className={`pin-key${key.empty ? " empty" : ""}${key.del ? " pin-key-del" : ""}`}
              onClick={() => handleKey(key)}
              disabled={key.empty}
            >
              {key.label}
              {key.sub && <span className="pin-key-sub">{key.sub}</span>}
            </button>
          ))}
        </div>

      </div>
    </div>
    </>
  );
}
