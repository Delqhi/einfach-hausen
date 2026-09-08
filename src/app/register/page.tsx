import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-v2/AuthShell";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Lege dein Eigentümer- oder Partnerkonto bei einfachhausen an.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return <AuthShell
    initialAuthMode="register"
    initialRole={sp.role === "provider" ? "handwerker" : "kunde"}
  />;
}
