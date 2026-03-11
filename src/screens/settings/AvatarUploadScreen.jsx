// screens/AvatarUploadScreen.jsx
import { useRef } from "react";
import { CamIcon, CheckIcon, ShieldIcon } from "../../icons/index.jsx";
import SCREENS from "../../constants/screens";

export default function AvatarUploadScreen({ navigate, previewAvatar, setPreviewAvatar, setYourAvatar }) {
  const fileInputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewAvatar(url);
  };

  const handleSave = () => {
    if (previewAvatar) setYourAvatar(previewAvatar);
    navigate(SCREENS.PAIRING);
  };

  const handleSkip = () => {
    setPreviewAvatar(null);
    navigate(SCREENS.PAIRING);
  };

  return (
    <div className="screen">
      <div className="aw" style={{ justifyContent: "flex-start", paddingTop: 50 }}>

        {/* Step indicator — step 3 of 4 */}
        <div className="steps" style={{ marginBottom: 10, alignSelf: "flex-start" }}>
          <div className="sd sd-done" />
          <div className="sd sd-done" />
          <div className="sd sd-on" />
          <div className="sd sd-off" />
        </div>

        <div className="htitle" style={{ marginBottom: 4, width: "100%" }}>
          Add a <em>photo</em>
        </div>
        <p className="sub" style={{ marginBottom: 22, width: "100%" }}>
          Let your partner put a face to your name. You can skip this and add one from profile settings later.
        </p>

        {/* Upload zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div className="av-zone" onClick={() => fileInputRef.current?.click()}>
            {previewAvatar
              ? <img src={previewAvatar} alt="preview" />
              : <>
                  <CamIcon size={26} />
                  <span style={{ fontSize: 11, color: "var(--faint)", letterSpacing: "1px" }}>Tap to upload</span>
                </>
            }
          </div>
          {previewAvatar && (
            <div className="pill pill-g">
              <CheckIcon size={11} /> Selected — uploads to Firebase Storage
            </div>
          )}
        </div>

        {/* Storage info */}
        <div className="card" style={{ width: "100%", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <ShieldIcon size={14} style={{ color: "var(--rose-lt)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.6 }}>
              Photo is stored in{" "}
              <strong style={{ color: "#fff" }}>Firebase Storage</strong> (or Supabase Storage).
              The public URL is saved to your{" "}
              <strong style={{ color: "#fff" }}>users</strong> table and only displayed inside your couple space.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 9, width: "100%" }}>
          <button className="btn btn-out" style={{ flex: 1, padding: "13px" }} onClick={handleSkip}>
            Skip
          </button>
          <button className="btn btn-p" style={{ flex: 2 }} onClick={handleSave}>
            {previewAvatar ? "Save & Continue →" : "Continue →"}
          </button>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(SCREENS.PASSWORD)}>
          ← Back
        </button>

      </div>
    </div>
  );
}
