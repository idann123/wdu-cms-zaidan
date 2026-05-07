const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialData = [
  // 2024 Projects (5)
  { name: 'BPK RI', category: 'Government', isActive: true, createdAt: new Date('2024-01-01'), logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png' },
  { name: 'BPOM', category: 'Government', isActive: true, createdAt: new Date('2024-02-01'), logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-300x205.png' },
  { name: 'BKPM', category: 'Government', isActive: true, createdAt: new Date('2024-03-01'), logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-1-300x205.png' },
  { name: 'KOMINFO', category: 'Government', isActive: true, createdAt: new Date('2024-04-01'), logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png' },
  { name: 'PALJAYA', category: 'Government', isActive: true, createdAt: new Date('2024-05-01'), logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png' },
];

async function main() {
  console.log('Cleaning existing partners...');
  await prisma.partner.deleteMany();
  
  console.log('Seeding exactly 5 partners for 2024...');
  for (const p of initialData) {
    await prisma.partner.create({ data: p });
  }

  console.log('Seeding 24 partners for other years...');
  for (let i = 0; i < 24; i++) {
    await prisma.partner.create({
      data: {
        name: `Old Partner ${i}`,
        category: 'Enterprise',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png'
      }
    });
  }
  
  console.log('Seed complete! Total 29 partners (5 from 2024).');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
