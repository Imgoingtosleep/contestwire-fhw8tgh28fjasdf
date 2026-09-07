import React from "react";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import PillarCard from "../components/PillarCard";
import pillars from "../data/pillars.json";
import historyImage from "../assets/images/content/about-history.jpg";
import "../styles/about.css";

export default function AboutPage() {
  return (
    <>
      <Hero
        titleWhite="ABOUT"
        titleBlue="US"
        description="โครงการโตโยต้า ถนนสีขาว เริ่มต้นจากความตั้งใจที่จะเป็นส่วนหนึ่งในการลดอุบัติเหตุบนท้องถนน ด้วยการปลูกฝังวินัยจราจรและน้ำใจให้กับผู้ใช้รถใช้ถนนทุกคน"
      />

      {/* ---- ประวัติความเป็นมา ---- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">ประวัติความเป็นมา</h2>
          </Reveal>

          <Reveal className="about-history">
            <img
              src={historyImage}
              alt="กิจกรรมโครงการโตโยต้า ถนนสีขาว"
              className="about-history-image"
              loading="lazy"
            />
            <div className="about-history-text">
              <p>
                บริษัท โตโยต้า มอเตอร์ ประเทศไทย จำกัด
                ไม่เพียงแต่มุ่งมั่นพัฒนาเทคโนโลยียานยนต์
                ที่มีคุณภาพและความปลอดภัยเท่านั้น
                แต่ยังดำเนินกิจกรรมเพื่อสังคมในหลากหลายด้าน
                โดยเฉพาะอย่างยิ่งเรื่องความปลอดภัยในการใช้รถใช้ถนน
              </p>
              <p>
                ภายใต้ <strong className="about-highlight">“โครงการ ถนนสีขาว”</strong>{" "}
                ซึ่งดำเนินการต่อเนื่องมาตั้งแต่ พ.ศ. 2531
                เพื่อให้ประชาชนทุกช่วงวัยได้ตระหนักถึงความสำคัญของ{" "}
                <strong className="about-highlight">“วินัย น้ำใจ”</strong>{" "}
                ในการเดินทางบนท้องถนน
                และเชื่อมโยงไปสู่การสร้างวัฒนธรรมความปลอดภัยที่ยั่งยืน
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- 3 ยุคของโครงการ ---- */}
      <section className="section section-cream">
        <div className="container">
          <Reveal className="section-head section-head-center">
            <h2 className="about-eras-title">
              เพื่อก่อให้เกิดวัฒนธรรมความปลอดภัยแก่สังคมไทย
              โดยสามารถแบ่งออกเป็น 3 ยุค ดังนี้
            </h2>
          </Reveal>

          <Reveal className="card-grid">
            {ERAS.map((era) => (
              <article key={era.id} className="about-era cream-card">
                <div className="about-era-body">
                  <p className="about-era-period">{era.period}</p>
                  <h3 className="about-era-title">{era.title}</h3>
                  <p className="about-era-description">{era.description}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---- แนวทางการดำเนินงาน ---- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">แนวทางการดำเนินงาน</h2>
          </Reveal>

          <Reveal className="card-grid">
            {pillars.map((item) => (
              <PillarCard key={item.id} item={item} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

const ERAS = [
  {
    id: "era-1",
    period: "พ.ศ. 2531 - 2543",
    title: "ยุคเริ่มต้นสร้างวินัยจราจร",
    description:
      "เริ่มรณรงค์ให้ความรู้เรื่องกฎจราจรและมารยาทในการขับขี่ผ่านสื่อและกิจกรรมชุมชน",
  },
  {
    id: "era-2",
    period: "พ.ศ. 2544 - 2558",
    title: "ยุคขยายเครือข่ายสู่สถานศึกษา",
    description:
      "ขยายกิจกรรมสู่โรงเรียนและมหาวิทยาลัย พร้อมพัฒนาหลักสูตรขับขี่ปลอดภัยร่วมกับหน่วยงานภาครัฐ",
  },
  {
    id: "era-3",
    period: "พ.ศ. 2559 - ปัจจุบัน",
    title: "ยุควัฒนธรรมความปลอดภัยยั่งยืน",
    description:
      "ใช้ข้อมูลและเทคโนโลยีวิเคราะห์จุดเสี่ยง พร้อมสร้างเครือข่ายเยาวชนให้ส่งต่อความปลอดภัยด้วยตัวเอง",
  },
];
