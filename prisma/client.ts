// lib/prisma.ts
import { PrismaClient } from "@prisma/client"; // ← Use @prisma/client, not generated path
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	pool: Pool | undefined;
};

// Create/reuse singleton pool
if (!globalForPrisma.pool) {
	globalForPrisma.pool = new Pool({
		connectionString: process.env.DATABASE_URL, // ← Use DATABASE_URL (pooled, port 6543)
		max: 10, // Connection limit for serverless
	});
}

const pool = globalForPrisma.pool;
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Store globally for dev hot reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
