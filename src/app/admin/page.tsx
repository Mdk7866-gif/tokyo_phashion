import React from "react";

export default function AdminDashboard() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="border-2 border-black bg-white px-10 py-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Welcome Admin 👋
        </h1>
        <p className="text-xs mt-2 text-zinc-500 font-bold uppercase tracking-widest">
          Dashboard is ready
        </p>
      </div>
    </div>
  );
}