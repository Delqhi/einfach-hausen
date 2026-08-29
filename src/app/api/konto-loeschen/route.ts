import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await admin.auth.admin.getUserById(userId);
  const user: any = (data as any)?.user;
  // Never derive authorization or data ownership from mutable user_metadata.
  // This legacy endpoint is intentionally fail-closed until it is migrated to
  // the server-controlled application identity model.
  return NextResponse.json({ error: "legacy endpoint disabled" }, { status: 410 });
  await admin.from("messages").delete().eq("sender_id", userId);
  await admin.auth.admin.deleteUser(userId);
  return NextResponse.json({ ok: true });
}
