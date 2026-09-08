import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Entwickler-Docs (intern)",
  robots: { index: false, follow: false },
};

export default async function DocsInternalIndex() {
  await requireAdmin();
  const docsDir = path.join(process.cwd(), "docs");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(docsDir)
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .sort((a, b) => a.localeCompare(b, "de"));
  } catch {
    files = [];
  }
  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Entwickler-Docs</h1>
      <p
        className="muted"
        style={{ color: "var(--eh-color-muted, #666)", marginBottom: "24px" }}
      >
        Interne Markdown-Dokumente aus <code>docs/*.md</code>. Nur f&uuml;r Admins.
      </p>
      {files.length === 0 ? (
        <p>Keine Dokumente gefunden.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {files.map((f) => {
            const slug = f.replace(/\.md$/i, "");
            return (
              <li
                key={f}
                style={{
                  borderBottom: "1px solid var(--eh-color-line, #e5e5e5)",
                  padding: "10px 0",
                }}
              >
                <Link
                  href={`/docs-internal/${encodeURIComponent(slug)}`}
                  style={{
                    color: "var(--eh-color-accent, #0b5fff)",
                    textDecoration: "underline",
                    fontFamily: "monospace",
                    fontSize: "14px",
                  }}
                >
                  {f}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
