import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn"], //todo make env specific
});

export { prisma, PrismaClient };
