import React from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsById } from "../news";
import "../styles/news-detail.css";

export default function NewsDetailPage() {
  const { id } = useParams();
  const item = getNewsById(id);

  if (!item) {
    return (
      <div className="page container">
        <p>ไม่พบข่าวนี้</p>
        <Link to="/news" className="back-link">
          &larr; กลับไปหน้าข่าวสาร
        </Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <Link to="/news" className="back-link">
        &larr; กลับไปหน้าข่าวสาร
      </Link>
      <h1 className="news-detail-title">{item.title}</h1>
      <p className="news-detail-date">{item.date}</p>
      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          className="news-detail-cover"
        />
      )}
      <div className="news-detail-content">
        {item.content}
      </div>
    </div>
  );
}
