import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const partners = await prisma.partner.findMany();
  console.log('Total partners:', partners.length);
  partners.forEach(p => console.log(p.name, p.year, p.category));
}

main().catch(console.error).finally(() => prisma.$disconnect());
