// App.jsx
import { useState, useRef } from "react";
import SCREENS from "./constants/screens";
import SignInScreen          from "./screens/login/SignInScreen";
import RegisterScreen        from "./screens/login/RegisterScreen";
import PasswordScreen        from "./screens/login/PasswordScreen";
import PairingScreen         from "./screens/login/PairingScreen";
import PairSuccessScreen     from "./screens/login/PairSuccessScreen";
import PairBlockedScreen     from "./screens/login/PairBlockedScreen";
import PinSetupScreen        from "./screens/login/PinSetupScreen";
import HomeScreen            from "./screens/home/HomeScreen";
import ChatScreen            from "./screens/features/ChatScreen";
import AvatarUploadScreen    from "./screens/settings/AvatarUploadScreen";
import UnpairScreen          from "./screens/settings/UnpairScreen";
import ProfileSettingsScreen from "./screens/settings/ProfileSettingsScreen";
import MainProfileScreen     from "./screens/settings/MainProfileScreen";
import DangerZoneScreen      from "./screens/settings/DangerZoneScreen";

// ── Global CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root { width: 100%; height: 100%; min-height: 100vh; }

:root {
  --rose:   #e8748a;
  --rose-lt:#f5a8b8;
  --rose-dk:#c45578;
  --plum:   #6b3a6e;
  --velvet: #130818;
  --deep:   #0d0511;
  --gold:   #c9a96e;
  --mint:   #5ef5a0;
  --border: rgba(255,255,255,.08);
  --dim:    rgba(255,255,255,.42);
  --faint:  rgba(255,255,255,.22);
}

/* Screen base */
.screen {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; overflow: hidden;
}

@keyframes screenFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.screen-enter { animation: screenFadeIn .28s cubic-bezier(.4,0,.2,1) both; }

.scroll { flex: 1; overflow-y: auto; overflow-x: hidden; }
.scroll::-webkit-scrollbar { display: none; }

/* Auth wrapper */
.aw {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 50px 26px 28px; overflow-y: auto;
  background: radial-gradient(ellipse 90% 60% at 50% 30%, #35104a, var(--deep) 65%);
}
.aw::-webkit-scrollbar { display: none; }

/* Floating hearts */
.fh-wrap { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.fh { position: absolute; color: rgba(232,116,138,.1); }
.fh1 { top: 56px;    left: 24px;   animation: fl1 7s ease-in-out infinite; }
.fh2 { top: 96px;    right: 32px;  animation: fl2 9s ease-in-out infinite; }
.fh3 { bottom: 170px;left: 40px;   animation: fl1 6s ease-in-out infinite reverse; }
.fh4 { bottom: 210px;right: 20px;  animation: fl2 8s ease-in-out infinite reverse; }
@keyframes fl1 { 0%,100%{transform:translateY(0) rotate(-10deg)} 50%{transform:translateY(-16px) rotate(-10deg)} }
@keyframes fl2 { 0%,100%{transform:translateY(0) rotate(14deg)}  50%{transform:translateY(-12px) rotate(14deg)} }

/* Typography */
.htitle    { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; color: #fff; }
.htitle em { font-style: italic; color: var(--rose-lt); }
.sub       { font-size: 13px; color: var(--dim); line-height: 1.65; }
.lbl       { font-size: 11px; color: var(--faint); letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-bottom: 7px; }
.sec-lbl   { font-size: 11px; color: rgba(255,255,255,.28); letter-spacing: 2px; text-transform: uppercase; }

/* Step dots */
.steps  { display: flex; align-items: center; gap: 6px; }
.sd     { width: 8px; height: 8px; border-radius: 50%; transition: all .3s; }
.sd-on  { background: var(--rose); width: 24px; border-radius: 4px; }
.sd-done{ background: rgba(232,116,138,.45); }
.sd-off { background: rgba(255,255,255,.14); }

/* Inputs */
.field { margin-bottom: 13px; }
.inp {
  width: 100%; background: rgba(255,255,255,.07);
  border: 1px solid var(--border); border-radius: 12px;
  padding: 13px 14px; color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: 14px; outline: none; transition: border-color .2s, background .2s;
}
.inp::placeholder { color: var(--faint); }
.inp:focus { border-color: var(--rose); background: rgba(232,116,138,.05); }
.inp-row { display: flex; gap: 10px; }
.inp-row .field { flex: 1; }
select.inp option { background: #1a0c1e; color: #fff; }

/* Buttons */
.btn { width: 100%; padding: 15px; border-radius: 14px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; transition: all .2s; letter-spacing: .2px; }
.btn-p         { background: linear-gradient(135deg, var(--rose), var(--rose-dk)); color: #fff; box-shadow: 0 8px 24px rgba(232,116,138,.28); }
.btn-p:hover   { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(232,116,138,.38); }
.btn-g         { background: rgba(255,255,255,.07); color: #fff; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-g:hover   { background: rgba(255,255,255,.12); }
.btn-ghost     { background: transparent; color: var(--dim); font-size: 13px; padding: 12px; }
.btn-out       { background: transparent; border: 1px solid var(--border); color: var(--dim); }
.btn-out:hover { border-color: var(--rose); color: var(--rose-lt); }
.btn-danger       { background: rgba(255,60,60,.09); color: #ff6b6b; border: 1px solid rgba(255,60,60,.2); }
.btn-danger:hover { background: rgba(255,60,60,.18); }

/* Divider */
.div      { display: flex; align-items: center; gap: 11px; margin: 15px 0; }
.div-line { flex: 1; height: 1px; background: var(--border); }
.div-txt  { font-size: 11px; color: var(--faint); }

/* Card */
.card { background: rgba(255,255,255,.05); border: 1px solid var(--border); border-radius: 20px; padding: 22px; }

/* Pills */
.pill     { display: inline-flex; align-items: center; gap: 5px; border-radius: 20px; padding: 5px 11px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; }
.pill-g   { background: rgba(94,245,160,.1);  border: 1px solid rgba(94,245,160,.18); color: var(--mint); }
.pill-red { background: rgba(255,80,80,.1);   border: 1px solid rgba(255,80,80,.22);  color: #ff8a8a; }

/* Security badge */
.sec-badge     { display: flex; align-items: flex-start; gap: 10px; background: rgba(94,245,160,.05); border: 1px solid rgba(94,245,160,.14); border-radius: 14px; padding: 12px 14px; }
.sec-badge-txt { font-size: 12px; color: rgba(94,245,160,.7); line-height: 1.55; }

/* Avatar upload zone */
.av-zone       { width: 116px; height: 116px; border-radius: 50%; border: 2px dashed rgba(232,116,138,.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all .2s; background: rgba(232,116,138,.05); color: var(--rose); position: relative; overflow: hidden; }
.av-zone:hover { border-color: var(--rose); background: rgba(232,116,138,.1); }
.av-zone img   { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

/* Avatar edit ring */
.av-ring              { border-radius: 50%; border: 2px solid var(--border); position: relative; cursor: pointer; overflow: hidden; }
.av-ring img          { width: 100%; height: 100%; object-fit: cover; display: block; }
.av-ring:hover .av-ov { opacity: 1; }
.av-ov { position: absolute; inset: 0; background: rgba(0,0,0,.54); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; flex-direction: column; gap: 3px; color: #fff; font-size: 11px; }

/* Boo ID box */
.boo-box  { background: linear-gradient(135deg, rgba(107,58,110,.22), rgba(50,15,60,.38)); border: 1px solid rgba(107,58,110,.38); border-radius: 18px; padding: 20px; text-align: center; width: 100%; }
.boo-id   { font-family: 'Cormorant Garamond', serif; font-size: 33px; letter-spacing: 5px; font-weight: 300; background: linear-gradient(135deg, #fff, var(--rose-lt)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.boo-copy { margin-top: 12px; padding: 8px 20px; border-radius: 9px; border: 1px solid rgba(255,255,255,.1); background: transparent; color: var(--dim); font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; letter-spacing: .7px; transition: all .2s; }
.boo-copy:hover { border-color: var(--rose); color: var(--rose-lt); }

/* Pair success */
.success-bg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 26px; gap: 18px; background: radial-gradient(ellipse 80% 58% at 50% 38%, #2e1040, var(--deep) 70%); }
.av-duo     { display: flex; align-items: center; }
.av-you     { width: 70px; height: 70px; border-radius: 50%; border: 3px solid var(--velvet); background: linear-gradient(135deg, #e8748a, #9b3a6e); display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; overflow: hidden; }
.av-them    { width: 70px; height: 70px; border-radius: 50%; border: 3px solid var(--velvet); background: linear-gradient(135deg, #7eb8f5, #3a6eb4); display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; margin-left: -14px; }
.av-heart   { margin: 0 -7px; z-index: 1; color: var(--rose); filter: drop-shadow(0 0 8px rgba(232,116,138,.5)); }
.cpl-badge  { background: rgba(255,255,255,.04); border: 1px solid var(--border); border-radius: 13px; padding: 11px 18px; display: flex; flex-direction: column; align-items: center; gap: 3px; width: 100%; }

/* Pair blocked */
.blocked-bg  { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 26px; gap: 18px; background: radial-gradient(ellipse 70% 50% at 50% 38%, #2a0d0d, var(--deep) 70%); }
.blocked-ico { width: 78px; height: 78px; border-radius: 50%; background: rgba(255,80,80,.09); border: 2px solid rgba(255,80,80,.22); display: flex; align-items: center; justify-content: center; color: #ff6b6b; }

/* Unpair */
.unpair-bg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 34px 22px; gap: 16px; background: radial-gradient(ellipse 68% 48% at 50% 36%, #1e0a0a, var(--deep) 70%); }
.warn      { display: flex; gap: 9px; align-items: flex-start; background: rgba(255,60,60,.05); border: 1px solid rgba(255,60,60,.13); border-radius: 11px; padding: 13px; }
.warn-txt  { font-size: 12px; color: #ff8a8a; line-height: 1.6; }

/* Profile settings */
.prof-bg { flex: 1; overflow-y: auto; padding: 52px 18px 22px; background: var(--velvet); }
.prof-bg::-webkit-scrollbar { display: none; }

/* PIN setup screen */
.pin-screen { height: 100%; overflow-y: auto; background: radial-gradient(ellipse 80% 55% at 50% 25%, #2a0840, var(--deep) 65%); display: flex; flex-direction: column; align-items: center; padding: 52px 28px 32px; }
.pin-screen::-webkit-scrollbar { display: none; }
.pin-dots { display: flex; gap: 14px; justify-content: center; margin: 24px 0 6px; }
.pin-dot  { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.22); transition: background .14s, border-color .14s; }
.pin-dot.filled { background: var(--rose); border-color: var(--rose); }
.pin-dot.error  { background: #ff6b6b; border-color: #ff6b6b; animation: pinShake .35s ease; }
@keyframes pinShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
.pin-keypad { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; width: 100%; max-width: 300px; margin-top: 8px; }
.pin-key    { aspect-ratio:1; border-radius: 50%; border: none; background: rgba(255,255,255,.07); color: #fff; font-size: 22px; font-weight: 300; font-family: 'Cormorant Garamond', serif; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; transition: background .14s, transform .1s; -webkit-tap-highlight-color: transparent; }
.pin-key:active { background: rgba(232,116,138,.2); transform: scale(.92); }
.pin-key.empty  { background: transparent; cursor: default; pointer-events: none; }
.pin-key-sub    { font-family: 'DM Sans', sans-serif; font-size: 8px; letter-spacing: 1.5px; color: rgba(255,255,255,.28); }

/* Danger zone screen */
.dz-screen { min-height: 100%; background: radial-gradient(ellipse 70% 50% at 50% 30%, #1e0808, var(--deep) 65%); display: flex; flex-direction: column; padding: 52px 18px 32px; gap: 14px; }
.dz-warn-banner { background: rgba(255,80,80,.06); border: 1px solid rgba(255,80,80,.15); border-radius: 14px; padding: 13px 16px; display: flex; gap: 10px; align-items: flex-start; }
.dz-action-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,80,80,.12); border-radius: 18px; overflow: hidden; }
.dz-action-head { display: flex; align-items: center; gap: 12px; padding: 16px; cursor: pointer; }
.dz-action-body { padding: 0 16px 16px; border-top: 1px solid rgba(255,255,255,.05); }

/* Bottom nav shell */
.shell-nav {
  height: 84px; flex-shrink: 0;
  background: rgba(9,3,14,.95); backdrop-filter: blur(28px);
  border-top: 1px solid rgba(255,255,255,.07);
  display: flex; align-items: flex-start; padding-top: 8px;
  position: relative; overflow: visible; z-index: 20;
}
.nav-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 6px 0; transition: all .18s; position: relative; }
.nav-tab-ico { width: 28px; height: 28px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: all .22s cubic-bezier(.4,0,.2,1); }
.nav-tab.active .nav-tab-ico { background: rgba(232,116,138,.14); transform: translateY(-2px); }
.nav-tab-lbl { font-size: 10px; font-weight: 500; color: rgba(255,255,255,.3); transition: color .18s; letter-spacing: .3px; }
.nav-tab.active .nav-tab-lbl { color: var(--rose); }
.nav-pip { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--rose); opacity: 0; transition: opacity .18s; }
.nav-tab.active .nav-pip { opacity: 1; }
.nav-fab-col { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.nav-fab {
  width: 58px; height: 58px; border-radius: 50%; margin-top: -20px;
  background: linear-gradient(135deg, var(--rose), var(--rose-dk));
  box-shadow: 0 8px 28px rgba(232,116,138,.45), 0 2px 8px rgba(0,0,0,.4);
  border: 2px solid rgba(255,255,255,.16);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; z-index: 2;
  transition: transform .22s cubic-bezier(.4,0,.2,1), background .22s, box-shadow .22s;
}
.nav-fab:active { transform: scale(.91); }
.nav-fab.fab-open { background: linear-gradient(135deg, #4a4a5a, #2a2a38); box-shadow: 0 4px 16px rgba(0,0,0,.5); }
.fab-glyph { font-size: 22px; color: #fff; transition: transform .3s cubic-bezier(.4,0,.2,1); line-height: 1; }
.nav-fab.fab-open .fab-glyph { transform: rotate(45deg); }
.radial-wrap { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); width: 0; height: 0; pointer-events: none; z-index: 50; }
.r-item { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 4px; pointer-events: none; transition: opacity .22s ease, transform .26s cubic-bezier(.4,0,.2,1); }
.r-item.vis { pointer-events: auto; }
.r-btn { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; border: 1.5px solid rgba(255,255,255,.14); box-shadow: 0 4px 18px rgba(0,0,0,.5); transition: transform .14s; }
.r-btn:active { transform: scale(.88) !important; }
.r-btn-call    { background: rgba(94,245,160,.2); }
.r-btn-msg     { background: rgba(232,116,138,.22); }
.r-btn-gallery { background: rgba(126,184,245,.2); }
.r-lbl { font-size: 9.5px; font-weight: 500; color: rgba(255,255,255,.55); white-space: nowrap; }
.drawer-overlay { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
.drawer-overlay.open { pointer-events: auto; }
.drawer-backdrop { position: absolute; inset: 0; background: transparent; transition: background .32s ease; }
.drawer-overlay.open .drawer-backdrop { background: rgba(0,0,0,.58); }
.drawer-sheet {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(180deg, #1a0828 0%, #0d0511 100%);
  border-radius: 28px 28px 0 0; border-top: 1px solid rgba(255,255,255,.1);
  padding: 0 20px 32px; transform: translateY(100%);
  transition: transform .36s cubic-bezier(.4,0,.2,1); z-index: 31;
}
.drawer-overlay.open .drawer-sheet { transform: translateY(0); }
.drawer-pill-row { display: flex; justify-content: center; padding: 12px 0 6px; cursor: pointer; }
.drawer-pill { width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,.18); }
.drawer-heading { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: #fff; margin: 2px 0 16px; }
.drawer-heading em { font-style: italic; color: var(--rose-lt); }
.d-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
.d-tile { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 16px; padding: 14px 8px 12px; display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; transition: transform .16s, background .16s; }
.d-tile:active { transform: scale(.94); background: rgba(255,255,255,.07); }
.d-ico { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.d-lbl { font-size: 11px; font-weight: 500; color: rgba(255,255,255,.45); text-align: center; }
.dt-chat    .d-ico { background: rgba(232,116,138,.1);  border: 1px solid rgba(232,116,138,.2); }
.dt-gallery .d-ico { background: rgba(126,184,245,.1);  border: 1px solid rgba(126,184,245,.2); }
.dt-games   .d-ico { background: rgba(201,169,110,.1);  border: 1px solid rgba(201,169,110,.2); }
.dt-calls   .d-ico { background: rgba(94,245,160,.07);  border: 1px solid rgba(94,245,160,.16); }
.dt-watch   .d-ico { background: rgba(190,110,255,.07); border: 1px solid rgba(190,110,255,.17); }
.dt-mood    .d-ico { background: rgba(255,200,90,.07);  border: 1px solid rgba(255,200,90,.17); }
.d-sub-lbl { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,.2); margin-bottom: 10px; }
.ldr-row { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; }
.ldr-row::-webkit-scrollbar { display: none; }
.ldr-chip { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; cursor: pointer; }
.ldr-ico { width: 48px; height: 48px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 22px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); transition: transform .16s; }
.ldr-chip:active .ldr-ico { transform: scale(.9); }
.ldr-lbl { font-size: 10px; color: rgba(255,255,255,.28); font-weight: 500; max-width: 52px; text-align: center; }

/* PIN gate modal (used in MainProfileScreen — rendered inline) */
.pin-gate-overlay { position: fixed; inset: 0; z-index: 60; background: rgba(0,0,0,.72); backdrop-filter: blur(8px); display: flex; align-items: flex-end; }
.pin-gate-sheet { width: 100%; background: linear-gradient(180deg, #1a0828, #0d0511); border-radius: 28px 28px 0 0; border-top: 1px solid rgba(255,255,255,.1); padding: 20px 28px 44px; animation: slideUp .28s cubic-bezier(.4,0,.2,1); }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: none; } }
.pin-gate-pill { width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,.16); margin: 0 auto 20px; cursor: pointer; }
.pin-gate-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: #fff; text-align: center; margin-bottom: 6px; }
.pin-gate-sub { font-size: 12px; color: rgba(255,255,255,.38); text-align: center; margin-bottom: 24px; line-height: 1.55; }
.pin-gate-dots { display: flex; gap: 14px; justify-content: center; margin-bottom: 8px; }
.pin-gate-dot { width: 13px; height: 13px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.22); transition: background .14s, border-color .14s; }
.pin-gate-dot.filled { background: #e8748a; border-color: #e8748a; }
.pin-gate-dot.error  { background: #ff6b6b; border-color: #ff6b6b; animation: gateShake .35s ease; }
@keyframes gateShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
.pin-gate-error { font-size: 11px; color: #ff8a8a; text-align: center; min-height: 16px; margin-bottom: 20px; }
.pin-gate-keypad { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; max-width: 280px; margin: 0 auto; }
.pin-gate-key { aspect-ratio: 1; border-radius: 50%; border: none; background: rgba(255,255,255,.07); color: #fff; font-size: 20px; font-weight: 300; font-family: 'Cormorant Garamond', serif; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .14s, transform .1s; -webkit-tap-highlight-color: transparent; }
.pin-gate-key:active { background: rgba(232,116,138,.2); transform: scale(.92); }
.pin-gate-key.empty { background: transparent; cursor: default; pointer-events: none; }
`;

// ── Shell components ──────────────────────────────────────────────────────────
const RADIAL_ITEMS = [
  { cls:"r-btn-call",    e:"📞", l:"Call",    a:-148, d:80 },
  { cls:"r-btn-msg",     e:"💬", l:"Message", a:-90,  d:88 },
  { cls:"r-btn-gallery", e:"📸", l:"Gallery", a:-32,  d:80 },
];

function RadialItems({ open, onClose, onChat }) {
  return (
    <div className="radial-wrap">
      {RADIAL_ITEMS.map(({ cls, e, l, a, d }, i) => {
        const rad = (a * Math.PI) / 180;
        const x = Math.cos(rad) * d, y = Math.sin(rad) * d;
        return (
          <div
            key={l}
            className={`r-item${open ? " vis" : ""}`}
            style={{
              opacity: open ? 1 : 0,
              transform: open
                ? `translate(calc(${x}px - 50%), calc(${y - 20}px - 50%))`
                : "translate(-50%,-50%) scale(.5)",
              transitionDelay: open ? `${i * .045}s` : `${(2 - i) * .03}s`,
            }}
            onPointerUp={ev => { ev.stopPropagation(); if (l === "Message") onChat(); else onClose(); }}
          >
            <div className={`r-btn ${cls}`}>{e}</div>
            <span className="r-lbl">{l}</span>
          </div>
        );
      })}
    </div>
  );
}

const HomeIco = ({ on }) => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
    stroke={on ? "#e8748a" : "rgba(255,255,255,.3)"} strokeWidth="1.8">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const PersonIco = ({ on }) => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
    stroke={on ? "#e8748a" : "rgba(255,255,255,.3)"} strokeWidth="1.8">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
  </svg>
);

const DRAWER_TILES = [
  { cls:"dt-chat",    e:"💬", l:"Chat" },
  { cls:"dt-gallery", e:"📸", l:"Gallery" },
  { cls:"dt-games",   e:"🎮", l:"Games" },
  { cls:"dt-calls",   e:"📞", l:"Calls" },
  { cls:"dt-watch",   e:"🎬", l:"Watch" },
  { cls:"dt-mood",    e:"🌡", l:"Mood" },
];
const LDR_CHIPS = [
  { e:"💌", l:"Nudge" },
  { e:"🎟", l:"Tickets" },
  { e:"⏱",  l:"Countdown" },
  { e:"📓", l:"Journal" },
  { e:"🌐", l:"Date Ideas" },
];

function QuickDrawer({ open, onClose, onChat }) {
  return (
    <div className={`drawer-overlay${open ? " open" : ""}`}>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-sheet">
        <div className="drawer-pill-row" onClick={onClose}><div className="drawer-pill" /></div>
        <div className="drawer-heading">Quick <em>Access</em></div>
        <div className="d-grid">
          {DRAWER_TILES.map(({ cls, e, l }) => (
            <div key={l} className={`d-tile ${cls}`} onClick={l === "Chat" ? onChat : onClose}>
              <div className="d-ico">{e}</div>
              <span className="d-lbl">{l}</span>
            </div>
          ))}
        </div>
        <div className="d-sub-lbl">LDR Features</div>
        <div className="ldr-row">
          {LDR_CHIPS.map(({ e, l }) => (
            <div key={l} className="ldr-chip">
              <div className="ldr-ico">{e}</div>
              <span className="ldr-lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FAB — swipe-up to open, swipe-down to close, tap to toggle
function FabButton({ open, onToggle }) {
  const dragRef = useRef({ dragging: false, startY: 0 });

  const onPointerDown = (e) => {
    dragRef.current = { dragging: false, startY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const dy = dragRef.current.startY - e.clientY;
    if (dy > 12 && !open)  { dragRef.current.dragging = true; onToggle(true);  }
    if (dy < -12 && open)  { dragRef.current.dragging = true; onToggle(false); }
  };
  const onPointerUp = (e) => {
    e.stopPropagation();
    if (!dragRef.current.dragging) onToggle(!open);
    dragRef.current.dragging = false;
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      {/* Swipe-up hint dots */}
      <div style={{ display:"flex", gap:3, opacity: open ? 0 : 0.3, transition:"opacity .2s", pointerEvents:"none", marginBottom:2 }}>
        {[3,5,3].map((h,i) => (
          <div key={i} style={{ width:3, height:h, borderRadius:2, background:"rgba(255,255,255,.7)", opacity:1-i*.15 }}/>
        ))}
      </div>
      <div
        className={`nav-fab${open ? " fab-open" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ touchAction:"none" }}
      >
        <span className="fab-glyph">✦</span>
      </div>
    </div>
  );
}

function AppShell({ navigate }) {
  const [tab,    setTab]    = useState(SCREENS.HOME);
  const [fabOpen, setFab]   = useState(false);
  const [drawer,  setDrawer] = useState(false);

  const handleTab = (t) => { setTab(t); setFab(false); setDrawer(false); };
  const handleFab = (v) => { setFab(v); if (v) setDrawer(false); };
  const dimClick  = ()  => { if (fabOpen) setFab(false); };

  const shellNavigate = (s) => {
    if (s === SCREENS.DANGER_ZONE || s === SCREENS.MAIN_PROFILE || s === SCREENS.HOME || s === SCREENS.CHAT) {
      setFab(false);
      setDrawer(false);
      handleTab(s);
    } else {
      navigate(s);
    }
  };

  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", overflow:"hidden", background:"var(--deep)" }}>
      {/* Content area */}
      <div style={{ position:"relative", flex:1, overflow:"hidden", background:"#0d0511" }} onClick={dimClick}>
        {tab === SCREENS.HOME         && <HomeScreen onDrawer={() => { setDrawer(true); setFab(false); }} />}
        {tab === SCREENS.MAIN_PROFILE && <MainProfileScreen navigate={shellNavigate} />}
        {tab === SCREENS.DANGER_ZONE  && <DangerZoneScreen  navigate={shellNavigate} />}
        {tab === SCREENS.CHAT         && <ChatScreen onBack={() => handleTab(SCREENS.HOME)} />}
      </div>

      {tab !== SCREENS.CHAT && <QuickDrawer open={drawer} onClose={() => setDrawer(false)} onChat={() => { setDrawer(false); shellNavigate(SCREENS.CHAT); }} />}

      {fabOpen && tab !== SCREENS.CHAT && (
        <div onClick={() => setFab(false)} style={{ position:"absolute", inset:0, zIndex:19, background:"rgba(0,0,0,.48)", backdropFilter:"blur(2px)" }} />
      )}

      {/* Bottom nav — hidden on full-screen screens like Chat */}
      <nav className="shell-nav" style={{ display: tab === SCREENS.CHAT ? "none" : undefined }}>
        <div className={`nav-tab${tab === SCREENS.HOME ? " active" : ""}`} onClick={() => handleTab(SCREENS.HOME)}>
          <div className="nav-tab-ico"><HomeIco on={tab === SCREENS.HOME} /></div>
          <span className="nav-tab-lbl">Home</span>
          <div className="nav-pip" />
        </div>

        <div className="nav-fab-col">
          <RadialItems open={fabOpen} onClose={() => setFab(false)} onChat={() => { setFab(false); shellNavigate(SCREENS.CHAT); }} />
          <FabButton open={fabOpen} onToggle={handleFab} />
        </div>

        <div className={`nav-tab${tab === SCREENS.MAIN_PROFILE ? " active" : ""}`} onClick={() => handleTab(SCREENS.MAIN_PROFILE)}>
          <div className="nav-tab-ico"><PersonIco on={tab === SCREENS.MAIN_PROFILE} /></div>
          <span className="nav-tab-lbl">Profile</span>
          <div className="nav-pip" />
        </div>
      </nav>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen,        setScreen]        = useState(SCREENS.METHOD);
  const [yourAvatar,    setYourAvatar]    = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const navigate    = (s) => setScreen(s);
  const sharedProps = { navigate, yourAvatar, setYourAvatar };

  const isShell = screen === SCREENS.HOME || screen === SCREENS.MAIN_PROFILE || screen === SCREENS.DANGER_ZONE || screen === SCREENS.CHAT;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", width:"100vw", height:"100vh", overflow:"hidden", background:"var(--velvet)", fontFamily:"'DM Sans', sans-serif" }}>
        {/* Auth flow */}
        {screen === SCREENS.METHOD       && <SignInScreen           {...sharedProps} />}
        {screen === SCREENS.REGISTER     && <RegisterScreen         {...sharedProps} />}
        {screen === SCREENS.PASSWORD     && <PasswordScreen         {...sharedProps} />}
        {screen === SCREENS.AVATAR       && (
          <AvatarUploadScreen {...sharedProps} previewAvatar={previewAvatar} setPreviewAvatar={setPreviewAvatar} />
        )}
        {screen === SCREENS.PAIRING      && <PairingScreen          {...sharedProps} />}
        {screen === SCREENS.PAIR_SUCCESS && <PairSuccessScreen      {...sharedProps} />}
        {screen === SCREENS.PAIR_BLOCKED && <PairBlockedScreen      {...sharedProps} />}
        {screen === SCREENS.UNPAIR       && <UnpairScreen           {...sharedProps} />}
        {screen === SCREENS.PROFILE      && <ProfileSettingsScreen  {...sharedProps} />}
        {screen === SCREENS.PIN_SETUP    && <PinSetupScreen         navigate={navigate} />}

        {/* Home shell */}
        {isShell && <AppShell navigate={navigate} />}
      </div>
    </>
  );
}
