import NextAuth from "next-auth"; 
import CredentialsProvider from "next-auth/providers/credentials"; 
import GoogleProvider from "next-auth/providers/google"; 
import LinkedInProvider from "next-auth/providers/linkedin"; 

import { supabase } from "@/config/supabaseClient"; 

export const authOptions = { 
    providers: [ 
    // Email & Password Login 
    CredentialsProvider({ 
        name: "Credentials", 
        credentials: { 
        email: { label: "Email", type: "text" }, 
        password: { label: "Password", type: "password" }, 
        }, 
        async authorize(credentials) { 
        const { email, password } = credentials as { email: string; password: string }; 

        const { data, error } = await supabase.auth.signInWithPassword({ email, password }); 

        if (error || !data.session) throw new Error(error?.message || "Invalid credentials"); 

        return { id: data.user.id, email: data.user.email }; 
        }, 
    }),

     // Google OAuth 
    GoogleProvider({ 

        clientId: process.env.GOOGLE_CLIENT_ID || (() => { throw new Error("GOOGLE_CLIENT_ID is not defined"); })(), 

        clientSecret: process.env.GOOGLE_CLIENT_SECRET || (() => { throw new 
            Error("GOOGLE_CLIENT_SECRET is not defined"); })(), 
    }), 

    // LinkedIn OAuth 
    LinkedInProvider({ 
        clientId: process.env.LINKEDIN_CLIENT_ID || (() => { throw new Error("LINKEDIN_CLIENT_ID is not defined"); })(), 
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || (() => { throw new 
            Error("LINKEDIN_CLIENT_SECRET is not defined"); })(), 
    }), 
    ], 

  // Callbacks for session handling 
    callbacks: { 
    async session({ session, token }: any) { 
        session.user.id = token.sub; 
        
            return session; 
}, 
}, 
// Configure NextAuth session settings 
session: { strategy: "jwt" as const }, 
secret: process.env.NEXTAUTH_SECRET, 
pages: { signIn: "/auth/login" }, 
}; 
export default NextAuth(authOptions);