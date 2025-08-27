import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: async () => cookieStore,
    });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect("/onboarding");
}
