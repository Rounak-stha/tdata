import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ApexDomain, InvitePath, PathPrefix, Paths, SITE_URL, TenantUrl } from "@lib/constants";

const RootDomainFormatted = new URL(SITE_URL).hostname;

/**
 * Method adapted from: https://github.com/vercel/platforms/blob/main/middleware.ts
 */
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || ""; // tenant.localtest.com:3000
  const hostname = host.split(":")[0]; // tenant.localtest.com

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localtest/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localtest")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Production environment
  // Regular subdomain detection
  const isSubdomain = hostname !== RootDomainFormatted && hostname !== `www.${RootDomainFormatted}` && hostname.endsWith(`.${RootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${RootDomainFormatted}`, "") : null;
}

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
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
    cookieOptions: {
      domain: ApexDomain,
      maxAge: 7 * 86400,
      path: "/",
      sameSite: "lax",
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subDomain = extractSubdomain(request);

  // A check for request method is added to not interfere with POST request made by server actions.
  // As the server action makes a POST request to the same path as it is in, the middleware interferes with it and does not work correctly.
  if ((!user && request.nextUrl.pathname == "/") || request.nextUrl.pathname == InvitePath) {
    return supabaseResponse;
  }

  if ((subDomain && !user) || (!user && !request.nextUrl.pathname.startsWith("/api/auth") && !request.nextUrl.pathname.startsWith(PathPrefix.auth))) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = Paths.signin;
    return NextResponse.redirect(url);
  }

  if (subDomain && user) {
    const path = request.nextUrl.pathname;
    const response = NextResponse.rewrite(new URL(`${PathPrefix.org}/${subDomain}${path}`, request.url));
    const cookiesToSet = supabaseResponse.cookies.getAll();
    cookiesToSet.forEach(({ name, value }) => {
      response.cookies.set(name, value);
    });
    return response;
  }

  if (user && !user.user_metadata.onboarded && !request.nextUrl.pathname.startsWith(Paths.onboarding())) {
    const url = request.nextUrl.clone();
    const token = url.searchParams.get("token");
    url.pathname = Paths.onboarding();
    if (token) {
      url.search = `?token=${token}`;
    }
    return NextResponse.redirect(url);
  }

  if (user && user.user_metadata.onboarded && (request.nextUrl.pathname == Paths.root() || request.nextUrl.pathname.startsWith(Paths.onboarding()))) {
    const activeOrgKey = user?.user_metadata.organizationKey;
    const url = request.nextUrl.clone();
    url.pathname = Paths.root();
    if (activeOrgKey) {
      url.hostname = TenantUrl(activeOrgKey);
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
