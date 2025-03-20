"use server";

import { InsertPriorityData, InsertTaskTypeData } from "@tdata/shared/types";
import { OrganizationRepository } from "@/repositories";
import { InsertWorkflowStatuseData } from "@/types";

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
