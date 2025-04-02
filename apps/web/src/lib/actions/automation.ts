"use server";

import { InsertAutomationData } from "@tdata/shared/types";
import { AutomationRepository } from "@/repositories";

export const createAutomation = async (data: InsertAutomationData) => {
  return await AutomationRepository.create(data);
};

export const updateAutomation = async (id: string, data: Partial<InsertAutomationData>) => {
  return await AutomationRepository.update(id, data);
};

export const getAutomationById = async (id: string) => {
  return AutomationRepository.getById(id);
};
