import { NextResponse } from "next/server";

import { supabase } from "@/config/supabaseClient"; 
export async function POST(req: Request) { 
const { email, password } = await req.json(); 
const { data, error } = await supabase.auth.signUp({ email, password });

if (error) { 
return NextResponse.json({ success: false, message: error.message }, { status: 400 }); 
} 

return NextResponse.json({ success: true, user: data.user }); 
}