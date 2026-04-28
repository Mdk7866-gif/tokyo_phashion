import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal | Tokyo Fashion',
  description: 'Explore the latest streetwear trends, style guides, and exclusive behind-the-scenes insights from Tokyo Fashion.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
