// screens/UnpairScreen.jsx
import { useState } from "react";
import { UnlinkIcon, AlertIcon, ShieldIcon } from "../icons/index.jsx";
import SCREENS from "../constants/screens";

export default function UnpairScreen({ navigate }) {
  const [step, setStep] = useState(0); // 0 = prompt, 1 = confirm

  return (
    <div className="screen">
      <div className="unpair-bg">

        <div className="un-ico">
          <UnlinkIcon size={30} />
        </div>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26, fontWeight: 300, color: "#fff", textAlign: "center",
        }}>
          {step === 0 ? "Unpair from Jordan?" : "Last chance"}
        </div>

        {/* Step 0 — initial prompt */}
        {step === 0 && (
          <>
            <div className="card" style={{ width: "100%" }}>
              <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.7 }}>
                Either partner can unpair at any time. This removes both users from the couple space
                and deletes the shared <strong style={{ color: "#fff" }}>couples</strong> record.
              </p>
              <div className="warn" style={{ marginTop: 13 }}>
                <AlertIcon size={14} style={{ color: "#ff8a8a", flexShrink: 0, marginTop: 1 }} />
                <span className="warn-txt">
                  Chat history, gallery photos and game data linked to this couple space will be cleared.
                  This cannot be undone.
                </span>
              </div>
            </div>

            <button className="btn btn-danger" onClick={() => setStep(1)}>
              Continue →
            </button>
            <button className="btn btn-ghost" onClick={() => navigate(SCREENS.METHOD)}>
              Cancel — keep us together 💕
            </button>
          </>
        )}

        {/* Step 1 — final confirm */}
        {step === 1 && (
          <>
            <p className="sub" style={{ textAlign: "center" }}>
              Both accounts will be marked as{" "}
              <strong style={{ color: "#fff" }}>unpaired</strong> in the database
              and freed to start a new couple space.
            </p>

            <div className="sec-badge" style={{ width: "100%" }}>
              <ShieldIcon size={14} style={{ color: "var(--mint)", flexShrink: 0 }} />
              <span className="sec-badge-txt">
                The couples record will be deleted. Both user records will have their{" "}
                <code style={{ background: "rgba(255,255,255,.1)", padding: "0 4px", borderRadius: 3 }}>
                  partner_id
                </code>{" "}
                field cleared.
              </span>
            </div>

            <div style={{ display: "flex", gap: 9, width: "100%" }}>
              <button
                className="btn btn-out"
                style={{ flex: 1 }}
                onClick={() => { setStep(0); navigate(SCREENS.METHOD); }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={() => { setStep(0); navigate(SCREENS.METHOD); }}
              >
                Unpair
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
