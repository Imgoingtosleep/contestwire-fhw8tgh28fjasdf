import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/news-card.css";

/** แปลงวันที่รูปแบบ YYYY-MM-DD เป็นวันที่ไทยแบบอ่านง่าย */
function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsCard({ item }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(item.cover) && !coverFailed;

  return (
    <Link to={`/articles/${item.id}`} className="news-card cream-card">
      <div className="news-card-media">
        {showCover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="news-card-image"
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="news-card-placeholder" aria-hidden="true">
            ถนนสีขาว
          </span>
        )}
      </div>

      <div className="news-card-body">
        <span className="news-card-date">{formatDate(item.date)}</span>
        <h3 className="news-card-title">{item.title}</h3>
        <p className="news-card-summary">{item.summary}</p>
        <span className="news-card-more">อ่านต่อ &rarr;</span>
      </div>
    </Link>
  );
}
