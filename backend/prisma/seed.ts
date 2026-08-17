import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@zumbii.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home & Living', slug: 'home-living' },
  { name: 'Industrial', slug: 'industrial' },
  { name: 'Food & Beverages', slug: 'food-beverages' },
  { name: 'Health & Beauty', slug: 'health-beauty' },
];

const pincodes = [
  { code: '400001', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 2 },
  { code: '400069', city: 'Mumbai', state: 'Maharashtra', deliveryDays: 2 },
  { code: '110001', city: 'New Delhi', state: 'Delhi', deliveryDays: 2 },
  { code: '560001', city: 'Bengaluru', state: 'Karnataka', deliveryDays: 3 },
  { code: '560100', city: 'Bengaluru', state: 'Karnataka', deliveryDays: 3 },
  { code: '600001', city: 'Chennai', state: 'Tamil Nadu', deliveryDays: 3 },
  { code: '500001', city: 'Hyderabad', state: 'Telangana', deliveryDays: 3 },
  { code: '411001', city: 'Pune', state: 'Maharashtra', deliveryDays: 3 },
  { code: '700001', city: 'Kolkata', state: 'West Bengal', deliveryDays: 4 },
  { code: '380001', city: 'Ahmedabad', state: 'Gujarat', deliveryDays: 4 },
  { code: '302001', city: 'Jaipur', state: 'Rajasthan', deliveryDays: 4, codAvailable: false },
  { code: '796001', city: 'Aizawl', state: 'Mizoram', deliveryDays: 7, isServiceable: false },
];

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      firstName: 'Zumbii',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  for (const pincode of pincodes) {
    await prisma.pincode.upsert({
      where: { code: pincode.code },
      update: {},
      create: pincode,
    });
  }

  console.log('Seed complete.');
  console.log(`Admin login -> email: ${admin.email} / password: ${ADMIN_PASSWORD}`);
  console.log(`Seeded ${categories.length} categories.`);
  console.log(`Seeded ${pincodes.length} pincodes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
