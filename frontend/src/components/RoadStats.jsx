import React, { useEffect, useState } from "react";
import stats from "../data/stats.json";
import useCountUp from "../hooks/useCountUp";
import useInView from "../hooks/useInView";
import "../styles/road-stats.css";

function formatNumber(n) {
  return n.toLocaleString("th-TH");
}

/** ตัวเลขวิ่งของสถิติรวมด้านบน */
function HeadlineCounter({ value, countFrom, suffix, baseline, active }) {
  const [current, done] = useCountUp(value, active, 2400, countFrom);
  return (
    <p className="road-stats-headline-value">
      <span
        className={`road-stats-headline-number${done ? " is-count-done" : ""}`}
      >
        {formatNumber(current)}
      </span>
      <span className="road-stats-headline-suffix">{suffix}</span>
      {baseline && (
        <span className="road-stats-headline-baseline">{baseline}</span>
      )}
    </p>
  );
}

/**
 * การ์ดเทียบก่อน/หลัง — ใช้ countFrom เป็นฐานปี 2562 และ value เป็นผลปีล่าสุด
 * แถบด้านล่างยาวตามสัดส่วนของตัวเลขจริง ไม่ใช่ค่าที่ hardcode ไว้
 */
function ComparePair({ headline, active }) {
  const { countFrom, value, suffix } = headline;
  const [after, afterDone] = useCountUp(value, active, 2400, countFrom);
  const ratio = countFrom > 0 ? value / countFrom : 1;
  const drop = countFrom > 0 ? (1 - ratio) * 100 : 0;

  return (
    <div className="road-compare">
      <div className="road-compare-card road-compare-before">
        <p className="road-compare-era">ปี 2562 — ก่อนโครงการเข้าพื้นที่</p>
        <p className="road-compare-value">
          {formatNumber(countFrom)}
          <small>{suffix}</small>
        </p>
        <div className="road-compare-bar">
          <span className="road-compare-fill is-before" />
        </div>
      </div>

      <div className="road-compare-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      </div>

      <div className="road-compare-card road-compare-after">
        <p className="road-compare-era">ปี 2569 — หลังโครงการเข้าพื้นที่</p>
        <p className={`road-compare-value${afterDone ? " is-count-done" : ""}`}>
          {formatNumber(after)}
          <small>{suffix}</small>
        </p>
        <div className="road-compare-bar">
          {/* ส่งเฉพาะ "ค่า" ผ่าน custom property — การตกแต่งทั้งหมดยังอยู่ใน CSS */}
          <span
            className="road-compare-fill is-after"
            style={{ "--compare-ratio": active ? ratio : 1 }}
          />
        </div>
        <p className="road-compare-drop">ลดลง {drop.toFixed(1)}%</p>
      </div>
    </div>
  );
}

/** Pop-up สถิติของแต่ละจุดบนถนน (นับเลขใหม่ทุกครั้งที่เปิด) */
function HotspotPopup({ item, onClose }) {
  const [current, done] = useCountUp(item.value, true, 1800, item.countFrom);

  return (
    <div className="road-popup" role="dialog" aria-label={item.title}>
      <button
        type="button"
        className="road-popup-close"
        onClick={onClose}
        aria-label="ปิดข้อมูลสถิติ"
      >
        &times;
      </button>
      <p className="road-popup-unit">{item.unit}</p>
      <p className={`road-popup-value${done ? " is-count-done" : ""}`}>
        {formatNumber(current)}
        <span className="road-popup-suffix">{item.suffix}</span>
      </p>
      {item.baseline && <p className="road-popup-baseline">{item.baseline}</p>}
      <h3 className="road-popup-title">{item.title}</h3>
      <p className="road-popup-desc">{item.description}</p>
    </div>
  );
}

export default function RoadStats() {
  const [sectionRef, inView] = useInView({ threshold: 0.3 });
  const [activeId, setActiveId] = useState(null);
  const [canHover, setCanHover] = useState(false);
  const { headline, hotspots } = stats;

  // อุปกรณ์ที่ไม่มีเมาส์ (มือถือ/แท็บเล็ต) ใช้การแตะแทนการชี้
  // ถ้าผูก mouseenter ไว้ด้วย การแตะจะสั่งเปิดแล้วปิดทันที
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  function toggle(id) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  const hoverProps = (id) =>
    canHover
      ? {
          onMouseEnter: () => setActiveId(id),
          onMouseLeave: () => setActiveId(null),
        }
      : {};

  return (
    <section className="section road-stats" ref={sectionRef} id="stats">
      <div className="container">
        <div className="section-head section-head-center">
          <span className="section-eyebrow">Safety Impact</span>
          <p className="road-stats-headline-label">{headline.label}</p>
          <HeadlineCounter
            value={headline.value}
            countFrom={headline.countFrom}
            suffix={headline.suffix}
            baseline={headline.baseline}
            active={inView}
          />
          <p className="road-stats-headline-note">{headline.note}</p>
        </div>

        <ComparePair headline={headline} active={inView} />

        <p className="road-stats-cue">
          <span className="road-stats-cue-dot" aria-hidden="true" />
          ชี้เมาส์ (หรือแตะบนมือถือ) ที่จุดบนถนน เพื่อดูสถิติแต่ละด้าน
        </p>

        <div className="road-map">
          {/* กราฟิกถนนแบบ vector — ปรับขนาดตามหน้าจอได้ไม่เสียสัดส่วน */}
          <svg
            className="road-map-svg"
            viewBox="0 0 1000 460"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label="ภาพประกอบถนนพร้อมจุดแสดงสถิติความปลอดภัย"
          >
            <defs>
              <linearGradient id="road-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f7f7f7" />
                <stop offset="100%" stopColor="#e9e9e9" />
              </linearGradient>
            </defs>

            <rect width="1000" height="460" fill="url(#road-sky)" />

            {/* เนินหญ้า */}
            <path d="M0 300 Q 250 250 520 300 T 1000 292 V460 H0 Z" fill="#e2e6e2" />

            {/* ผิวถนน */}
            <path
              d="M-40 420 C 220 360 320 300 520 292 C 720 284 840 250 1040 214 L1040 300 C 850 330 720 356 520 366 C 330 376 220 420 -40 470 Z"
              fill="#3f4448"
            />
            {/* เส้นขอบถนน */}
            <path
              d="M-40 424 C 220 364 320 304 520 296 C 720 288 840 254 1040 218"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              opacity="0.85"
            />
            <path
              d="M-40 466 C 220 416 330 372 520 362 C 720 352 850 326 1040 296"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              opacity="0.85"
            />
            {/* เส้นแบ่งเลนประ */}
            <path
              d="M-40 445 C 220 390 325 338 520 329 C 715 320 845 290 1040 257"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeDasharray="26 26"
              opacity="0.9"
            />

            {/* ทางม้าลาย */}
            <g opacity="0.95" fill="#ffffff">
              <rect x="352" y="316" width="10" height="42" rx="2" transform="rotate(-14 352 316)" />
              <rect x="372" y="313" width="10" height="42" rx="2" transform="rotate(-14 372 313)" />
              <rect x="392" y="310" width="10" height="42" rx="2" transform="rotate(-14 392 310)" />
              <rect x="412" y="307" width="10" height="42" rx="2" transform="rotate(-14 412 307)" />
            </g>
          </svg>

          {/* จุด hotspot — ตำแหน่งกำหนดใน road-stats.css ตาม id */}
          <ul className="road-hotspots">
            {hotspots.map((item) => (
              <li
                key={item.id}
                className={`road-hotspot road-hotspot-${item.id}${
                  activeId === item.id ? " is-active" : ""
                }`}
                {...hoverProps(item.id)}
              >
                <button
                  type="button"
                  className="road-hotspot-btn"
                  aria-expanded={activeId === item.id}
                  aria-label={`ดูสถิติ ${item.title}`}
                  onClick={() => toggle(item.id)}
                >
                  <span className="road-hotspot-pulse" aria-hidden="true" />
                  <span className="road-hotspot-label">{item.title}</span>
                </button>

                {activeId === item.id && (
                  <HotspotPopup
                    key={item.id}
                    item={item}
                    onClose={() => setActiveId(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* สรุปตัวเลขทุกจุด — สำรองสำหรับหน้าจอเล็กและผู้ใช้ที่ไม่ได้โต้ตอบ */}
        <ul className="road-stats-summary">
          {hotspots.map((item) => (
            <li key={item.id} className="road-stats-summary-item">
              <SummaryValue
                value={item.value}
                countFrom={item.countFrom}
                suffix={item.suffix}
                active={inView}
              />
              <span className="road-stats-summary-title">{item.title}</span>
              {item.baseline && (
                <span className="road-stats-summary-baseline">{item.baseline}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SummaryValue({ value, countFrom, suffix, active }) {
  const [current, done] = useCountUp(value, active, 2200, countFrom);
  return (
    <span className={`road-stats-summary-value${done ? " is-count-done" : ""}`}>
      {formatNumber(current)}
      <small>{suffix}</small>
    </span>
  );
}
