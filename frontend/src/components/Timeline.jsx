import React from "react";
import "../styles/timeline.css";

/**
 * ไทม์ไลน์กำหนดการ — แนวนอนบน desktop / แนวตั้งบนมือถือ
 * ทำเครื่องหมายขั้นที่ผ่านมาแล้วจาก isoDate เทียบกับวันปัจจุบัน
 */
export default function Timeline({ items }) {
  const now = Date.now();

  let activeIndex = items.findIndex((item) => {
    const end = new Date(item.isoDate);
    end.setHours(23, 59, 59, 999);
    return now <= end.getTime();
  });
  if (activeIndex === -1) activeIndex = items.length - 1;

  const progress =
    items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;

  return (
    <div className="timeline cream-card">
      <ol className="timeline-list">
        <li className="timeline-track" aria-hidden="true">
          <span
            className="timeline-track-fill"
            data-progress={Math.round(progress)}
          />
        </li>

        {items.map((item, index) => {
          const state =
            index < activeIndex
              ? "is-done"
              : index === activeIndex
              ? "is-active"
              : "";

          return (
            <li key={item.id} className={`timeline-item ${state}`}>
              <p className="timeline-date">{item.date}</p>
              <span className="timeline-node" aria-hidden="true" />
              <div className="timeline-content">
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
