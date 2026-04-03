"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-16 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
        {/* About Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            {/* GC Logo Placeholder */}
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center font-serif text-xl font-bold tracking-tight">
              TP
            </div>
            <span className="font-serif text-lg tracking-widest uppercase">TOKYO PHASHION</span>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400">About Us</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Tokyo Phashion represents a legacy built on a century of style, craftsmanship and innovation. 
              We take pride in shaping the future of modern menswear, offering timeless elegance and 
              contemporary fashion, crafted with precision and delivered at unbeatable value.
            </p>
          </div>

          <div className="flex items-center gap-5 mt-2">
            {/* Social Icons placeholders */}
            <a href="#" className="hover:text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="bi bi-facebook">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-white">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            {[
              "Contact Information",
              "Return and Exchange",
              "Privacy Policy",
              "Shipping Policy",
              "Terms of Service"
            ].map((link) => (
              <li key={link}>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-white">Contact</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Address</p>
              <p className="text-sm text-gray-400 leading-relaxed uppercase">
                11-12, 14 Valkeshwar Flora nr. Shahid Circle Nava Naroda,<br />
                Ahmedabad, Gujarat - 382346
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">info.tokyophashion@gmail.com</p>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">For Order Tracking, Please contact us on</p>
              <p className="text-sm text-gray-400">+91 8320684933, +91 7874514500</p>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-3 pt-4 flex-wrap">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block w-full mb-1">We Accept</span>
              <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-gray-300">PayPal</div>
              <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-gray-300">Ebay</div>
              <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-gray-300">Visa</div>
              <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-gray-300">MasterCard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="mt-16 pt-8 border-t border-white/10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-gray-500 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} TOKYO PHASHION. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4">
           {/* Tiny arrow to top if wanted */}
           <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up group-hover:-translate-y-0.5 transition-transform">
                <path d="m18 15-6-6-6 6"/>
              </svg>
           </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
