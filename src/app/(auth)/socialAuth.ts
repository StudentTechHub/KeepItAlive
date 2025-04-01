import { supabase } from "@/config/supabaseClient"; 
export async function signInWithProvider(provider: "google" | "linkedin") { 
const { data, error } = await supabase.auth.signInWithOAuth({ 
provider, 
options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` }, 
}); 

if (error) throw new Error(error.message); 

return data; 
}