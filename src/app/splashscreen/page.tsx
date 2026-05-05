"use client";

export default function SplashScreenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md animate-pulse">
        <svg width="400" height="260" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <rect width="100%" height="100%" fill="white"/>
          <text x="140" y="130" textAnchor="middle" fontSize="90" fontWeight="700" fill="black">東</text>
          <text x="260" y="130" textAnchor="middle" fontSize="90" fontWeight="700" fill="black">京</text>
          <circle cx="200" cy="110" r="15" fill="#E60012"/>
          <text x="200" y="175" textAnchor="middle" fontSize="38" letterSpacing="4" fill="black">TOKYO</text>
        </svg>
      </div>
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 animate-pulse">
        Loading the future of streetwear...
      </p>
    </div>
  );
}
