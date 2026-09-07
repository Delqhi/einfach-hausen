import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-v2/AuthShell";
import auth from "@/components/marketing/auth-convergence.module.css";
import { safeNextPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melde dich an — als Eigentümer oder Handwerksbetrieb.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return (
    <div className={[auth.authConverged, auth.authV2Page, auth.loginPage].join(" ")}>
      <AuthShell initialAuthMode="login" initialRole={sp.role === "provider" ? "handwerker" : "kunde"} nextPath={safeNextPath(sp.next)} />
    </div>
  );
}
