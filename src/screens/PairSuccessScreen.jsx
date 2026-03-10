// screens/PairSuccessScreen.jsx
import { HeartIcon, ShieldIcon } from "../icons/index.jsx";
import SCREENS from "../constants/screens";
import { BOO_ID } from "../constants/data";

export default function PairSuccessScreen({ navigate, yourAvatar }) {
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

        {/* couples table record badge */}
        <div className="cpl-badge">
          <div style={{ fontSize: 10, color: "var(--faint)", letterSpacing: "2px", textTransform: "uppercase" }}>
            couples table record
          </div>
          <div style={{
            fontSize: 13, color: "var(--dim)",
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "3px", marginTop: 2,
          }}>
            CPL · {BOO_ID.slice(0, 4)} · B7X2
          </div>
        </div>

        {/* Security info card */}
        <div className="card" style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <ShieldIcon size={14} style={{ color: "var(--mint)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.6 }}>
              A <strong style={{ color: "#fff" }}>couples</strong> record has been written linking both user IDs.
              Both accounts are now marked <strong style={{ color: "#fff" }}>paired</strong> —
              further pairing attempts on either account will be blocked.
            </p>
          </div>
        </div>

        {/* Next: set up app PIN */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn btn-p" onClick={() => navigate(SCREENS.PIN_SETUP)}>
            Continue — Set Up App PIN
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--faint)", lineHeight: 1.5 }}>
            You'll create a PIN to protect your app on this device
          </p>
        </div>

      </div>
    </div>
  );
}
