import React from "react";

import "../styles/video-player.css";

/**
 * VideoPlayer — ฝังวิดีโอ YouTube
 *
 * เมื่อมี youtubeId จะฝัง iframe ของ YouTube ลงไปตรง ๆ
 * ปุ่มเล่น แถบเวลา และชื่อคลิปเป็นของ YouTube เองทั้งหมด
 * ใช้โดเมน youtube-nocookie เพื่อไม่ให้ตั้งคุกกี้ติดตามจนกว่าผู้ใช้จะกดเล่น
 * และใส่ loading="lazy" ให้ iframe เริ่มโหลดเมื่อเลื่อนมาใกล้เท่านั้น
 * หน้าแรกจึงไม่ต้องแบกสคริปต์ของ YouTube ตั้งแต่วินาทีแรก
 *
 * ถ้ายังไม่มี youtubeId (เช่น ยังไม่ได้อัปโหลดวิดีโอจริง)
 * จะถอยไปแสดงภาพปกพร้อมปุ่มเล่น ที่เป็นลิงก์ออกไปยัง href แทน
 *
 * showCaption = false เมื่อหน้าที่เรียกใช้มีหัวข้อของตัวเองอยู่แล้ว
 * จะได้ไม่มีหัวข้อซ้ำสองชั้น แต่ยังต้องส่ง title มาเพราะใช้เป็น
 * title ของ iframe และ aria-label ของลิงก์สำรอง
 */
export default function VideoPlayer({
  poster,
  title,
  caption,
  duration,
  youtubeId,
  href,
  posterAlt,
  showCaption = true,
}) {
  return (
    <figure className={youtubeId ? "video-player video-player--embed" : "video-player"}>
      <div className="video-player-frame">
        {youtubeId ? (
          <iframe
            className="video-player-embed"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a
            className="video-player-trigger"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`เปิดดูวิดีโอ: ${title}`}
          >
            <img
              src={poster}
              alt={posterAlt || title}
              className="video-player-poster"
              loading="lazy"
            />
            <span className="video-player-scrim" aria-hidden="true" />
            <span className="video-player-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="video-player-play-label">เล่นวิดีโอ</span>
            </span>
            {duration && (
              <span className="video-player-duration" aria-hidden="true">
                {duration}
              </span>
            )}
          </a>
        )}
      </div>

      {showCaption && (title || caption) && (
        <figcaption className="video-player-caption">
          {title && <h3 className="video-player-title">{title}</h3>}
          {caption && <p className="video-player-text">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
