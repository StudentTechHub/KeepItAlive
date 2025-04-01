import { NextResponse } from "next/server"; 
 
import { supabase } from "@/config/supabaseClient"; 
 
export async function POST(req: Request) { 
    const { email, password } = await req.json(); 
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }); 
 
    if (error) { 
        return NextResponse.json({ success: false, message: error.message }, { status: 400 }); 
    } 
 
return NextResponse.json({ success: true, session: data.session }); 
} 
// Optional: Handle GET requests to prevent the 405 error 
export async function GET() { 
return NextResponse.json({ error: "Use POST to log in" }, { status: 405 }); 
}