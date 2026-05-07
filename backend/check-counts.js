const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const partners = await prisma.partner.count();
  const partners2024 = await prisma.partner.count({
    where: {
      createdAt: {
        gte: new Date('2024-01-01T00:00:00Z'),
        lt: new Date('2025-01-01T00:00:00Z'),
      },
    },
  });
  const messages = await prisma.contactMessage.count();
  const unreadMessages = await prisma.contactMessage.count({
    where: { isRead: false },
  });

  console.log('Total Partners:', partners);
  console.log('Partners 2024:', partners2024);
  console.log('Total Messages:', messages);
  console.log('Unread Messages:', unreadMessages);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
