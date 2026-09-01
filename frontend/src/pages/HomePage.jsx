import React from "react";
import { Link } from "react-router-dom";
import newsList from "../news";
import NewsCard from "../components/NewsCard";
import "../styles/home.css";

export default function HomePage() {
  const latest = newsList.slice(0, 3);

  return (
    <div className="page container">
      <section className="hero-section">
        <h1 className="hero-title">ยินดีต้อนรับสู่เว็บไซต์ข่าวสารและประกวดวิดีโอ</h1>
        <p className="hero-subtitle">
          ติดตามข่าวสารล่าสุด และร่วมส่งผลงานวิดีโอเข้าประกวดได้แล้ววันนี้
        </p>
        <Link to="/contest" className="hero-cta">
          สมัครส่งผลงานเข้าประกวด &rarr;
        </Link>
      </section>

      <section className="news-section">
        <h2 className="news-section-title">ข่าวล่าสุด</h2>
        {latest.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
        <Link to="/news" className="view-all-link">
          ดูข่าวทั้งหมด &rarr;
        </Link>
      </section>
    </div>
  );
}
