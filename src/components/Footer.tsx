"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const socialIcons = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M7.75 2C4.575 2 2 4.575 2 7.75v8.5C2 19.425 4.575 22 7.75 22h8.5C19.425 22 22 19.425 22 16.25v-8.5C22 4.575 19.425 2 16.25 2h-8.5zM12 7.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm5.25-.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22 5.8c-.7.3-1.5.5-2.3.6a4 4 0 001.8-2.2 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.8a4.1 4.1 0 001.3 5.5 4 4 0 01-1.9-.5v.1a4.1 4.1 0 003.3 4 4 4 0 01-1.8.1 4.1 4.1 0 003.8 2.8A8.3 8.3 0 012 19.5a11.7 11.7 0 006.3 1.8c7.5 0 11.6-6.2 11.6-11.6v-.5A8.3 8.3 0 0022 5.8z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.2-3.4.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.3V12h2.3l-.4 2.9h-1.9v7A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    name: "Youtube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M21.6 7.2a2.8 2.8 0 00-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 00-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 002 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 002-2C22 15 22 12 22 12s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
];

const footerLinks = [
  {
    title: "Shop",
    links: ["New Arrivals", "Best Sellers", "Accessories", "Collections"],
  },
  {
    title: "Support",
    links: ["Shipping & Delivery", "Returns & Exchanges", "Size Guide", "Contact Us"],
  },
  {
    title: "Company",
    links: ["Our Story", "Sustainability", "Careers", "Terms of Service"],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-black bg-white text-black">
      <div className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand & Social */}
          <div className="col-span-2 lg:col-span-3">
            <Link href="/" className="inline-block">
              <Logo className="h-12 w-auto" />
            </Link>
            <p className="mt-8 max-w-md text-sm leading-8 text-black/60">
              Defining the future of urban streetwear. Born in the streets of Shibuya, 
              crafted for the global avant-garde. We believe in high contrast, 
              minimalism, and the power of the streets.
            </p>
            <div className="mt-10 flex gap-4">
              {socialIcons.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="rounded-none border border-black p-3 text-black hover:bg-black hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-xs font-bold text-black/50 hover:text-black transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-24 border-t border-zinc-100 pt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-bold text-black/40 text-center sm:text-left">
            &copy; {currentYear} TOKYO FASHION LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex justify-center gap-10 text-[11px] font-bold text-black/40">
            <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-black transition-colors">Accessibility</Link>
            <Link href="#" className="hover:text-black transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;