import { EHScope, EHSection } from "@/design-system";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DocsInternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <EHScope app><main><EHSection compact>
      <nav>
        <Link
          href="/admin/ops"
        >
          &larr; Zur&uuml;ck zu Admin / Ops
        </Link>
      </nav>
      {children}
    </EHSection></main></EHScope>
  );
}
