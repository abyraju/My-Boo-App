// screens/HomeScreen.jsx
import { useState, useEffect } from "react";

// ── Couple start date (replace with real couple.created_at from DB) ──────────
const COUPLE_START = new Date("2025-07-07T00:00:00");

// ── Helpers ──────────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function calcDuration(now) {
  let y  = now.getFullYear() - COUPLE_START.getFullYear();
  let mo = now.getMonth()    - COUPLE_START.getMonth();
  let d  = now.getDate()     - COUPLE_START.getDate();

  if (d  < 0) { mo--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
  if (mo < 0) { y--;  mo += 12; }

  const totalSecs = Math.floor((now - COUPLE_START) / 1000);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600)  / 60);
  const s = totalSecs % 60;

  return { y, mo, d, h, m, s };
}

function pad(n) { return String(n).padStart(2, "0"); }

function todayFull() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
  /* ── Home screen ── */
  .home-bg {
    min-height: 100%;
    background: radial-gradient(ellipse 120% 52% at 50% -5%, #360e4c, #0d0511 56%);
    display: flex;
    flex-direction: column;
  }

  /* Top header */
  .home-header {
    padding: 14px 20px 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .hdr-left { display: flex; flex-direction: column; gap: 4px; }
  .hdr-greeting {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 300; font-style: italic;
    color: rgba(255,255,255,.82);
  }
  .hdr-online { display: flex; align-items: center; gap: 6px; }
  .hdr-online-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #5ef5a0; flex-shrink: 0;
    animation: hs-blink 2.2s ease-in-out infinite;
  }
  @keyframes hs-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
  .hdr-online-text { font-size: 11.5px; color: rgba(255,255,255,.38); }
  .hdr-online-text strong { color: rgba(94,245,160,.82); font-weight: 500; }

  /* Avatar pair */
  .hdr-avatars { display: flex; align-items: center; }
  .hdr-av {
    width: 42px; height: 42px; border-radius: 50%;
    border: 2.5px solid #0d0511;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 600; color: #fff;
    position: relative; flex-shrink: 0;
  }
  .hdr-av-you  { background: linear-gradient(135deg, #e8748a, #9b3a6e); z-index: 2; }
  .hdr-av-them { background: linear-gradient(135deg, #7eb8f5, #3a6eb4); margin-left: -11px; z-index: 1; }
  .hdr-av-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 9px; height: 9px; border-radius: 50%;
    background: #5ef5a0; border: 2px solid #0d0511;
  }

  /* Couple card */
  .couple-card {
    margin: 14px 16px 0;
    background: linear-gradient(150deg, rgba(107,58,110,.28) 0%, rgba(36,8,52,.5) 100%);
    border: 1px solid rgba(232,116,138,.16);
    border-radius: 28px; padding: 20px 20px 18px;
    position: relative; overflow: hidden; cursor: pointer;
    transition: border-color .2s;
  }
  .couple-card:active { border-color: rgba(232,116,138,.32); }
  .couple-card::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 90% 65% at 50% -15%, rgba(232,116,138,.1), transparent 55%);
  }

  .couple-center {
    display: flex; flex-direction: column; align-items: center;
    position: relative; z-index: 1;
  }

  .couple-heart {
    font-size: 22px; color: #e8748a; margin-bottom: 10px;
    filter: drop-shadow(0 0 12px rgba(232,116,138,.6));
    animation: hs-hb 2.8s ease-in-out infinite;
  }
  @keyframes hs-hb {
    0%,100%{transform:scale(1)}   14%{transform:scale(1.22)}
    28%{transform:scale(1)}       42%{transform:scale(1.12)}
    56%{transform:scale(1)}
  }

  /* Y · M · D row */
  .ymd-row {
    display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px;
  }
  .ymd-block { display: flex; flex-direction: column; align-items: center; }
  .ymd-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px; font-weight: 300; line-height: 1; color: #fff;
    font-variant-numeric: tabular-nums;
  }
  .ymd-num em { font-style: italic; color: #f5a8b8; }
  .ymd-unit {
    font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,.28); margin-top: 1px;
  }
  .ymd-sep {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 300; color: rgba(232,116,138,.3);
    align-self: flex-start; padding-top: 6px;
  }

  /* H : M : S row */
  .hms-row {
    display: flex; align-items: baseline; gap: 4px; margin-bottom: 14px;
  }
  .hms-block { display: flex; flex-direction: column; align-items: center; }
  .hms-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; line-height: 1;
    color: rgba(255,255,255,.45);
    font-variant-numeric: tabular-nums;
  }
  .hms-unit {
    font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,.2); margin-top: 1px;
  }
  .hms-sep {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; color: rgba(255,255,255,.18); padding-bottom: 2px;
  }

  .hs-milestone-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(201,169,110,.1); border: 1px solid rgba(201,169,110,.22);
    border-radius: 20px; padding: 5px 14px;
    font-size: 11.5px; color: #c9a96e; font-weight: 500;
    margin-bottom: 12px;
  }

  .couple-names { display: flex; align-items: center; gap: 9px; margin-bottom: 14px; }
  .cname { font-size: 12px; font-weight: 500; color: rgba(255,255,255,.36); }
  .camp  { font-size: 14px; color: rgba(232,116,138,.4); }

  .couple-date-bottom {
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,.07);
    padding-top: 12px; text-align: center;
    font-size: 11px; letter-spacing: 1.8px; text-transform: uppercase;
    color: rgba(255,255,255,.2);
  }

  /* Highlight card */
  .hs-section-lbl {
    margin: 20px 20px 10px;
    font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,.18);
    display: flex; align-items: center; gap: 8px;
  }
  .hs-section-lbl::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.055);
  }
  .hs-cal-btn {
    width: 28px; height: 28px; border-radius: 9px; flex-shrink: 0;
    background: rgba(232,116,138,.1); border: 1px solid rgba(232,116,138,.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer; transition: background .16s, transform .12s;
    -webkit-tap-highlight-color: transparent;
  }
  .hs-cal-btn:active { background: rgba(232,116,138,.22); transform: scale(.9); }
  .hi-card {
    margin: 0 16px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 16px;
    display: flex; gap: 12px; align-items: flex-start;
    position: relative; overflow: hidden;
  }
  .hi-card::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 55% 80% at 0% 50%, rgba(232,116,138,.05), transparent);
  }
  .hi-ico {
    width: 42px; height: 42px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    background: rgba(232,116,138,.09); border: 1px solid rgba(232,116,138,.16);
    position: relative; z-index: 1;
  }
  .hi-body { flex: 1; position: relative; z-index: 1; }
  .hi-title { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 4px; }
  .hi-sub   { font-size: 12px; color: rgba(255,255,255,.42); line-height: 1.55; }

  /* Swipe hint */
  .swipe-hint {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding-bottom: 18px; gap: 7px;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .swipe-pill {
    width: 36px; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,.16);
    transition: background .18s;
  }
  .swipe-hint:active .swipe-pill { background: rgba(232,116,138,.5); }
  .swipe-lbl {
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,.22); font-weight: 500;
    transition: color .18s;
  }
  .swipe-hint:active .swipe-lbl { color: rgba(232,116,138,.6); }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomeScreen({ onDrawer }) {
  const now             = useClock();
  const { y, mo, d, h, m, s } = calcDuration(now);

  // Build YMD blocks — only include units with value > 0
  // Rule: always show at least one unit (days) even if all are 0
  const ymdBlocks = [];
  if (y  > 0) ymdBlocks.push({ num: pad(y),  unit: y  === 1 ? "Year"  : "Years"  });
  if (mo > 0) ymdBlocks.push({ num: pad(mo), unit: mo === 1 ? "Month" : "Months" });
  // Always show days (it's the smallest unit; covers day 0 on the first day together)
  if (d > 0 || ymdBlocks.length === 0) {
    ymdBlocks.push({ num: pad(d), unit: d === 1 ? "Day" : "Days" });
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="screen" style={{ background: "#0d0511", overflowY: "auto" }}>
      <div className="home-bg">

        {/* Top header */}
        <div className="home-header">
          <div className="hdr-left">
            <span className="hdr-greeting">Good morning, Alex 🌸</span>
          </div>
          <div className="hdr-avatars">
            <div className="hdr-av hdr-av-you">A</div>
            <div className="hdr-av hdr-av-them" style={{ position:"relative" }}>
              J
              {/* Partner status dot — 💚 online (synced from partner's device in production) */}
              <div style={{
                position:"absolute", bottom:-1, right:-1,
                width:14, height:14, borderRadius:"50%",
                background:"#0d0511", border:"1.5px solid #0d0511",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5ef5a0" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3.5" fill="#5ef5a0" stroke="none"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Couple card */}
        <div className="couple-card">
          <div className="couple-center">
            <div className="couple-heart">♥</div>

            {/* Years · Months · Days — only non-zero units */}
            <div className="ymd-row">
              {ymdBlocks.map((blk, i) => (
                <div key={blk.unit} style={{ display: "contents" }}>
                  {i > 0 && <div className="ymd-sep">·</div>}
                  <div className="ymd-block">
                    <div className="ymd-num"><em>{blk.num}</em></div>
                    <div className="ymd-unit">{blk.unit}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours : Mins : Secs */}
            <div className="hms-row">
              <div className="hms-block">
                <div className="hms-num">{pad(h)}</div>
                <div className="hms-unit">Hrs</div>
              </div>
              <div className="hms-sep">:</div>
              <div className="hms-block">
                <div className="hms-num">{pad(m)}</div>
                <div className="hms-unit">Mins</div>
              </div>
              <div className="hms-sep">:</div>
              <div className="hms-block">
                <div className="hms-num">{pad(s)}</div>
                <div className="hms-unit">Secs</div>
              </div>
            </div>

            <div className="hs-milestone-pill">🎯 8 months · in 6 days ›</div>
            <div className="couple-names">
              <span className="cname">Alex</span>
              <span className="camp">♥</span>
              <span className="cname">Jordan</span>
            </div>
          </div>

          {/* Date — bottom of card */}
          <div className="couple-date-bottom">{todayFull()}</div>
        </div>

        {/* Events section label + calendar shortcut */}
        <div className="hs-section-lbl">
          Events
          {/* Calendar button — will open shared calendar in a later phase */}
          <div
            className="hs-cal-btn"
            title="Calendar (coming soon)"
            onClick={() => {/* TODO: navigate to SCREENS.CALENDAR */}}
          >
            📅
          </div>
        </div>
        <div className="hi-card">
          <div className="hi-ico">📅</div>
          <div className="hi-body">
            <div className="hi-title">8-month milestone — in 6 days</div>
            <div className="hi-sub">Plan something special for Jordan 💕</div>
          </div>
        </div>

        {/* Swipe-up hint */}
        <div className="swipe-hint" onClick={onDrawer}>
          <div className="swipe-pill" />
          <span className="swipe-lbl">Swipe up · features</span>
        </div>
      </div>
      </div>
    </>
  );
}
