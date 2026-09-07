import React from "react";

import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import SplitBlock from "../components/SplitBlock";
import Timeline from "../components/Timeline";
import ContestForm from "../components/ContestForm";

import program from "../data/program.json";
import campContest from "../assets/images/content/camp-contest.jpg";
import campWorkshop from "../assets/images/content/camp-workshop.jpg";
import campNetwork from "../assets/images/content/camp-network.jpg";
import mascot from "../assets/images/content/mascot-apply.png";
import "../styles/youth-camp.css";

const IMAGES = {
  contest: campContest,
  workshop: campWorkshop,
  network: campNetwork,
};

export default function YouthCampPage() {
  const { intro, highlights, timeline, cta } = program;

  return (
    <>
      <Hero
        titleWhite="YOUTH"
        titleBlue="CAMP"
        description="ค่ายเยาวชน โตโยต้า ถนนสีขาว (Milky Way Youth Camp) โตโยต้าได้ออกแบบการเรียนรู้ที่ผสมผสานทั้งภาคทฤษฎีและภาคปฏิบัติ เพื่อให้เยาวชนเข้าใจง่ายและนำไปใช้ได้จริง"
        ctaLabel="Apply now"
        ctaHref="#apply"
      />

      {/* ---- แนวคิดของค่าย ---- */}
      <section className="section youth-intro">
        <div className="container">
          <Reveal>
            <h2 className="youth-intro-title">{program.hero.subtitle}</h2>
            <p className="youth-intro-body">{intro.body}</p>
          </Reveal>
        </div>
      </section>

      {/* ---- ไฮไลต์กิจกรรม ---- */}
      <section className="section youth-highlights">
        <div className="container">
          {highlights.map((item, index) => (
            <Reveal key={item.id}>
              <SplitBlock
                image={IMAGES[item.id]}
                alt={item.title}
                title={item.title}
                description={item.description}
                reverse={index % 2 === 1}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- กำหนดการ ---- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">กำหนดการ</h2>
            <p className="section-subtitle">
              เส้นทางกิจกรรมค่ายเยาวชน โตโยต้า ถนนสีขาว
            </p>
          </Reveal>

          <Reveal>
            <Timeline items={timeline} />
          </Reveal>
        </div>
      </section>

      {/* ---- ชวนสมัคร ---- */}
      <section className="section youth-cta">
        <div className="container youth-cta-inner">
          <img
            src={mascot}
            alt=""
            className="youth-cta-mascot"
            aria-hidden="true"
            loading="lazy"
          />
          <div className="youth-cta-content">
            <h2 className="youth-cta-title">{cta.title}</h2>
            <p className="youth-cta-subtitle">{cta.subtitle}</p>
            <a href="#apply" className="btn btn-primary">
              {cta.button}
            </a>
          </div>
        </div>
      </section>

      {/* ---- ฟอร์มสมัครส่งผลงาน ---- */}
      <section className="section section-cream" id="apply">
        <div className="container">
          <Reveal className="section-head section-head-center">
            <h2 className="section-title">สมัครส่งผลงานเข้าประกวด</h2>
            <p className="section-subtitle">
              กรอกข้อมูลให้ครบถ้วน พร้อมแนบลิงก์วิดีโอหรืออัปโหลดไฟล์ผลงานของคุณ
            </p>
          </Reveal>

          <ContestForm />
        </div>
      </section>
    </>
  );
}
