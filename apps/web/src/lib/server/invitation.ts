import { InvitationRepository } from "@/repositories";

export async function getInvitationByToken(token: string) {
  return await InvitationRepository.getInvitationByToken(token);
}
