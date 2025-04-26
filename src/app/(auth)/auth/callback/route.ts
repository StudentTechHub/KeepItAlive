import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (!sessionError) {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      // Check if the user exists in the database
      if (user && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          // If the user doesn't exist, create a new user in the database
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.user_metadata?.full_name ?? null,
              avatarUrl: user.user_metadata?.avatar_url ?? null

              // Add any other fields you want to set for the new user
            }
          });
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
