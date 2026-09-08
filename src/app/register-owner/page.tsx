import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-v2/AuthShell";

export const metadata: Metadata = {
  title: "Eigentümer-Konto anlegen",
  description: "Lege dein Hauskonto bei einfachhausen an.",
  robots: { index: false, follow: false },
};

export default function RegisterOwnerPage() {
  return <AuthShell initialAuthMode="register" initialRole="kunde" />;
}
