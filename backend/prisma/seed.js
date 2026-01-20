import prisma from "../src/config/db.js";

async function main() {
  await prisma.service.createMany({
    data: [
      {
        title: "Home Cleaning",
        category: "Cleaning",
        description: "Full house cleaning service",
        creditCost: 50,
        ratingAvg: 4.6,
      },
      {
        title: "AC Repair",
        category: "Appliances",
        description: "AC repair and servicing",
        creditCost: 70,
        ratingAvg: 4.5,
      },
      {
        title: "Plumbing",
        category: "Repairs",
        description: "Plumbing and pipe fixing",
        creditCost: 40,
        ratingAvg: 4.4,
      },
      {
        title: "Electrician",
        category: "Repairs",
        description: "Electrical wiring and fixing",
        creditCost: 45,
        ratingAvg: 4.3,
      },
    ],
  });

  console.log("✅ Services seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
