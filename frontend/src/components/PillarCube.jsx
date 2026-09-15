import React from "react";
import "../styles/pillar-cube.css";

/** ไอคอนประจำเสาหลักแต่ละข้อ — inline SVG แบบเส้น (stroke ใช้ currentColor) */
const ICONS = {
  "people-safe": (
    <>
      <circle cx="12" cy="6" r="3" />
      <path d="M6 21v-5a6 6 0 0112 0v5" />
      <path d="M9.5 16.5l1.8 1.8 3.4-3.6" />
    </>
  ),
  "car-safe": (
    <>
      <path d="M3 16v-3.5l2-5A2 2 0 016.9 6h10.2a2 2 0 011.9 1.5l2 5V16" />
      <path d="M2 16h20v2H2z" />
      <path d="M5 12.5h14" />
      <circle cx="7" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </>
  ),
  "road-safe": (
    <>
      <path d="M8 3L4 21" />
      <path d="M16 3l4 18" />
      <path d="M12 4v2.5M12 10.5v3M12 17.5V20" />
    </>
  ),
};

/*
 * ลูกบาศก์มีหน้าคู่ตรงข้าม 3 คู่ — จับคู่ละหนึ่งเสาหลัก
 * ด้านหลัก (front / right / top) = ไอคอน + ชื่อไทย, ด้านตรงข้าม = ชื่ออังกฤษ
 * การหมุนไปยังแต่ละด้านอยู่ใน pillar-cube.css (.pillar-cube-show-*)
 */
const FACE_PAIRS = [
  ["front", "back"],
  ["right", "left"],
  ["top", "bottom"],
];

/**
 * ลูกบาศก์ 3 มิติ "คนเซฟ / รถเซฟ / ถนนเซฟ"
 * หมุนไปยังหน้าของเสาหลักที่ active (ควบคุมจาก parent)
 */
export default function PillarCube({ pillars, activeIndex }) {
  const faces = pillars.slice(0, FACE_PAIRS.length);
  const active = faces[activeIndex] || faces[0];
  const showClass = FACE_PAIRS[activeIndex]
    ? FACE_PAIRS[activeIndex][0]
    : FACE_PAIRS[0][0];

  return (
    <div className="pillar-cube-scene">
      <div
        className={`pillar-cube pillar-cube-show-${showClass}`}
        aria-hidden="true"
      >
        {faces.map((item, i) => {
          const [main, opposite] = FACE_PAIRS[i];
          return (
            <React.Fragment key={item.id}>
              <div className={`pillar-cube-face pillar-cube-face-${main}`}>
                <svg
                  className="pillar-cube-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  focusable="false"
                >
                  {ICONS[item.id]}
                </svg>
                <span className="pillar-cube-label">{item.title}</span>
              </div>
              <div
                className={`pillar-cube-face pillar-cube-face-alt pillar-cube-face-${opposite}`}
              >
                <span className="pillar-cube-label-alt">{item.subtitle}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ข้อความสำหรับ screen reader แทนลูกบาศก์ที่ซ่อนไว้ */}
      <p className="visually-hidden" aria-live="polite">
        {active ? `${active.title} (${active.subtitle})` : ""}
      </p>
    </div>
  );
}
