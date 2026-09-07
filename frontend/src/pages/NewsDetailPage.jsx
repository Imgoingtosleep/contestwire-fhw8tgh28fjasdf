import React from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsById } from "../news";
import "../styles/news-detail.css";

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const item = getNewsById(id);

  if (!item) {
    return (
      <div className="container news-detail news-detail-empty">
        <p>ไม่พบบทความที่ต้องการ</p>
        <Link to="/articles" className="btn btn-outline">
          กลับไปหน้าบทความ
        </Link>
      </div>
    );
  }

  return (
    <article className="container news-detail">
      <Link to="/articles" className="news-detail-back">
        &larr; กลับไปหน้าบทความ
      </Link>

      <p className="news-detail-date">{formatDate(item.date)}</p>
      <h1 className="news-detail-title">{item.title}</h1>

      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          className="news-detail-cover"
          loading="lazy"
        />
      )}

      <div className="news-detail-content">{item.content}</div>
    </article>
  );
}
