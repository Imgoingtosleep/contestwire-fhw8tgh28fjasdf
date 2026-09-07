import React from "react";
import "../styles/split-block.css";

/**
 * บล็อกรูป + ข้อความสลับซ้าย/ขวา ตาม Figma หน้า youth camp
 * reverse = true จะสลับให้รูปอยู่ด้านขวา
 */
export default function SplitBlock({ image, alt, title, description, reverse }) {
  return (
    <article className={reverse ? "split-block is-reverse" : "split-block"}>
      <div className="split-block-media">
        <img src={image} alt={alt || title} loading="lazy" />
      </div>
      <div className="split-block-content">
        <h3 className="split-block-title">{title}</h3>
        <p className="split-block-description">{description}</p>
      </div>
    </article>
  );
}
