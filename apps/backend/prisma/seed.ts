import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Find or create test user
  let user = await prisma.user.findUnique({
    where: { email: 'danny@test.com' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'danny@test.com',
        username: 'Danny',
        password: await hashPassword('testpass123'),
      },
    });
    console.log('✅ Created test user: danny@test.com');
  } else {
    console.log('✅ Using existing user: danny@test.com');
  }

  // Delete existing entries for clean slate
  const deleted = await prisma.coffeeEntry.deleteMany({
    where: { userId: user.id },
  });
  console.log(`🗑️  Deleted ${deleted.count} existing entries`);

  // Create specific coffee entries matching the screenshot
  const entries = [
    // 01/01: 1 entry
    { day: 1, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/02: 1 entry
    { day: 2, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/04: 1 entry
    { day: 4, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/05: 2 entries (Carmen)
    { day: 5, type: 'LATTE', size: 'MEDIUM', caffeine: 150, notes: 'de Carmen' },
    { day: 5, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/06: 1 entry
    { day: 6, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/06: 1 entry (second one)
    { day: 6, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/07: 1 entry
    { day: 7, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/07: 1 entry (second one)
    { day: 7, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/08: 1 entry
    { day: 8, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },

    // 01/08: 1 entry (second one)
    { day: 8, type: 'LATTE', size: 'MEDIUM', caffeine: 150 },
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const entryData = entries.map((entry, index) => {
    const consumedAt = new Date(currentYear, currentMonth, entry.day, 10 + index, 0, 0);

    return {
      userId: user.id,
      type: entry.type as 'LATTE',
      size: entry.size as 'MEDIUM',
      caffeine: entry.caffeine,
      consumedAt,
      notes: entry.notes,
    };
  });

  // Create entries
  await prisma.coffeeEntry.createMany({
    data: entryData,
  });

  console.log(`✅ Created ${entryData.length} coffee entries for January`);

  // Calculate stats
  const totalCaffeine = entryData.reduce((sum, e) => sum + e.caffeine, 0);
  const uniqueDays = new Set(entryData.map(e => e.consumedAt.getDate())).size;

  console.log('\n📊 Summary:');
  console.log(`   Total entries: ${entryData.length}`);
  console.log(`   Days with coffee: ${uniqueDays}`);
  console.log(`   Total caffeine: ${totalCaffeine}mg`);
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
