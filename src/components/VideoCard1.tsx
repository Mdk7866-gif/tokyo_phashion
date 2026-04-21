import React from "react";
import Image from "next/image";

interface VideoCard1Props {
  videoSrc: string;
  title: string;
}

const VideoCard1: React.FC<VideoCard1Props> = ({ videoSrc, title }) => {
  const isVideo = videoSrc.endsWith('.mp4') || videoSrc.includes('video');

  return (
    <div className="vc1-root group">
      {/* Media */}
      <div className="vc1-media-wrap">
        {isVideo ? (
          <video
            src={videoSrc}
            className="vc1-media"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={videoSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 130px, 220px"
            className="vc1-media"
          />
        )}

        {/* Gradient overlay */}
        <div className="vc1-gradient" />

        {/* Title */}
        <div className="vc1-info">
          <h3 className="vc1-title">{title}</h3>
          <div className="vc1-play-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .vc1-root {
          flex-shrink: 0;
          cursor: pointer;
        }

        .vc1-media-wrap {
          position: relative;
          width: 130px;
          aspect-ratio: 9 / 16;
          border-radius: 18px;
          overflow: hidden;
          background: #111;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
          transition: box-shadow 0.4s ease, transform 0.4s ease;
        }
        @media (min-width: 768px) {
          .vc1-media-wrap { width: 210px; border-radius: 22px; }
        }

        .vc1-root:hover .vc1-media-wrap {
          box-shadow: 0 16px 40px rgba(0,0,0,0.55);
          transform: scale(1.03) translateY(-4px);
        }

        .vc1-media {
          object-fit: cover;
          transition: transform 0.7s ease;
          width: 100%;
          height: 100%;
        }
        .vc1-root:hover .vc1-media { transform: scale(1.08); }

        .vc1-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          transition: opacity 0.3s;
        }

        .vc1-info {
          position: absolute;
          inset-x: 0;
          bottom: 0;
          padding: 12px 10px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        @media (min-width: 768px) { .vc1-info { padding: 16px 14px; } }

        .vc1-title {
          color: #fff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          line-height: 1.3;
          transition: transform 0.3s ease;
        }
        @media (min-width: 768px) { .vc1-title { font-size: 11px; } }
        .vc1-root:hover .vc1-title { transform: translateY(-2px); }

        .vc1-play-btn {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(6px);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        @media (min-width: 768px) { .vc1-play-btn { width: 32px; height: 32px; } }
        .vc1-root:hover .vc1-play-btn { background: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
};

export default VideoCard1;
