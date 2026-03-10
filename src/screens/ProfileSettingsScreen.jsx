// screens/ProfileSettingsScreen.jsx
import { useRef } from "react";
import { CamIcon, CheckIcon, BackIcon } from "../icons/index.jsx";
import SCREENS from "../constants/screens";
import { COUNTRIES, BOO_ID } from "../constants/data";

export default function ProfileSettingsScreen({ navigate, yourAvatar, setYourAvatar }) {
  const fileInputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setYourAvatar(url);
  };

  return (
    <div className="screen" style={{ background: "var(--velvet)" }}>
      <div className="prof-bg">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 22 }}>
          <button
            onClick={() => navigate(SCREENS.METHOD)}
            style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 9, padding: 7, cursor: "pointer", color: "var(--dim)", display: "flex" }}
          >
            <BackIcon />
          </button>
          <div className="htitle">Profile Settings</div>
        </div>

        {/* Avatar */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, padding: "20px 0 22px" }}>
          <div className="av-ring" style={{ width: 98, height: 98 }} onClick={() => fileInputRef.current?.click()}>
            {yourAvatar
              ? <img src={yourAvatar} alt="profile" />
              : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,var(--rose),var(--plum))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff" }}>
                  A
                </div>
            }
            <div className="av-ov">
              <CamIcon size={17} />
              <span>Change</span>
            </div>
          </div>

          {yourAvatar && (
            <div className="pill pill-g">
              <CheckIcon size={11} /> Synced to partner's view
            </div>
          )}
          <div style={{ fontSize: 11, color: "var(--faint)", textAlign: "center", lineHeight: 1.6 }}>
            Tap to change · stored in Firebase Storage<br />
            URL saved to{" "}
            <code style={{ background: "rgba(255,255,255,.07)", padding: "0 4px", borderRadius: 3, fontSize: 10 }}>
              users.avatar_url
            </code>
          </div>
        </div>

        {/* Personal info */}
        <div className="sec-lbl" style={{ marginBottom: 10 }}>Your Info</div>
        <div style={{ marginBottom: 18 }}>
          <div className="field">
            <label className="lbl">Display name</label>
            <input className="inp" defaultValue="Alex" />
          </div>
          <div className="field">
            <label className="lbl">Email</label>
            <input className="inp" type="email" defaultValue="alex@email.com" />
          </div>
          <div className="field">
            <label className="lbl">Phone</label>
            <input className="inp" type="tel" defaultValue="+1 555 000 0000" />
          </div>
          <div className="inp-row">
            <div className="field">
              <label className="lbl">Country</label>
              <select className="inp">
                <option>United States</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="lbl">Birthday</label>
              <input className="inp" type="date" style={{ colorScheme: "dark" }} />
            </div>
          </div>
        </div>

        {/* Boo ID (read-only) */}
        <div className="sec-lbl" style={{ marginBottom: 10 }}>Boo ID</div>
        <div className="boo-box" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--faint)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
            Your unique identifier
          </div>
          <div className="boo-id" style={{ fontSize: 26, letterSpacing: 4 }}>{BOO_ID}</div>
          <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 8 }}>
            Generated at account creation · cannot be changed
          </div>
        </div>

        <button className="btn btn-p">Save Changes</button>

      </div>
    </div>
  );
}
