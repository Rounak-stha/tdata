"use server";

import { redirect } from "next/navigation";

import OrganizationRepository from "@/repositories/organization";
import { OnboardingData } from "@/types/auth";
import { createSupabaseClient } from "@lib/supabase/server/client";

import type { Session } from "@supabase/supabase-js";

type Provider = "google";

const SITE_URL = (() => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
})();

const getCallbackUrl = (provider: Provider) => `${SITE_URL}/api/auth/callback/${provider}`;

const signInWith = (provider: Provider) => {
  return async () => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getCallbackUrl(provider),
      },
    });

    if (error) {
      console.log(error);
    }

    if (data?.url) {
      redirect(data.url);
    } else {
      console.log("No URL to redirect to");
    }
  };
};

export const signInWithEmail = async (email: string) => {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { data: { name: email.split("@")[0], email } },
    });

    if (error) {
      console.log(error);
      return { success: false };
    }
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });

    if (error) throw error;
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

export const signout = async () => {
  try {
    const supabase = await createSupabaseClient();

    const { data, error: getSessionError } = await supabase.auth.getSession();

    if (getSessionError || !data.session) {
      console.log(getSessionError, data);
      return { success: false };
    }

    const { error } = await supabase.auth.admin.signOut(data.session.access_token);

    if (error) throw error;
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};

export const onboardUser = async (data: OnboardingData) => {
  /**
   * NOTE: There's no proper error handling here
   * We're using both Supabase CLient and ORM to interact with the database, so we can't wrap both in a transaction
   * After the onboarded flag is set, the organization create may fail, leaving the user in a bad state and we can't even revert the operation
   * TODO: Find a better way to handle this
   */
  const supabase = await createSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData || !userData.user) return { success: false };

  const organization = await OrganizationRepository.create({
    name: data.organizationName,
    key: data.organizationKey,
    createdBy: userData.user?.id,
  });

  const { data: updatedUserData } = await supabase.auth.updateUser({
    data: {
      ...userData.user.user_metadata,
      name: data.name,
      avatar_url: data.avatar,
      onboarded: true,
      organizationId: organization.id,
      organizationKey: organization.key,
    },
  });

  if (!updatedUserData || !updatedUserData.user) return { success: false };

  await supabase.auth.refreshSession();
  return { success: true };
};

export const checkOrganizationKeyAvailability = async (key: string) => {
  return !(await OrganizationRepository.existsByKey(key));
};

export const getSession = async (): Promise<{ success: false; data: null } | { success: true; data: Session }> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) return { success: false, data: null };
  return { success: true, data: data.session };
};

export const signInWithGoogle = signInWith("google");
