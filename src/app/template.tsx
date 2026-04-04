import Loading from "./loading";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Loading />
      {children}
    </>
  );
}
