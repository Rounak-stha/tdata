"use server";

import { BucketNames } from "@lib/constants/supabase";
import { createSupabaseClient } from "@lib/supabase/server/client";

type ReturnType<T> = { success: true; data: T } | { success: false; data: null };

export const uploadAvatar = async (file: File): Promise<ReturnType<{ url: string }>> => {
  try {
    const supabase = await createSupabaseClient();
    const { data: userData, error: err } = await supabase.auth.getUser();

    if (err) throw err;

    const userId = userData.user.id;

    const fileName = `${userId}/${file.name}${Date.now()}`;
    const { error } = await supabase.storage.from(BucketNames.avatar).upload(fileName, file);

    if (error) throw error;

    const url = supabase.storage.from(BucketNames.avatar).getPublicUrl(fileName).data.publicUrl;

    return { success: true, data: { url } };
  } catch (e) {
    console.log(e);
    return { success: false, data: null };
  }
};
