// screens/login/CloudProviderScreen.jsx
//
// Shown only on the Boo Private Login (email) path — after Avatar upload, before Pairing.
// Users who signed in with Google skip this screen: Google Drive is selected automatically.
//
// Architecture:
//   The user's personal cloud account (Google Drive / Dropbox / OneDrive) is used as an
//   encrypted data relay. The developer never hosts or sees couple data.
//   All blobs are AES-256-GCM encrypted with the Couple's Key BEFORE upload.
//   The app requests restricted scopes only — it cannot see the user's other files.
//
import { useState } from "react";
import { ShieldIcon } from "../../icons/index.jsx";
import SCREENS from "../../constants/screens.js";
import { CLOUD_PROVIDERS } from "../../constants/data.js";

const CSS = `
  .cloud-card {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1.5px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    cursor: pointer;
    transition: border-color .18s, background .18s;
    margin-bottom: 10px;
  }
  .cloud-card.selected {
    border-color: rgba(232,116,138,.5);
    background: rgba(232,116,138,.05);
  }
  .cloud-card:active { transform: scale(.99); }
  .cloud-icon {
    width: 44px; height: 44px; border-radius: 13px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.09);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .cloud-info { flex: 1; }
  .cloud-name { font-size: 15px; font-weight: 500; color: #fff; margin-bottom: 3px; }
  .cloud-meta { font-size: 11px; color: var(--faint); letter-spacing: .3px; }
  .cloud-note { font-size: 12px; color: rgba(255,255,255,.35); margin-top: 5px; line-height: 1.55; }
  .cloud-check {
    width: 22px; height: 22px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,.18);
    flex-shrink: 0; margin-top: 2px;
    display: flex; align-items: center; justify-content: center;
    transition: background .16s, border-color .16s;
  }
  .cloud-check.on { background: var(--rose); border-color: var(--rose); }
  .scope-row {
    display: flex; align-items: center; gap: 8px;
    background: rgba(94,245,160,.04);
    border: 1px solid rgba(94,245,160,.12);
    border-radius: 11px; padding: 10px 13px; margin-bottom: 14px;
  }
  .scope-txt { font-size: 11px; color: rgba(94,245,160,.65); line-height: 1.55; }
`;

export default function CloudProviderScreen({ navigate }) {
  const [selected, setSelected] = useState("google_drive");

  return (
    <>
      <style>{CSS}</style>
      <div className="screen">
        <div className="aw" style={{ justifyContent: "flex-start", paddingTop: 50 }}>

          {/* Step indicator — step 4 of 5 */}
          <div className="steps" style={{ marginBottom: 10, alignSelf: "flex-start" }}>
            <div className="sd sd-done" />
            <div className="sd sd-done" />
            <div className="sd sd-done" />
            <div className="sd sd-on" />
            <div className="sd sd-off" />
          </div>

          <div className="htitle" style={{ marginBottom: 4, width: "100%" }}>
            Choose your <em>cloud</em>
          </div>
          <p className="sub" style={{ marginBottom: 18, width: "100%" }}>
            My Boo syncs your data through <strong style={{ color: "#fff" }}>your own</strong> cloud
            account — not our servers. Everything is encrypted on your device first, so even the
            cloud provider can't read it.
          </p>

          {/* Restricted scope notice */}
          <div className="scope-row" style={{ width: "100%" }}>
            <ShieldIcon size={14} style={{ color: "var(--mint)", flexShrink: 0 }} />
            <span className="scope-txt">
              <strong style={{ color: "var(--mint)" }}>Restricted access.</strong>{" "}
              My Boo only requests access to a hidden app folder — it can't see any of your other files.
            </span>
          </div>

          {/* Provider cards */}
          {CLOUD_PROVIDERS.map((p) => (
            <div
              key={p.id}
              className={`cloud-card${selected === p.id ? " selected" : ""}`}
              onClick={() => setSelected(p.id)}
            >
              <div className="cloud-icon">{p.icon}</div>
              <div className="cloud-info">
                <div className="cloud-name">{p.name}</div>
                <div className="cloud-meta">{p.api} · {p.scope} · {p.freeTier} free</div>
                <div className="cloud-note">{p.note}</div>
              </div>
              <div className={`cloud-check${selected === p.id ? " on" : ""}`}>
                {selected === p.id && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
              </div>
            </div>
          ))}

          {/* Continue */}
          <button
            className="btn btn-p"
            style={{ marginTop: 6, width: "100%" }}
            onClick={() => {
              // TODO: Trigger OAuth flow for the selected provider, store provider ID in user session
              navigate(SCREENS.PAIRING);
            }}
          >
            Connect {CLOUD_PROVIDERS.find(p => p.id === selected)?.name} →
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(SCREENS.AVATAR)}>
            ← Back
          </button>

        </div>
      </div>
    </>
  );
}
