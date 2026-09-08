import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { requireAdmin } from "@/lib/admin-auth";
import { EHAppHeader, EHList, EHEmptyState } from "@/design-system";

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
      <EHAppHeader
        eyebrow="Intern"
        title="Entwickler-Docs"
        text="Interne Markdown-Dokumente aus docs/*.md. Nur für Admins."
      />
      {files.length === 0 ? (
        <EHEmptyState title="Keine Dokumente" text="Im docs-Verzeichnis wurden keine Markdown-Dateien gefunden." />
      ) : (
        <EHList
          label="Interne Dokumentation"
          items={files.map((f) => ({
            id: f,
            title: f,
            href: `/docs-internal/${encodeURIComponent(f.replace(/\.md$/i, ""))}`,
          }))}
        />
      )}
    </div>
  );
}
