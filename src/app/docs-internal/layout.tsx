import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DocsInternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        maxWidth: "880px",
        margin: "0 auto",
        padding: "32px 20px 64px",
        color: "var(--eh-color-ink, #1a1a1a)",
        background: "var(--eh-color-paper, #fff)",
      }}
    >
      <nav style={{ marginBottom: "24px", fontSize: "14px" }}>
        <Link
          href="/admin/ops"
          style={{ color: "var(--eh-color-accent, #0b5fff)", textDecoration: "underline" }}
        >
          &larr; Zur&uuml;ck zu Admin / Ops
        </Link>
      </nav>
      {children}
    </main>
  );
}
