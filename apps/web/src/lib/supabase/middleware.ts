import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { PathPrefix, Paths } from "@lib/constants";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname == "/") return supabaseResponse;

  if (!user && !request.nextUrl.pathname.startsWith("/api/auth") && !request.nextUrl.pathname.startsWith(PathPrefix.auth)) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = Paths.signin;
    return NextResponse.redirect(url);
  }

  if (user && !user.user_metadata.onboarded && !request.nextUrl.pathname.startsWith(Paths.onboarding)) {
    const url = request.nextUrl.clone();
    url.pathname = Paths.onboarding;
    return NextResponse.redirect(url);
  }

  if (user && user.user_metadata.onboarded && (request.nextUrl.pathname == Paths.root || request.nextUrl.pathname.startsWith(Paths.onboarding))) {
    const activeOrgKey = user?.user_metadata.organizationKey;
    const url = request.nextUrl.clone();
    url.pathname = Paths.root;
    if (activeOrgKey) {
      url.pathname = Paths.org(activeOrgKey);
    }
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
