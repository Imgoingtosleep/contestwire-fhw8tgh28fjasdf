import React from "react";
import { Link } from "react-router-dom";
import banner from "../assets/images/banner.jpg";
import "../styles/hero.css";

/**
 * แบนเนอร์หัวหน้าเพจตาม Figma (1440x600)
 * หัวเรื่องแยกสองส่วน: titleWhite = สีขาว, titleBlue = สีฟ้า
 *
 * joinedTitle = true เมื่อสองส่วนเป็นคำเดียวกัน (EVENT + S, ARTICLE + S)
 * จะได้ไม่มีช่องว่างคั่น และไม่ตัดบรรทัดกลางคำบนจอเล็ก
 */
export default function Hero({
  titleWhite,
  titleBlue,
  description,
  ctaLabel,
  ctaTo,
  ctaHref,
  joinedTitle = false,
}) {
  return (
    <section className="hero">
      <img src={banner} alt="" className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="container hero-inner">
        <h1 className={`hero-title${joinedTitle ? " hero-title-joined" : ""}`}>
          {titleWhite && <span className="hero-title-white">{titleWhite}</span>}
          {titleBlue && <span className="hero-title-blue">{titleBlue}</span>}
        </h1>

        {description && <p className="hero-description">{description}</p>}

        {ctaLabel && (ctaTo || ctaHref) && (
          <div className="hero-cta">
            {ctaTo ? (
              <Link to={ctaTo} className="btn btn-primary">
                {ctaLabel}
              </Link>
            ) : (
              <a href={ctaHref} className="btn btn-primary">
                {ctaLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
