// screens/SignInScreen.jsx
import { HeartIcon, GoogleIcon, ShieldIcon } from "../icons/index.jsx";
import SCREENS from "../constants/screens";

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
          <button className="btn btn-g" onClick={() => navigate(SCREENS.PAIRING)}>
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
        </div>

        {/* Privacy note */}
        <div className="sec-badge" style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <ShieldIcon size={15} style={{ color: "var(--mint)", flexShrink: 0, marginTop: 1 }} />
          <span className="sec-badge-txt">
            <strong style={{ color: "var(--mint)" }}>Private by design.</strong>{" "}
            Database-level rules block all third-party access — only you and your partner can ever read or write this data.
          </span>
        </div>

      </div>
    </div>
  );
}
