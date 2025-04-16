"use client";
import { login, signup } from "./actions";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const handleSocialLogin = (provider: "google" | "linkedin_oidc") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://localhost:3000/auth/callback`
      }
    });
  };

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input required id="email" name="email" type="email" />
      <label htmlFor="password">Password:</label>
      <input required id="password" name="password" type="password" />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
      <button onClick={() => handleSocialLogin("google")}>Google</button>
    </form>
  );
}
