import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

const noStoreHeaders = { 'cache-control': 'private, no-store' };
const sendSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  requestId: z.string().trim().min(8).max(100).regex(/^[A-Za-z0-9._:-]+$/),
});

function parsePositiveId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function ownerRelation(homeownerId: number, contactUserId: number) {
  return db.prepare(`SELECT hc.provider_id,hc.contact_user_id,u.first_name,u.last_name
    FROM homeowner_contacts hc
    JOIN users u ON u.id=hc.contact_user_id AND u.role='provider'
    JOIN provider_members m ON m.user_id=hc.contact_user_id AND m.provider_id=hc.provider_id AND m.active=1
    WHERE hc.homeowner_id=? AND hc.contact_user_id=?
    LIMIT 1`).get(homeownerId, contactUserId) as {
      provider_id: number;
      contact_user_id: number;
      first_name: string;
      last_name: string;
    } | undefined;
}

function markOwnerThreadRead(homeownerId: number, contactUserId: number, providerId: number) {
  return db.transaction(() => {
    const directChanged = db.prepare(`UPDATE contact_messages SET read_at=CURRENT_TIMESTAMP
      WHERE homeowner_id=? AND provider_id=? AND contact_user_id=? AND sender_id<>? AND read_at IS NULL`)
      .run(homeownerId, providerId, contactUserId, homeownerId).changes;

    const jobChanged = db.prepare(`UPDATE messages SET read_at=CURRENT_TIMESTAMP
      WHERE recipient_id=? AND sender_id=? AND read_at IS NULL
        AND EXISTS (
          SELECT 1 FROM jobs j
          JOIN job_assignments ja ON ja.job_id=j.id
          WHERE j.id=messages.job_id AND j.homeowner_id=? AND ja.provider_id=? AND ja.contact_user_id=?
        )`)
      .run(homeownerId, contactUserId, homeownerId, providerId, contactUserId).changes;

    const notificationChanged = db.prepare(`UPDATE notifications SET read_at=CURRENT_TIMESTAMP
      WHERE user_id=? AND kind='message' AND read_at IS NULL AND (
        href LIKE ? OR href IN (
          SELECT '/app/jobs/' || j.id
          FROM jobs j JOIN job_assignments ja ON ja.job_id=j.id
          WHERE j.homeowner_id=? AND ja.provider_id=? AND ja.contact_user_id=?
        )
      )`)
      .run(homeownerId, `/app/messages?contact=${contactUserId}%`, homeownerId, providerId, contactUserId).changes;

    return { changed: directChanged + jobChanged, notificationChanged };
  }).immediate();
}

export async function POST(req: Request, { params }: { params: Promise<{ contactUserId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'homeowner') {
    return NextResponse.json({ ok: false, error: 'Nicht angemeldet.' }, { status: 401, headers: noStoreHeaders });
  }

  const { contactUserId: rawId } = await params;
  const contactUserId = parsePositiveId(rawId);
  if (!contactUserId) {
    return NextResponse.json({ ok: false, error: 'Kontakt nicht verfügbar.' }, { status: 404, headers: noStoreHeaders });
  }

  const relation = ownerRelation(user.id, contactUserId);
  if (!relation) {
    return NextResponse.json({ ok: false, error: 'Kontakt nicht verfügbar.' }, { status: 404, headers: noStoreHeaders });
  }

  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: 'Ungültige Nachricht.' }, { status: 400, headers: noStoreHeaders });
  }
  const parsed = sendSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Die Nachricht muss zwischen 1 und 4000 Zeichen lang sein.' }, { status: 400, headers: noStoreHeaders });
  }

  const result = db.transaction(() => {
    const receiptHref = `/pro/messages?homeowner=${user.id}&receipt=${encodeURIComponent(parsed.data.requestId)}`;
    const duplicate = db.prepare(`SELECT id FROM notifications
      WHERE user_id=? AND kind='message' AND href=? LIMIT 1`).get(contactUserId, receiptHref);
    if (duplicate) return { duplicate: true };

    db.prepare(`INSERT INTO contact_messages(homeowner_id,provider_id,contact_user_id,sender_id,body)
      VALUES(?,?,?,?,?)`).run(user.id, relation.provider_id, contactUserId, user.id, parsed.data.body);
    db.prepare(`INSERT INTO notifications(user_id,kind,title,body,href)
      VALUES(?,'message','Neue direkte Nachricht',?,?)`).run(
        contactUserId,
        `${user.first_name}: ${parsed.data.body.slice(0, 120)}`,
        receiptHref,
      );
    return { duplicate: false };
  }).immediate();

  return NextResponse.json({ ok: true, duplicate: result.duplicate }, { status: result.duplicate ? 200 : 201, headers: noStoreHeaders });
}

export async function PATCH(_req: Request, { params }: { params: Promise<{ contactUserId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'homeowner') {
    return NextResponse.json({ ok: false, error: 'Nicht angemeldet.' }, { status: 401, headers: noStoreHeaders });
  }

  const { contactUserId: rawId } = await params;
  const contactUserId = parsePositiveId(rawId);
  if (!contactUserId) {
    return NextResponse.json({ ok: false, error: 'Kontakt nicht verfügbar.' }, { status: 404, headers: noStoreHeaders });
  }
  const relation = ownerRelation(user.id, contactUserId);
  if (!relation) {
    return NextResponse.json({ ok: false, error: 'Kontakt nicht verfügbar.' }, { status: 404, headers: noStoreHeaders });
  }

  const result = markOwnerThreadRead(user.id, contactUserId, relation.provider_id);
  return NextResponse.json({ ok: true, ...result }, { headers: noStoreHeaders });
}
