import React, { useMemo, useState } from "react";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import showcase from "../data/showcase.json";
import "../styles/showcase.css";

export default function ShowcasePage() {
  const years = useMemo(
    () => ["ทั้งหมด", ...Array.from(new Set(showcase.map((i) => i.year)))],
    []
  );
  const [year, setYear] = useState("ทั้งหมด");

  const items =
    year === "ทั้งหมด" ? showcase : showcase.filter((i) => i.year === year);

  return (
    <>
      <Hero
        titleWhite="SHOW"
        titleBlue="CASE"
        description="รวมผลงานวิดีโอที่ได้รับรางวัลและผลงานเด่นจากเยาวชนที่ร่วมโครงการในปีที่ผ่านมา"
      />

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">ผลงานที่ได้รับรางวัล</h2>
            <p className="section-subtitle">
              เลือกดูผลงานตามปีที่จัดกิจกรรม
            </p>
          </Reveal>

          <div className="showcase-filter" role="group" aria-label="กรองตามปี">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                className={
                  y === year ? "showcase-filter-btn is-active" : "showcase-filter-btn"
                }
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>

          <Reveal className="card-grid">
            {items.map((item) => (
              <article key={item.id} className="showcase-card cream-card">
                <div className="showcase-card-body">
                  <p className="showcase-card-award">{item.award}</p>
                  <h3 className="showcase-card-title">{item.title}</h3>
                  <p className="showcase-card-team">
                    {item.team} · ปี {item.year}
                  </p>
                  <p className="showcase-card-description">{item.description}</p>
                  <a
                    className="showcase-card-link"
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ดูผลงาน &rarr;
                  </a>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
