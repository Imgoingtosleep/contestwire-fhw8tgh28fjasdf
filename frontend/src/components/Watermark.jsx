import React, { useMemo } from "react";
import "../styles/watermark.css";

/**
 * คอมโพเนนต์แสดงลายน้ำ (Watermark) กระจายทั่วทั้งหน้าจอ
 * - pointer-events: none เพื่อไม่ขัดขวางการคลิกหรือการใช้งานหน้าเว็บ
 * - aria-hidden="true" เพื่อไม่รบกวน screen reader
 */
export default function Watermark({ text = "DEMO VERSION" }) {
  const bgImage = useMemo(() => {
    // ลายน้ำเฉียงซ้ำแบบ staggered (สับหว่าง) เพื่อความเป็นระเบียบสวยงาม
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
        <text x="90" y="60" text-anchor="middle" dominant-baseline="middle" transform="rotate(-25 90 60)" fill="rgba(0, 0, 0, 0.08)" font-size="19" font-family="system-ui, -apple-system, 'Prompt', 'Helvetica Neue', Arial, sans-serif" font-weight="700" letter-spacing="3">${text}</text>
        <text x="270" y="180" text-anchor="middle" dominant-baseline="middle" transform="rotate(-25 270 180)" fill="rgba(0, 0, 0, 0.08)" font-size="19" font-family="system-ui, -apple-system, 'Prompt', 'Helvetica Neue', Arial, sans-serif" font-weight="700" letter-spacing="3">${text}</text>
      </svg>
    `.trim();
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [text]);

  return (
    <div
      className="watermark-overlay"
      style={{ backgroundImage: bgImage }}
      aria-hidden="true"
    />
  );
}
