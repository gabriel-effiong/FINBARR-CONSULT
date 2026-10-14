const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

const adapter = process.env.DATABASE_URL
  ? new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  : undefined;
const prisma = new PrismaClient(adapter ? { adapter } : {});

module.exports = prisma;
