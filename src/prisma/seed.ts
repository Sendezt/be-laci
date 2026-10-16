import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@gmail.com';
  const password = 'admin@gmail.com';

  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} sudah ada, skip.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { email, password: hashed, role: 'admin' },
  });

  console.log(`Seeded admin: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });