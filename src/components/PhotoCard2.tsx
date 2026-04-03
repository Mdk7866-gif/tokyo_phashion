import React from 'react';

interface PhotoCard2Props {
  imageSrc: string;
  title: string;
  originalPrice: string;
  currentPrice: string;
  discount: string;
}

const PhotoCard2: React.FC<PhotoCard2Props> = ({ imageSrc, title, originalPrice, currentPrice, discount }) => {
  return (
    <div className="flex flex-col w-[200px] md:w-[260px] shrink-0 overflow-hidden bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 group cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative">
      {/* Discount Badge */}
      <div className="absolute top-0 left-0 bg-black text-white text-[9px] md:text-[10px] font-black px-3 py-1.5 z-10 tracking-widest uppercase rounded-br-lg shadow-sm">
        {discount}
      </div>
      
      {/* Image */}
      <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5 md:gap-2">
        <h3 className="text-[11px] md:text-xs font-bold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] md:text-[11px] text-gray-400 line-through">
            {originalPrice}
          </span>
          <span className="text-xs md:text-sm font-black text-black">
            {currentPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard2;
