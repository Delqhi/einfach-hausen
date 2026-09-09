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
      <h1>Entwickler-Docs</h1>
      <p
        className="muted"
      >
        Interne Markdown-Dokumente aus <code>docs/*.md</code>. Nur f&uuml;r Admins.
      </p>
      {files.length === 0 ? (
        <p>Keine Dokumente gefunden.</p>
      ) : (
        <ul>
          {files.map((f) => {
            const slug = f.replace(/\.md$/i, "");
            return (
              <li
                key={f}
              >
                <Link
                  href={`/docs-internal/${encodeURIComponent(slug)}`}
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
