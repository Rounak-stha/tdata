"use server";

import { redirect } from "next/navigation";

import { UserRepository } from "@/repositories";
import { Paths } from "@lib/constants";

import { getSession } from "./auth";

export const getUser = async (userId: string, organizationId: number) => {
  const { data, success } = await getSession();

  if (!success) redirect(Paths.signin);
  else {
    const user = await UserRepository.getUser(data.user.id, organizationId);
    if (!user) redirect(Paths.signin);
    return user;
  }
};
