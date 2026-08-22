import { PrismaClient, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@zumbii.com';
const SUPER_ADMIN_PASSWORD = process.env.SEED_SUPER_ADMIN_PASSWORD || 'ChangeMe@12345';

async function main() {
  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  const superAdmin = await prisma.adminUser.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {},
    create: {
      email: SUPER_ADMIN_EMAIL,
      passwordHash,
      name: 'Super Admin',
      role: AdminRole.SUPER_ADMIN,
      twoFactorEnabled: false,
    },
  });

  console.log('Seeded admin-panel Super Admin:');
  console.log(`  email:    ${superAdmin.email}`);
  console.log(`  password: ${SUPER_ADMIN_PASSWORD} (change this / rely on 2FA enrollment on first login)`);
  console.log('  2FA is NOT enabled yet — the first login will require enrolling an authenticator app before a session is issued.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
