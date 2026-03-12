// screens/login/SignInScreen.jsx
//
// Architecture note:
//   • "Continue with Google" → signs in via Google OAuth AND implicitly selects Google Drive
//     as the cloud storage provider (drive.appdata scope). Skips Register/Password — name and
//     email are pulled from the Google profile. Lands directly on the Avatar upload screen.
//     Flow: Google OAuth → Avatar → Pairing → PairSuccess → PIN Setup → Home
//   • "Create Account" (email) → Register → Password → Avatar → CloudProvider → Pair.
//   • Apple Sign-In will be added before iOS App Store release (mandatory per App Store guidelines).
//
import { HeartIcon, GoogleIcon, ShieldIcon } from "../../icons/index.jsx";
import SCREENS from "../../constants/screens.js";

export default function SignInScreen({ navigate }) {
  return (
    <div className="screen">
      <div className="aw" style={{ justifyContent: "center" }}>

        {/* Floating hearts */}
        <div className="fh-wrap">
          <div className="fh fh1"><HeartIcon size={52} /></div>
          <div className="fh fh2"><HeartIcon size={36} /></div>
          <div className="fh fh3"><HeartIcon size={66} /></div>
          <div className="fh fh4"><HeartIcon size={28} /></div>
        </div>

        {/* Logo */}
        <div style={{ color: "var(--rose)", position: "relative", zIndex: 1, marginBottom: 8 }}>
          <HeartIcon size={36} filled />
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 300, color: "#fff",
          letterSpacing: "-1px", position: "relative", zIndex: 1,
          textAlign: "center", lineHeight: 1,
        }}>
          My <em style={{ fontStyle: "italic", color: "var(--rose-lt)" }}>Boo</em>
        </div>
        <div style={{
          fontSize: 12, color: "var(--faint)", letterSpacing: "3px",
          textTransform: "uppercase", marginBottom: 28,
          position: "relative", zIndex: 1,
        }}>
          Just the two of you
        </div>

        {/* Auth card */}
        <div className="card" style={{ width: "100%", position: "relative", zIndex: 1, marginBottom: 10 }}>
          {/*
           * Google Sign-In also auto-selects Google Drive (drive.appdata scope) as the
           * cloud storage provider — no extra step needed for this path.
           * Name + email are pulled from the Google profile — Register/Password are skipped.
           * TODO: Trigger real Google OAuth + request drive.appdata scope here.
           */}
          <button className="btn btn-g" onClick={() => navigate(SCREENS.AVATAR)}>
            <GoogleIcon size={18} /> Continue with Google
          </button>

          <div className="div">
            <div className="div-line" />
            <span className="div-txt">or sign up with email</span>
            <div className="div-line" />
          </div>

          <button className="btn btn-p" style={{ marginBottom: 8 }} onClick={() => navigate(SCREENS.REGISTER)}>
            Create Account
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(SCREENS.REGISTER)}>
            Already have an account · Sign in
          </button>

          {/*
           * Apple Sign-In — required before iOS App Store release.
           * TODO: Uncomment and wire once apple_sign_in package is integrated.
           *
           * <div className="div"><div className="div-line" /><div className="div-line" /></div>
           * <button className="btn btn-g" onClick={() => navigate(SCREENS.REGISTER)}>
           *   🍎  Continue with Apple
           * </button>
           */}
        </div>

        {/* Privacy / E2EE notice */}
        <div className="sec-badge" style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <ShieldIcon size={15} style={{ color: "var(--mint)", flexShrink: 0, marginTop: 1 }} />
          <span className="sec-badge-txt">
            <strong style={{ color: "var(--mint)" }}>End-to-end encrypted.</strong>{" "}
            Your data is encrypted on your device before it ever leaves. It syncs through{" "}
            <em>your own</em> cloud account — we never host or see your data.
          </span>
        </div>

      </div>
    </div>
  );
}
