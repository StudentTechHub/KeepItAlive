import { NextRequest, NextResponse } from "next/server";

import auth from "@/config/nextAuthConfig"; 
// Function to get the current authenticated user 
export async function getCurrentUser() { 
const session = await auth(); 

if (!session || !session.user) return null; 

return session.user; 
} 

// Middleware to protect API routes 
export function requireAuth(_req: NextRequest) { 
const session = auth(); 

if (!session) { 
return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
} 

return NextResponse.next(); 
}