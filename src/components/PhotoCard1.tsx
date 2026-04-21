import React from 'react';
import Image from 'next/image';

interface PhotoCard1Props {
  imageSrc: string;
  category: string;
  price?: string;
}

const PhotoCard1: React.FC<PhotoCard1Props> = ({ imageSrc, category, price }) => {
  return (
    <div className="photo-card1-root group">
      {/* Circle image container */}
      <div className="photo-card1-img-wrap">
        <Image
          src={imageSrc}
          alt={category}
          fill
          sizes="(max-width: 640px) 28vw, (max-width: 1200px) 16vw, 180px"
          className="photo-card1-img"
        />
        {/* Hover ring */}
        <div className="photo-card1-ring" />
      </div>

      {/* Label */}
      <div className="photo-card1-label">
        <span className="photo-card1-title">{category}</span>
        {price && <span className="photo-card1-price">{price}</span>}
      </div>

      <style>{`
        .photo-card1-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          width: 100%;
        }

        .photo-card1-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
          background: #f3f3f3;
          border: 3px solid transparent;
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
          box-shadow: 0 4px 18px rgba(0,0,0,0.08);
        }

        .photo-card1-root:hover .photo-card1-img-wrap {
          border-color: #000;
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
          transform: translateY(-4px) scale(1.03);
        }

        .photo-card1-img {
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .photo-card1-root:hover .photo-card1-img {
          transform: scale(1.1);
        }

        .photo-card1-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0);
          transition: border-color 0.35s ease;
          pointer-events: none;
          z-index: 2;
        }

        .photo-card1-root:hover .photo-card1-ring {
          border-color: rgba(0,0,0,0.12);
        }

        .photo-card1-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          text-align: center;
        }

        .photo-card1-title {
          font-size: clamp(9px, 1.8vw, 13px);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #111;
          transition: color 0.25s ease;
          line-height: 1.2;
        }

        .photo-card1-root:hover .photo-card1-title {
          color: #555;
        }

        .photo-card1-price {
          font-size: clamp(9px, 1.5vw, 12px);
          font-weight: 900;
          color: #111;
        }
      `}</style>
    </div>
  );
};

export default PhotoCard1;
