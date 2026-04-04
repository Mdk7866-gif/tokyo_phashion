import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal | Tokyo Phashion',
  description: 'Explore the latest streetwear trends, style guides, and exclusive behind-the-scenes insights from Tokyo Phashion.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
