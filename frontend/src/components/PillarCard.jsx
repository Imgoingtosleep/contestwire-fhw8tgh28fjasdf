import React from "react";
import "../styles/pillar-card.css";

/** การ์ดแนวทางการดำเนินงาน (คนเซฟ / รถเซฟ / ถนนเซฟ) */
export default function PillarCard({ item }) {
  return (
    <article className="pillar-card cream-card">
      <div className="pillar-card-body">
        <h3 className="pillar-card-title">{item.title}</h3>
        <p className="pillar-card-subtitle">{item.subtitle}</p>
        <p className="pillar-card-description">{item.description}</p>
      </div>
    </article>
  );
}
