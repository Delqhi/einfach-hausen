import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { EHArticleHeader, EHProse, EHTextLink } from "@/design-system";

export const metadata: Metadata = {
  title: "Dokument (intern)",
  robots: { index: false, follow: false },
};

function isSafeSlug(slug: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMd(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\w)\*([^\*\n]+)\*(?!\w)/g, "<em>$1</em>");
  out = out.replace(/_([^_\n]+)_/g, "<em>$1</em>");
  return out;
}

// Minimaler Markdown-zu-HTML Konverter ohne neue Dependencies:
// Codebloecke, Ueberschriften, Listen, Zitate, Trennlinien, Absaetze + Inline.
function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];
  let inList: "ul" | "ol" | null = null;

  const closeList = () => {
    if (inList) {
      html.push(inList === "ul" ? "</ul>" : "</ol>");
      inList = null;
    }
  };

  for (const raw of lines) {
    const fence = raw.match(/^```(\w*)\s*$/);
    if (fence) {
      if (!inCode) {
        inCode = true;
        codeLang = fence[1] || "";
        codeBuf = [];
        closeList();
      } else {
        inCode = false;
        const cls = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
        html.push(`<pre><code${cls}>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeLang = "";
        codeBuf = [];
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      continue;
    }
    if (/^\s*$/.test(raw)) {
      closeList();
      continue;
    }
    const h = raw.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      html.push(`<h${level}>${inlineMd(h[2])}</h${level}>`);
      continue;
    }
    if (/^\s*---\s*$/.test(raw) || /^\s*\*\*\s*$/.test(raw)) {
      closeList();
      html.push("<hr />");
      continue;
    }
    const quote = raw.match(/^&gt;\s?(.*)$/);
    // Hinweis: raw ist noch unescapet, daher ">" pruefen:
    const q2 = raw.match(/^>\s?(.*)$/);
    if (q2) {
      closeList();
      html.push(`<blockquote>${inlineMd(q2[1])}</blockquote>`);
      continue;
    }
    const ul = raw.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      if (inList !== "ul") {
        closeList();
        html.push("<ul>");
        inList = "ul";
      }
      html.push(`<li>${inlineMd(ul[1])}</li>`);
      continue;
    }
    const ol = raw.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) {
      if (inList !== "ol") {
        closeList();
        html.push("<ol>");
        inList = "ol";
      }
      html.push(`<li>${inlineMd(ol[1])}</li>`);
      continue;
    }
    void quote;
    closeList();
    html.push(`<p>${inlineMd(raw.trim())}</p>`);
  }
  if (inCode) {
    const cls = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
    html.push(`<pre><code${cls}>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  }
  closeList();
  return html.join("\n");
}

export default async function DocPage({ params }: { params: Promise<{ doc: string }> }) {
  await requireAdmin();
  const { doc } = await params;
  const slug = decodeURIComponent(doc);
  if (!isSafeSlug(slug)) notFound();
  const filePath = path.join(process.cwd(), "docs", `${slug}.md`);
  const resolved = path.resolve(filePath);
  const docsRoot = path.resolve(path.join(process.cwd(), "docs"));
  if (!resolved.startsWith(docsRoot + path.sep)) notFound();
  let md: string;
  try {
    md = fs.readFileSync(resolved, "utf8");
  } catch {
    notFound();
  }
  const html = mdToHtml(md);
  return (
    <div>
      <EHArticleHeader category="Entwickler-Doku" title={`${slug}.md`} />
      <p>
        <EHTextLink href="/docs-internal">&larr; Alle Docs</EHTextLink>
      </p>
      <EHProse>
        <article dangerouslySetInnerHTML={{ __html: html }} />
      </EHProse>
    </div>
  );
}
