"use client";
import Image from "next/image";
import { MapPin, Phone, Map } from "lucide-react";

interface Branch {
  id: number;
  name: string;
  type: string;
  address: string;
  mobile: string;
  imageUrl: string;
  mapUrl: string;
}

const BRANCHES: Branch[] = [
  {
    id: 1,
    name: "Tokyo Phashion - MEN(Branch 1)",
    type: "Menswear",
    address: "SHOP NO 4, SUGRA RESIDENCY, BERAL MARKET, HIMALAYA ROAD, Danilimda, Ahmedabad, Gujarat 382405",
    mobile: "+91 9624217769",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1778188060/Screenshot_2026-05-08_023656_k4pamq.png",
    mapUrl: "https://www.google.com/maps/place/TOKYO+FASHION+HUB/@22.9803388,72.575211,57m/data=!3m1!1e3!4m7!3m6!1s0x395e854796b2225f:0x622ba1a151d4e80d!4b1!8m2!3d22.9803156!4d72.5752915!16s%2Fg%2F11twq4xt8d?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    id: 2,
    name: "Tokyo Phashion - MEN(Branch 2)",
    type: "Menswear",
    address: "Emaad Heights, Arshad Park, Sarkhej, Ahmedabad, Gujarat 380055",
    mobile: "+91 8347061498",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1778188513/Screenshot_2026-05-08_024502_zjtybu.png",
    mapUrl: "https://www.google.com/maps/place/TOKYO+FASHION+JUHAPURA,+Emaad+Heights,+Arshad+Park,+Sarkhej,+Ahmedabad,+Gujarat+380055/data=!4m2!3m1!1s0x395e9b00239807f3:0x6c00f5ecf8731cf?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjM1LjAYACCenQoqmQEsOTQyNjc3MjcsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyODUwNTIsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjUsOTQyODY4ODJCAklO&skid=2e52d343-c6ac-4efc-903b-1ab59b2f7366"
  },
  {
    id: 3,
    name: "Tokyo Phashion - MEN(Branch 3)",
    type: "Menswear",
    address: "Vatva, Ahmedabad, Gujarat 382445",
    mobile: "+91 7621929267",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1778188060/Screenshot_2026-05-08_023656_k4pamq.png",
    mapUrl: "https://www.google.com/maps/place/SILICON-101,+Vatva,+Ahmedabad,+Gujarat+382445/@22.9594937,72.612211,908m/data=!3m2!1e3!4b1!4m6!3m5!1s0x395e8f4cf60db35f:0xd35653b150648028!8m2!3d22.9595548!4d72.6122525!16s%2Fg%2F11lsnh6qjw!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    id: 4,
    name: "Tokyo Kicks - Premium Shoes",
    type: "Footwear",
    address: "Emaad Heights, Arshad Park, Sarkhej, Ahmedabad, Gujarat 380055",
    mobile: "+91 8347061498",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1778189222/Screenshot_2026-05-08_025640_jijn92.png",
    mapUrl: "https://www.google.com/maps/place/TOKYO+FASHION+JUHAPURA,+Emaad+Heights,+Arshad+Park,+Sarkhej,+Ahmedabad,+Gujarat+380055/data=!4m2!3m1!1s0x395e9b00239807f3:0x6c00f5ecf8731cf?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjM1LjAYACCenQoqmQEsOTQyNjc3MjcsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyODUwNTIsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjUsOTQyODY4ODJCAklO&skid=2e52d343-c6ac-4efc-903b-1ab59b2f7366"
  },
  {
    id: 5,
    name: "Tokyo Kids - Street Juniors",
    type: "Kidswear",
    address: "Emaad Heights, Arshad Park, Sarkhej, Ahmedabad, Gujarat 380055",
    mobile: "+91 8347061498",
    imageUrl: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1778189221/Screenshot_2026-05-08_025601_olhspj.png",
    mapUrl: "https://www.google.com/maps/place/TOKYO+FASHION+JUHAPURA,+Emaad+Heights,+Arshad+Park,+Sarkhej,+Ahmedabad,+Gujarat+380055/data=!4m2!3m1!1s0x395e9b00239807f3:0x6c00f5ecf8731cf?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjM1LjAYACCenQoqmQEsOTQyNjc3MjcsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyODUwNTIsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjUsOTQyODY4ODJCAklO&skid=2e52d343-c6ac-4efc-903b-1ab59b2f7366"
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Branches Section Title */}
      <section className="pt-6 pb-2 px-6 bg-zinc-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Our <span className="text-zinc-300">Branches</span>
          </h1>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="flex flex-col group border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white">
              {/* Branch Image - Increased Height */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden border-b-2 border-black">
                <Image 
                  src={branch.imageUrl} 
                  alt={branch.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black text-white text-[8px] sm:text-[10px] font-black uppercase px-2 py-1 sm:px-3 sm:py-1 tracking-widest z-10">
                  {branch.type}
                </div>
              </div>

              {/* Branch Info - Increased Font Sizes */}
              <div className="flex-1 p-4 sm:p-8 flex flex-col">
                <div className="space-y-3 sm:space-y-6 flex-1">
                  <h3 className="text-base sm:text-2xl font-black uppercase italic tracking-tighter leading-tight">
                    {branch.name}
                  </h3>
                  
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-start gap-2 sm:gap-4">
                      <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-red-600 mt-1 flex-shrink-0" />
                      <p className="text-[10px] sm:text-[13px] font-bold text-zinc-800 leading-snug sm:leading-relaxed">
                        {branch.address}
                      </p>
                    </div>
                    
                    <a 
                      href={`tel:${branch.mobile}`}
                      className="flex items-center gap-2 sm:gap-4 group/phone hover:opacity-70 transition-opacity"
                    >
                      <Phone className="w-3 h-3 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                      <p className="text-[10px] sm:text-[13px] font-black uppercase tracking-widest text-black group-hover/phone:underline underline-offset-4">
                        {branch.mobile}
                      </p>
                    </a>

                    <div className="flex items-center gap-2 sm:gap-4 pt-2 border-t border-zinc-100">
                      <div className="w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">Opening Hours</span>
                        <p className="text-[9px] sm:text-[12px] font-bold text-black">11:30 AM - 11:00 PM (All Days)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* High Visibility Map Button */}
                <a 
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 sm:gap-3 w-full py-3 sm:py-5 bg-black text-white text-[9px] sm:text-[12px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] mt-6"
                >
                  <Map className="w-4 h-4 sm:w-5 sm:h-5" /> View on Map
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-black text-white py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Founder Image */}
            <div className="relative aspect-square w-full max-w-md mx-auto md:mx-0 group">
              <div className="absolute -inset-4 border-2 border-zinc-800 translate-x-4 translate-y-4 sm:translate-x-8 sm:translate-y-8 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
              <div className="relative h-full w-full bg-zinc-900 overflow-hidden border-2 border-white">
                <Image 
                  src="https://res.cloudinary.com/ddya4o2yl/image/upload/v1778161746/tokyofashion/prod_1778161737964.jpg" 
                  alt="Bilal Shaikh"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            {/* Founder Info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Founder & CEO</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  Bilal <br />
                  <span className="text-zinc-400">Shaikh</span>
                </h2>
              </div>
              
              <div className="space-y-6 max-w-md">
                <p className="text-zinc-400 text-sm leading-relaxed italic border-l-4 border-zinc-800 pl-6">
                  &quot;Fashion is more than just clothing; it&apos;s about how you carry yourself in the urban landscape. We created Tokyo Phashion to bring the precision of Japanese street style to the vibrant energy of India.&quot;
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Under Bilal&apos;s vision, Tokyo Phashion has grown from a single boutique to a multi-branch network specializing in menswear, high-end footwear, and street-ready kidswear, setting new benchmarks for the urban aesthetic in Ahmedabad.
                </p>
              </div>

              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/tokyo__fashion_hub/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="instagram-gradient-about" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagram-gradient-about)" strokeWidth="2.5" />
                    <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient-about)" strokeWidth="2.5" />
                    <circle cx="18" cy="6" r="1.5" fill="url(#instagram-gradient-about)" />
                  </svg>
                  Connect with Bilal
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="py-10 border-t-2 border-black flex overflow-hidden whitespace-nowrap bg-white">
        <div className="animate-marquee flex gap-10">
          {[1,2,3,4,5].map((i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">
              STREET CULTURE / URBAN AESTHETIC / SHIBUYA ROOTS / MINIMAL DESIGN /
            </span>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
