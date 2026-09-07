import React from "react";
import "../styles/event-card.css";

/** การ์ดกิจกรรม — พื้นครีมมุมมนตาม Figma */
export default function EventCard({ item }) {
  return (
    <article className="event-card cream-card">
      <div className="event-card-body">
        <p className="event-card-date">{item.dateLabel}</p>
        <h3 className="event-card-title">{item.title}</h3>
        <p className="event-card-place">{item.place}</p>
        <p className="event-card-summary">{item.summary}</p>
      </div>
    </article>
  );
}
