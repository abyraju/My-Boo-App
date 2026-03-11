// screens/RegisterScreen.jsx
import { useState } from "react";
import SCREENS from "../../constants/screens";
import { COUNTRIES } from "../../constants/data";

export default function RegisterScreen({ navigate }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phone, setPhone] = useState("");

  const handleCountryChange = (e) => {
    const found = COUNTRIES.find((c) => c.code === e.target.value);
    setSelectedCountry(found || null);
    setPhone(""); // reset phone when country changes
  };

  return (
    <div className="screen">
      <div className="aw" style={{ justifyContent: "flex-start", paddingTop: 50 }}>

        {/* Step indicator — step 1 of 4 */}
        <div className="steps" style={{ marginBottom: 10, alignSelf: "flex-start" }}>
          <div className="sd sd-on" />
          <div className="sd sd-off" />
          <div className="sd sd-off" />
          <div className="sd sd-off" />
        </div>

        <div className="htitle" style={{ marginBottom: 4, width: "100%" }}>
          Create your <em>account</em>
        </div>
        <p className="sub" style={{ marginBottom: 18, width: "100%" }}>
          Your private space starts here.
        </p>

        <div style={{ width: "100%" }}>

          {/* Name */}
          <div className="field">
            <label className="lbl">Your name</label>
            <input className="inp" placeholder="How should your boo call you?" />
          </div>

          {/* Email */}
          <div className="field">
            <label className="lbl">Email address</label>
            <input className="inp" type="email" placeholder="you@email.com" />
          </div>

          {/* Country — also sets dial code */}
          <div className="field">
            <label className="lbl">Country</label>
            <select
              className="inp"
              value={selectedCountry?.code || ""}
              onChange={handleCountryChange}
            >
              <option value="">Select your country…</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.dial})
                </option>
              ))}
            </select>
          </div>

          {/* Phone — prefixed with dial code from country selection */}
          <div className="field">
            <label className="lbl">
              Phone number{" "}
              <span style={{ color: "var(--faint)", textTransform: "none", letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <div style={{ display: "flex", gap: 0 }}>
              {/* Dial code badge */}
              <div style={{
                background: "rgba(255,255,255,.07)",
                border: "1px solid var(--border)",
                borderRight: "none",
                borderRadius: "12px 0 0 12px",
                padding: "13px 14px",
                color: selectedCountry ? "#fff" : "var(--faint)",
                fontSize: 14,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                minWidth: 64,
                justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {selectedCountry ? selectedCountry.dial : "+–"}
              </div>
              {/* Number input */}
              <input
                className="inp"
                type="tel"
                placeholder="000 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!selectedCountry}
                style={{
                  borderRadius: "0 12px 12px 0",
                  flex: 1,
                  opacity: selectedCountry ? 1 : 0.5,
                }}
              />
            </div>
            {!selectedCountry && (
              <p style={{ fontSize: 11, color: "var(--faint)", marginTop: 5 }}>
                Select a country first to enable this field
              </p>
            )}
          </div>

          {/* Birthday */}
          <div className="field">
            <label className="lbl">Birthday</label>
            <input className="inp" type="date" style={{ colorScheme: "dark" }} />
          </div>

          <button
            className="btn btn-p"
            style={{ marginTop: 4 }}
            onClick={() => navigate(SCREENS.PASSWORD)}
          >
            Continue →
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(SCREENS.METHOD)}>
            ← Back
          </button>

        </div>
      </div>
    </div>
  );
}
