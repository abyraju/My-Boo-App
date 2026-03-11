// screens/PairBlockedScreen.jsx
import { AlertIcon, ShieldIcon } from "../../icons/index.jsx";
import SCREENS from "../../constants/screens";

export default function PairBlockedScreen({ navigate }) {
  return (
    <div className="screen">
      <div className="blocked-bg">

        <div className="blocked-ico">
          <AlertIcon size={32} />
        </div>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 27, fontWeight: 300, color: "#fff", textAlign: "center",
        }}>
          Account already paired
        </div>

        <div className="pill pill-red">
          <AlertIcon size={11} /> Pairing blocked
        </div>

        <p className="sub" style={{ textAlign: "center" }}>
          The Boo ID you entered belongs to an account that's already in a couple space.
          Each account can only ever be connected to one partner.
        </p>

        {/* DB enforcement note */}
        <div className="card" style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <ShieldIcon size={14} style={{ color: "#ff8a8a", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.6 }}>
              This check is enforced at the{" "}
              <strong style={{ color: "#fff" }}>database rule level</strong>.
              Write access to an already-paired account's couple record is denied
              for all external requests — not just in the UI.
            </p>
          </div>
        </div>

        <button className="btn btn-out" style={{ width: "100%" }} onClick={() => navigate(SCREENS.PAIRING)}>
          ← Try a different Boo ID
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(SCREENS.METHOD)}>
          Back to sign in
        </button>

      </div>
    </div>
  );
}
