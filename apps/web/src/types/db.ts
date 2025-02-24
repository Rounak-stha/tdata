import { db } from "@db";

export type TransactionDb = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type PagintionMeta = {
  limit: number;
  page: number;
};
