import React, { useState } from "react";

import "../styles/video-player.css";

/**
 * VideoPlayer — เครื่องเล่นวิดีโอแบบ facade (lite embed)
 *
 * แสดงภาพปกก่อน แล้วค่อยโหลด iframe ของ YouTube เมื่อผู้ใช้กดเล่น
 * ช่วยให้หน้าแรกไม่ต้องแบกสคริปต์ของ YouTube ตั้งแต่โหลดครั้งแรก
 *
 * ถ้ายังไม่มี youtubeId (เช่น ยังไม่ได้อัปโหลดวิดีโอจริง)
 * คอมโพเนนต์จะกลายเป็นลิงก์ออกไปยัง href แทน
 */
export default function VideoPlayer({
  poster,
  title,
  caption,
  duration,
  youtubeId,
  href,
  posterAlt,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const canEmbed = Boolean(youtubeId);

  const cover = (
    <>
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
    </>
  );

  return (
    <figure className="video-player">
      <div className="video-player-frame">
        {isPlaying && canEmbed ? (
          <iframe
            className="video-player-embed"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : canEmbed ? (
          <button
            type="button"
            className="video-player-trigger"
            onClick={() => setIsPlaying(true)}
            aria-label={`เล่นวิดีโอ: ${title}`}
          >
            {cover}
          </button>
        ) : (
          <a
            className="video-player-trigger"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`เปิดดูวิดีโอ: ${title}`}
          >
            {cover}
          </a>
        )}
      </div>

      {(title || caption) && (
        <figcaption className="video-player-caption">
          {title && <h3 className="video-player-title">{title}</h3>}
          {caption && <p className="video-player-text">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
