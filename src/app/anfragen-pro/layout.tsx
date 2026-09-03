import type { Metadata } from 'next';

/** SEO P0: privater Bereich — nicht indexieren. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AnfragenProNoIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
