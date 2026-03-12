// screens/login/PairSuccessScreen.jsx
//
// Shown immediately after both Boo IDs are matched and the couple record is created.
// At this point:
//   1. A couples row has been written linking both user IDs.
//   2. A 9-character Couple's Key has been generated and stored in the device Keychain/Keystore.
//   3. Both accounts are marked as paired — further pairing attempts will be blocked.
//
import { useState } from "react";
import { HeartIcon, ShieldIcon } from "../../icons/index.jsx";
import SCREENS from "../../constants/screens.js";
import { BOO_ID, COUPLES_KEY } from "../../constants/data.js";

export default function PairSuccessScreen({ navigate, yourAvatar }) {
  const [keyVisible, setKeyVisible] = useState(false);
  const [keyCopied,  setKeyCopied]  = useState(false);

  const handleKeyCopy = () => {
    navigator.clipboard?.writeText(COUPLES_KEY).catch(() => {});
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 1800);
  };

  return (
    <div className="screen">
      <div className="success-bg">

        {/* Confetti row */}
        <div style={{ display: "flex", gap: 8, fontSize: 22 }}>🎉 ✨ 💕 ✨ 🎉</div>

        {/* Linked avatars */}
        <div className="av-duo">
          <div className="av-you">
            {yourAvatar
              ? <img src={yourAvatar} alt="you" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : "A"
            }
          </div>
          <div className="av-heart">
            <HeartIcon size={26} filled />
          </div>
          <div className="av-them">J</div>
        </div>

        {/* Couple name */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 27, fontWeight: 300, color: "#fff" }}>
            Alex <em style={{ fontStyle: "italic", color: "var(--rose-lt)" }}>&</em> Jordan
          </div>
          <p className="sub" style={{ marginTop: 5 }}>Your couple space has been created 💜</p>
        </div>

        {/* Couple's Key reveal card */}
        <div style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(201,169,110,.1), rgba(50,15,60,.3))",
          border: "1px solid rgba(201,169,110,.25)",
          borderRadius: 18,
          padding: "16px 18px",
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "2px", textTransform: "uppercase",
            color: "var(--gold)", marginBottom: 6,
          }}>
            🔑 Couple's Key generated
          </div>

          {/* Masked / revealed key display */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, letterSpacing: "5px",
            color: keyVisible ? "#fff" : "rgba(255,255,255,.25)",
            filter: keyVisible ? "none" : "blur(6px)",
            transition: "filter .25s, color .25s",
            textAlign: "center",
            margin: "8px 0",
            userSelect: keyVisible ? "text" : "none",
          }}>
            {COUPLES_KEY}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 4 }}>
            <button
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 9, padding: "6px 14px", color: "var(--dim)",
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer",
                transition: "border-color .18s, color .18s",
              }}
              onClick={() => setKeyVisible(v => !v)}
            >
              {keyVisible ? "Hide" : "Reveal key"}
            </button>
            {keyVisible && (
              <button
                style={{
                  background: "transparent", border: "1px solid rgba(201,169,110,.3)",
                  borderRadius: 9, padding: "6px 14px", color: "var(--gold)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer",
                }}
                onClick={handleKeyCopy}
              >
                {keyCopied ? "✓ Copied" : "Copy"}
              </button>
            )}
          </div>

          <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 10, lineHeight: 1.6, textAlign: "center" }}>
            This key encrypts all your shared data (AES-256). It's stored securely on your device and{" "}
            <strong style={{ color: "rgba(255,255,255,.5)" }}>never transmitted</strong>.
            You won't need to remember it.
          </p>
        </div>

        {/* Security summary card */}
        <div className="card" style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <ShieldIcon size={14} style={{ color: "var(--mint)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.6 }}>
              Your couple space is live. Data syncs encrypted through{" "}
              <strong style={{ color: "#fff" }}>your own cloud account</strong> — not our servers.
              Both accounts are now marked <strong style={{ color: "#fff" }}>paired</strong>:
              further pairing attempts will be blocked.
            </p>
          </div>
        </div>

        {/* Next: set up PIN */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn btn-p" onClick={() => navigate(SCREENS.PIN_SETUP)}>
            Continue — Set Up App Lock
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--faint)", lineHeight: 1.5 }}>
            Create a PIN (and optionally enable biometrics) to protect this app on your device
          </p>
        </div>

      </div>
    </div>
  );
}
