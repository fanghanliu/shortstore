const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function main() {
  const email = normalizeEmail(process.argv[2]);

  if (!email) {
    console.error("Usage: node scripts/make-admin.js <email>");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exitCode = 1;
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: "admin",
      status: "active"
    }
  });

  console.log(`${updatedUser.email} is now an admin.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
