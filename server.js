require("dotenv").config();

const app = require("./src/app");
const prisma = require("./src/db");

const port = Number(process.env.PORT) || 5000;
const server = app.listen(port, () => {
  console.log(`Finbarr Consult API running at http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
