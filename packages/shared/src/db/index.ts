/**
 * Example taken from: https://github.com/rphlmr/drizzle-supabase-rls/blob/main/database/drizzle.ts
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { PgDatabase } from "drizzle-orm/pg-core";
import { decodeJWT } from "@utils";

type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_DB_URL) {
  throw new Error("Missing Supabase DB Envs");
}

export const db = drizzle({ connection: SUPABASE_DB_URL, casing: "snake_case" /* logger: true */ });

// eslint-disable-next-line
export function createDrizzle<Database extends PgDatabase<any, any, any>, Token extends SupabaseToken = SupabaseToken>(token: Token, { client }: { client: Database }) {
  return {
    rls: (async (transaction, ...rest) => {
      return await client.transaction(async (tx) => {
        // Supabase exposes auth.uid() and auth.jwt()
        // https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions
        try {
          await tx.execute(sql`
						-- auth.jwt()
						select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(token))}', TRUE);
						-- auth.uid()
						select set_config('request.jwt.claim.sub', '${sql.raw(token.sub ?? "")}', TRUE);												
						-- set local role
						set local role ${sql.raw(token.role ?? "anon")};
						-- set search path to public schema as the authenticated role does not automatically assume public as the search path
						SET LOCAL search_path = public;
					`);
          return await transaction(tx);
        } finally {
          await tx.execute(sql`
						-- reset
						select set_config('request.jwt.claims', NULL, TRUE);
						select set_config('request.jwt.claim.sub', NULL, TRUE);
						reset role;
					`);
        }
      }, ...rest);
    }) as typeof client.transaction,
  };
}

export function createDrizzleForServiceRole<Database extends PgDatabase<any, any, any>, Token extends SupabaseToken = SupabaseToken>(
  token: Token,
  { client }: { client: Database }
) {
  return {
    rls: (async (transaction, ...rest) => {
      return await client.transaction(async (tx) => {
        // Supabase exposes auth.uid() and auth.jwt()
        // https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions
        try {
          await tx.execute(sql`
				-- auth.jwt()
				select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(token))}', TRUE);
				-- auth.uid()
				select set_config('request.jwt.claim.sub', '${sql.raw(token.sub ?? "")}', TRUE);												
				-- set local role to service role
				set local role ${sql.raw(token.role ?? "service_role")};  -- Use service_role as default
				-- set search path to public schema
				SET LOCAL search_path = public;
			  `);
          return await transaction(tx);
        } finally {
          await tx.execute(sql`
				-- reset
				select set_config('request.jwt.claims', NULL, TRUE);
				select set_config('request.jwt.claim.sub', NULL, TRUE);
				reset role;
			  `);
        }
      }, ...rest);
    }) as typeof client.transaction,
  };
}

export async function createDrizzleSupabaseServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Supabase Service Role Key");
  return createDrizzleForServiceRole(decodeJWT(SUPABASE_SERVICE_ROLE_KEY!), { client: db });
}
