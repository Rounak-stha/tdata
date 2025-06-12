import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createServerClient } from "@supabase/ssr";
import { InfantUser } from "@tdata/shared/types";
import { ApexDomain, Paths } from "@/lib/constants";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing env variables SUPABASE_URL and SUPABASE_ANON_KEY");
}

export async function createSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    cookieOptions: {
      domain: ApexDomain,
      maxAge: 7 * 86400,
      path: "/",
      sameSite: "lax",
    },
  });
}

/**
 * To be used in server components to get the logged in user
 * if any errors occur, it will redirect to error page
 * @returns User
 */
export const getInfantUser = async (): Promise<InfantUser> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data) redirect(Paths.signin);
  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata.name,
    imageUrl: data.user.user_metadata.avatar_url,
  };
};

/**
 * To be used in server components to get the logged in user
 * @returns User
 */
export const getAuthedUser = async (): Promise<InfantUser | null> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data) return null;
  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata.name,
    imageUrl: data.user.user_metadata.avatar_url,
  };
};
