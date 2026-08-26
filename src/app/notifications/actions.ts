'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { markNotificationRead, markNotificationUnread } from '@/lib/notifications';

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? '').trim();
}

export async function setNotificationReadStateAction(fd: FormData) {
  const user = await requireUser();
  const id = Number(text(fd, 'id'));
  const read = text(fd, 'read') === '1';
  if (!Number.isInteger(id) || id <= 0) return;
  if (read) markNotificationRead(user.id, id);
  else markNotificationUnread(user.id, id);
  revalidatePath('/notifications');
}

export async function markAllNotificationsReadForCurrentUserAction() {
  const user = await requireUser();
  db.prepare('UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE user_id=? AND read_at IS NULL').run(user.id);
  revalidatePath('/notifications');
}
