import React from "react";

interface PhotoCard1Props {
  imageSrc: string;
  category: string;
}

const PhotoCard1: React.FC<PhotoCard1Props> = ({ imageSrc, category }) => {
  return (
    <div className="flex flex-col w-[160px] md:w-[210px] flex-shrink-0 cursor-pointer group bg-zinc-50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5">
      <div className="w-full aspect-[3.5/5] overflow-hidden bg-zinc-200">
        <img 
          src={imageSrc} 
          alt={category} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="w-full p-4 bg-white">
        <h3 className="text-[11px] md:text-xs font-black text-black tracking-[0.1em] uppercase group-hover:text-zinc-600 transition-colors">
          {category}
        </h3>
      </div>
    </div>
  );
};

export default PhotoCard1;
