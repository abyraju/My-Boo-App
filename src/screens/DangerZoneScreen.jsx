// screens/DangerZoneScreen.jsx
// Accessible only after PIN verification. Contains Unpair and Delete Everything.
import { useState } from "react";
import SCREENS from "../constants/screens";

const CSS = `
  .dz-screen {
    min-height: 100%;
    background: radial-gradient(ellipse 90% 45% at 50% 0%, #2a0808, #0d0511 55%);
    display: flex; flex-direction: column;
    padding-bottom: 32px;
  }

  /* Header */
  .dz-header {
    display: flex; align-items: center; gap: 12px;
    padding: 52px 20px 0;
    margin-bottom: 6px;
  }
  .dz-back {
    width: 36px; height: 36px; border-radius: 11px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; flex-shrink: 0;
    transition: background .15s;
  }
  .dz-back:active { background: rgba(255,255,255,.12); }
  .dz-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #fff;
  }
  .dz-title em { font-style: italic; color: #ff8a8a; }

  /* Warning banner */
  .dz-banner {
    margin: 16px 16px 0;
    background: rgba(255,60,60,.06); border: 1px solid rgba(255,60,60,.16);
    border-radius: 16px; padding: 14px 16px;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .dz-banner-ico { font-size: 18px; flex-shrink: 0; }
  .dz-banner-txt { font-size: 12px; color: rgba(255,130,130,.7); line-height: 1.6; }

  /* Section label */
  .dz-section {
    margin: 22px 20px 10px;
    font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,.18);
    display: flex; align-items: center; gap: 8px;
  }
  .dz-section::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.055); }

  /* Action cards */
  .dz-card {
    margin: 0 16px 12px;
    border-radius: 18px; padding: 18px;
    cursor: pointer; transition: all .18s;
  }
  .dz-card:active { transform: scale(.99); }
  .dz-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .dz-card-ico {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    flex-shrink: 0;
  }
  .dz-card-name { font-size: 15px; font-weight: 500; }
  .dz-card-desc { font-size: 12px; line-height: 1.6; }
  .dz-card-action { margin-top: 14px; }

  /* Unpair style */
  .dz-card-unpair {
    background: rgba(255,140,60,.07); border: 1px solid rgba(255,140,60,.18);
  }
  .dz-card-unpair .dz-card-ico { background: rgba(255,140,60,.12); }
  .dz-card-unpair .dz-card-name { color: #ffad6a; }
  .dz-card-unpair .dz-card-desc { color: rgba(255,160,100,.5); }
  .dz-card-unpair .dz-card-action .btn { background: rgba(255,140,60,.15); color: #ffad6a; border: 1px solid rgba(255,140,60,.3); }

  /* Delete style */
  .dz-card-delete {
    background: rgba(255,60,60,.06); border: 1px solid rgba(255,60,60,.16);
  }
  .dz-card-delete .dz-card-ico { background: rgba(255,60,60,.12); }
  .dz-card-delete .dz-card-name { color: #ff7a7a; }
  .dz-card-delete .dz-card-desc { color: rgba(255,120,120,.45); }
  .dz-card-delete .dz-card-action .btn { background: rgba(255,60,60,.12); color: #ff7a7a; border: 1px solid rgba(255,60,60,.28); }

  /* Modal overlay */
  .dz-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,.7); backdrop-filter: blur(6px);
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 0;
  }
  .dz-modal {
    width: 100%; max-width: 390px;
    background: linear-gradient(180deg, #1e0a0a 0%, #0d0511 100%);
    border-radius: 28px 28px 0 0;
    border-top: 1px solid rgba(255,255,255,.1);
    padding: 24px 22px 44px;
    animation: slideUp .28s cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .dz-modal-pill {
    width: 36px; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,.15); margin: 0 auto 20px;
  }
  .dz-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #fff;
    margin-bottom: 10px; text-align: center;
  }
  .dz-modal-body { font-size: 13px; color: rgba(255,255,255,.45); line-height: 1.7; text-align: center; margin-bottom: 22px; }
  .dz-modal-actions { display: flex; flex-direction: column; gap: 10px; }

  /* Delete confirm: type DELETE */
  .dz-type-field {
    width: 100%; background: rgba(255,60,60,.07);
    border: 1px solid rgba(255,60,60,.2); border-radius: 12px;
    padding: 12px 14px; color: #ff9999; font-size: 14px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; outline: none; text-align: center;
    letter-spacing: 2px; text-transform: uppercase;
    transition: border-color .2s;
  }
  .dz-type-field::placeholder { color: rgba(255,100,100,.3); letter-spacing: 1px; text-transform: none; font-weight: 400; }
  .dz-type-field:focus { border-color: rgba(255,80,80,.4); }
`;

export default function DangerZoneScreen({ navigate }) {
  const [modal,       setModal]       = useState(null); // null | 'unpair' | 'delete'
  const [deleteText,  setDeleteText]  = useState("");

  const closeModal = () => { setModal(null); setDeleteText(""); };

  const confirmUnpair = () => {
    // TODO: call unpair API, clear couple session
    navigate(SCREENS.PAIRING);
  };

  const confirmDelete = () => {
    if (deleteText.trim().toUpperCase() !== "DELETE") return;
    // TODO: call account deletion API
    navigate(SCREENS.METHOD);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dz-screen screen-enter">

        {/* Header */}
        <div className="dz-header">
          <div className="dz-back" onClick={() => navigate(SCREENS.MAIN_PROFILE)}>←</div>
          <div className="dz-title">Danger <em>Zone</em></div>
        </div>

        {/* Warning banner */}
        <div className="dz-banner">
          <div className="dz-banner-ico">⚠️</div>
          <div className="dz-banner-txt">
            Actions on this screen are <strong style={{ color: "#ff9999" }}>irreversible</strong>.
            They affect both you and your partner. Proceed with care.
          </div>
        </div>

        {/* Unpair */}
        <div className="dz-section">Unpair</div>
        <div className="dz-card dz-card-unpair">
          <div className="dz-card-head">
            <div className="dz-card-ico">🔗</div>
            <div className="dz-card-name">Unpair from Jordan</div>
          </div>
          <div className="dz-card-desc">
            Dissolves your couple profile. Jordan will also lose access to the shared space immediately.
            Your individual accounts will remain intact.
          </div>
          <div className="dz-card-action">
            <button className="btn" onClick={() => setModal("unpair")}>Unpair</button>
          </div>
        </div>

        {/* Delete Everything */}
        <div className="dz-section">Delete Everything</div>
        <div className="dz-card dz-card-delete">
          <div className="dz-card-head">
            <div className="dz-card-ico">🗑</div>
            <div className="dz-card-name">Delete Everything</div>
          </div>
          <div className="dz-card-desc">
            Permanently deletes both accounts, all messages, photos, milestones, journal entries,
            and your entire couple space. This cannot be undone under any circumstances.
          </div>
          <div className="dz-card-action">
            <button className="btn" onClick={() => setModal("delete")}>Delete Everything</button>
          </div>
        </div>

      </div>

      {/* ── Unpair confirmation modal ── */}
      {modal === "unpair" && (
        <div className="dz-modal-overlay">
          <div className="dz-modal">
            <div className="dz-modal-pill" />
            <div className="dz-modal-title">Are you sure?</div>
            <div className="dz-modal-body">
              This will dissolve your couple profile. Jordan will also lose access to the shared space.
              This <strong style={{ color: "#fff" }}>cannot be undone</strong>.
            </div>
            <div className="dz-modal-actions">
              <button className="btn btn-danger" onClick={confirmUnpair}>Yes, Unpair</button>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {modal === "delete" && (
        <div className="dz-modal-overlay">
          <div className="dz-modal">
            <div className="dz-modal-pill" />
            <div className="dz-modal-title">Permanently delete everything?</div>
            <div className="dz-modal-body">
              This will permanently delete your account, Jordan's shared data, all messages, photos,
              milestones, and memories. <strong style={{ color: "#fff" }}>This action cannot be undone.</strong>
            </div>
            <input
              className="dz-type-field"
              placeholder="Type DELETE to confirm"
              value={deleteText}
              onChange={e => setDeleteText(e.target.value)}
              maxLength={10}
            />
            <div className="dz-modal-actions" style={{ marginTop: 14 }}>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
                style={{ opacity: deleteText.trim().toUpperCase() === "DELETE" ? 1 : 0.4 }}
              >
                Delete Everything
              </button>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
