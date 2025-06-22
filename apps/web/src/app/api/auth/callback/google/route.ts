import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createSupabaseClient } from "@lib/supabase/server/client";
import { SITE_URL } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(SITE_URL);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${SITE_URL}/auth/auth-code-error`);
}
