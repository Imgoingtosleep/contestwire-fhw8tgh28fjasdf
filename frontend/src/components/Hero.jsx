import React from "react";
import { Link } from "react-router-dom";
import banner from "../assets/images/banner.jpg";
import "../styles/hero.css";

/**
 * แบนเนอร์หัวหน้าเพจตาม Figma (1440x600)
 * หัวเรื่องแยกสองส่วน: titleWhite = สีขาว, titleBlue = สีฟ้า
 */
export default function Hero({
  titleWhite,
  titleBlue,
  description,
  ctaLabel,
  ctaTo,
  ctaHref,
}) {
  return (
    <section className="hero">
      <img src={banner} alt="" className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="container hero-inner">
        <h1 className="hero-title">
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
