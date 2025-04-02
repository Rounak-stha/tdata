import { createDrizzleSupabaseClient } from "@/db";
import { automations } from "@tdata/shared/db/schema";

import { Automation, InsertAutomationData } from "@tdata/shared/types";
import { eq } from "drizzle-orm";

export class AutomationRepository {
  static async create(data: InsertAutomationData): Promise<Automation> {
    const db = await createDrizzleSupabaseClient();

    const result = await db.rls(async (tx) => {
      const createdAutomation = await tx.insert(automations).values(data).returning();
      return createdAutomation[0];
    });

    return result;
  }

  static async update(id: string, data: Partial<InsertAutomationData>): Promise<Automation> {
    const db = await createDrizzleSupabaseClient();

    const result = await db.rls(async (tx) => {
      const createdAutomation = await tx.update(automations).set(data).where(eq(automations.id, id)).returning();
      return createdAutomation[0];
    });

    return result;
  }

  static async getById(id: string): Promise<Automation | null> {
    const db = await createDrizzleSupabaseClient();

    const result = await db.rls(async (tx) => {
      const automation = await tx.select().from(automations).where(eq(automations.id, id)).limit(1).execute();
      return automation;
    });

    if (result.length == 0) return null;
    return result[0];
  }
}

export default AutomationRepository;
