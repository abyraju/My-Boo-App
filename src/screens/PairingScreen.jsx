// screens/PairingScreen.jsx
import { useState } from "react";
import { ShieldIcon } from "../icons/index.jsx";
import SCREENS from "../constants/screens";
import { BOO_ID } from "../constants/data";

export default function PairingScreen({ navigate }) {
  const [copied, setCopied] = useState(false);
  const [partnerInput, setPartnerInput] = useState("");

  const handleCopy = () => {
    navigator.clipboard?.writeText(BOO_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="screen">
      <div className="aw" style={{ justifyContent: "flex-start", paddingTop: 50 }}>

        {/* Step indicator */}
        <div className="steps" style={{ marginBottom: 10, alignSelf: "flex-start" }}>
          <div className="sd sd-done" />
          <div className="sd sd-done" />
          <div className="sd sd-on" />
        </div>

        <div className="htitle" style={{ marginBottom: 4, width: "100%" }}>
          Find your <em>boo</em>
        </div>
        <p className="sub" style={{ marginBottom: 18, width: "100%" }}>
          Share your Boo ID or enter theirs. Only matched IDs create a couple space — third parties are blocked.
        </p>

        {/* Your Boo ID */}
        <div className="boo-box" style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: "var(--faint)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 10 }}>
            Your Boo ID
          </div>
          <div className="boo-id">{BOO_ID}</div>
          <button className="boo-copy" onClick={handleCopy}>
            {copied ? "✓ Copied!" : "Copy ID"}
          </button>
          <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 7 }}>
            9-character alphanumeric · generated on sign-up · unique per account
          </div>
        </div>

        {/* Divider */}
        <div className="div" style={{ width: "100%" }}>
          <div className="div-line" />
          <span className="div-txt">enter your partner's Boo ID</span>
          <div className="div-line" />
        </div>

        {/* Partner ID input */}
        <div style={{ display: "flex", gap: 8, width: "100%", marginBottom: 10 }}>
          <input
            className="inp"
            placeholder="e.g. B7X2MN4KQ"
            value={partnerInput}
            onChange={(e) => setPartnerInput(e.target.value.toUpperCase())}
            maxLength={9}
            style={{
              flex: 1, letterSpacing: "3px", textAlign: "center",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 22, padding: "13px 10px",
            }}
          />
          <button
            className="btn btn-p"
            style={{ width: "auto", padding: "0 18px", whiteSpace: "nowrap", fontSize: 14 }}
            onClick={() => navigate(SCREENS.PAIR_SUCCESS)}
          >
            Connect 💕
          </button>
        </div>

        {/* Security note */}
        <div className="sec-badge" style={{ width: "100%", marginBottom: 10 }}>
          <ShieldIcon size={14} style={{ color: "var(--mint)", flexShrink: 0, marginTop: 1 }} />
          <span className="sec-badge-txt">
            Already-paired accounts are blocked at the database rule level. Each account can belong to exactly one couple space.
          </span>
        </div>

        {/* Dev shortcut to blocked state */}
        <button
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,100,100,.4)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: "6px 0" }}
          onClick={() => navigate(SCREENS.PAIR_BLOCKED)}
        >
          Preview: "already paired" blocked state →
        </button>

      </div>
    </div>
  );
}
