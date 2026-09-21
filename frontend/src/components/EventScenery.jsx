import {useEffect, useState} from "react";
import {EVENT_THEME_EVENT} from "../theme/eventThemes.js";

// ---- Shared particle helpers (deterministic positions) ----

const STARS = Array.from({length: 18}, (_, i) => ({
  x: 3 + ((i * 5.3) % 94),
  y: 5 + ((i * 12.9) % 44),
  s: 2 + (i % 3),
  d: (0.2 + ((i * 0.47) % 1)).toFixed(2) + "s",
}));

const LANTERNS = [
  {x: 8, sl: 34, d: "0s"},
  {x: 47, sl: 48, d: "1.2s"},
  {x: 83, sl: 28, d: "2.3s"},
];

const MOSQUES = [
  {x: 5, w: 230, h: 118, o: 0.95},
  {x: 66, w: 175, h: 86, o: 0.65},
];

const PENNANT_COLORS = ["#f59e0b", "#84cc16", "#22c55e", "#eab308", "#a3e635", "#fbbf24"];
const PENNANTS = Array.from({length: 11}, (_, i) => ({
  x: 2 + i * 9.1,
  c: PENNANT_COLORS[i % PENNANT_COLORS.length],
  d: ((i % 5) * 0.35).toFixed(2) + "s",
}));

const GOLD_STARS = Array.from({length: 12}, (_, i) => ({
  x: 8 + ((i * 7.7) % 84),
  y: 6 + ((i * 11.3) % 40),
  d: (0.4 + ((i * 0.61) % 1)).toFixed(2) + "s",
  big: i % 3 === 0,
}));

const EGGS = [
  {x: 9, y: 3, s: 26, c: "#f9a8d4", d: "0s", k: 2.2},
  {x: 21, y: 6, s: 20, c: "#a7f3d0", d: "0.5s", k: 2.6},
  {x: 32, y: 4, s: 30, c: "#fde68a", d: "0.9s", k: 2.4},
  {x: 46, y: 9, s: 23, c: "#bbf7d0", d: "1.4s", k: 2.8},
  {x: 58, y: 5, s: 22, c: "#c4b5fd", d: "0.3s", k: 2.7},
  {x: 70, y: 3, s: 28, c: "#fecdd3", d: "1.1s", k: 2.3},
  {x: 82, y: 7, s: 20, c: "#bfdbfe", d: "0.7s", k: 2.5},
];

const PETALS = Array.from({length: 8}, (_, i) => ({
  x: 6 + ((i * 12) % 88),
  c: ["#f9a8d4", "#fde68a", "#c4b5fd", "#fecdd3"][i % 4],
  s: 5 + (i % 3) * 2,
  d: ((i * 0.55) % 4).toFixed(2) + "s",
  dur: (5 + (i % 3) * 1.6).toFixed(1) + "s",
  sway: i % 2 ? 42 : -50,
}));

const SNOW = Array.from({length: 26}, (_, i) => ({
  x: 2 + ((i * 3.8) % 96),
  s: 2 + (i % 4),
  d: ((i * 0.9) % 6).toFixed(2) + "s",
  dur: (7 + (i % 5) * 2.2).toFixed(1) + "s",
  sway: i % 2 ? 60 : -50,
}));

const BAUBLES = [
  {x: 76, d: "0s", c: "#dc2626", s: 22},
  {x: 84, d: "0.9s", c: "#f59e0b", s: 16},
  {x: 91, d: "1.8s", c: "#dc2626", s: 19},
];

const FW_COLORS = ["#fbbf24", "#f87171", "#f9a8d4", "#fde047", "#ffffff", "#60a5fa"];
const FIREWORKS = [
  {x: 20, y: 26, d: "0.4s"},
  {x: 78, y: 20, d: "1.7s"},
  {x: 50, y: 40, d: "2.9s"},
  {x: 32, y: 58, d: "4.1s"},
];

const CONFETTI = Array.from({length: 16}, (_, i) => ({
  x: 3 + ((i * 6.3) % 93),
  c: ["#fbbf24", "#f87171", "#60a5fa", "#34d399", "#a78bfa", "#fde047"][i % 6],
  d: ((i * 0.8) % 5).toFixed(2) + "s",
  dur: (4 + (i % 4) * 1.5).toFixed(1) + "s",
  sway: i % 2 ? 58 : -42,
  spin: i % 2 ? 360 : -320,
}));

const PITCH_CONFETTI = Array.from({length: 9}, (_, i) => ({
  x: 6 + ((i * 10) % 86),
  c: ["#34d399", "#fbbf24", "#60a5fa"][i % 3],
  d: ((i * 0.9) % 5).toFixed(2) + "s",
  dur: (4.5 + (i % 4) * 1.3).toFixed(1) + "s",
  sway: i % 2 ? 40 : -38,
  spin: i % 2 ? 320 : -300,
}));

// ---- Scenes ----

function RamadanScene() {
  return (
    <>
      <div className="sc-moon" />
      <div className="sc-moon-halo" />
      {STARS.map((s, i) => (
        <span key={i} className="sc-star" style={{left: s.x + "%", top: s.y + "%", width: s.s + "px", height: s.s + "px", animationDelay: s.d}} />
      ))}
      {LANTERNS.map((l, i) => (
        <div key={i} className="sc-lantern" style={{left: l.x + "%", animationDelay: l.d}}>
          <div className="sc-l-string" style={{"--slen": l.sl + "px"}} />
          <div className="sc-l-tip" />
          <div className="sc-l-body" />
          <div className="sc-l-base" />
        </div>
      ))}
      {MOSQUES.map((m, i) => (
        <div key={i} className="sc-mosque" style={{left: m.x + "%", width: m.w, height: m.h, opacity: m.o}}>
          <div className="sc-m-base" />
          <div className="sc-m-minaret" style={{left: "13%", height: "78%"}} />
          <div className="sc-m-minaret" style={{right: "6%", height: "92%"}} />
          <div className="sc-m-dome" />
        </div>
      ))}
    </>
  );
}

function EidScene() {
  return (
    <>
      <div className="sc-moon sc-moon-sm" />
      {GOLD_STARS.map((s, i) => (
        <span key={i} className="sc-star sc-star-gold" style={{left: s.x + "%", top: s.y + "%", width: s.big ? 4 : 3, height: s.big ? 4 : 3, animationDelay: s.d}} />
      ))}
      <div className="sc-bunting-line" />
      {PENNANTS.map((p, i) => (
        <span key={i} className="sc-pennant" style={{left: p.x + "%", borderTopColor: p.c, animationDelay: p.d}} />
      ))}
      {CONFETTI.slice(0, 8).map((c, i) => (
        <span key={i} className="sc-confetti" style={{left: c.x + "%", background: c.c, animationDelay: c.d, animationDuration: c.dur, "--sway": c.sway + "px", "--spin": c.spin + "deg"}} />
      ))}
    </>
  );
}

function EasterScene() {
  return (
    <>
      {EGGS.map((e, i) => (
        <span key={i} className="sc-egg" style={{left: e.x + "%", bottom: e.y + "vh", width: e.s, height: e.s * 1.32, background: e.c, animationDelay: e.d, animationDuration: e.k + "s"}} />
      ))}
      {PETALS.map((p, i) => (
        <span key={i} className="sc-petal" style={{left: p.x + "%", width: p.s, height: p.s, background: p.c, animationDelay: p.d, animationDuration: p.dur, "--sway": p.sway + "px"}} />
      ))}
    </>
  );
}

function ChristmasScene() {
  return (
    <>
      {SNOW.map((s, i) => (
        <span key={i} className="sc-snow" style={{left: s.x + "%", width: s.s + "px", height: s.s + "px", animationDelay: s.d, animationDuration: s.dur, "--sway": s.sway + "px"}} />
      ))}
      {BAUBLES.map((b, i) => (
        <div key={i} className="sc-bauble" style={{left: b.x + "%", background: b.c, width: b.s, height: b.s, animationDelay: b.d}} />
      ))}
    </>
  );
}

function NewYearScene() {
  return (
    <>
      <span className="sc-yr">2026</span>
      {FIREWORKS.map((f, i) => (
        <div key={i} className="sc-firework" style={{left: f.x + "%", top: f.y + "%", animationDelay: f.d}}>
          {Array.from({length: 12}, (_, p) => (
            <span key={p} className="sc-fw-p" style={{"--i": p * 30, "--fw-c": FW_COLORS[(i + p) % FW_COLORS.length], animationDelay: f.d}} />
          ))}
        </div>
      ))}
      {CONFETTI.map((c, i) => (
        <span key={i} className="sc-confetti" style={{left: c.x + "%", background: c.c, animationDelay: c.d, animationDuration: c.dur, "--sway": c.sway + "px", "--spin": c.spin + "deg"}} />
      ))}
    </>
  );
}

function WorldCupScene() {
  return (
    <>
      <div className="sc-pitch" />
      <div className="sc-ball">
        <div className="sc-ball-in" style={{bottom: "26vh"}} />
      </div>
      <div className="sc-beam sc-beam-a" />
      <div className="sc-beam sc-beam-b" />
      {PITCH_CONFETTI.map((c, i) => (
        <span key={i} className="sc-confetti" style={{left: c.x + "%", background: c.c, animationDelay: c.d, animationDuration: c.dur, "--sway": c.sway + "px", "--spin": c.spin + "deg"}} />
      ))}
    </>
  );
}

const SCENES = {
  ramadan: <RamadanScene />,
  eid: <EidScene />,
  easter: <EasterScene />,
  christmas: <ChristmasScene />,
  newyear: <NewYearScene />,
  worldcup: <WorldCupScene />,
};

function EventScenery() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.event || "default");

  useEffect(() => {
    setTheme(document.documentElement.dataset.event || "default");
    const onChange = (e) => setTheme(e.detail || "default");
    window.addEventListener(EVENT_THEME_EVENT, onChange);
    return () => window.removeEventListener(EVENT_THEME_EVENT, onChange);
  }, []);

  if (!SCENES[theme]) return null;

  return (
    <div className="event-scenery" aria-hidden="true">
      <div className="sc-sky" />
      {SCENES[theme]}
    </div>
  );
}

export default EventScenery;