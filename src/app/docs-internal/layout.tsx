import type { Metadata } from "next";
import { EHScope, EHContainer, EHTextLink } from "@/design-system";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DocsInternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <EHScope>
      <EHContainer narrow>
        <nav aria-label="Zurück">
          <EHTextLink href="/admin/ops">&larr; Zurück zu Admin / Ops</EHTextLink>
        </nav>
        {children}
      </EHContainer>
    </EHScope>
  );
}
