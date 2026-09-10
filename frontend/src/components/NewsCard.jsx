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

/**
 * การ์ดบทความ
 *
 * featured = การ์ดเด่นของบทความล่าสุด กินเต็มความกว้างของกริด
 * วางภาพครึ่งซ้าย เนื้อหาครึ่งขวา (บนจอเล็กเรียงบนล่างเหมือนการ์ดปกติ)
 *
 * หมวดหมู่มาจาก item.category ถ้าไฟล์ข่าวไม่ได้ระบุไว้จะใช้ "ข่าวสาร"
 * จึงเพิ่มฟิลด์นี้ในไฟล์ news-XXX.js เมื่อไหร่ก็ได้ ไม่กระทบข่าวเดิม
 */
export default function NewsCard({ item, featured = false }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(item.cover) && !coverFailed;
  const category = item.category || "ข่าวสาร";

  return (
    <Link
      to={`/articles/${item.id}`}
      className={
        featured
          ? "news-card news-card--featured cream-card"
          : "news-card cream-card"
      }
    >
      <div className="news-card-media">
        {showCover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="news-card-image"
            loading={featured ? "eager" : "lazy"}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="news-card-placeholder" aria-hidden="true">
            ถนนสีขาว
          </span>
        )}
      </div>

      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-card-tag">{category}</span>
          <time className="news-card-date" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
        </div>

        <h3 className="news-card-title">{item.title}</h3>
        <p className="news-card-summary">{item.summary}</p>

        <span className="news-card-more">
          อ่านต่อ
          <svg
            className="news-card-arrow"
            viewBox="0 0 16 9"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 4.5h14M10.5 1 14 4.5 10.5 8"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
