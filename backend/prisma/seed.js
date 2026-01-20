import prisma from "../src/config/db.js";

async function main() {
  // No service seeding - providers must create services themselves
  console.log("✅ Seed completed (no services seeded - providers create their own)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
