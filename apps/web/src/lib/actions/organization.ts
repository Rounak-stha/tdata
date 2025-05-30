"use server";

import { InsertPriorityData, InsertTaskTypeData } from "@tdata/shared/types";
import { InvitationRepository, OrganizationRepository, UserRepository } from "@/repositories";
import { InsertWorkflowStatuseData } from "@/types";
import { Role } from "@tdata/shared/types";
import { sendInviteEmail } from "@lib/actions/email";
import { generateInviteToken } from "@lib/utils/crypto";

export const createTaskType = async (data: InsertTaskTypeData) => {
  try {
    return OrganizationRepository.createTaskType(data);
  } catch (e) {
    console.log(e);
    throw "Failed to create task type";
  }
};

export const createStatus = async (data: InsertWorkflowStatuseData) => {
  try {
    return OrganizationRepository.createStatus(data);
  } catch (e) {
    console.log(e);
    throw "Failed to create status";
  }
};

export const createPriority = async (data: InsertPriorityData) => {
  try {
    return OrganizationRepository.createPriority(data);
  } catch (e) {
    console.log(e);
    throw "Failed to create priority";
  }
};

export async function createInvitation(data: { organizationId: number; invitedById: string; email: string; role: Role }) {
  const { organizationId, invitedById, email, role } = data;
  const organization = await OrganizationRepository.getById(organizationId);
  const invitedBy = await UserRepository.getUserById(invitedById);

  if (!organization || !invitedBy) return { success: false };

  const token = generateInviteToken();
  const { success } = await sendInviteEmail(email, organization.name, token);
  if (!success) return { success };
  await InvitationRepository.create({ email, organizationId: organization.id, invitedById: invitedBy.id, token, role });
  return { success: true };
}
