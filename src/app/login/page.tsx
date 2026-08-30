import { authMode } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  // Fails closed in production local mode (authMode throws by design). Supabase
  // mode renders the client Supabase form; local mode renders the credential
  // form backed by the local-login route.
  const mode = authMode();
  return <LoginForm mode={mode} />;
}
