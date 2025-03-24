import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseURL) {
  throw new Error("Supabase URL is not defined in environment variables");
}

const supabaseAPIKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAPIKey) {
  throw new Error("Supabase API Key is not defined in environment variables");
}

const supabase = createClient(supabaseURL, supabaseAPIKey);

export default supabase;
