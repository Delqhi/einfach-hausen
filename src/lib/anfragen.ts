import { supabase } from "@/lib/supabase";

export async function getEigeneAnfragen() {
  return supabase.from("anfragen").select("*").order("created_at", { ascending: false });
}

export async function getOffeneAnfragenFuerPro(leistungen: string[], plzListe: string[]) {
  let query: any = supabase.from("anfragen").select("*").eq("status", "offen").order("created_at", { ascending: false }).limit(30);
  if (leistungen.length > 0) query = query.in("kategorie", leistungen);
  if (plzListe.length > 0) {
    const praefixe = plzListe.map((p) => p.slice(0, 2));
    const orFilter = praefixe.map((p) => `plz.ilike.${p}*`).join(",");
    query = query.or(orFilter);
  }
  const { data, error } = await query;
  if (error) { console.error("Anfragen-Fehler:", error); return []; }
  return data ?? [];
}

export async function getMeineAnfragen(userId: string) {
  const { data } = await supabase.from("anfragen").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAngeboteFuerAnfrage(anfrageId: string) {
  return supabase.from("angebote").select("*").eq("anfrage_id", anfrageId);
}

export async function getMeineAngebote(proId: string) {
  return supabase.from("angebote").select("*, anfragen(titel, plz, ort, status)").eq("pro_id", proId).order("created_at", { ascending: false });
}
