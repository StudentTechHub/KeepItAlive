import { createBrowserClient } from "@supabase/ssr";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Supabase URL is not defined in environment variables");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase API Key is not defined in environment variables");
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
