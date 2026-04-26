// The login page uses no navbar — it's a standalone dark screen.
// It intentionally has no layout wrapper so the admin NavBar doesn't render.
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
