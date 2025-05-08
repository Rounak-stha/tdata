import { jwtDecode, type JwtPayload } from "jwt-decode";

export function decodeJWT(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch (error) {
    console.log(error);
    return { role: "anon" } as JwtPayload & { role: string };
  }
}
