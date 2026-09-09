import React from "react";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import NewsCard from "../components/NewsCard";
import newsList from "../news";

export default function ArticlesPage() {
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
            <h2 className="section-title">บทความข่าวสารที่เกี่ยวข้อง</h2>
          </Reveal>

          {newsList.length === 0 ? (
            <p className="section-subtitle">ยังไม่มีบทความในขณะนี้</p>
          ) : (
            <Reveal className="card-grid">
              {newsList.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
