// screens/PasswordScreen.jsx
import { useState } from "react";
import SCREENS from "../../constants/screens";

const EyeIcon = ({ size = 18, open = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const rules = [
  { label: "8 – 16 characters",           test: (p) => p.length >= 8 && p.length <= 16 },
  { label: "One uppercase letter (A–Z)",  test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)",  test: (p) => /[a-z]/.test(p) },
  { label: "One number (0–9)",            test: (p) => /[0-9]/.test(p) },
  { label: "One special character",       test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordScreen({ navigate }) {
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [touched,   setTouched]   = useState(false);

  const allRulesMet  = rules.every((r) => r.test(password));
  const passwordsMatch = password === confirm && confirm.length > 0;
  const canSubmit    = allRulesMet && passwordsMatch;

  return (
    <div className="screen">
      <div className="aw" style={{ justifyContent: "flex-start", paddingTop: 50 }}>

        {/* Step indicator — step 2 of 4 */}
        <div className="steps" style={{ marginBottom: 10, alignSelf: "flex-start" }}>
          <div className="sd sd-done" />
          <div className="sd sd-on" />
          <div className="sd sd-off" />
          <div className="sd sd-off" />
        </div>

        <div className="htitle" style={{ marginBottom: 4, width: "100%" }}>
          Set your <em>password</em>
        </div>
        <p className="sub" style={{ marginBottom: 22, width: "100%" }}>
          Choose something only you would know.
        </p>

        <div style={{ width: "100%" }}>

          {/* Password field */}
          <div className="field">
            <label className="lbl">Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="inp"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                maxLength={16}
                onChange={(e) => { setPassword(e.target.value); setTouched(true); }}
                style={{ paddingRight: 46 }}
              />
              <button
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--faint)", display: "flex", alignItems: "center", padding: 0,
                }}
              >
                <EyeIcon size={18} open={showPass} />
              </button>
            </div>
            {/* Character counter */}
            <div style={{ textAlign: "right", fontSize: 11, marginTop: 5,
              color: password.length >= 14 ? (password.length === 16 ? "#ff8a8a" : "var(--gold)") : "var(--faint)" }}>
              {password.length} / 16
            </div>
          </div>

          {/* Strength rules */}
          {touched && password.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}>
              {rules.map((r) => {
                const met = r.test(password);
                return (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      background: met ? "rgba(94,245,160,.15)" : "rgba(255,255,255,.06)",
                      border: `1px solid ${met ? "rgba(94,245,160,.4)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: met ? "var(--mint)" : "var(--faint)",
                      transition: "all .2s",
                    }}>
                      {met && <CheckIcon size={10} />}
                    </div>
                    <span style={{ fontSize: 12, color: met ? "rgba(255,255,255,.65)" : "var(--faint)" }}>
                      {r.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirm password field */}
          <div className="field">
            <label className="lbl">Confirm password</label>
            <div style={{ position: "relative" }}>
              <input
                className="inp"
                type={showConf ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={{
                  paddingRight: 46,
                  borderColor: confirm.length > 0
                    ? passwordsMatch
                      ? "rgba(94,245,160,.5)"
                      : "rgba(255,80,80,.4)"
                    : undefined,
                }}
              />
              <button
                onClick={() => setShowConf((v) => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--faint)", display: "flex", alignItems: "center", padding: 0,
                }}
              >
                <EyeIcon size={18} open={showConf} />
              </button>
            </div>
            {confirm.length > 0 && !passwordsMatch && (
              <p style={{ fontSize: 11, color: "#ff8a8a", marginTop: 5 }}>
                Passwords don't match
              </p>
            )}
            {passwordsMatch && (
              <p style={{ fontSize: 11, color: "var(--mint)", marginTop: 5 }}>
                ✓ Passwords match
              </p>
            )}
          </div>

          <button
            className="btn btn-p"
            style={{ marginTop: 4, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? "pointer" : "not-allowed" }}
            onClick={() => { if (canSubmit) navigate(SCREENS.AVATAR); }}
          >
            Continue →
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(SCREENS.REGISTER)}>
            ← Back
          </button>

        </div>
      </div>
    </div>
  );
}
