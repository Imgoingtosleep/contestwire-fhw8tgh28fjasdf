import React from "react";
import { Link } from "react-router-dom";
import "../styles/news-card.css";

export default function NewsCard({ item }) {
  return (
    <Link to={`/news/${item.id}`} className="news-card">
      {item.cover && (
        <img src={item.cover} alt={item.title} className="news-card-image" />
      )}
      <div className="news-card-body">
        <span className="news-card-date">{item.date}</span>
        <h3 className="news-card-title">{item.title}</h3>
        <p className="news-card-summary">{item.summary}</p>
      </div>
    </Link>
  );
}
