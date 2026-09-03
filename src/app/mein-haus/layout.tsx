import type { Metadata } from 'next';

/** SEO P0: privater Bereich — nicht indexieren. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MeinHausNoIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
