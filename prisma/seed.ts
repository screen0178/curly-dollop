// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();

  await prisma.company.create({
    data: {
      name: "focuson"
    }
  })

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash("admin12345", salt);

  await prisma.user.create({
    data: {
      name: "Super admin",
      password: hash,
      username: "ADMIN",
      companyId: 1,
      role: "ADMIN"
    }
  });
};



main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });