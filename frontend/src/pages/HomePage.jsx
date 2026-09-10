import React from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import PillarCard from "../components/PillarCard";
import EventCard from "../components/EventCard";
import RoadStats from "../components/RoadStats";
import VideoPlayer from "../components/VideoPlayer";

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

      {/* ---- สถิติแบบโต้ตอบ ---- */}
      <RoadStats />

      {/* ---- ROAD SAFETY : การ์ดเกยขอบแถบสถิติ ---- */}
      <section className="section home-pillars">
        <div className="container">
          <Reveal className="section-head section-head-center">
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

      {/* ---- วิดีโอแนะนำโครงการ ---- */}
      <section className="section section-cream home-video-section">
        <div className="container">
          <Reveal className="section-head section-head-center">
            <h2 className="section-title">{site.video.title}</h2>
            <p className="section-subtitle">{site.video.caption}</p>
          </Reveal>
        </div>

        <Reveal className="home-video">
          <VideoPlayer
            poster={videoThumb}
            posterAlt="วิดีโอแนะนำโครงการโตโยต้า ถนนสีขาว"
            title={site.video.title}
            duration={site.video.duration}
            youtubeId={site.video.youtubeId}
            href={site.social.find((s) => s.id === "youtube").url}
            showCaption={false}
          />
        </Reveal>
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
