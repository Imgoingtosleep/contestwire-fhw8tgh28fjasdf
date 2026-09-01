import React from "react";
import newsList from "../news";
import NewsCard from "../components/NewsCard";

export default function NewsPage() {
  return (
    <div className="page container">
      <h1 className="page-title">ข่าวสารทั้งหมด</h1>
      <p className="page-description">อัปเดตข่าวสาร ข้อมูลโครงการ และประกาศล่าสุด</p>
      {newsList.length === 0 && <p>ยังไม่มีข่าวในขณะนี้</p>}
      {newsList.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
