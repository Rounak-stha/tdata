/**
 * To only be used in server
 */

import { randomBytes } from "crypto";

export const generateInviteToken = () => {
  return randomBytes(32).toString("hex"); // 64-char string
};
