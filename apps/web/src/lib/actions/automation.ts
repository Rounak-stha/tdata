"use server";

import { InsertAutomationData } from "@tdata/shared/types";
import { AutomationRepository } from "@/repositories";

export const createAutomation = async (data: InsertAutomationData) => {
  return await AutomationRepository.create(data);
};

export const getAutomationById = async (id: number) => {
  return AutomationRepository.getById(id);
};
