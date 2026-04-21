/**
 * Login page layout — renders children WITHOUT the global Navbar/Footer.
 * The login page is a standalone fullscreen experience.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
