import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await hash('Password123!', 10);
  const viewerPass = await hash('Password123!', 10);
  const beboerPass = await hash('Password123!', 10);

  const unit = await prisma.unit.upsert({
    where: { houseCode: 'HOUSE-123' },
    update: {},
    create: {
      name: 'Unit A',
      address: 'Example Street 1',
      houseCode: 'HOUSE-123'
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPass,
      role: 'ADMIN',
      profile: { create: { name: 'Admin' } }
    }
  });

  await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      passwordHash: viewerPass,
      role: 'VIEWER',
      profile: { create: { name: 'Viewer' } }
    }
  });

  const beboer = await prisma.user.upsert({
    where: { email: 'beboer@example.com' },
    update: {},
    create: {
      email: 'beboer@example.com',
      passwordHash: beboerPass,
      role: 'BEBOER',
      profile: { create: { name: 'Beboer' } },
      tenants: { create: { unitId: unit.id } }
    }
  });

  console.log('Seed completed', { unit, beboer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
