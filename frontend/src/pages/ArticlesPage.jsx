import React from "react";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import NewsCard from "../components/NewsCard";
import newsList from "../news";

export default function ArticlesPage() {
  // newsList เรียงใหม่สุดขึ้นก่อนมาแล้วจาก news/index.js
  // ชิ้นแรกจึงเป็นบทความล่าสุดเสมอ และถูกยกขึ้นเป็นการ์ดเด่น
  const [featured, ...rest] = newsList;

  return (
    <>
      <Hero
        titleWhite="ARTICLE"
        titleBlue="S"
        joinedTitle
        description="รวมบทความและข่าวสารเกี่ยวกับความปลอดภัยบนท้องถนน กิจกรรมของโครงการ และเรื่องราวจากเยาวชนถนนสีขาวทั่วประเทศ"
      />

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-eyebrow">Newsroom</span>
            <h2 className="section-title">บทความข่าวสารที่เกี่ยวข้อง</h2>
            <p className="section-subtitle">
              เรียงจากใหม่ไปเก่า อัปเดตทุกครั้งที่มีความเคลื่อนไหวของโครงการ
            </p>
          </Reveal>

          {newsList.length === 0 ? (
            <p className="section-subtitle">ยังไม่มีบทความในขณะนี้</p>
          ) : (
            <Reveal className="news-grid">
              <NewsCard key={featured.id} item={featured} featured />
              {rest.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
