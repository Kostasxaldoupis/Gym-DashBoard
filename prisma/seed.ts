import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plans = [
    { name: "1 Month", durationDays: 30, price: 30 },
    { name: "3 Months", durationDays: 90, price: 80 },
    { name: "6 Months", durationDays: 180, price: 150 },
    { name: "9 Months", durationDays: 270, price: 210 },
    { name: "12 Months", durationDays: 365, price: 270 },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
        where: { name: plan.name },
        update: plan,
        create: plan,
    })
  }
}

main()
.then(() => prisma.$disconnect())
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1);
})