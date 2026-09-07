import React from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import PillarCard from "../components/PillarCard";
import EventCard from "../components/EventCard";
import RoadStats from "../components/RoadStats";

import pillars from "../data/pillars.json";
import events from "../data/events.json";
import site from "../data/site.json";
import videoThumb from "../assets/images/content/home-video.jpg";
import "../styles/home.css";

export default function HomePage() {
  return (
    <>
      <Hero
        titleWhite="TOYOTA"
        titleBlue="ROAD SAFETY"
        description={
          'โครงการ "โตโยต้า ถนนสีขาว" มุ่งมั่นสร้างจิตสำนึกและการรณรงค์ขับขี่ปลอดภัย เพื่อลดอุบัติเหตุบนท้องถนน พร้อมสร้างสรรค์กิจกรรมดี ๆ เพื่อเยาวชนและสังคมไทยอย่างยั่งยืน'
        }
        ctaLabel="เรียนรู้เพิ่มเติม"
        ctaTo="/about"
      />

      {/* ---- ROAD SAFETY ---- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">ROAD SAFETY</h2>
            <p className="section-subtitle">
              ความปลอดภัยบนท้องถนน เริ่มต้นที่เราทุกคน
            </p>
          </Reveal>

          <Reveal className="card-grid">
            {pillars.map((item) => (
              <PillarCard key={item.id} item={item} />
            ))}
          </Reveal>

          <div className="btn-center">
            <Link to="/about" className="btn btn-primary">
              ดูรายละเอียดเพิ่มเติม
            </Link>
          </div>
        </div>
      </section>

      {/* ---- สถิติแบบโต้ตอบ ---- */}
      <RoadStats />

      {/* ---- วิดีโอแนะนำโครงการ ---- */}
      <section className="section home-video-section">
        <div className="container">
          <Reveal className="home-video">
            <a
              className="home-video-link"
              href={site.social.find((s) => s.id === "youtube").url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="เปิดดูวิดีโอโครงการโตโยต้า ถนนสีขาว บน YouTube"
            >
              <img
                src={videoThumb}
                alt="วิดีโอแนะนำโครงการโตโยต้า ถนนสีขาว"
                className="home-video-thumb"
                loading="lazy"
              />
              <span className="home-video-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---- UPCOMING EVENTS ---- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">UPCOMING EVENTS</h2>
            <p className="section-subtitle">กิจกรรมที่กำลังจะมาถึง</p>
          </Reveal>

          <Reveal className="card-grid">
            {events.upcoming.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </Reveal>

          <div className="btn-center">
            <Link to="/events" className="btn btn-primary">
              ดูปฏิทินกิจกรรมทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
