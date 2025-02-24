import { redirect } from "next/navigation";
import { createSupabaseClient } from "../supabase/server/client";
import { Paths } from "../constants";

export const getSession = async () => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) redirect(Paths.signin);
  return data.session;
};
