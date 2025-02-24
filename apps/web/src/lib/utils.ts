import { clsx, type ClassValue } from "clsx";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { twMerge } from "tailwind-merge";

import { TaskActivityUserSubtype, User } from "@tdata/shared/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcUserDiff(prevUsers: User[], newUser: User[]) {
  const [larger, smaller] = prevUsers.length > newUser.length ? [prevUsers, newUser] : [newUser, prevUsers];
  const action: TaskActivityUserSubtype = prevUsers.length > newUser.length ? "remove" : "add";
  const diff: User[] = [];

  larger.forEach((lUser) => {
    if (!smaller.some((sUser) => sUser.id == lUser.id)) diff.push(lUser);
  });

  return { action, diff };
}

export function decodeJWT(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch (error) {
    console.log(error);
    return { role: "anon" } as JwtPayload & { role: string };
  }
}
