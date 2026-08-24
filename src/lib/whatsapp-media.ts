import {
  normalizedMediaType,
  privateMediaRule,
  savePrivateMediaBuffer,
  type IntakeMediaKind,
} from './intake-media';

export type WhatsAppMediaResult = { path: string; kind: IntakeMediaKind; body: string };
type IncomingMedia = { id?: unknown; mime_type?: unknown; caption?: unknown };
type MediaMetadata = { url?: unknown; mime_type?: unknown; file_size?: unknown };

const allowedHosts = new Set(['graph.facebook.com', 'lookaside.fbsbx.com']);

export function whatsappMediaType(type: unknown): 'image' | 'audio' | null {
  return type === 'image' || type === 'audio' ? type : null;
}

export function whatsappMediaPlaceholder(kind: 'image' | 'audio', caption: unknown) {
  const label = kind === 'image' ? 'Foto' : 'Sprachnachricht';
  const text = typeof caption === 'string' ? caption.trim().slice(0, 1200) : '';
  return text ? `${label}: ${text}` : `${label} empfangen.`;
}

export async function readBoundedResponseBody(response: Response, maxBytes: number): Promise<Uint8Array | null> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) return null;

  const contentLengthHeader = response.headers.get('content-length');
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isSafeInteger(contentLength) || contentLength <= 0 || contentLength > maxBytes) return null;
  }

  if (!response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.byteLength) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (!total) return null;
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function downloadWhatsAppMedia(message: {
  type?: unknown;
  image?: IncomingMedia;
  audio?: IncomingMedia;
}): Promise<WhatsAppMediaResult | null> {
  const kind = whatsappMediaType(message.type);
  if (!kind) return null;

  const media = (kind === 'image' ? message.image : message.audio) || {};
  const id = typeof media.id === 'string' ? media.id : '';
  const declaredType = typeof media.mime_type === 'string' ? media.mime_type : '';
  const declaredRule = privateMediaRule(declaredType);
  if (!id || !declaredRule || declaredRule.kind !== kind) return null;

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const version = process.env.WHATSAPP_GRAPH_VERSION || 'v23.0';
  if (!token) return null;

  const metadataResponse = await fetch(`https://graph.facebook.com/${version}/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!metadataResponse.ok) return null;

  const metadata = (await metadataResponse.json()) as MediaMetadata;
  const metadataType = typeof metadata.mime_type === 'string' ? metadata.mime_type : '';
  const metadataRule = privateMediaRule(metadataType);
  if (!metadataRule || metadataRule.kind !== kind) return null;
  if (normalizedMediaType(metadataType) !== normalizedMediaType(declaredType)) return null;

  if (metadata.file_size !== undefined && metadata.file_size !== null) {
    const reportedSize = Number(metadata.file_size);
    if (!Number.isSafeInteger(reportedSize) || reportedSize <= 0 || reportedSize > metadataRule.max) return null;
  }

  const url = typeof metadata.url === 'string' ? metadata.url : '';
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:' || !allowedHosts.has(parsed.hostname)) return null;

  const response = await fetch(parsed, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return null;

  const downloadedType = response.headers.get('content-type');
  const downloadedRule = privateMediaRule(downloadedType);
  if (!downloadedType || !downloadedRule || downloadedRule.kind !== kind) return null;
  if (normalizedMediaType(downloadedType) !== normalizedMediaType(metadataType)) return null;

  const bytes = await readBoundedResponseBody(response, downloadedRule.max);
  if (!bytes) return null;

  const path = await savePrivateMediaBuffer(bytes, downloadedType, `whatsapp:${id}`);
  return { path, kind, body: whatsappMediaPlaceholder(kind, media.caption) };
}
