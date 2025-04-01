import { NextResponse } from "next/server"; 

import { supabase } from "@/config/supabaseClient"; 
export async function POST() { 
const { error } = await supabase.auth.signOut(); 

if (error) { 
return NextResponse.json({ success: false, message: error.message }, { status: 400 }); 
} 

return NextResponse.json({ success: true, message: "Logged out successfully" }); 
}