import React from "react";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import EventCard from "../components/EventCard";
import events from "../data/events.json";

export default function EventsPage() {
  return (
    <>
      <Hero
        titleWhite="EVENT"
        titleBlue="S"
        joinedTitle
        description="โตโยต้ามุ่งมั่นในการรณรงค์และจัดกิจกรรมด้านความปลอดภัยบนท้องถนนอย่างต่อเนื่อง ทั้งกิจกรรมในสถานศึกษา ชุมชน และเครือข่ายเยาวชนทั่วประเทศ"
      />

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">กิจกรรมที่กำลังจะมาถึง</h2>
          </Reveal>

          <Reveal className="card-grid">
            {events.upcoming.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="section-title">กิจกรรมที่ผ่านมา</h2>
          </Reveal>

          <Reveal className="card-grid">
            {events.past.map((item) => (
              <EventCard key={item.id} item={item} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
