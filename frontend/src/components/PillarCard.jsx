import React from "react";
import "../styles/pillar-card.css";

/**
 * การ์ดแนวทางการดำเนินงาน (คนเซฟ / รถเซฟ / ถนนเซฟ)
 * ถ้าส่ง onActivate มา การ์ดจะโต้ตอบได้ (hover / focus / click) — ใช้คู่กับ PillarCube หน้าแรก
 */
export default function PillarCard({ item, isActive = false, onActivate }) {
  const interactive = typeof onActivate === "function";
  const classes = [
    "pillar-card",
    "cream-card",
    interactive ? "pillar-card-interactive" : "",
    isActive ? "is-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handlers = interactive
    ? {
        tabIndex: 0,
        onMouseEnter: onActivate,
        onFocus: onActivate,
        onClick: onActivate,
      }
    : {};

  return (
    <article className={classes} {...handlers}>
      <div className="pillar-card-body">
        <h3 className="pillar-card-title">{item.title}</h3>
        <p className="pillar-card-subtitle">{item.subtitle}</p>
        <p className="pillar-card-description">{item.description}</p>
      </div>
    </article>
  );
}
