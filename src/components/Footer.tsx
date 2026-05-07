"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Mail, Phone } from "lucide-react";

const socialIcons = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/tokyo__fashion_hub/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="footer-insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#footer-insta-gradient)" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="url(#footer-insta-gradient)" strokeWidth="2" />
        <circle cx="18" cy="6" r="1.2" fill="url(#footer-insta-gradient)" />
      </svg>
    ),
  },
];

const Footer = () => {


  return (
    <footer className="w-full border-t-2 border-black bg-zinc-50 text-black">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* SECTION 1: BRAND */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
              Defining the future of urban streetwear. Born in the streets of Shibuya,
              crafted for the global avant-garde.
            </p>
          </div>

          {/* SECTION 2: CONTACT */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Contact Us</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <a
                  href="https://maps.app.goo.gl/5SgRZ9Rf22BjUsiY7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pl-7 group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black transition-colors">
                    Tokyo Fashion, Himalaya Road,<br />Danilimda, Ahmedabad 380028
                  </span>
                </a>

                <a
                  href="https://maps.app.goo.gl/5SgRZ9Rf22BjUsiY7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-7 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-700 hover:text-black underline underline-offset-4 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>

                  View on Google Maps
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <a href="tel:7874568421" className="flex items-center gap-3 group w-fit">
                  <Phone className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black transition-colors">7874568421</span>
                </a>
                <a href="tel:9978605512" className="flex items-center gap-3 group w-fit ml-7">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black transition-colors">9978605512</span>
                </a>
              </div>
              <a href="mailto:tokyofashion320124@gmail.com" className="flex items-center gap-3 group w-fit">
                <Mail className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" />
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 group-hover:text-black transition-colors lowercase">tokyofashion320124@gmail.com</span>
              </a>
            </div>
          </div>

          {/* SECTION 3: SOCIALS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Follow Us</h3>
            <div className="flex flex-col gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full sm:w-fit px-6 py-3 border border-black hover:bg-zinc-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] bg-white group"
                  aria-label={social.name}
                >
                  {social.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1">Follow on Instagram</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-8 border-t border-zinc-100 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-zinc-400 text-center sm:text-left uppercase tracking-widest">
              &copy; {new Date().getFullYear()} TOKYO FASHION. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center sm:text-left">
              Managed by <span className="text-zinc-700">Mujahid Khan</span> <span className="mx-2 opacity-30 text-gray-400">|</span> <a href="tel:8511274216" className="hover:text-black transition-colors text-gray-600">8511274216</a>
            </p>
          </div>
          <div className="flex justify-center gap-6 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;