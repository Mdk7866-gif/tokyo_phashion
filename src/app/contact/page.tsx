import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-[85vh] w-full bg-[#050505] flex flex-col items-center py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-5 font-serif">
            GET IN TOUCH
          </h1>
          <p className="text-gray-400 text-sm md:text-base tracking-wide">
            Have a question or a comment? We&apos;d love to hear from you.
          </p>
          <div className="w-12 h-1 bg-white/20 mx-auto mt-8 rounded-full" />
        </div>

        {/* Contact Form Card */}
        <form className="w-full bg-[#0d0d0f] border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5">
           <div>
             <input 
               type="text" 
               placeholder="Your Name" 
               className="w-full bg-[#151518] border border-white/5 rounded-xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-[#1a1a1f] transition-all"
               required
             />
           </div>
           <div>
             <input 
               type="email" 
               placeholder="Your Email" 
               className="w-full bg-[#151518] border border-white/5 rounded-xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-[#1a1a1f] transition-all"
               required
             />
           </div>
           <div>
             <textarea 
               placeholder="Your Message" 
               rows={6}
               className="w-full bg-[#151518] border border-white/5 rounded-xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-[#1a1a1f] transition-all resize-none"
               required
             ></textarea>
           </div>
           
           <button 
             type="submit" 
             className="w-full bg-white text-black font-black text-[11px] md:text-xs tracking-[0.2em] uppercase py-4 md:py-5 rounded-xl mt-4 hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
             SEND MESSAGE
           </button>
        </form>
      </div>
    </div>
  );
}
