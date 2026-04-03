import React from 'react';
import Image from 'next/image';

interface PhotoCard1Props {
  imageSrc: string;
  category: string;
  price?: string;
}

const PhotoCard1: React.FC<PhotoCard1Props> = ({ imageSrc, category, price }) => {
  return (
    <div className="flex flex-col w-full cursor-pointer group bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      {/* Image */}
      <div className="w-full aspect-[3/4] overflow-hidden bg-zinc-100 rounded-lg relative">
        <Image
          src={imageSrc}
          alt={category}
          fill
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
      </div>
      {/* Label */}
      <div className="pt-2 pb-1 px-0.5">
        <h3
          className={`text-[11px] md:text-sm font-bold text-black group-hover:text-zinc-500 transition-colors leading-tight ${
            !price ? 'tracking-wide uppercase' : ''
          }`}
        >
          {category}
        </h3>
        {price && (
          <p className="text-xs md:text-sm font-black text-black mt-0.5">{price}</p>
        )}
      </div>
    </div>
  );
};

export default PhotoCard1;
