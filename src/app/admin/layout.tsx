import NavBar from "@/components/admin/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
